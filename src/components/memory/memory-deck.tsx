import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Brain, Clock, Trash2 } from "lucide-react";
import { memoryAPI, MemoryCardWithReview, MemoryDeck } from "@/lib/memory-api";
import { useToast } from "@/hooks/use-toast";

export function MemoryDeckComponent() {
  const [decks, setDecks] = useState<MemoryDeck[]>([]);
  const [dueCards, setDueCards] = useState<MemoryCardWithReview[]>([]);
  const [stats, setStats] = useState({ totalCards: 0, dueToday: 0, reviewStreak: 0, masteredCards: 0 });
  const [newVerseRef, setNewVerseRef] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    try {
      const [decksData, dueCardsData, statsData] = await Promise.all([
        memoryAPI.getUserDecks(),
        memoryAPI.getDueCards(5),
        memoryAPI.getMemoryStats()
      ]);
      
      setDecks(decksData);
      setDueCards(dueCardsData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load memory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVerse = async () => {
    if (!newVerseRef.trim()) return;
    
    try {
      await memoryAPI.addCard(newVerseRef.trim());
      setNewVerseRef("");
      loadMemoryData();
      toast({
        title: "Success",
        description: "Verse added to memory deck!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add verse",
        variant: "destructive"
      });
    }
  };

  const handleReview = async (cardId: string, grade: 'again' | 'hard' | 'good' | 'easy') => {
    try {
      await memoryAPI.reviewCard(cardId, grade);
      loadMemoryData();
      toast({
        title: "Review Complete",
        description: "Card reviewed successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to review card",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="h-48 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{stats.dueToday}</div>
            <div className="text-sm text-muted-foreground">Due Today</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.reviewStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.masteredCards}</div>
            <div className="text-sm text-muted-foreground">Mastered</div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Add New Verse */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Verse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter verse reference (e.g., John 3:16)"
              value={newVerseRef}
              onChange={(e) => setNewVerseRef(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddVerse()}
              className="mobile-input"
            />
            <LiquidGlassButton onClick={handleAddVerse} className="mobile-touch-target">
              Add
            </LiquidGlassButton>
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Due Cards for Review */}
      {dueCards.length > 0 && (
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Cards Due for Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dueCards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{card.verse_ref}</Badge>
                  <Badge variant="outline">
                    Interval: {card.review?.interval_days || 1} days
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <LiquidGlassButton
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReview(card.id, 'again')}
                  >
                    Again
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(card.id, 'hard')}
                  >
                    Hard
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="default"
                    size="sm"
                    onClick={() => handleReview(card.id, 'good')}
                  >
                    Good
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReview(card.id, 'easy')}
                  >
                    Easy
                  </LiquidGlassButton>
                </div>
              </div>
            ))}
          </CardContent>
        </LiquidGlassCard>
      )}

      {/* Memory Decks */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Memory Decks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {decks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No memory decks yet. Add your first verse to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {decks.map((deck) => (
                <div key={deck.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{deck.title}</h3>
                      {deck.description && (
                        <p className="text-sm text-muted-foreground">{deck.description}</p>
                      )}
                      {deck.is_default && (
                        <Badge variant="outline" className="mt-1">Default</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(deck.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}