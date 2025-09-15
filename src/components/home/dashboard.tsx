import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { BookOpen, Sparkles, Heart, Users, Award, Calendar } from "lucide-react";
import heroBible from "@/assets/hero-bible.jpg";

export function Dashboard() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header with Hero Image */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroBible})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold mb-2">
              Devotion
            </h1>
            <p className="text-lg opacity-90">
              AI Study • Prayer • Community
            </p>
          </div>
        </div>
      </div>

      {/* Today's Focus */}
      <LiquidGlassCard variant="divine" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Calendar className="w-5 h-5" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-inter font-normal tracking-tighter text-primary-foreground">7-Day Foundations - Day 1</h3>
            <p className="text-primary-foreground/90 text-sm">
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
        <LiquidGlassCard variant="elevated" className="cursor-pointer hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4 text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">Continue Reading</h3>
              <p className="text-xs text-foreground/70">John 3:16</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard variant="elevated" className="cursor-pointer hover:scale-105 transition-transform duration-300">
          <CardContent className="p-4 text-center space-y-3">
            <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto shadow-divine">
              <Sparkles className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">Ask AI Guide</h3>
              <p className="text-xs text-foreground/70">3 questions left</p>
            </div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Prayer & Streak */}
      <div className="grid grid-cols-2 gap-4">
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center space-y-3">
            <Heart className="w-8 h-8 text-destructive mx-auto" />
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">Prayer Journal</h3>
              <p className="text-xs text-foreground/70">2 active prayers</p>
            </div>
          </CardContent>
        </LiquidGlassCard>

        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center space-y-3">
            <Award className="w-8 h-8 text-secondary mx-auto" />
            <div>
              <h3 className="font-inter font-normal tracking-tighter text-sm">7 Day Streak</h3>
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-divine opacity-20 rounded-full -translate-y-16 translate-x-16" />
        <CardHeader>
          <CardTitle>Verse of the Day</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="text-lg font-inter font-normal tracking-tighter leading-relaxed">
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
          </blockquote>
          <p className="text-sm text-foreground/70 font-inter font-normal tracking-tighter">John 3:16 (WEB)</p>
          
          <div className="flex gap-2">
            <LiquidGlassButton variant="outline" size="sm">
              Share
            </LiquidGlassButton>
            <LiquidGlassButton variant="ghost" size="sm">
              Save
            </LiquidGlassButton>
          </div>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}