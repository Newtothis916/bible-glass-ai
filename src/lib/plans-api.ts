import { supabase } from '@/integrations/supabase/client';

export interface Plan {
  id: string;
  title: string;
  description?: string;
  duration_days: number;
  is_premium: boolean;
  locale: string;
  cover_url?: string;
  author?: string;
  tags: string[];
  created_at: string;
}

export interface PlanDay {
  id: string;
  plan_id: string;
  day_index: number;
  title?: string;
  passages: string[];
  devotion_content?: string;
  prayer_prompt?: string;
  estimated_minutes: number;
}

export interface PlanEnrollment {
  id: string;
  plan_id: string;
  user_id: string;
  start_date: string;
  progress_day: number;
  completed: boolean;
  reminders_time?: string;
  reminders_enabled: boolean;
  muted: boolean;
  created_at: string;
  updated_at: string;
  plan?: Plan;
}

class PlansAPI {
  // Get all available plans
  async getPlans(premiumOnly = false, locale = 'en'): Promise<Plan[]> {
    let query = supabase
      .from('plans')
      .select('*')
      .eq('locale', locale)
      .order('created_at', { ascending: false });

    if (premiumOnly) {
      query = query.eq('is_premium', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get a specific plan with its days
  async getPlan(planId: string): Promise<Plan & { days: PlanDay[] }> {
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        plan_days (
          id,
          plan_id,
          day_index,
          title,
          passages,
          devotion_content,
          prayer_prompt,
          estimated_minutes
        )
      `)
      .eq('id', planId)
      .single();

    if (error) throw error;
    return {
      ...data,
      days: (data.plan_days || []).map((day: any) => ({
        ...day,
        plan_id: planId // Ensure plan_id is included
      }))
    };
  }

  // Get user's plan enrollments
  async getUserEnrollments(userId: string): Promise<PlanEnrollment[]> {
    const { data, error } = await supabase
      .from('plan_enrollments')
      .select(`
        *,
        plan:plans (
          id,
          title,
          description,
          duration_days,
          is_premium,
          locale,
          cover_url,
          author,
          tags,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Enroll in a plan
  async enrollInPlan(planId: string, remindersTime?: string): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('plan_enrollments')
      .insert({
        plan_id: planId,
        user_id: user.id,
        reminders_time: remindersTime,
        reminders_enabled: !!remindersTime,
        start_date: new Date().toISOString().split('T')[0]
      });

    if (error) throw error;
  }

  // Update plan progress
  async updateProgress(enrollmentId: string, dayIndex: number): Promise<void> {
    const { error } = await supabase
      .from('plan_enrollments')
      .update({ 
        progress_day: dayIndex,
        completed: dayIndex >= 0 // Will be updated when we check against total days
      })
      .eq('id', enrollmentId);

    if (error) throw error;
  }

  // Complete a plan
  async completePlan(enrollmentId: string): Promise<void> {
    const { error } = await supabase
      .from('plan_enrollments')
      .update({ completed: true })
      .eq('id', enrollmentId);

    if (error) throw error;
  }

  // Update reminder settings
  async updateReminders(enrollmentId: string, enabled: boolean, time?: string): Promise<void> {
    const { error } = await supabase
      .from('plan_enrollments')
      .update({
        reminders_enabled: enabled,
        reminders_time: time
      })
      .eq('id', enrollmentId);

    if (error) throw error;
  }

  // Get specific plan day
  async getPlanDay(planId: string, dayIndex: number): Promise<PlanDay | null> {
    const { data, error } = await supabase
      .from('plan_days')
      .select('*')
      .eq('plan_id', planId)
      .eq('day_index', dayIndex)
      .single();

    if (error) throw error;
    return data;
  }

  // Search plans
  async searchPlans(query: string, locale = 'en'): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('locale', locale)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const plansAPI = new PlansAPI();