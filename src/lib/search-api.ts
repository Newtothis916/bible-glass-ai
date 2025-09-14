import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  verse_id: string;
  text: string;
  verse_number: number;
  chapter_number: number;
  book_name: string;
  book_code: string;
  version_code: string;
  version_name: string;
  testament: string;
  relevance?: number;
}

export interface SearchFilters {
  versions?: string[];
  testament?: 'ot' | 'nt' | 'both';
  books?: string[];
  wordsOfChrist?: boolean;
}

class SearchAPI {
  // Text search across Bible verses
  async searchVerses(
    query: string, 
    filters: SearchFilters = {},
    limit = 50
  ): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    let searchQuery = supabase
      .from('verses')
      .select(`
        id,
        number,
        text,
        chapter:chapters!inner(
          id,
          number,
          book:books!inner(
            id,
            code,
            name,
            testament,
            version:bible_versions!inner(
              id,
              code,
              name
            )
          )
        )
      `)
      .textSearch('text', query.trim(), {
        type: 'websearch',
        config: 'english'
      })
      .limit(limit);

    // Apply filters
    if (filters.versions && filters.versions.length > 0) {
      searchQuery = searchQuery.in('chapter.book.version.code', filters.versions);
    }

    if (filters.testament && filters.testament !== 'both') {
      searchQuery = searchQuery.eq('chapter.book.testament', filters.testament);
    }

    if (filters.books && filters.books.length > 0) {
      searchQuery = searchQuery.in('chapter.book.code', filters.books);
    }

    const { data, error } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      throw error;
    }

    // Transform the data to match our SearchResult interface
    return (data || []).map((item: any) => ({
      id: `${item.chapter.book.version.code}-${item.chapter.book.code}-${item.chapter.number}-${item.number}`,
      verse_id: item.id,
      text: item.text,
      verse_number: item.number,
      chapter_number: item.chapter.number,
      book_name: item.chapter.book.name,
      book_code: item.chapter.book.code,
      version_code: item.chapter.book.version.code,
      version_name: item.chapter.book.version.name,
      testament: item.chapter.book.testament,
      relevance: 1 // PostgreSQL full-text search doesn't return relevance scores directly
    }));
  }

  // Simple verse reference parser and lookup
  async lookupReference(reference: string): Promise<SearchResult[]> {
    // Simple regex for "Book Chapter:Verse" format
    const refRegex = /^(\d?\s?\w+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
    const match = reference.trim().match(refRegex);

    if (!match) return [];

    const [, bookName, chapterStr, verseStart, verseEnd] = match;
    const chapter = parseInt(chapterStr);
    const startVerse = verseStart ? parseInt(verseStart) : null;
    const endVerse = verseEnd ? parseInt(verseEnd) : startVerse;

    try {
      let query = supabase
        .from('verses')
        .select(`
          id,
          number,
          text,
          chapter:chapters!inner(
            id,
            number,
            book:books!inner(
              id,
              code,
              name,
              testament,
              version:bible_versions!inner(
                id,
                code,
                name
              )
            )
          )
        `)
        .eq('chapter.number', chapter)
        .ilike('chapter.book.name', `%${bookName.trim()}%`);

      if (startVerse) {
        if (endVerse && endVerse !== startVerse) {
          query = query.gte('number', startVerse).lte('number', endVerse);
        } else {
          query = query.eq('number', startVerse);
        }
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: `${item.chapter.book.version.code}-${item.chapter.book.code}-${item.chapter.number}-${item.number}`,
        verse_id: item.id,
        text: item.text,
        verse_number: item.number,
        chapter_number: item.chapter.number,
        book_name: item.chapter.book.name,
        book_code: item.chapter.book.code,
        version_code: item.chapter.book.version.code,
        version_name: item.chapter.book.version.name,
        testament: item.chapter.book.testament,
        relevance: 1
      }));
    } catch (error) {
      console.error('Reference lookup error:', error);
      return [];
    }
  }

  // Get popular search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    // Common Bible topics and themes
    const suggestions = [
      'love', 'faith', 'hope', 'peace', 'joy', 'forgiveness', 'salvation',
      'prayer', 'wisdom', 'trust', 'strength', 'comfort', 'healing',
      'eternal life', 'grace', 'mercy', 'righteousness', 'truth',
      'Jesus', 'God\'s love', 'Holy Spirit', 'Kingdom of God',
      'fear not', 'be strong', 'do not worry', 'trust in the Lord'
    ];

    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  // Get recent searches for a user
  async getUserRecentSearches(userId: string, limit = 10): Promise<string[]> {
    // This would be implemented with a searches table in a full app
    // For now, return empty array
    return [];
  }

  // Advanced search with multiple terms and operators
  async advancedSearch(
    terms: string[], 
    operator: 'AND' | 'OR' = 'AND',
    filters: SearchFilters = {},
    limit = 50
  ): Promise<SearchResult[]> {
    if (!terms.length) return [];

    const searchQuery = operator === 'AND' 
      ? terms.join(' & ')
      : terms.join(' | ');

    return this.searchVerses(searchQuery, filters, limit);
  }
}

export const searchAPI = new SearchAPI();