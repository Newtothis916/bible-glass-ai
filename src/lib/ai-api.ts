import { supabase } from '@/integrations/supabase/client';

export interface AIResponse {
  answer_md: string;
  citations: Citation[];
  tokens_used: number;
  response_time_ms: number;
}

export interface Citation {
  type: 'verse' | 'resource';
  ref: string;
  excerpt: string;
}

export interface AIQuery {
  id: string;
  user_id: string;
  question: string;
  context_refs: string[];
  answer_md?: string;
  citations: Citation[];
  tokens_used: number;
  rating?: number;
  feedback?: string;
  created_at: string;
}

class AIAPI {
  // Ask the AI Bible Guide a question
  async askBibleGuide(question: string, contextRefs: string[] = []): Promise<AIResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.functions.invoke('ai-bible-guide', {
      body: {
        question,
        contextRefs,
        userId: user?.id
      }
    });

    if (error) throw error;
    return data;
  }

  // Get user's AI query history
  async getUserQueries(userId: string, limit = 50): Promise<AIQuery[]> {
    const { data, error } = await supabase
      .from('ai_queries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Transform Json to Citation[] type and handle nullable fields
    return (data || []).map(item => ({
      id: item.id,
      user_id: item.user_id,
      question: item.question,
      context_refs: item.context_refs || [],
      answer_md: item.answer_md || undefined,
      citations: Array.isArray(item.citations) 
        ? (item.citations as unknown as Citation[])
        : [],
      tokens_used: item.tokens_used || 0,
      rating: item.rating || undefined,
      feedback: item.feedback || undefined,
      created_at: item.created_at
    }));
  }

  // Rate an AI response
  async rateResponse(queryId: string, rating: number, feedback?: string): Promise<void> {
    const { error } = await supabase
      .from('ai_queries')
      .update({
        rating: Math.max(1, Math.min(5, rating)), // Ensure 1-5 range
        feedback
      })
      .eq('id', queryId);

    if (error) throw error;
  }

  // Get usage stats for current user
  async getUserUsageStats(userId: string): Promise<{
    totalQueries: number;
    queriesThisMonth: number;
    averageRating: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('ai_queries')
      .select('created_at, rating')
      .eq('user_id', userId);

    if (error) throw error;

    const queries = data || [];
    const thisMonthQueries = queries.filter(
      q => new Date(q.created_at) >= startOfMonth
    );
    
    const ratedQueries = queries.filter(q => q.rating > 0);
    const averageRating = ratedQueries.length > 0
      ? ratedQueries.reduce((sum, q) => sum + q.rating, 0) / ratedQueries.length
      : 0;

    return {
      totalQueries: queries.length,
      queriesThisMonth: thisMonthQueries.length,
      averageRating: Math.round(averageRating * 10) / 10
    };
  }

  // Check if user has reached their AI usage limit
  async checkUsageLimit(userId: string, isPremium: boolean): Promise<{
    canUse: boolean;
    remaining?: number;
    resetDate?: string;
  }> {
    if (isPremium) {
      return { canUse: true };
    }

    // Free tier: 5 queries per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('ai_queries')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) throw error;

    const queriesCount = data?.length || 0;
    const dailyLimit = 5;
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      canUse: queriesCount < dailyLimit,
      remaining: Math.max(0, dailyLimit - queriesCount),
      resetDate: tomorrow.toISOString()
    };
  }
}

export const aiAPI = new AIAPI();