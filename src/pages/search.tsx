import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchAPI, SearchResult, SearchFilters } from '@/lib/search-api';
import { bibleAPI } from '@/lib/bible-api';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ExternalLink,
  Loader2,
  History,
  TrendingUp,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    versions: ['web'],
    testament: 'both',
    books: []
  });

  useEffect(() => {
    loadVersions();
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const loadVersions = async () => {
    try {
      const versionsData = await bibleAPI.getVersions();
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const suggestionsData = await searchAPI.getSearchSuggestions(query);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const performSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchParams({ q: searchQuery });
    
    try {
      // Try verse reference lookup first
      const referenceResults = await searchAPI.lookupReference(searchQuery);
      
      if (referenceResults.length > 0) {
        setResults(referenceResults);
      } else {
        // Fall back to text search
        const searchResults = await searchAPI.searchVerses(searchQuery, filters);
        setResults(searchResults);
      }
      
      if (results.length === 0) {
        toast.info('No results found. Try different keywords.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/read/${result.version_code}/${result.book_code}/${result.chapter_number}`);
  };

  const clearFilters = () => {
    setFilters({
      versions: ['web'],
      testament: 'both',
      books: []
    });
  };

  const formatVerseReference = (result: SearchResult) => {
    return `${result.book_name} ${result.chapter_number}:${result.verse_number}`;
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const popularSearches = [
    'John 3:16', 'love', 'faith', 'hope', 'peace', 'forgiveness', 
    'salvation', 'prayer', 'wisdom', 'strength'
  ];

  return (
    <MainLayout currentTab="read">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Search Scripture</h1>
          <p className="text-muted-foreground">
            Find verses by reference, keywords, or topics
          </p>
        </div>

        {/* Search Bar */}
        <LiquidGlassCard className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search for verses, topics, or try 'John 3:16'..."
                className="pl-10 pr-12 text-lg h-12"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LiquidGlassButton 
                  onClick={() => performSearch()}
                  disabled={!query.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </LiquidGlassButton>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {Object.values(filters).some(f => f !== 'both' && f?.length > 0) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(suggestion);
                        performSearch(suggestion);
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </LiquidGlassCard>

        {/* Filters Panel */}
        {showFilters && (
          <LiquidGlassCard className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Search Filters</h3>
              
              {/* Bible Version Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bible Version</label>
                <div className="flex flex-wrap gap-2">
                  {versions.map((version) => (
                    <Button
                      key={version.id}
                      variant={filters.versions?.includes(version.code) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentVersions = filters.versions || [];
                        const newVersions = currentVersions.includes(version.code)
                          ? currentVersions.filter(v => v !== version.code)
                          : [...currentVersions, version.code];
                        setFilters({ ...filters, versions: newVersions });
                      }}
                    >
                      {version.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Testament Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Testament</label>
                <div className="flex gap-2">
                  {[
                    { value: 'both', label: 'Both' },
                    { value: 'ot', label: 'Old Testament' },
                    { value: 'nt', label: 'New Testament' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.testament === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilters({ ...filters, testament: option.value as any })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Search Results ({results.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Found in {new Set(results.map(r => r.version_name)).size} version(s)
              </p>
            </div>

            <div className="space-y-3">
              {results.map((result) => (
                <LiquidGlassCard 
                  key={result.id}
                  className="p-4 hover:scale-[1.01] transition-transform cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-primary">
                          {formatVerseReference(result)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{result.version_name}</Badge>
                          <Badge variant="outline">{result.testament.toUpperCase()}</Badge>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                      {highlightSearchTerm(result.text, query)}
                    </p>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        ) : !loading && query ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try different keywords or check your spelling
            </p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((search) => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(search);
                      performSearch(search);
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : !query && !loading ? (
          <div className="text-center py-12 space-y-6">
            <div className="space-y-4">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium mb-2">Search the Bible</h3>
                <p className="text-muted-foreground">
                  Enter a verse reference like "John 3:16" or search for topics like "love" or "faith"
                </p>
              </div>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  Popular searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 6).map((search) => (
                    <Button
                      key={search}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(search);
                        performSearch(search);
                      }}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}