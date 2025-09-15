import { supabase } from "@/integrations/supabase/client";

export interface MemoryDeck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemoryCard {
  id: string;
  user_id: string;
  deck_id: string;
  verse_ref: string;
  added_at: string;
}

export interface MemoryReview {
  id: string;
  card_id: string;
  due_at: string;
  interval_days: number;
  ease_factor: number;
  last_reviewed_at: string | null;
  last_grade: 'again' | 'hard' | 'good' | 'easy' | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface MemoryCardWithReview extends MemoryCard {
  review?: MemoryReview;
  deck?: MemoryDeck;
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export class MemoryAPI {
  private readonly DEFAULT_DECK_TITLE = "My Verses";

  async getUserDecks(): Promise<MemoryDeck[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('memory_decks')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('title');

    if (error) throw error;
    return data || [];
  }

  async getOrCreateDefaultDeck(): Promise<MemoryDeck> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if default deck exists
    const { data: existingDeck } = await supabase
      .from('memory_decks')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (existingDeck) return existingDeck;

    // Create default deck
    const { data, error } = await supabase
      .from('memory_decks')
      .insert({
        user_id: user.id,
        title: this.DEFAULT_DECK_TITLE,
        is_default: true
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async createDeck(title: string, description?: string): Promise<MemoryDeck> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('memory_decks')
      .insert({
        user_id: user.id,
        title,
        description,
        is_default: false
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async addCard(verseRef: string, deckId?: string): Promise<MemoryCard> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let targetDeckId = deckId;
    if (!targetDeckId) {
      const defaultDeck = await this.getOrCreateDefaultDeck();
      targetDeckId = defaultDeck.id;
    }

    // Check if card already exists
    const { data: existingCard } = await supabase
      .from('memory_cards')
      .select('*')
      .eq('user_id', user.id)
      .eq('verse_ref', verseRef)
      .eq('deck_id', targetDeckId)
      .single();

    if (existingCard) {
      throw new Error('This verse is already in your memory deck');
    }

    // Create the card
    const { data: card, error: cardError } = await supabase
      .from('memory_cards')
      .insert({
        user_id: user.id,
        deck_id: targetDeckId,
        verse_ref: verseRef
      })
      .select('*')
      .single();

    if (cardError) throw cardError;

    // Create initial review record
    const { error: reviewError } = await supabase
      .from('memory_reviews')
      .insert({
        card_id: card.id,
        due_at: new Date().toISOString(), // Due immediately for first review
        interval_days: 1,
        ease_factor: 2.5,
        review_count: 0
      });

    if (reviewError) throw reviewError;

    return card;
  }

  async getDueCards(limit: number = 20): Promise<MemoryCardWithReview[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('memory_reviews')
      .select(`
        *,
        memory_cards:card_id (
          *,
          memory_decks:deck_id (*)
        )
      `)
      .lte('due_at', now)
      .order('due_at')
      .limit(limit);

    if (error) throw error;

    return (data || []).map(review => ({
      ...review.memory_cards,
      review: {
        ...review,
        last_grade: review.last_grade as 'again' | 'hard' | 'good' | 'easy' | null
      },
      deck: review.memory_cards.memory_decks
    }));
  }

  async reviewCard(cardId: string, grade: ReviewGrade): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current review data
    const { data: currentReview, error: reviewError } = await supabase
      .from('memory_reviews')
      .select('*')
      .eq('card_id', cardId)
      .single();

    if (reviewError) throw reviewError;

    // Calculate new interval and ease factor using SM-2 algorithm
    const { intervalDays, easeFactor } = this.calculateSM2(
      currentReview.interval_days,
      currentReview.ease_factor,
      grade,
      currentReview.review_count
    );

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + intervalDays);

    // Update review record
    const { error: updateError } = await supabase
      .from('memory_reviews')
      .update({
        due_at: dueAt.toISOString(),
        interval_days: intervalDays,
        ease_factor: easeFactor,
        last_reviewed_at: new Date().toISOString(),
        last_grade: grade,
        review_count: currentReview.review_count + 1
      })
      .eq('card_id', cardId);

    if (updateError) throw updateError;
  }

  private calculateSM2(
    currentInterval: number,
    currentEase: number,
    grade: ReviewGrade,
    reviewCount: number
  ): { intervalDays: number; easeFactor: number } {
    let easeFactor = currentEase;
    let intervalDays = currentInterval;

    // SM-2 algorithm implementation
    switch (grade) {
      case 'again':
        intervalDays = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        break;
      case 'hard':
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
        easeFactor = Math.max(1.3, easeFactor - 0.15);
        break;
      case 'good':
        if (reviewCount === 0) {
          intervalDays = 1;
        } else if (reviewCount === 1) {
          intervalDays = 6;
        } else {
          intervalDays = Math.round(intervalDays * easeFactor);
        }
        break;
      case 'easy':
        if (reviewCount === 0) {
          intervalDays = 4;
        } else {
          intervalDays = Math.round(intervalDays * easeFactor * 1.3);
        }
        easeFactor = Math.min(2.5, easeFactor + 0.15);
        break;
    }

    return { intervalDays, easeFactor };
  }

  async getMemoryStats(): Promise<{
    totalCards: number;
    dueToday: number;
    reviewStreak: number;
    masteredCards: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { totalCards: 0, dueToday: 0, reviewStreak: 0, masteredCards: 0 };

    // Get total cards
    const { count: totalCards } = await supabase
      .from('memory_cards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get due today
    const today = new Date().toISOString().split('T')[0] + 'T23:59:59.999Z';
    const { count: dueToday } = await supabase
      .from('memory_reviews')
      .select(`
        *,
        memory_cards!inner (user_id)
      `, { count: 'exact', head: true })
      .lte('due_at', today)
      .eq('memory_cards.user_id', user.id);

    // Get mastered cards (interval >= 21 days)
    const { count: masteredCards } = await supabase
      .from('memory_reviews')
      .select(`
        *,
        memory_cards!inner (user_id)
      `, { count: 'exact', head: true })
      .gte('interval_days', 21)
      .eq('memory_cards.user_id', user.id);

    // Calculate review streak (simplified - consecutive days with reviews)
    const reviewStreak = await this.calculateReviewStreak();

    return {
      totalCards: totalCards || 0,
      dueToday: dueToday || 0,
      reviewStreak,
      masteredCards: masteredCards || 0
    };
  }

  private async calculateReviewStreak(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: reviews } = await supabase
      .from('memory_reviews')
      .select(`
        last_reviewed_at,
        memory_cards!inner (user_id)
      `)
      .eq('memory_cards.user_id', user.id)
      .not('last_reviewed_at', 'is', null)
      .order('last_reviewed_at', { ascending: false });

    if (!reviews || reviews.length === 0) return 0;

    // Group reviews by date and count consecutive days
    const reviewDates = new Set(
      reviews.map(r => r.last_reviewed_at!.split('T')[0])
    );

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (reviewDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async deleteCard(cardId: string): Promise<void> {
    const { error } = await supabase
      .from('memory_cards')
      .delete()
      .eq('id', cardId);

    if (error) throw error;
  }

  async getDeckCards(deckId: string): Promise<MemoryCardWithReview[]> {
    const { data, error } = await supabase
      .from('memory_cards')
      .select(`
        *,
        memory_reviews (*),
        memory_decks:deck_id (*)
      `)
      .eq('deck_id', deckId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(card => ({
      ...card,
      review: card.memory_reviews[0] ? {
        ...card.memory_reviews[0],
        last_grade: card.memory_reviews[0].last_grade as 'again' | 'hard' | 'good' | 'easy' | null
      } : undefined,
      deck: card.memory_decks
    }));
  }
}

export const memoryAPI = new MemoryAPI();