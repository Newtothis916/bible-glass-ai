import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Search, Grid, List, Heart, BookOpen, Star, Trash2, FolderOpen } from "lucide-react";
import { useState } from "react";

interface BookmarkItem {
  id: string;
  title: string;
  verse: string;
  book: string;
  chapter: number;
  verseNumber: number;
  category: string;
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}

const mockBookmarks: BookmarkItem[] = [
  {
    id: '1',
    title: 'God\'s Love and Salvation',
    verse: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    book: 'John',
    chapter: 3,
    verseNumber: 16,
    category: 'Salvation',
    tags: ['love', 'salvation', 'eternal life'],
    createdAt: '2024-01-15',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Strength Through Christ',
    verse: 'I can do all this through him who gives me strength.',
    book: 'Philippians',
    chapter: 4,
    verseNumber: 13,
    category: 'Encouragement',
    tags: ['strength', 'perseverance', 'faith'],
    createdAt: '2024-01-12',
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Trust in the Lord',
    verse: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    book: 'Proverbs',
    chapter: 3,
    verseNumber: 5,
    category: 'Wisdom',
    tags: ['trust', 'wisdom', 'guidance'],
    createdAt: '2024-01-10',
    isFavorite: true,
  },
  {
    id: '4',
    title: 'The Lord\'s Prayer',
    verse: 'This, then, is how you should pray: "Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven."',
    book: 'Matthew',
    chapter: 6,
    verseNumber: 9,
    category: 'Prayer',
    tags: ['prayer', 'worship', 'kingdom'],
    createdAt: '2024-01-08',
    isFavorite: false,
  },
  {
    id: '5',
    title: 'God\'s Plans',
    verse: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.',
    book: 'Jeremiah',
    chapter: 29,
    verseNumber: 11,
    category: 'Hope',
    tags: ['hope', 'future', 'plans', 'prosperity'],
    createdAt: '2024-01-05',
    isFavorite: true,
  },
];

export default function BookmarksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', ...Array.from(new Set(mockBookmarks.map(b => b.category)))];
  
  const filteredBookmarks = mockBookmarks.filter(bookmark => {
    const matchesSearch = searchTerm === '' || 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const favoriteBookmarks = filteredBookmarks.filter(b => b.isFavorite);
  const recentBookmarks = [...filteredBookmarks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Bookmarks
          </h1>
          <p className="text-muted-foreground">
            Your saved verses and favorite passages
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search and Filter Bar */}
          <LiquidGlassCard variant="elevated">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookmarks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{mockBookmarks.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookmarks</div>
              </CardContent>
            </LiquidGlassCard>
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{favoriteBookmarks.length}</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </CardContent>
            </LiquidGlassCard>
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </LiquidGlassCard>
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Bookmarks Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                All ({filteredBookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites ({favoriteBookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredBookmarks.length === 0 ? (
                <LiquidGlassCard variant="elevated">
                  <CardContent className="p-8 text-center">
                    <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookmarks found</h3>
                    <p className="text-muted-foreground mb-4">
                      Start bookmarking verses as you read to build your collection
                    </p>
                  </CardContent>
                </LiquidGlassCard>
              ) : (
                <BookmarksList bookmarks={filteredBookmarks} viewMode={viewMode} />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favoriteBookmarks.length === 0 ? (
                <LiquidGlassCard variant="elevated">
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground">
                      Mark your most meaningful verses as favorites
                    </p>
                  </CardContent>
                </LiquidGlassCard>
              ) : (
                <BookmarksList bookmarks={favoriteBookmarks} viewMode={viewMode} />
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <BookmarksList bookmarks={recentBookmarks} viewMode={viewMode} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}

function BookmarksList({ bookmarks, viewMode }: { bookmarks: BookmarkItem[], viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {bookmarks.map(bookmark => (
          <LiquidGlassCard key={bookmark.id} variant="elevated">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {bookmark.category}
                    </Badge>
                    {bookmark.isFavorite && (
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    )}
                  </div>
                  <h3 className="font-medium mb-1">{bookmark.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {bookmark.book} {bookmark.chapter}:{bookmark.verseNumber}
                  </p>
                  <blockquote className="text-sm border-l-2 border-primary/30 pl-3 italic mb-3">
                    "{bookmark.verse}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <Button variant="ghost" size="sm">
                    <FolderOpen className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map(bookmark => (
        <LiquidGlassCard key={bookmark.id} variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {bookmark.category}
                  </Badge>
                  {bookmark.isFavorite && (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">{bookmark.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookmark.book} {bookmark.chapter}:{bookmark.verseNumber}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <FolderOpen className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <blockquote className="border-l-2 border-primary/30 pl-3 text-sm italic line-clamp-3">
                "{bookmark.verse}"
              </blockquote>
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {bookmark.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{bookmark.tags.length - 3}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(bookmark.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      ))}
    </div>
  );
}