import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { BookOpen, Sparkles, Heart, Users, Award, Calendar, Brain, Target, Play, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { practicesAPI } from "@/lib/practices-api";
import { memoryAPI } from "@/lib/memory-api";
import { prayerAPI } from "@/lib/prayer-api";
import heroBible from "@/assets/hero-bible.jpg";
import verseLandscape1 from "@/assets/verse-landscape-1.jpg";
import verseLandscape2 from "@/assets/verse-landscape-2.jpg"; 
import verseLandscape3 from "@/assets/verse-landscape-3.jpg";

// Sample verse of the day data with rotating landscape images
const versesOfTheDay = [
  {
    id: 1,
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    image: verseLandscape1,
  },
  {
    id: 2,
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    image: verseLandscape2,
  },
  {
    id: 3,
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    image: verseLandscape3,
  }
];

// Get today's verse based on date
const getTodaysVerse = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return versesOfTheDay[dayOfYear % versesOfTheDay.length];
};

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    practiceStreak: 0,
    memoryCards: 0,
    activePrayers: 0,
    completedSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const todaysVerse = getTodaysVerse();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [practiceStats, memoryStats, prayers] = await Promise.all([
        practicesAPI.getRecentPracticeStats(),
        memoryAPI.getMemoryStats(),
        prayerAPI.getUserPrayers()
      ]);

      setStats({
        practiceStreak: practiceStats.weeklyStreak,
        memoryCards: memoryStats.totalCards,
        activePrayers: prayers.filter(p => p.status === 'active').length,
        completedSessions: practiceStats.completedSessions
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 space-y-6 max-w-6xl mx-auto">
      {/* Header with Hero Image */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div 
          className="h-48 sm:h-56 md:h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroBible})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Devotion
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90">
              AI Study • Prayer • Community
            </p>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <LiquidGlassCard variant="elevated" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-5" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-inter font-normal tracking-tighter text-foreground">7-Day Foundations - Day 1</h3>
            <p className="text-foreground/70 text-sm">
              "In the beginning was the Word..." - Discover the foundation of faith
            </p>
          </div>
          <LiquidGlassButton variant="glass" size="sm">
            Continue Reading
          </LiquidGlassButton>
        </CardContent>
      </LiquidGlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <LiquidGlassCard 
          variant="elevated" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/read')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Continue Reading</h3>
              <p className="text-xs text-muted-foreground">John 3:16</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant="elevated" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/ai')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto shadow-divine">
              <Sparkles className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Ask AI Guide</h3>
              <p className="text-xs text-muted-foreground">Get Bible insights</p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Spiritual Growth Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiquidGlassCard 
          variant="outline" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/practices')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <Play className="w-8 h-8 text-primary mx-auto" />
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">Guided Practices</h3>
              <p className="text-xs text-foreground/70">{stats.completedSessions} sessions</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant="outline" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/memory')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <Brain className="w-8 h-8 text-secondary mx-auto" />
            <div>
              <h3 className="font-medium text-sm">Memory Verses</h3>
              <p className="text-xs text-muted-foreground">{stats.memoryCards} cards</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard 
          variant="outline" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/rule-of-life')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <Target className="w-8 h-8 text-accent mx-auto" />
            <div>
              <h3 className="font-medium text-sm">Rule of Life</h3>
              <p className="text-xs text-muted-foreground">Daily practices</p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Prayer & Streak */}
      <div className="grid grid-cols-2 gap-4">
        <LiquidGlassCard 
          variant="outline" 
          className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => navigate('/pray')}
        >
          <CardContent className="p-4 text-center space-y-3">
            <Heart className="w-8 h-8 text-destructive mx-auto" />
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">Prayer Journal</h3>
              <p className="text-xs text-foreground/70">{stats.activePrayers} active prayers</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center space-y-3">
            <Award className="w-8 h-8 text-secondary mx-auto" />
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">{stats.practiceStreak} Week Streak</h3>
              <p className="text-xs text-foreground/70">Keep it up!</p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Community Highlights */}
      <LiquidGlassCard variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm font-inter font-normal tracking-tighter">John shared a reflection</p>
                <p className="text-xs text-foreground/70">"This verse changed my perspective on forgiveness..."</p>
                <p className="text-xs text-foreground/50 mt-1">Matthew 6:14 • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-xs font-medium text-secondary-foreground">
                SM
              </div>
              <div className="flex-1">
                <p className="text-sm font-inter font-normal tracking-tighter">Sarah completed 7-Day Foundations</p>
                <p className="text-xs text-foreground/70">"Amazing journey through the Gospel!"</p>
                <p className="text-xs text-foreground/50 mt-1">Just now</p>
              </div>
            </div>
          </div>

          <LiquidGlassButton variant="outline" size="sm" className="w-full">
            Join Discussion
          </LiquidGlassButton>
        </CardContent>
      </LiquidGlassCard>

      {/* Verse of the Day */}
      <LiquidGlassCard variant="elevated" className="relative overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center relative rounded-t-xl"
          style={{ backgroundImage: `url(${todaysVerse.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-t-xl" />
        </div>
        <CardContent className="relative -mt-16 z-10 space-y-4">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 border border-border/20">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Verse of the Day</h3>
            </div>
            <blockquote className="text-lg font-serif leading-relaxed mb-4 text-foreground">
              "{todaysVerse.text}"
            </blockquote>
            <p className="text-sm text-muted-foreground font-medium mb-4">{todaysVerse.reference}</p>
            
            <div className="flex gap-2">
              <LiquidGlassButton variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </LiquidGlassButton>
              <LiquidGlassButton variant="ghost" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </LiquidGlassButton>
            </div>
          </div>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}