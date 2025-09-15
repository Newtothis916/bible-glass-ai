import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Verse, Highlight, Bookmark, Note } from '@/lib/bible-api';
import { useAuth } from '@/hooks/use-auth';
import { bibleAPI } from '@/lib/bible-api';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { 
  Highlighter, 
  Bookmark as BookmarkIcon, 
  StickyNote, 
  MoreHorizontal,
  Palette,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface BibleVerseProps {
  verse: Verse;
  highlight?: Highlight;
  bookmark?: Bookmark;
  note?: Note;
  isSelected?: boolean;
  onSelect?: () => void;
  onAnnotationChange?: () => void;
}

const highlightColors = [
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-200 dark:bg-yellow-900/30' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-200 dark:bg-blue-900/30' },
  { name: 'Green', value: 'green', class: 'bg-green-200 dark:bg-green-900/30' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-200 dark:bg-pink-900/30' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-200 dark:bg-orange-900/30' },
];

export function BibleVerse({ 
  verse, 
  highlight, 
  bookmark, 
  note,
  isSelected, 
  onSelect,
  onAnnotationChange 
}: BibleVerseProps) {
  const { user } = useAuth();
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [isLoading, setIsLoading] = useState(false);

  const highlightColorClass = highlight ? 
    highlightColors.find(c => c.value === highlight.color)?.class || highlightColors[0].class :
    '';

  const handleHighlight = async (color: string) => {
    if (!user) {
      toast.error('Please sign in to highlight verses');
      return;
    }

    setIsLoading(true);
    try {
      if (highlight) {
        await bibleAPI.removeHighlight(verse.id);
      }
      
      if (!highlight || highlight.color !== color) {
        await bibleAPI.addHighlight(verse.id, color);
      }
      
      onAnnotationChange?.();
      toast.success(highlight ? 'Highlight updated' : 'Verse highlighted');
    } catch (error) {
      toast.error('Failed to update highlight');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark verses');
      return;
    }

    setIsLoading(true);
    try {
      if (bookmark) {
        await bibleAPI.removeBookmark(verse.id);
        toast.success('Bookmark removed');
      } else {
        await bibleAPI.addBookmark(verse.id);
        toast.success('Verse bookmarked');
      }
      
      onAnnotationChange?.();
    } catch (error) {
      toast.error('Failed to update bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!user) {
      toast.error('Please sign in to add notes');
      return;
    }

    setIsLoading(true);
    try {
      if (note) {
        if (noteContent.trim()) {
          await bibleAPI.updateNote(note.id, noteContent.trim());
          toast.success('Note updated');
        } else {
          await bibleAPI.deleteNote(note.id);
          toast.success('Note deleted');
        }
      } else if (noteContent.trim()) {
        await bibleAPI.addNote(verse.id, noteContent.trim());
        toast.success('Note added');
      }
      
      onAnnotationChange?.();
      setShowNoteDialog(false);
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className={cn(
          'group flex items-start gap-3 p-2 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.045] shadow-xl backdrop-blur-md',
          highlightColorClass,
          isSelected && 'ring-2 ring-primary',
          'cursor-pointer'
        )}
        onClick={onSelect}
      >
        <span className="text-sm font-medium text-muted-foreground min-w-[2rem] pt-1">
          {verse.number}
        </span>
        
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{verse.text}</p>
          
          {note && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-xl transition-all duration-300 hover:scale-[1.045] hover:shadow-xl hover:shadow-white/5">
              <p className="text-xs text-muted-foreground mb-1">Your note:</p>
              <p className="text-sm">{note.content}</p>
            </div>
          )}
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <Highlighter className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {highlightColors.map((color) => (
                  <DropdownMenuItem 
                    key={color.value}
                    onClick={() => handleHighlight(color.value)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn("w-3 h-3 rounded", color.class)} />
                    {color.name}
                  </DropdownMenuItem>
                ))}
                {highlight && (
                  <DropdownMenuItem onClick={() => handleHighlight('')}>
                    Remove highlight
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBookmark}
              disabled={isLoading}
              className={cn(bookmark && "text-primary")}
            >
              <BookmarkIcon className={cn("h-3 w-3", bookmark && "fill-current")} />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setNoteContent(note?.content || '');
                setShowNoteDialog(true);
              }}
              disabled={isLoading}
              className={cn(note && "text-primary")}
            >
              <StickyNote className="h-3 w-3" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <MessageSquare className="h-3 w-3 mr-2" />
                  Ask AI
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Share verse
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {note ? 'Edit Note' : 'Add Note'} - Verse {verse.number}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-muted/30 rounded p-3">
              <p className="text-sm">{verse.text}</p>
            </div>
            
            <Textarea
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowNoteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LiquidGlassButton 
                onClick={handleSaveNote}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Note'}
              </LiquidGlassButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}