import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { plansAPI, Plan, PlanEnrollment } from '@/lib/plans-api';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/auth/auth-modal';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Search, 
  Star,
  Play,
  Check,
  Filter,
  Calendar,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function PlansPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<PlanEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremium, setShowPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadPlans();
    if (user) {
      loadUserEnrollments();
    }
  }, [user, showPremium]);

  const loadPlans = async () => {
    try {
      const plansData = await plansAPI.getPlans(showPremium);
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Failed to load reading plans');
    } finally {
      setLoading(false);
    }
  };

  const loadUserEnrollments = async () => {
    if (!user) return;
    
    try {
      const enrollments = await plansAPI.getUserEnrollments(user.id);
      setUserEnrollments(enrollments);
    } catch (error) {
      console.error('Error loading user enrollments:', error);
    }
  };

  const handleEnrollInPlan = async (planId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      await plansAPI.enrollInPlan(planId);
      toast.success('Successfully enrolled in plan!');
      loadUserEnrollments();
    } catch (error) {
      console.error('Error enrolling in plan:', error);
      toast.error('Failed to enroll in plan');
    }
  };

  const isEnrolledInPlan = (planId: string) => {
    return userEnrollments.some(enrollment => enrollment.plan_id === planId);
  };

  const getEnrollmentProgress = (planId: string) => {
    const enrollment = userEnrollments.find(e => e.plan_id === planId);
    if (!enrollment) return null;
    
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;

    return {
      progress: enrollment.progress_day,
      total: plan.duration_days,
      completed: enrollment.completed
    };
  };

  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const myActivePlans = userEnrollments.filter(e => !e.completed);
  const myCompletedPlans = userEnrollments.filter(e => e.completed);

  return (
    <MainLayout currentTab="read">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Reading Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Grow in your faith with structured Bible reading plans designed for every season of life
          </p>
        </div>

        {/* My Plans Section */}
        {user && (myActivePlans.length > 0 || myCompletedPlans.length > 0) && (
          <LiquidGlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Plans
            </h2>
            
            {/* Active Plans */}
            {myActivePlans.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-muted-foreground">Continue Reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myActivePlans.map((enrollment) => {
                    const plan = enrollment.plan;
                    const progress = getEnrollmentProgress(enrollment.plan_id);
                    
                    return (
                      <LiquidGlassCard key={enrollment.id} className="p-4 hover:scale-[1.02] transition-transform">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium line-clamp-2">{plan?.title}</h4>
                            {plan?.is_premium && (
                              <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Day {progress.progress}</span>
                                <span>{progress.total} days</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${(progress.progress / progress.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <LiquidGlassButton 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/plans/${enrollment.plan_id}/day/${enrollment.progress_day || 1}`)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </LiquidGlassButton>
                        </div>
                      </LiquidGlassCard>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Plans */}
            {myCompletedPlans.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-muted-foreground">Completed</h3>
                <div className="space-y-2">
                  {myCompletedPlans.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{enrollment.plan?.title}</span>
                      <Badge variant="secondary" className="ml-auto">Completed</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </LiquidGlassCard>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showPremium ? "default" : "outline"}
              onClick={() => setShowPremium(!showPremium)}
              size="sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LiquidGlassCard key={i} className="p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const enrolled = isEnrolledInPlan(plan.id);
              const progress = getEnrollmentProgress(plan.id);
              
              return (
                <LiquidGlassCard key={plan.id} className="p-6 hover:scale-[1.02] transition-transform">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold line-clamp-2">{plan.title}</h3>
                        {plan.is_premium && (
                          <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      {plan.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {plan.duration_days} days
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {Math.floor(Math.random() * 1000) + 100} enrolled
                      </div>
                    </div>

                    {plan.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {plan.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {plan.author && (
                      <p className="text-xs text-muted-foreground">
                        By {plan.author}
                      </p>
                    )}

                    {enrolled ? (
                      progress?.completed ? (
                        <Button variant="outline" className="w-full" disabled>
                          <Check className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : (
                        <LiquidGlassButton 
                          className="w-full"
                          onClick={() => navigate(`/plans/${plan.id}/day/${progress?.progress || 1}`)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue - Day {progress?.progress}
                        </LiquidGlassButton>
                      )
                    ) : (
                      <LiquidGlassButton 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleEnrollInPlan(plan.id)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Plan
                      </LiquidGlassButton>
                    )}
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}

        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No plans found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse all available plans
            </p>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </MainLayout>
  );
}