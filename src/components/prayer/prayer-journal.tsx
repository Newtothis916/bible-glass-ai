import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Heart, Plus, Check, Clock, Lock, Users, Edit, Trash2 } from "lucide-react";
import { prayerAPI, Prayer } from "@/lib/prayer-api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function PrayerJournal() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerBody, setNewPrayerBody] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPrayers();
    }
  }, [user]);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      const userPrayers = await prayerAPI.getUserPrayers();
      setPrayers(userPrayers);
    } catch (error) {
      toast({
        title: "Error loading prayers",
        description: "Failed to load your prayers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPrayers = prayers.filter(prayer => {
    if (filter === 'active') return prayer.status === 'active';
    if (filter === 'answered') return prayer.status === 'answered';
    return true;
  });

  const toggleAnswered = async (prayerId: string) => {
    const prayer = prayers.find(p => p.id === prayerId);
    if (!prayer) return;

    try {
      const newStatus = prayer.status === 'answered' ? 'active' : 'answered';
      await prayerAPI.updatePrayerStatus(prayerId, newStatus);
      await loadPrayers();
      
      toast({
        title: newStatus === 'answered' ? "Prayer marked as answered!" : "Prayer marked as active",
        description: "Your prayer status has been updated."
      });
    } catch (error) {
      toast({
        title: "Error updating prayer",
        description: "Failed to update prayer status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addPrayer = async () => {
    if (!newPrayerTitle.trim()) return;

    try {
      await prayerAPI.addPrayer(newPrayerTitle, newPrayerBody);
      await loadPrayers();
      setNewPrayerTitle('');
      setNewPrayerBody('');
      setShowAddForm(false);
      
      toast({
        title: "Prayer added",
        description: "Your prayer has been saved to your journal."
      });
    } catch (error) {
      toast({
        title: "Error adding prayer",
        description: "Failed to add your prayer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deletePrayer = async (prayerId: string) => {
    try {
      await prayerAPI.deletePrayer(prayerId);
      await loadPrayers();
      
      toast({
        title: "Prayer deleted",
        description: "Your prayer has been removed from your journal."
      });
    } catch (error) {
      toast({
        title: "Error deleting prayer",
        description: "Failed to delete the prayer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private': return <Lock className="w-3 h-3" />;
      case 'circle': return <Users className="w-3 h-3" />;
      case 'public': return <Heart className="w-3 h-3" />;
      default: return <Lock className="w-3 h-3" />;
    }
  };

  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'private': return 'text-muted-foreground';
      case 'circle': return 'text-primary';
      case 'public': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <LiquidGlassCard variant="outline">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Sign in to access your Prayer Journal</h3>
            <p className="text-sm text-muted-foreground">
              Your prayers are private and secure when you create an account.
            </p>
          </CardContent>
        </LiquidGlassCard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your prayers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <LiquidGlassCard variant="divine" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Heart className="w-6 h-6" />
            Prayer Journal
          </CardTitle>
          <p className="text-sm text-primary-foreground/80">
            Keep track of your prayers and see how God answers
          </p>
        </CardHeader>
      </LiquidGlassCard>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All', count: prayers.length },
          { key: 'active', label: 'Active', count: prayers.filter(p => p.status === 'active').length },
          { key: 'answered', label: 'Answered', count: prayers.filter(p => p.status === 'answered').length }
        ].map(({ key, label, count }) => (
          <LiquidGlassButton
            key={key}
            variant={filter === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className="flex-1"
          >
            {label} ({count})
          </LiquidGlassButton>
        ))}
      </div>

      {/* Add Prayer Button */}
      <LiquidGlassButton
        variant="outline"
        className="w-full"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <Plus className="w-4 h-4" />
        Add New Prayer
      </LiquidGlassButton>

      {/* Add Prayer Form */}
      {showAddForm && (
        <LiquidGlassCard variant="elevated">
          <CardHeader>
            <CardTitle className="text-base">New Prayer Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Prayer title..."
              value={newPrayerTitle}
              onChange={(e) => setNewPrayerTitle(e.target.value)}
              className="w-full p-3 bg-glass-bg border border-border-glass rounded-xl text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <textarea
              placeholder="What would you like to pray about?"
              rows={4}
              value={newPrayerBody}
              onChange={(e) => setNewPrayerBody(e.target.value)}
              className="w-full p-3 bg-glass-bg border border-border-glass rounded-xl text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
            <div className="flex gap-2">
              <LiquidGlassButton variant="default" size="sm" onClick={addPrayer}>
                Save Prayer
              </LiquidGlassButton>
              <LiquidGlassButton 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </LiquidGlassButton>
            </div>
          </CardContent>
        </LiquidGlassCard>
      )}

      {/* Prayer List */}
      <div className="space-y-4">
        {filteredPrayers.map((prayer) => (
          <LiquidGlassCard 
            key={prayer.id} 
            variant={prayer.status === 'answered' ? "elevated" : "default"}
            className={prayer.status === 'answered' ? "border-l-4 border-l-success" : ""}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-medium ${prayer.status === 'answered' ? 'line-through text-muted-foreground' : ''}`}>
                        {prayer.title}
                      </h3>
                      <div className={`flex items-center gap-1 ${getPrivacyColor(prayer.privacy)}`}>
                        {getPrivacyIcon(prayer.privacy)}
                      </div>
                    </div>
                    <p className={`text-sm text-muted-foreground mb-3 ${prayer.status === 'answered' ? 'line-through' : ''}`}>
                      {prayer.body || prayer.title}
                    </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prayer.tags && prayer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Timestamps */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(prayer.created_at).toLocaleDateString()}
                    </div>
                    {prayer.answered_at && (
                      <div className="flex items-center gap-1 text-success">
                        <Check className="w-3 h-3" />
                        Answered {new Date(prayer.answered_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border-glass">
                <LiquidGlassButton
                  variant={prayer.status === 'answered' ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleAnswered(prayer.id)}
                >
                  <Check className="w-4 h-4" />
                  {prayer.status === 'answered' ? 'Mark Active' : 'Mark Answered'}
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </LiquidGlassButton>
                <LiquidGlassButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deletePrayer(prayer.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </LiquidGlassButton>
              </div>
            </CardContent>
          </LiquidGlassCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrayers.length === 0 && (
        <LiquidGlassCard variant="outline">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No prayers found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter === 'all' 
                ? "Start your prayer journey by adding your first prayer request."
                : `No ${filter} prayers at the moment.`
              }
            </p>
            <LiquidGlassButton variant="outline" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4" />
              Add Prayer
            </LiquidGlassButton>
          </CardContent>
        </LiquidGlassCard>
      )}
    </div>
  );
}