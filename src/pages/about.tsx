import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            About Bible App
          </h1>
          <p className="text-muted-foreground">Your digital companion for Bible study</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We're dedicated to making Bible study accessible, engaging, and meaningful for everyone. 
                Our app combines traditional Bible reading with modern technology to enhance your spiritual journey.
              </p>
            </CardContent>
          </LiquidGlassCard>

          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Version Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>January 2024</span>
              </div>
            </CardContent>
          </LiquidGlassCard>
        </div>
      </div>
    </MainLayout>
  );
}