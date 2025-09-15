import { supabase } from "@/integrations/supabase/client";

export interface LifeRule {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  morning_practices: any; // Use any to match Supabase Json type
  midday_practices: any;
  evening_practices: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RuleCompletion {
  id: string;
  user_id: string;
  rule_id: string;
  date_iso: string;
  time_slot: 'morning' | 'midday' | 'evening';
  completed_at: string;
  notes: string | null;
}

export interface DailyRuleProgress {
  date: string;
  morning: boolean;
  midday: boolean;
  evening: boolean;
  totalSlots: number;
  completedSlots: number;
  percentComplete: number;
}

export class RuleOfLifeAPI {
  async getUserRules(): Promise<LifeRule[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('life_rules')
      .select('*')
      .eq('user_id', user.id)
      .order('is_active', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(rule => ({
      ...rule,
      morning_practices: rule.morning_practices as string[],
      midday_practices: rule.midday_practices as string[],
      evening_practices: rule.evening_practices as string[]
    }));
  }

  async getActiveRule(): Promise<LifeRule | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('life_rules')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data ? {
      ...data,
      morning_practices: data.morning_practices as string[],
      midday_practices: data.midday_practices as string[],
      evening_practices: data.evening_practices as string[]
    } : null;
  }

  async createRule(rule: {
    title: string;
    description?: string;
    morning_practices: string[];
    midday_practices: string[];
    evening_practices: string[];
  }): Promise<LifeRule> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Deactivate other rules first
    await this.deactivateAllRules();

    const { data, error } = await supabase
      .from('life_rules')
      .insert({
        user_id: user.id,
        title: rule.title,
        description: rule.description || null,
        morning_practices: rule.morning_practices,
        midday_practices: rule.midday_practices,
        evening_practices: rule.evening_practices,
        is_active: true
      })
      .select('*')
      .single();

    if (error) throw error;
    return {
      ...data,
      morning_practices: data.morning_practices as string[],
      midday_practices: data.midday_practices as string[],
      evening_practices: data.evening_practices as string[]
    };
  }

  async updateRule(ruleId: string, updates: Partial<LifeRule>): Promise<void> {
    const { error } = await supabase
      .from('life_rules')
      .update(updates)
      .eq('id', ruleId);

    if (error) throw error;
  }

  async activateRule(ruleId: string): Promise<void> {
    // Deactivate all other rules first
    await this.deactivateAllRules();

    // Activate the selected rule
    const { error } = await supabase
      .from('life_rules')
      .update({ is_active: true })
      .eq('id', ruleId);

    if (error) throw error;
  }

  private async deactivateAllRules(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('life_rules')
      .update({ is_active: false })
      .eq('user_id', user.id);
  }

  async markSlotComplete(
    ruleId: string, 
    timeSlot: 'morning' | 'midday' | 'evening', 
    date: string = new Date().toISOString().split('T')[0],
    notes?: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('rule_completions')
      .upsert({
        user_id: user.id,
        rule_id: ruleId,
        date_iso: date,
        time_slot: timeSlot,
        notes: notes || null,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,rule_id,date_iso,time_slot'
      });

    if (error) throw error;
  }

  async unmarkSlotComplete(
    ruleId: string, 
    timeSlot: 'morning' | 'midday' | 'evening', 
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('rule_completions')
      .delete()
      .eq('user_id', user.id)
      .eq('rule_id', ruleId)
      .eq('date_iso', date)
      .eq('time_slot', timeSlot);

    if (error) throw error;
  }

  async getDailyProgress(
    ruleId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<DailyRuleProgress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Default to last 30 days if no range provided
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || (() => {
      const date = new Date();
      date.setDate(date.getDate() - 29);
      return date.toISOString().split('T')[0];
    })();

    const { data: completions, error } = await supabase
      .from('rule_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('rule_id', ruleId)
      .gte('date_iso', start)
      .lte('date_iso', end)
      .order('date_iso');

    if (error) throw error;

    // Get the rule to know what slots should be available
    const rule = await this.getRuleById(ruleId);
    if (!rule) throw new Error('Rule not found');

    // Group completions by date
    const completionsByDate = new Map<string, Set<string>>();
    (completions || []).forEach(completion => {
      if (!completionsByDate.has(completion.date_iso)) {
        completionsByDate.set(completion.date_iso, new Set());
      }
      completionsByDate.get(completion.date_iso)!.add(completion.time_slot);
    });

    // Calculate available slots for this rule
    const availableSlots = [];
    if (rule.morning_practices.length > 0) availableSlots.push('morning');
    if (rule.midday_practices.length > 0) availableSlots.push('midday');
    if (rule.evening_practices.length > 0) availableSlots.push('evening');

    // Generate progress for each date in range
    const progress: DailyRuleProgress[] = [];
    const currentDate = new Date(start);
    const endDate_obj = new Date(end);

    while (currentDate <= endDate_obj) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const completedSlots = completionsByDate.get(dateStr) || new Set();

      const morning = availableSlots.includes('morning') && completedSlots.has('morning');
      const midday = availableSlots.includes('midday') && completedSlots.has('midday');
      const evening = availableSlots.includes('evening') && completedSlots.has('evening');

      const totalSlots = availableSlots.length;
      const completedCount = [morning, midday, evening].filter(Boolean).length;
      const percentComplete = totalSlots > 0 ? (completedCount / totalSlots) * 100 : 0;

      progress.push({
        date: dateStr,
        morning,
        midday,
        evening,
        totalSlots,
        completedSlots: completedCount,
        percentComplete: Math.round(percentComplete)
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return progress;
  }

  private async getRuleById(ruleId: string): Promise<LifeRule | null> {
    const { data, error } = await supabase
      .from('life_rules')
      .select('*')
      .eq('id', ruleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? {
      ...data,
      morning_practices: data.morning_practices as string[],
      midday_practices: data.midday_practices as string[],
      evening_practices: data.evening_practices as string[]
    } : null;
  }

  async getRuleStats(ruleId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    averageCompletion: number;
  }> {
    const progress = await this.getDailyProgress(ruleId);
    
    // Calculate current streak (from today backwards)
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = progress.length - 1; i >= 0; i--) {
      const day = progress[i];
      if (day.date <= today && day.percentComplete === 100) {
        currentStreak++;
      } else if (day.date <= today) {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    
    progress.forEach(day => {
      if (day.percentComplete === 100) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // Calculate totals
    const totalDays = progress.filter(day => day.date <= today).length;
    const averageCompletion = totalDays > 0 
      ? progress
          .filter(day => day.date <= today)
          .reduce((sum, day) => sum + day.percentComplete, 0) / totalDays
      : 0;

    return {
      currentStreak,
      longestStreak,
      totalDays,
      averageCompletion: Math.round(averageCompletion)
    };
  }

  async deleteRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('life_rules')
      .delete()
      .eq('id', ruleId);

    if (error) throw error;
  }

  // Predefined practice templates
  getPracticeTemplates(): {
    category: string;
    practices: { id: string; title: string; description: string }[];
  }[] {
    return [
      {
        category: "Scripture & Prayer",
        practices: [
          {
            id: "scripture_reading",
            title: "Scripture Reading",
            description: "Daily Bible reading and reflection"
          },
          {
            id: "lectio_divina", 
            title: "Lectio Divina",
            description: "Meditative Scripture reading"
          },
          {
            id: "morning_prayer",
            title: "Morning Prayer", 
            description: "Start the day in prayer"
          },
          {
            id: "evening_prayer",
            title: "Evening Prayer",
            description: "End the day in prayer"
          },
          {
            id: "daily_examen",
            title: "Daily Examen",
            description: "Reflect on God's presence in your day"
          }
        ]
      },
      {
        category: "Contemplative Practices",
        practices: [
          {
            id: "breath_prayer",
            title: "Breath Prayer",
            description: "Simple prayer with breathing"
          },
          {
            id: "centering_prayer",
            title: "Centering Prayer",
            description: "Silent contemplative prayer"
          },
          {
            id: "silence",
            title: "Silence",
            description: "Quiet time with God"
          },
          {
            id: "gratitude",
            title: "Gratitude Practice",
            description: "Counting daily blessings"
          }
        ]
      },
      {
        category: "Service & Community",
        practices: [
          {
            id: "acts_of_service",
            title: "Acts of Service",
            description: "Serving others in love"
          },
          {
            id: "intercession",
            title: "Intercessory Prayer",
            description: "Praying for others"
          },
          {
            id: "family_prayer",
            title: "Family Prayer",
            description: "Praying with household"
          }
        ]
      }
    ];
  }
}

export const ruleOfLifeAPI = new RuleOfLifeAPI();