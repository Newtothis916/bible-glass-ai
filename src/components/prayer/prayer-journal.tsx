import { useState } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Heart, Plus, Check, Clock, Lock, Users, Edit, Trash2 } from "lucide-react";

interface Prayer {
  id: string;
  title: string;
  content: string;
  tags: string[];
  answered: boolean;
  privacy: 'private' | 'circle' | 'public';
  createdAt: Date;
  answeredAt?: Date;
}

const samplePrayers: Prayer[] = [
  {
    id: '1',
    title: 'Family Health',
    content: 'Please keep my family healthy and safe during this challenging time.',
    tags: ['family', 'health'],
    answered: false,
    privacy: 'private',
    createdAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '2',
    title: 'Job Interview',
    content: 'Asking for wisdom and peace before my important interview tomorrow.',
    tags: ['work', 'wisdom'],
    answered: true,
    privacy: 'circle',
    createdAt: new Date(Date.now() - 86400000 * 7),
    answeredAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: '3',
    title: 'Friend\'s Salvation',
    content: 'Praying for my friend Sarah to come to know Christ.',
    tags: ['salvation', 'friendship'],
    answered: false,
    privacy: 'private',
    createdAt: new Date(Date.now() - 86400000 * 14)
  }
];

export function PrayerJournal() {
  const [prayers, setPrayers] = useState<Prayer[]>(samplePrayers);
  const [filter, setFilter] = useState<'all' | 'active' | 'answered'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredPrayers = prayers.filter(prayer => {
    if (filter === 'active') return !prayer.answered;
    if (filter === 'answered') return prayer.answered;
    return true;
  });

  const toggleAnswered = (prayerId: string) => {
    setPrayers(prev => prev.map(prayer => {
      if (prayer.id === prayerId) {
        return {
          ...prayer,
          answered: !prayer.answered,
          answeredAt: !prayer.answered ? new Date() : undefined
        };
      }
      return prayer;
    }));
  };

  const getPrivacyIcon = (privacy: Prayer['privacy']) => {
    switch (privacy) {
      case 'private': return <Lock className="w-3 h-3" />;
      case 'circle': return <Users className="w-3 h-3" />;
      case 'public': return <Heart className="w-3 h-3" />;
    }
  };

  const getPrivacyColor = (privacy: Prayer['privacy']) => {
    switch (privacy) {
      case 'private': return 'text-muted-foreground';
      case 'circle': return 'text-primary';
      case 'public': return 'text-destructive';
    }
  };

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
          { key: 'active', label: 'Active', count: prayers.filter(p => !p.answered).length },
          { key: 'answered', label: 'Answered', count: prayers.filter(p => p.answered).length }
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
              className="w-full p-3 bg-glass-bg border border-border-glass rounded-xl text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <textarea
              placeholder="What would you like to pray about?"
              rows={4}
              className="w-full p-3 bg-glass-bg border border-border-glass rounded-xl text-sm placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            />
            <div className="flex gap-2">
              <LiquidGlassButton variant="default" size="sm">
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
            variant={prayer.answered ? "elevated" : "default"}
            className={prayer.answered ? "border-l-4 border-l-success" : ""}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-medium ${prayer.answered ? 'line-through text-muted-foreground' : ''}`}>
                      {prayer.title}
                    </h3>
                    <div className={`flex items-center gap-1 ${getPrivacyColor(prayer.privacy)}`}>
                      {getPrivacyIcon(prayer.privacy)}
                    </div>
                  </div>
                  <p className={`text-sm text-muted-foreground mb-3 ${prayer.answered ? 'line-through' : ''}`}>
                    {prayer.content}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prayer.tags.map((tag, index) => (
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
                      {prayer.createdAt.toLocaleDateString()}
                    </div>
                    {prayer.answeredAt && (
                      <div className="flex items-center gap-1 text-success">
                        <Check className="w-3 h-3" />
                        Answered {prayer.answeredAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border-glass">
                <LiquidGlassButton
                  variant={prayer.answered ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleAnswered(prayer.id)}
                >
                  <Check className="w-4 h-4" />
                  {prayer.answered ? 'Mark Active' : 'Mark Answered'}
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </LiquidGlassButton>
                <LiquidGlassButton variant="ghost" size="sm">
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