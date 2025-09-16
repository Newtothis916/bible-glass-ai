import { MainLayout } from "@/components/layout/main-layout";
import { PracticeSession } from "@/components/practices/practice-session";
import { Sparkles } from "lucide-react";

export default function Practices() {
  return (
    <MainLayout currentTab="practices">
      <div className="space-y-8">
        {/* Professional Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Spiritual Practices</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deepen your faith through guided spiritual exercises and contemplative practices
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PracticeSession practiceSlug="lectio-divina" />
        </div>
      </div>
    </MainLayout>
  );
}