import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate checking session status
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!sessionId) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlassCard variant="elevated" className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl">Welcome to Premium!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your subscription has been activated successfully. You now have access to all premium features.
            </p>

            <div className="bg-muted/10 p-4 rounded-lg space-y-2 text-left">
              <h4 className="font-medium flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Premium Features Unlocked:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Unlimited AI Bible Guide questions</li>
                <li>✓ Multiple Bible translations</li>
                <li>✓ Advanced search & study tools</li>
                <li>✓ Audio Bible access</li>
                <li>✓ Premium reading plans</li>
                <li>✓ Export & backup features</li>
              </ul>
            </div>

            <div className="space-y-2">
              <LiquidGlassButton 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Start Exploring
                <ArrowRight className="w-4 h-4" />
              </LiquidGlassButton>
              
              <LiquidGlassButton 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/ai'}
              >
                Try AI Bible Guide
              </LiquidGlassButton>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Having issues? Contact support at help@ultimatebible.com
            </p>
          </CardContent>
        </LiquidGlassCard>
      </div>
    </MainLayout>
  );
}