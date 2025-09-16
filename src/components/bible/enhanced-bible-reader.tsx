import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bookmark, Highlighter, MessageSquare, Volume2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BibleVerse {
  id: string;
  number: number;
  text: string;
  chapter_id: string;
}

interface BibleBook {
  id: string;
  name: string;
  code: string;
  chapter_count: number;
}

interface BibleVersion {
  id: string;
  name: string;
  code: string;
}

export function EnhancedBibleReader() {
  const [versions, setVersions] = useState<BibleVersion[]>([
    { id: '1', name: 'World English Bible', code: 'WEB' },
    { id: '2', name: 'King James Version', code: 'KJV' },
    { id: '3', name: 'New International Version', code: 'NIV' }
  ]);
  const [books, setBooks] = useState<BibleBook[]>([
    { id: '1', name: 'Genesis', code: 'GEN', chapter_count: 50 },
    { id: '2', name: 'Exodus', code: 'EXO', chapter_count: 40 },
    { id: '3', name: 'Matthew', code: 'MAT', chapter_count: 28 },
    { id: '4', name: 'John', code: 'JOH', chapter_count: 21 }
  ]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  
  const [selectedVersion, setSelectedVersion] = useState('1');
  const [selectedBook, setSelectedBook] = useState('4'); // John
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sample verses for John 3
  const sampleVerses = [
    { id: '1', number: 1, text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.", chapter_id: '1' },
    { id: '2', number: 2, text: "This man came to Jesus by night and said to him, \"Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do unless God is with him.\"", chapter_id: '1' },
    { id: '3', number: 16, text: "For God so loved the world, that he gave his only begotten Son, that whoever believes in him should not perish, but have eternal life.", chapter_id: '1' },
    { id: '4', number: 17, text: "For God didn't send his Son into the world to judge the world, but that the world should be saved through him.", chapter_id: '1' }
  ];

  useEffect(() => {
    setVerses(sampleVerses);
  }, [selectedVersion, selectedBook, selectedChapter]);

  const handleBookmark = (verseId: string) => {
    toast({
      title: "Bookmarked",
      description: "Verse added to your bookmarks"
    });
  };

  const handleHighlight = (verseId: string, color: string) => {
    toast({
      title: "Highlighted",
      description: `Verse highlighted in ${color}`
    });
  };

  const handleAddNote = (verseId: string) => {
    toast({
      title: "Note Added",
      description: "Your note has been saved"
    });
  };

  const handleShare = (verseId: string) => {
    const verse = verses.find(v => v.id === verseId);
    if (verse) {
      navigator.clipboard.writeText(`${verse.text} - John ${selectedChapter}:${verse.number}`);
      toast({
        title: "Copied",
        description: "Verse copied to clipboard"
      });
    }
  };

  const handlePlayAudio = (verseId: string) => {
    toast({
      title: "Audio Playing",
      description: "Playing verse audio"
    });
  };

  return (
    <div className="space-y-6">
      {/* Bible Navigation */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Bible Reader
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {versions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.name} ({version.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger>
                <SelectValue placeholder="Select book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChapter.toString()} onValueChange={(value) => setSelectedChapter(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 21 }, (_, i) => i + 1).map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    Chapter {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Bible Text */}
      <LiquidGlassCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              John Chapter {selectedChapter}
            </CardTitle>
            <Badge variant="outline">
              {versions.find(v => v.id === selectedVersion)?.code}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {verses.map((verse) => (
            <div key={verse.id} className="group relative">
              <div className="flex gap-4">
                <Badge variant="outline" className="mt-1 flex-shrink-0">
                  {verse.number}
                </Badge>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed mb-3">
                    {verse.text}
                  </p>
                  
                  {/* Verse Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBookmark(verse.id)}
                    >
                      <Bookmark className="w-3 h-3" />
                    </LiquidGlassButton>
                    
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleHighlight(verse.id, 'yellow')}
                    >
                      <Highlighter className="w-3 h-3" />
                    </LiquidGlassButton>
                    
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddNote(verse.id)}
                    >
                      <MessageSquare className="w-3 h-3" />
                    </LiquidGlassButton>
                    
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayAudio(verse.id)}
                    >
                      <Volume2 className="w-3 h-3" />
                    </LiquidGlassButton>
                    
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare(verse.id)}
                    >
                      <Share2 className="w-3 h-3" />
                    </LiquidGlassButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </LiquidGlassCard>

      {/* Chapter Navigation */}
      <div className="flex justify-between">
        <LiquidGlassButton
          variant="outline"
          disabled={selectedChapter === 1}
          onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
        >
          Previous Chapter
        </LiquidGlassButton>
        
        <LiquidGlassButton
          variant="outline"
          disabled={selectedChapter === 21}
          onClick={() => setSelectedChapter(prev => Math.min(21, prev + 1))}
        >
          Next Chapter
        </LiquidGlassButton>
      </div>
    </div>
  );
}