import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Heart, DollarSign, Users, Lightbulb, Shield, Award } from "lucide-react";
import { useState } from "react";

export default function GivingPage() {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');

  const presetAmounts = [10, 25, 50, 100, 250];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 pb-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Support Our Ministry</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your generous support helps us provide free access to God's Word and spiritual resources 
            to people around the world. Every gift makes a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Donation Form */}
          <LiquidGlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Make a Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Amounts */}
              <div>
                <h3 className="font-semibold mb-3">Choose an Amount</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {presetAmounts.map((preset) => (
                    <LiquidGlassButton
                      key={preset}
                      variant={amount === preset.toString() ? "default" : "outline"}
                      onClick={() => setAmount(preset.toString())}
                      className="h-12"
                    >
                      ${preset}
                    </LiquidGlassButton>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background/50 backdrop-blur-sm rounded-xl border border-border/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h3 className="font-semibold mb-3">Frequency</h3>
                <div className="grid grid-cols-2 gap-2">
                  <LiquidGlassButton
                    variant={frequency === 'one-time' ? "default" : "outline"}
                    onClick={() => setFrequency('one-time')}
                  >
                    One Time
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    variant={frequency === 'monthly' ? "default" : "outline"}
                    onClick={() => setFrequency('monthly')}
                  >
                    Monthly
                  </LiquidGlassButton>
                </div>
              </div>

              <LiquidGlassButton className="w-full" size="lg">
                Donate {amount && `$${amount}`} {frequency === 'monthly' ? 'Monthly' : ''}
              </LiquidGlassButton>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Secure donation processing
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Impact Information */}
          <div className="space-y-6">
            <LiquidGlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">$25</h4>
                      <p className="text-sm text-muted-foreground">
                        Provides Bible access to 10 people for a month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">$50</h4>
                      <p className="text-sm text-muted-foreground">
                        Funds development of new study resources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">$100</h4>
                      <p className="text-sm text-muted-foreground">
                        Supports server costs for 1,000 daily users
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </LiquidGlassCard>

            <LiquidGlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Other Ways to Give
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <LiquidGlassButton variant="outline" className="w-full justify-start">
                  Share the app with friends
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" className="w-full justify-start">
                  Leave a positive review
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" className="w-full justify-start">
                  Volunteer your skills
                </LiquidGlassButton>
              </CardContent>
            </LiquidGlassCard>

            <LiquidGlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  We're grateful for our supporters who make this ministry possible:
                </p>
                <div className="space-y-2 text-sm">
                  <div>• Monthly donors: Premium features access</div>
                  <div>• Annual report with ministry impact</div>
                  <div>• Early access to new features</div>
                </div>
              </CardContent>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}