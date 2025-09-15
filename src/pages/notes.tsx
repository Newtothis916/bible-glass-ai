import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Star, Tag } from "lucide-react";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  verse: string;
  book: string;
  chapter: number;
  verseNumber: number;
  tags: string[];
  createdAt: string;
  isHighlight: boolean;
  highlightColor?: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'God\'s Love',
    content: 'This verse reminds me of God\'s unconditional love for us. No matter what we\'ve done, His love remains constant.',
    verse: 'For God so loved the world that he gave his one and only Son...',
    book: 'John',
    chapter: 3,
    verseNumber: 16,
    tags: ['love', 'salvation', 'grace'],
    createdAt: '2024-01-15',
    isHighlight: false,
  },
  {
    id: '2',
    title: '',
    content: '',
    verse: 'I can do all this through him who gives me strength.',
    book: 'Philippians',
    chapter: 4,
    verseNumber: 13,
    tags: ['strength', 'perseverance'],
    createdAt: '2024-01-10',
    isHighlight: true,
    highlightColor: 'yellow',
  },
  {
    id: '3',
    title: 'Trust in the Lord',
    content: 'A powerful reminder to trust God completely, especially when we don\'t understand His ways.',
    verse: 'Trust in the Lord with all your heart and lean not on your own understanding...',
    book: 'Proverbs',
    chapter: 3,
    verseNumber: 5,
    tags: ['trust', 'wisdom', 'guidance'],
    createdAt: '2024-01-08',
    isHighlight: false,
  },
];

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const allTags = Array.from(new Set(mockNotes.flatMap(note => note.tags)));
  
  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.verse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.book.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const notes = filteredNotes.filter(note => !note.isHighlight);
  const highlights = filteredNotes.filter(note => note.isHighlight);

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Notes & Highlights
          </h1>
          <p className="text-muted-foreground">
            Your personal Bible study collection
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
                    placeholder="Search notes, highlights, and verses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreatingNote(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Note
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </LiquidGlassCard>

          {/* Notes and Highlights Tabs */}
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Notes ({notes.length})
              </TabsTrigger>
              <TabsTrigger value="highlights" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Highlights ({highlights.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              {notes.length === 0 ? (
                <LiquidGlassCard variant="elevated">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notes found</h3>
                    <p className="text-muted-foreground mb-4">
                      Start taking notes as you read to build your study collection
                    </p>
                    <Button onClick={() => setIsCreatingNote(true)}>
                      Create Your First Note
                    </Button>
                  </CardContent>
                </LiquidGlassCard>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {notes.map(note => (
                    <LiquidGlassCard key={note.id} variant="elevated">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {note.book} {note.chapter}:{note.verseNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <blockquote className="border-l-2 border-primary/30 pl-3 text-sm italic">
                            "{note.verse}"
                          </blockquote>
                          {note.content && (
                            <p className="text-sm text-muted-foreground">
                              {note.content}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </LiquidGlassCard>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="highlights" className="space-y-4">
              {highlights.length === 0 ? (
                <LiquidGlassCard variant="elevated">
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No highlights found</h3>
                    <p className="text-muted-foreground mb-4">
                      Highlight verses as you read to quickly find them later
                    </p>
                  </CardContent>
                </LiquidGlassCard>
              ) : (
                <div className="space-y-3">
                  {highlights.map(highlight => (
                    <LiquidGlassCard key={highlight.id} variant="elevated">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full bg-${highlight.highlightColor || 'yellow'}-400`} />
                              <p className="text-sm font-medium">
                                {highlight.book} {highlight.chapter}:{highlight.verseNumber}
                              </p>
                            </div>
                            <blockquote className="text-sm border-l-2 border-primary/30 pl-3 italic">
                              "{highlight.verse}"
                            </blockquote>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex flex-wrap gap-1">
                                {highlight.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(highlight.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
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
              )}
            </TabsContent>
          </Tabs>

          {/* Create Note Modal (simplified for now) */}
          {isCreatingNote && (
            <LiquidGlassCard variant="elevated" className="fixed inset-4 z-50 max-w-2xl mx-auto my-auto">
              <CardHeader>
                <CardTitle>Create New Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Note title (optional)" />
                <Input placeholder="Bible reference (e.g., John 3:16)" />
                <Textarea placeholder="Your thoughts and reflections..." rows={4} />
                <Input placeholder="Tags (comma-separated)" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingNote(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreatingNote(false)}>
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </LiquidGlassCard>
          )}
        </div>
      </div>
    </MainLayout>
  );
}