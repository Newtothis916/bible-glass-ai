import { supabase } from "@/integrations/supabase/client";

export interface Prayer {
  id: string;
  title: string;
  body: string | null;
  tags: string[];
  status: 'active' | 'answered' | 'archived';
  privacy: string;
  created_at: string;
  updated_at: string;
  answered_at: string | null;
  user_id: string;
}

export class PrayerAPI {
  async getUserPrayers(): Promise<Prayer[]> {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addPrayer(title: string, body?: string, tags: string[] = [], privacy: string = 'private'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('prayers')
      .insert({
        title,
        body,
        tags,
        privacy,
        user_id: user.id,
        status: 'active'
      });

    if (error) throw error;
  }

  async updatePrayerStatus(prayerId: string, status: 'active' | 'answered' | 'archived'): Promise<void> {
    const updates: any = { status };
    if (status === 'answered') {
      updates.answered_at = new Date().toISOString();
    } else if (status === 'active') {
      updates.answered_at = null;
    }

    const { error } = await supabase
      .from('prayers')
      .update(updates)
      .eq('id', prayerId);

    if (error) throw error;
  }

  async updatePrayer(prayerId: string, title: string, body?: string, tags: string[] = []): Promise<void> {
    const { error } = await supabase
      .from('prayers')
      .update({ title, body, tags })
      .eq('id', prayerId);

    if (error) throw error;
  }

  async deletePrayer(prayerId: string): Promise<void> {
    const { error } = await supabase
      .from('prayers')
      .delete()
      .eq('id', prayerId);

    if (error) throw error;
  }
}

export const prayerAPI = new PrayerAPI();