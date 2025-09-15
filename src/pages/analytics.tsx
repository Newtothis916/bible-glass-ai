import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Calendar, BookOpen, Target, Award, Crown, Clock, Heart, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface ReadingStreak {
  current: number;
  longest: number;
  thisWeek: number;
}

interface ReadingStats {
  totalDays: number;
  totalChapters: number;
  totalVerses: number;
  averagePerDay: number;
  favoriteBook: string;
  readingTime: number; // in minutes
}

interface GoalProgress {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'behind' | 'completed';
}

const mockReadingStreak: ReadingStreak = {
  current: 12,
  longest: 23,
  thisWeek: 5,
};

const mockStats: ReadingStats = {
  totalDays: 47,
  totalChapters: 89,
  totalVerses: 1456,
  averagePerDay: 31,
  favoriteBook: 'Psalms',
  readingTime: 1240, // 20+ hours
};

const mockGoals: GoalProgress[] = [
  {
    id: '1',
    title: 'Read Bible Daily',
    target: 365,
    current: 47,
    unit: 'days',
    deadline: '2024-12-31',
    status: 'on-track',
  },
  {
    id: '2',
    title: 'Complete New Testament',
    target: 27,
    current: 12,
    unit: 'books',
    deadline: '2024-06-30',
    status: 'behind',
  },
  {
    id: '3',
    title: 'Memorize 50 Verses',
    target: 50,
    current: 23,
    unit: 'verses',
    deadline: '2024-12-31',
    status: 'on-track',
  },
];

const mockWeeklyData = [
  { day: 'Mon', chapters: 3, minutes: 25 },
  { day: 'Tue', chapters: 2, minutes: 18 },
  { day: 'Wed', chapters: 4, minutes: 32 },
  { day: 'Thu', chapters: 1, minutes: 12 },
  { day: 'Fri', chapters: 3, minutes: 28 },
  { day: 'Sat', chapters: 5, minutes: 45 },
  { day: 'Sun', chapters: 2, minutes: 20 },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isPremium = false; // TODO: Add subscription logic

  if (!isPremium) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Reading Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your Bible reading progress and insights
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <LiquidGlassCard variant="elevated" className="border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <Crown className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Premium Feature</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Unlock detailed reading analytics, progress tracking, goal setting, and personalized insights 
                  to enhance your Bible study journey.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Progress Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed reading streaks and statistics
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Goal Setting</h4>
                    <p className="text-sm text-muted-foreground">
                      Set and track personal reading goals
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium mb-1">Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Personalized reading insights and recommendations
                    </p>
                  </div>
                </div>

                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </LiquidGlassCard>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Reading Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your Bible reading progress and insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{mockReadingStreak.current}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">+2 this week</span>
                </div>
              </CardContent>
            </LiquidGlassCard>

            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{mockStats.totalChapters}</div>
                <div className="text-sm text-muted-foreground">Chapters Read</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {Math.round(mockStats.readingTime / 60)} hours total
                </div>
              </CardContent>
            </LiquidGlassCard>

            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{mockStats.averagePerDay}</div>
                <div className="text-sm text-muted-foreground">Verses/Day</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Above average!
                </div>
              </CardContent>
            </LiquidGlassCard>

            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
                <div className="text-xs text-muted-foreground mt-2">
                  2 on track
                </div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="streaks">Streaks</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Weekly Reading Chart */}
              <LiquidGlassCard variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    This Week's Reading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockWeeklyData.map((day, index) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{day.day}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm">{day.chapters} chapters</span>
                            <Clock className="w-4 h-4 text-muted-foreground ml-4" />
                            <span className="text-sm text-muted-foreground">{day.minutes} min</span>
                          </div>
                          <Progress value={(day.chapters / 5) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </LiquidGlassCard>

              {/* Reading Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Reading Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Reading Days</span>
                      <span className="font-medium">{mockStats.totalDays}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Verses</span>
                      <span className="font-medium">{mockStats.totalVerses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Favorite Book</span>
                      <span className="font-medium">{mockStats.favoriteBook}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Reading Time</span>
                      <span className="font-medium">{Math.round(mockStats.readingTime / 60)}h {mockStats.readingTime % 60}m</span>
                    </div>
                  </CardContent>
                </LiquidGlassCard>

                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">10 Day Streak</h4>
                        <p className="text-xs text-muted-foreground">Read for 10 consecutive days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Book Explorer</h4>
                        <p className="text-xs text-muted-foreground">Read from 5 different books</p>
                      </div>
                    </div>
                  </CardContent>
                </LiquidGlassCard>
              </div>
            </TabsContent>

            <TabsContent value="streaks" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-center">Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {mockReadingStreak.current}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">days</div>
                    <Badge className="bg-green-500">Active</Badge>
                  </CardContent>
                </LiquidGlassCard>

                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-center">Longest Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {mockReadingStreak.longest}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">days</div>
                    <Badge variant="outline">Personal Best</Badge>
                  </CardContent>
                </LiquidGlassCard>

                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-center">This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {mockReadingStreak.thisWeek}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">days</div>
                    <Progress value={(mockReadingStreak.thisWeek / 7) * 100} className="h-2" />
                  </CardContent>
                </LiquidGlassCard>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="space-y-4">
                {mockGoals.map(goal => (
                  <LiquidGlassCard key={goal.id} variant="elevated">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          goal.status === 'completed' ? 'default' :
                          goal.status === 'on-track' ? 'secondary' : 'destructive'
                        }>
                          {goal.status === 'on-track' ? 'On Track' : 
                           goal.status === 'behind' ? 'Behind' : 'Completed'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{goal.current} of {goal.target} {goal.unit}</span>
                          <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </LiquidGlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Reading Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Best Reading Time</h4>
                      <p className="text-xs text-muted-foreground">
                        You read most consistently in the morning (7-9 AM)
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Favorite Genre</h4>
                      <p className="text-xs text-muted-foreground">
                        You spend 40% of your time reading Psalms and Proverbs
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Reading Speed</h4>
                      <p className="text-xs text-muted-foreground">
                        Average 2.3 minutes per chapter - that's great focus!
                      </p>
                    </div>
                  </CardContent>
                </LiquidGlassCard>

                <LiquidGlassCard variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-sm mb-1">Keep Your Streak!</h4>
                      <p className="text-xs text-muted-foreground">
                        You're only 11 days away from your longest streak of 23 days!
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Try Something New</h4>
                      <p className="text-xs text-muted-foreground">
                        Consider exploring the book of Romans based on your reading preferences
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Join a Reading Plan</h4>
                      <p className="text-xs text-muted-foreground">
                        Structure your reading with a 30-day New Testament plan
                      </p>
                    </div>
                  </CardContent>
                </LiquidGlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}