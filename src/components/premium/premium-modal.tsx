import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { LiquidGlassCard, CardContent, CardHeader } from "@/components/ui/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Users, Zap } from "lucide-react";
import { stripeAPI, SUBSCRIPTION_TIERS } from "@/lib/stripe-api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface PremiumModalProps {
  trigger: React.ReactNode;
  defaultTier?: string;
}

export function PremiumModal({ trigger, defaultTier = 'premium' }: PremiumModalProps) {
  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUpgrade = async (tierId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upgrade your account.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd have Stripe price IDs configured
      const stripePriceIds: Record<string, string> = {
        premium: 'price_premium_monthly',
        family: 'price_family_monthly'
      };

      const priceId = stripePriceIds[tierId];
      if (!priceId) {
        throw new Error('Price ID not configured');
      }

      const checkoutUrl = await stripeAPI.createCheckoutSession(priceId, tierId);
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Unable to start upgrade process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'premium': return <Crown className="w-5 h-5 text-amber-500" />;
      case 'family': return <Users className="w-5 h-5 text-blue-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'premium': return 'border-amber-500/50 bg-amber-500/20 backdrop-blur-md';
      case 'family': return 'border-blue-500/50 bg-blue-500/20 backdrop-blur-md';
      default: return 'border-white/30 bg-white/10 backdrop-blur-md';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <LiquidGlassCard 
              key={tier.id}
              variant={selectedTier === tier.id ? "elevated" : "default"}
              className={`relative ${getTierColor(tier.id)} transition-all cursor-pointer`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.id === 'premium' && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTierIcon(tier.id)}
                  <h3 className="font-inter font-normal tracking-tighter text-lg">{tier.name}</h3>
                </div>
                
                {tier.price > 0 ? (
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">${tier.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">Free</div>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}

                {tier.id !== 'free' && (
                  <LiquidGlassButton
                    variant={selectedTier === tier.id ? "default" : "outline"}
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade(tier.id);
                    }}
                    disabled={loading}
                  >
                    <Zap className="w-4 h-4" />
                    {loading ? 'Processing...' : 'Upgrade Now'}
                  </LiquidGlassButton>
                )}
              </CardContent>
            </LiquidGlassCard>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl transition-all duration-300 hover:scale-[1.045] hover:shadow-xl hover:shadow-white/5">
          <h4 className="font-inter font-normal tracking-tighter mb-2">Why upgrade?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Unlimited AI Bible study assistance</li>
            <li>• Access to multiple Bible translations</li>
            <li>• Advanced search and study tools</li>
            <li>• Audio Bible with premium narrators</li>
            <li>• Exclusive reading plans and devotionals</li>
            <li>• Export your notes and highlights</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}