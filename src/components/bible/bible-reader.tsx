import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { BibleVerse } from "./bible-verse";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { bibleAPI, BibleVersion, Book, Chapter, Highlight, Bookmark, Note } from "@/lib/bible-api";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft, ChevronRight, Settings, Share, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function BibleReader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { version = 'web', book = 'joh', chapter = '3' } = useParams();
  
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadVersions();
  }, []);

  // Load chapter when params change
  useEffect(() => {
    if (version && book && chapter) {
      loadChapter();
    }
  }, [version, book, chapter]);

  // Load user annotations when chapter or user changes
  useEffect(() => {
    if (currentChapter && user) {
      loadUserAnnotations();
    }
  }, [currentChapter, user]);

  const loadVersions = async () => {
    try {
      const versionsData = await bibleAPI.getVersions();
      setVersions(versionsData);
      
      // Load books for current version
      if (versionsData.length > 0) {
        const currentVersion = versionsData.find(v => v.code === version) || versionsData[0];
        const booksData = await bibleAPI.getBooks(currentVersion.id);
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error loading versions:', error);
      setError('Failed to load Bible versions');
    }
  };

  const loadChapter = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const chapterData = await bibleAPI.getChapterByReference(version!, book!, parseInt(chapter!));
      
      if (!chapterData) {
        setError('Chapter not found');
        return;
      }
      
      setCurrentChapter(chapterData);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setError('Failed to load chapter');
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnnotations = async () => {
    if (!currentChapter?.verses || !user) return;

    const verseIds = currentChapter.verses.map(v => v.id);
    
    try {
      const [highlightsData, bookmarksData, notesData] = await Promise.all([
        bibleAPI.getUserHighlights(user.id, verseIds),
        bibleAPI.getUserBookmarks(user.id, verseIds),
        bibleAPI.getUserNotes(user.id, verseIds)
      ]);
      
      setHighlights(highlightsData);
      setBookmarks(bookmarksData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  };

  const handleVersionChange = (newVersion: string) => {
    navigate(`/read/${newVersion}/${book}/${chapter}`);
  };

  const handleBookChange = (newBook: string) => {
    navigate(`/read/${version}/${newBook}/1`);
  };

  const handleChapterChange = (newChapter: number) => {
    navigate(`/read/${version}/${book}/${newChapter}`);
  };

  const getCurrentBook = () => books.find(b => b.code === book);
  const getCurrentVersion = () => versions.find(v => v.code === version);

  const canNavigatePrev = () => {
    const currentBook = getCurrentBook();
    return currentBook && (parseInt(chapter!) > 1);
  };

  const canNavigateNext = () => {
    const currentBook = getCurrentBook();
    return currentBook && (parseInt(chapter!) < currentBook.chapter_count);
  };

  const navigatePrevChapter = () => {
    if (canNavigatePrev()) {
      handleChapterChange(parseInt(chapter!) - 1);
    }
  };

  const navigateNextChapter = () => {
    if (canNavigateNext()) {
      handleChapterChange(parseInt(chapter!) + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/read')}>Go to Reader</Button>
        </div>
      </div>
    );
  }

  const currentBook = getCurrentBook();
  const currentVersion = getCurrentVersion();

  return (
    <div className="space-y-6">
      {/* Header */}
      <LiquidGlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {currentBook?.name} {chapter}
          </h1>
          <div className="flex items-center gap-2">
            <LiquidGlassButton variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </LiquidGlassButton>
            <LiquidGlassButton variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </LiquidGlassButton>
          </div>
        </div>
        
        {/* Version and Book selectors */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Select value={version} onValueChange={handleVersionChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.code}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={book} onValueChange={handleBookChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {books.map((b) => (
                <SelectItem key={b.id} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={chapter} onValueChange={(value) => handleChapterChange(parseInt(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentBook && Array.from({ length: currentBook.chapter_count }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{currentVersion?.name}</span>
          <span>•</span>
          <span>{currentBook?.testament?.toUpperCase()}</span>
          {currentVersion?.copyright_notice && (
            <>
              <span>•</span>
              <span>{currentVersion.copyright_notice}</span>
            </>
          )}
        </div>
      </LiquidGlassCard>

      {/* Verses */}
      {currentChapter && (
        <LiquidGlassCard className="p-6">
          <div className="space-y-4">
            {currentChapter.verses.map((verse) => {
              const highlight = highlights.find(h => h.verse_id === verse.id);
              const bookmark = bookmarks.find(b => b.verse_id === verse.id);
              const note = notes.find(n => n.verse_id === verse.id);
              
              return (
                <BibleVerse
                  key={verse.id}
                  verse={verse}
                  highlight={highlight}
                  bookmark={bookmark}
                  note={note}
                  isSelected={selectedVerse === verse.number}
                  onSelect={() => setSelectedVerse(verse.number)}
                  onAnnotationChange={loadUserAnnotations}
                />
              );
            })}
          </div>
        </LiquidGlassCard>
      )}

      {/* Navigation */}
      <LiquidGlassCard className="p-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={navigatePrevChapter}
            disabled={!canNavigatePrev()}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Chapter {parseInt(chapter!) - 1}
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Chapter {chapter} of {currentBook?.chapter_count}
          </span>
          
          <Button 
            variant="outline" 
            onClick={navigateNextChapter}
            disabled={!canNavigateNext()}
          >
            Chapter {parseInt(chapter!) + 1}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </LiquidGlassCard>

      {/* AI Study Guide Prompt */}
      <LiquidGlassCard className="p-6 border-primary/20">
        <div className="text-center space-y-3">
          <h3 className="font-inter font-normal tracking-tighter">Need help understanding this passage?</h3>
          <p className="text-sm text-muted-foreground">
            Ask our AI Bible Guide any questions about {currentBook?.name} {chapter}
          </p>
          <LiquidGlassButton 
            className="bg-primary/20 backdrop-blur-md border border-primary/30 hover:bg-primary/30 shadow-xl transition-all duration-300 hover:scale-[1.045] hover:shadow-xl hover:shadow-primary/20"
            onClick={() => navigate('/ai')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask AI Guide
          </LiquidGlassButton>
        </div>
      </LiquidGlassCard>
    </div>
  );
}