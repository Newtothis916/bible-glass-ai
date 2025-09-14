import { supabase } from '@/integrations/supabase/client';

export interface BibleVersion {
  id: string;
  code: string;
  name: string;
  language: string;
  license_type: string;
  copyright_notice?: string;
  is_premium: boolean;
}

export interface Book {
  id: string;
  code: string;
  name: string;
  testament: string;
  chapter_count: number;
  order_num: number;
}

export interface Chapter {
  id: string;
  number: number;
  verse_count: number;
  verses: Verse[];
}

export interface Verse {
  id: string;
  number: number;
  text: string;
}

export interface Note {
  id: string;
  verse_id: string;
  content: string;
  privacy: string;
  created_at: string;
}

export interface Highlight {
  id: string;
  verse_id: string;
  color: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  verse_id: string;
  created_at: string;
}

class BibleAPI {
  // Get all available Bible versions
  async getVersions(): Promise<BibleVersion[]> {
    const { data, error } = await supabase
      .from('bible_versions')
      .select('*')
      .eq('enabled', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }

  // Get books for a specific version
  async getBooks(versionId: string): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('version_id', versionId)
      .order('order_num');

    if (error) throw error;
    return data || [];
  }

  // Get a specific chapter with verses
  async getChapter(bookId: string, chapterNumber: number): Promise<Chapter | null> {
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select(`
        id,
        number,
        verse_count,
        verses (
          id,
          number,
          text
        )
      `)
      .eq('book_id', bookId)
      .eq('number', chapterNumber)
      .single();

    if (chapterError) throw chapterError;
    return chapterData;
  }

  // Get chapter by version, book code, and chapter number
  async getChapterByReference(versionCode: string, bookCode: string, chapterNumber: number): Promise<Chapter | null> {
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        id,
        number,
        verse_count,
        verses (
          id,
          number,
          text
        ),
        book:books!inner (
          id,
          code,
          name,
          version:bible_versions!inner (
            code
          )
        )
      `)
      .eq('book.version.code', versionCode)
      .eq('book.code', bookCode)
      .eq('number', chapterNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Search verses
  async searchVerses(query: string, versionId?: string): Promise<Verse[]> {
    let supabaseQuery = supabase
      .from('verses')
      .select(`
        id,
        number,
        text,
        chapter:chapters!inner (
          number,
          book:books!inner (
            code,
            name,
            version_id
          )
        )
      `)
      .textSearch('text', query)
      .limit(50);

    if (versionId) {
      supabaseQuery = supabaseQuery.eq('chapter.book.version_id', versionId);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data || [];
  }

  // User annotations
  async getUserHighlights(userId: string, verseIds?: string[]): Promise<Highlight[]> {
    let query = supabase
      .from('highlights')
      .select('*')
      .eq('user_id', userId);

    if (verseIds) {
      query = query.in('verse_id', verseIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async addHighlight(verseId: string, color: string = 'yellow'): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('highlights')
      .insert({ 
        user_id: user.id,
        verse_id: verseId, 
        color 
      });

    if (error) throw error;
  }

  async removeHighlight(verseId: string): Promise<void> {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('verse_id', verseId);

    if (error) throw error;
  }

  async getUserBookmarks(userId: string, verseIds?: string[]): Promise<Bookmark[]> {
    let query = supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);

    if (verseIds) {
      query = query.in('verse_id', verseIds);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async addBookmark(verseId: string): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('bookmarks')
      .insert({ 
        user_id: user.id,
        verse_id: verseId 
      });

    if (error) throw error;
  }

  async removeBookmark(verseId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('verse_id', verseId);

    if (error) throw error;
  }

  async getUserNotes(userId: string, verseIds?: string[]): Promise<Note[]> {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId);

    if (verseIds) {
      query = query.in('verse_id', verseIds);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async addNote(verseId: string, content: string, privacy: string = 'private'): Promise<void> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notes')
      .insert({ 
        user_id: user.id,
        verse_id: verseId, 
        content, 
        privacy 
      });

    if (error) throw error;
  }

  async updateNote(noteId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({ content })
      .eq('id', noteId);

    if (error) throw error;
  }

  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  }
}

export const bibleAPI = new BibleAPI();