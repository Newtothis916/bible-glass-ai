import { useState } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { BookOpen, ChevronLeft, ChevronRight, Highlighter, MessageSquare, Share, Sparkles } from "lucide-react";

// Sample verse data
const sampleVerses = [
  { number: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
  { number: 2, text: "He was in the beginning with God." },
  { number: 3, text: "All things were made through him. Without him, nothing was made that has been made." },
  { number: 4, text: "In him was life, and the life was the light of men." },
  { number: 5, text: "The light shines in darkness, and the darkness hasn't overcome it." },
  { number: 6, text: "There came a man sent from God, whose name was John." },
  { number: 7, text: "The same came as a witness, that he might testify about the light, that all might believe through him." },
  { number: 8, text: "He was not the light, but was sent that he might testify about the light." },
];

export function BibleReader() {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [highlightedVerses, setHighlightedVerses] = useState<Set<number>>(new Set());

  const toggleHighlight = (verseNumber: number) => {
    const newHighlighted = new Set(highlightedVerses);
    if (newHighlighted.has(verseNumber)) {
      newHighlighted.delete(verseNumber);
    } else {
      newHighlighted.add(verseNumber);
    }
    setHighlightedVerses(newHighlighted);
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <LiquidGlassCard variant="glass">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LiquidGlassButton variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </LiquidGlassButton>
              <div>
                <CardTitle className="text-lg">John 1</CardTitle>
                <p className="text-sm text-muted-foreground">World English Bible</p>
              </div>
            </div>
            <LiquidGlassButton variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </LiquidGlassButton>
          </div>
        </CardHeader>
      </LiquidGlassCard>

      {/* Bible Text */}
      <LiquidGlassCard variant="elevated">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-4">
            {sampleVerses.map((verse) => (
              <div
                key={verse.number}
                className={`group relative p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  highlightedVerses.has(verse.number)
                    ? "bg-secondary/20 border border-secondary/30"
                    : selectedVerse === verse.number
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedVerse(selectedVerse === verse.number ? null : verse.number)}
              >
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-soft">
                    {verse.number}
                  </span>
                  <p className="text-base leading-relaxed flex-1 text-foreground">
                    {verse.text}
                  </p>
                </div>

                {/* Verse Actions */}
                {selectedVerse === verse.number && (
                  <div className="mt-4 flex gap-2 animate-in slide-in-from-top-2 duration-300">
                    <LiquidGlassButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHighlight(verse.number);
                      }}
                      className={highlightedVerses.has(verse.number) ? "bg-secondary/20 border-secondary" : ""}
                    >
                      <Highlighter className="w-4 h-4" />
                      {highlightedVerses.has(verse.number) ? "Highlighted" : "Highlight"}
                    </LiquidGlassButton>
                    <LiquidGlassButton variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                      Note
                    </LiquidGlassButton>
                    <LiquidGlassButton variant="outline" size="sm">
                      <Sparkles className="w-4 h-4" />
                      Ask AI
                    </LiquidGlassButton>
                    <LiquidGlassButton variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </LiquidGlassButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Chapter Navigation */}
      <div className="flex justify-between items-center gap-4">
        <LiquidGlassButton variant="outline" className="flex-1">
          <ChevronLeft className="w-4 h-4" />
          Previous Chapter
        </LiquidGlassButton>
        <LiquidGlassButton variant="outline" className="flex-1">
          Next Chapter
          <ChevronRight className="w-4 h-4" />
        </LiquidGlassButton>
      </div>

      {/* Quick AI Ask */}
      <LiquidGlassCard variant="divine" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-10" />
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center shadow-divine">
              <Sparkles className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-primary-foreground">Need help understanding?</h3>
              <p className="text-sm text-primary-foreground/80">Ask the AI Study Guide about this chapter</p>
            </div>
            <LiquidGlassButton variant="glass" size="sm">
              Ask AI
            </LiquidGlassButton>
          </div>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}