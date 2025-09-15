import { supabase } from "@/integrations/supabase/client";

export interface Practice {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  steps: number;
  default_passage: string | null;
  estimated_minutes: number;
  created_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  practice_slug: string;
  started_at: string;
  completed_at: string | null;
  duration_sec: number | null;
  notes_md: string | null;
  passage_ref: string | null;
  steps_completed: number;
  step_data: any; // Use any to match Supabase Json type
  created_at: string;
}

export interface PracticePrompt {
  id: string;
  practice_slug: string;
  step_index: number;
  prompt_text: string;
  locale: string;
  created_at: string;
}

export class PracticesAPI {
  async getPractices(): Promise<Practice[]> {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .order('title');

    if (error) throw error;
    return data || [];
  }

  async getPracticeBySlug(slug: string): Promise<Practice | null> {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  async getPracticePrompts(practiceSlug: string, locale: string = 'en'): Promise<PracticePrompt[]> {
    const { data, error } = await supabase
      .from('practice_prompts')
      .select('*')
      .eq('practice_slug', practiceSlug)
      .eq('locale', locale)
      .order('step_index');

    if (error) throw error;
    return data || [];
  }

  async startPracticeSession(practiceSlug: string, passageRef?: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('practice_sessions')
      .insert({
        practice_slug: practiceSlug,
        user_id: user.id,
        passage_ref: passageRef,
        steps_completed: 0,
        step_data: {}
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async updatePracticeSession(
    sessionId: string, 
    updates: {
      steps_completed?: number;
      step_data?: Record<string, any>;
      notes_md?: string;
      completed_at?: string;
      duration_sec?: number;
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('practice_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) throw error;
  }

  async completePracticeSession(sessionId: string, durationSec: number): Promise<void> {
    const { error } = await supabase
      .from('practice_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_sec: durationSec
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  async getUserPracticeSessions(): Promise<PracticeSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return (data || []) as PracticeSession[];
  }

  async getPracticeSession(sessionId: string): Promise<PracticeSession | null> {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as PracticeSession;
  }

  async getRecentPracticeStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    totalMinutes: number;
    weeklyStreak: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { totalSessions: 0, completedSessions: 0, totalMinutes: 0, weeklyStreak: 0 };

    const { data: sessions } = await supabase
      .from('practice_sessions')
      .select('completed_at, duration_sec, started_at')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (!sessions) return { totalSessions: 0, completedSessions: 0, totalMinutes: 0, weeklyStreak: 0 };

    const completedSessions = sessions.filter(s => s.completed_at).length;
    const totalMinutes = sessions
      .filter(s => s.duration_sec)
      .reduce((sum, s) => sum + (s.duration_sec || 0), 0) / 60;

    // Calculate weekly streak (consecutive weeks with at least one completed session)
    const now = new Date();
    const weeklyStreak = this.calculateWeeklyStreak(sessions as Pick<PracticeSession, 'completed_at' | 'started_at'>[], now);

    return {
      totalSessions: sessions.length,
      completedSessions,
      totalMinutes: Math.round(totalMinutes),
      weeklyStreak
    };
  }

  private calculateWeeklyStreak(sessions: Pick<PracticeSession, 'completed_at' | 'started_at'>[], now: Date): number {
    const completedSessions = sessions.filter(s => s.completed_at);
    if (completedSessions.length === 0) return 0;

    // Group sessions by week
    const weekMap = new Map<string, boolean>();
    
    completedSessions.forEach(session => {
      const date = new Date(session.started_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      weekMap.set(weekKey, true);
    });

    // Count consecutive weeks from current week backwards
    let streak = 0;
    const currentWeek = new Date(now);
    currentWeek.setDate(now.getDate() - now.getDay());
    
    let checkWeek = new Date(currentWeek);
    
    while (weekMap.has(checkWeek.toISOString().split('T')[0])) {
      streak++;
      checkWeek.setDate(checkWeek.getDate() - 7);
    }

    return streak;
  }
}

export const practicesAPI = new PracticesAPI();