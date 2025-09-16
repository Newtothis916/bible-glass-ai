import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { BookOpen, Sparkles, Heart, Users, Award, Calendar, Brain, Target, Play } from "lucide-react";
import { practicesAPI } from "@/lib/practices-api";
import { memoryAPI } from "@/lib/memory-api";
import { prayerAPI } from "@/lib/prayer-api";

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    practiceStreak: 0,
    memoryCards: 0,
    activePrayers: 0,
    completedSessions: 0
  });
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8">
      {/* Professional Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Continue your spiritual journey with guided practices, prayer, and study
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <LiquidGlassCard>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {loading ? "..." : stats.practiceStreak}
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {loading ? "..." : stats.memoryCards}
            </div>
            <div className="text-sm text-muted-foreground">Memory Cards</div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {loading ? "..." : stats.activePrayers}
            </div>
            <div className="text-sm text-muted-foreground">Active Prayers</div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {loading ? "..." : stats.completedSessions}
            </div>
            <div className="text-sm text-muted-foreground">Sessions Done</div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Quick Actions</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/read')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Read Scripture</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Continue your Bible reading journey
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Start Reading
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/practices')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Daily Practice</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Guided spiritual exercises and meditation
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Begin Practice
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/pray')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Prayer Journal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Record and track your prayer requests
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Open Journal
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/memory')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Memory Verses</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn and review scripture by heart
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Study Cards
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/groups')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Study Groups</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with others in faith community
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Join Groups
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/listen')}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Play className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Audio Bible</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Listen to scripture narrations
                  </p>
                  <LiquidGlassButton size="sm" variant="outline">
                    Start Listening
                  </LiquidGlassButton>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
}