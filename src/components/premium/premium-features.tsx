import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Crown, Sparkles, Headphones, BookOpen, Download, Users, Infinity, Check } from "lucide-react";

export function PremiumFeatures() {
  const features = [
    {
      icon: <Infinity className="w-5 h-5" />,
      title: "Unlimited AI Questions",
      description: "Ask as many questions as you want to the AI Study Guide",
      free: "5 per day",
      premium: "Unlimited"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Premium Study Plans",
      description: "Access exclusive devotionals and in-depth study series",
      free: "Basic plans only",
      premium: "All premium content"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Offline Audio",
      description: "Download high-quality audio for offline listening",
      free: "Stream only",
      premium: "Download packs"
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Premium Voices",
      description: "High-quality neural voices for audio Bible",
      free: "Standard voice",
      premium: "Premium voices"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Advanced Commentary",
      description: "Access scholarly commentaries and interlinear text",
      free: "Basic notes",
      premium: "Full commentary"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Priority Support",
      description: "Get priority help from our support team",
      free: "Community support",
      premium: "Priority support"
    }
  ];

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <LiquidGlassCard variant="premium" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-20" />
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-divine">
            <Crown className="w-8 h-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-2xl text-primary-foreground mb-2">
            Unlock Premium Features
          </CardTitle>
          <p className="text-primary-foreground/90">
            Enhance your Bible study experience with unlimited access
          </p>
        </CardHeader>
      </LiquidGlassCard>

      {/* Pricing Cards */}
      <div className="grid gap-4">
        {/* Free Plan */}
        <LiquidGlassCard variant="outline">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Free</span>
              <span className="text-2xl font-bold">$0</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Perfect for getting started</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span>Core Bible reading</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span>5 AI questions per day</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span>Basic study plans</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span>Prayer journal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-success" />
                <span>Community features</span>
              </div>
            </div>
            <LiquidGlassButton variant="outline" className="w-full" disabled>
              Current Plan
            </LiquidGlassButton>
          </CardContent>
        </LiquidGlassCard>

        {/* Premium Plan */}
        <LiquidGlassCard variant="premium" className="relative border-2 border-secondary">
          <div className="absolute top-4 right-4 bg-secondary/20 backdrop-blur-md border border-secondary/30 text-secondary px-3 py-1 rounded-2xl text-xs font-inter font-normal tracking-tighter shadow-xl transition-all duration-300 hover:scale-105">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary-foreground">
              <span>Premium</span>
              <div className="text-right">
                <div className="text-2xl font-bold">$8.99</div>
                <div className="text-sm opacity-80">per month</div>
              </div>
            </CardTitle>
            <p className="text-sm text-primary-foreground/80">Everything you need for deep study</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Everything in Free</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span><strong>Unlimited</strong> AI questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Premium study plans</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Offline audio downloads</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Premium voices</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Advanced commentary</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground">
                <Check className="w-4 h-4 text-secondary" />
                <span>Ad-free experience</span>
              </div>
            </div>
            <LiquidGlassButton variant="glass" className="w-full">
              <Crown className="w-4 h-4" />
              Start Premium Trial
            </LiquidGlassButton>
            <p className="text-xs text-center text-primary-foreground/60">
              7-day free trial • Cancel anytime
            </p>
          </CardContent>
        </LiquidGlassCard>

        {/* Annual Plan */}
        <LiquidGlassCard variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Premium Annual</span>
              <div className="text-right">
                <div className="text-2xl font-bold">$89</div>
                <div className="text-sm text-muted-foreground">per year</div>
                <div className="text-xs text-success font-medium">Save 17%</div>
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Best value for committed users</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All Premium features with significant annual savings
            </p>
            <LiquidGlassButton variant="outline" className="w-full">
              Choose Annual
            </LiquidGlassButton>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Feature Comparison */}
      <LiquidGlassCard variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Feature Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-primary-foreground mt-1">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Free: </span>
                    <span className="font-medium">{feature.free}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Premium: </span>
                    <span className="font-medium text-primary">{feature.premium}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </LiquidGlassCard>

      {/* Testimonials */}
      <LiquidGlassCard variant="outline">
        <CardHeader>
          <CardTitle>What Premium Users Say</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <blockquote className="text-sm italic">
              "The unlimited AI questions transformed my Bible study. I can ask as many follow-up questions as I need to really understand Scripture."
            </blockquote>
            <p className="text-xs text-muted-foreground">— Sarah M., Premium User</p>
          </div>
          
          <div className="space-y-3">
            <blockquote className="text-sm italic">
              "The premium study plans and offline audio are game-changers. I can study anywhere, even without internet."
            </blockquote>
            <p className="text-xs text-muted-foreground">— David K., Premium User</p>
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Support Info */}
      <LiquidGlassCard variant="outline">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Questions about Premium?
          </p>
          <LiquidGlassButton variant="link" size="sm">
            Contact Support
          </LiquidGlassButton>
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}