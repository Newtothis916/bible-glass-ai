import { supabase } from "@/integrations/supabase/client";

export interface Group {
  id: string;
  name: string;
  description: string | null;
  visibility: 'public' | 'private' | 'invite_only';
  member_count: number;
  owner_id: string | null;
  invite_code: string | null;
  created_at: string;
  updated_at: string;
  is_premium_only: boolean;
}

export interface GroupMember {
  user_id: string;
  group_id: string;
  role: 'owner' | 'moderator' | 'member';
  joined_at: string;
}

export interface Message {
  id: string;
  body: string | null;
  user_id: string;
  group_id: string;
  type: 'text' | 'verse' | 'prayer' | 'media';
  verse_refs: string[];
  media_url: string | null;
  reply_to: string | null;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
}

export class GroupsAPI {
  async getUserGroups(): Promise<Group[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(user_id)
      `)
      .eq('group_members.user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getPublicGroups(): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('visibility', 'public')
      .order('member_count', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  async createGroup(name: string, description: string, visibility: Group['visibility']): Promise<Group> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('groups')
      .insert({
        name,
        description,
        visibility,
        owner_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getGroupMessages(groupId: string, limit: number = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data?.reverse() || [];
  }

  async sendMessage(groupId: string, body: string, type: Message['type'] = 'text'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('messages')
      .insert({
        group_id: groupId,
        user_id: user.id,
        body,
        type
      });

    if (error) throw error;
  }

  async joinGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member'
      });

    if (error) throw error;
  }

  async leaveGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) throw error;
  }
}

export const groupsAPI = new GroupsAPI();