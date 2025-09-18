import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 pb-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Send Feedback
          </h1>
          <p className="text-muted-foreground">Help us improve your Bible study experience</p>
        </div>

        <div className="space-y-6">
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Tell us what you think..." rows={6} />
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Send Feedback
              </Button>
            </CardContent>
          </LiquidGlassCard>
        </div>
      </div>
    </MainLayout>
  );
}