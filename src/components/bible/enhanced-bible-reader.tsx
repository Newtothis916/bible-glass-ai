import { useState, useEffect } from "react";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bookmark, Highlighter, MessageSquare, Volume2, Share2, ChevronLeft, ChevronRight } from "lucide-react";
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

// Extended sample verses for a fuller reading experience like YouVersion
const sampleChapterVerses = [
  { id: '1', number: 1, text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.", chapter_id: '1' },
  { id: '2', number: 2, text: "This man came to Jesus by night and said to him, \"Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do unless God is with him.\"", chapter_id: '1' },
  { id: '3', number: 3, text: "Jesus answered him, \"Most certainly, I tell you, unless one is born anew, he can't see God's Kingdom.\"", chapter_id: '1' },
  { id: '4', number: 4, text: "Nicodemus said to him, \"How can a man be born when he is old? Can he enter a second time into his mother's womb, and be born?\"", chapter_id: '1' },
  { id: '5', number: 5, text: "Jesus answered, \"Most certainly I tell you, unless one is born of water and spirit, he can't enter into God's Kingdom.\"", chapter_id: '1' },
  { id: '6', number: 6, text: "That which is born of the flesh is flesh. That which is born of the Spirit is spirit.", chapter_id: '1' },
  { id: '7', number: 7, text: "Don't marvel that I said to you, 'You must be born anew.'", chapter_id: '1' },
  { id: '8', number: 8, text: "The wind blows where it wants to, and you hear its sound, but don't know where it comes from and where it is going. So is everyone who is born of the Spirit.\"", chapter_id: '1' },
  { id: '9', number: 9, text: "Nicodemus answered him, \"How can these things be?\"", chapter_id: '1' },
  { id: '10', number: 10, text: "Jesus answered him, \"Are you the teacher of Israel, and don't understand these things?\"", chapter_id: '1' },
  { id: '11', number: 11, text: "Most certainly I tell you, we speak that which we know, and testify of that which we have seen, and you don't receive our witness.", chapter_id: '1' },
  { id: '12', number: 12, text: "If I told you earthly things and you don't believe, how will you believe if I tell you heavenly things?", chapter_id: '1' },
  { id: '13', number: 13, text: "No one has ascended into heaven, but he who descended out of heaven, the Son of Man, who is in heaven.", chapter_id: '1' },
  { id: '14', number: 14, text: "As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,", chapter_id: '1' },
  { id: '15', number: 15, text: "that whoever believes in him should not perish, but have eternal life.", chapter_id: '1' },
  { id: '16', number: 16, text: "For God so loved the world, that he gave his only begotten Son, that whoever believes in him should not perish, but have eternal life.", chapter_id: '1' },
  { id: '17', number: 17, text: "For God didn't send his Son into the world to judge the world, but that the world should be saved through him.", chapter_id: '1' },
  { id: '18', number: 18, text: "He who believes in him is not judged. He who doesn't believe has been judged already, because he has not believed in the name of the one and only Son of God.", chapter_id: '1' },
  { id: '19', number: 19, text: "This is the judgment, that the light has come into the world, and men loved the darkness rather than the light; for their works were evil.", chapter_id: '1' },
  { id: '20', number: 20, text: "For everyone who does evil hates the light, and doesn't come to the light, lest his works would be exposed.", chapter_id: '1' },
  { id: '21', number: 21, text: "But he who does the truth comes to the light, that his works may be revealed, that they have been done in God.", chapter_id: '1' },
  { id: '22', number: 22, text: "After these things, Jesus came with his disciples into the land of Judea. He stayed there with them, and baptized.", chapter_id: '1' },
  { id: '23', number: 23, text: "John also was baptizing in Enon near Salim, because there was much water there. They came, and were baptized.", chapter_id: '1' },
  { id: '24', number: 24, text: "For John was not yet thrown into prison.", chapter_id: '1' },
  { id: '25', number: 25, text: "There arose therefore a questioning on the part of John's disciples with some Jews about purification.", chapter_id: '1' },
  { id: '26', number: 26, text: "They came to John, and said to him, \"Rabbi, he who was with you beyond the Jordan, to whom you have testified, behold, the same baptizes, and all men come to him.\"", chapter_id: '1' },
  { id: '27', number: 27, text: "John answered, \"A man can receive nothing, unless it has been given him from heaven.\"", chapter_id: '1' },
  { id: '28', number: 28, text: "You yourselves testify that I said, 'I am not the Christ,' but, 'I have been sent before him.'", chapter_id: '1' },
  { id: '29', number: 29, text: "He who has the bride is the bridegroom; but the friend of the bridegroom, who stands and hears him, rejoices greatly because of the bridegroom's voice. This, my joy, therefore is made full.", chapter_id: '1' },
  { id: '30', number: 30, text: "He must increase, but I must decrease.", chapter_id: '1' },
  { id: '31', number: 31, text: "He who comes from above is above all. He who is from the earth belongs to the earth, and speaks of the earth. He who comes from heaven is above all.", chapter_id: '1' },
  { id: '32', number: 32, text: "What he has seen and heard, of that he testifies; and no one receives his witness.", chapter_id: '1' },
  { id: '33', number: 33, text: "He who has received his witness has set his seal to this, that God is true.", chapter_id: '1' },
  { id: '34', number: 34, text: "For he whom God has sent speaks the words of God; for God gives the Spirit without measure.", chapter_id: '1' },
  { id: '35', number: 35, text: "The Father loves the Son, and has given all things into his hand.", chapter_id: '1' },
  { id: '36', number: 36, text: "One who believes in the Son has eternal life, but one who disobeys the Son won't see life, but the wrath of God remains on him.\"", chapter_id: '1' }
];

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
  const [fontSize, setFontSize] = useState('medium');
  const { toast } = useToast();

  useEffect(() => {
    setVerses(sampleChapterVerses);
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

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-base';
      case 'large': return 'text-xl';
      case 'extra-large': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Clean Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LiquidGlassButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
            disabled={selectedChapter === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </LiquidGlassButton>
          
          <h1 className="text-2xl font-semibold text-foreground">
            John {selectedChapter}
          </h1>
          
          <LiquidGlassButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChapter(prev => Math.min(21, prev + 1))}
            disabled={selectedChapter === 21}
          >
            <ChevronRight className="w-4 h-4" />
          </LiquidGlassButton>
        </div>

        <div className="flex items-center gap-3">
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="extra-large">X-Large</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline">
            {versions.find(v => v.id === selectedVersion)?.code}
          </Badge>
        </div>
      </div>

      {/* Bible Text */}
      <div className="space-y-6 mb-8">
        {verses.map((verse) => (
          <div key={verse.id} className="group flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-medium text-muted-foreground bg-muted/30 rounded-full">
                {verse.number}
              </span>
            </div>
            
            <div className="flex-1">
              <p className={`${getFontSizeClass()} leading-relaxed text-foreground font-serif mb-3 selection:bg-primary/20`}>
                {verse.text}
              </p>
              
              {/* Verse Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <LiquidGlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBookmark(verse.id)}
                  className="h-7 w-7 p-0"
                >
                  <Bookmark className="w-3 h-3" />
                </LiquidGlassButton>
                
                <LiquidGlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleHighlight(verse.id, 'yellow')}
                  className="h-7 w-7 p-0"
                >
                  <Highlighter className="w-3 h-3" />
                </LiquidGlassButton>
                
                <LiquidGlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddNote(verse.id)}
                  className="h-7 w-7 p-0"
                >
                  <MessageSquare className="w-3 h-3" />
                </LiquidGlassButton>
                
                <LiquidGlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePlayAudio(verse.id)}
                  className="h-7 w-7 p-0"
                >
                  <Volume2 className="w-3 h-3" />
                </LiquidGlassButton>
                
                <LiquidGlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare(verse.id)}
                  className="h-7 w-7 p-0"
                >
                  <Share2 className="w-3 h-3" />
                </LiquidGlassButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-4 bg-card rounded-lg">
        <LiquidGlassButton
          variant="outline"
          disabled={selectedChapter === 1}
          onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </LiquidGlassButton>
        
        <div className="flex items-center gap-3">
          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  {version.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {books.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <LiquidGlassButton
          variant="outline"
          disabled={selectedChapter === 21}
          onClick={() => setSelectedChapter(prev => Math.min(21, prev + 1))}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </LiquidGlassButton>
      </div>
    </div>
  );
}