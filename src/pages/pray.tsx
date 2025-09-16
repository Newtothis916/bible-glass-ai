import { EnhancedPrayerJournal } from "@/components/prayer/enhanced-prayer-journal";
import { MainLayout } from "@/components/layout/main-layout";
import { Heart } from "lucide-react";

export default function Pray() {
  return (
    <MainLayout currentTab="pray">
      <div className="space-y-8">
        {/* Professional Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Prayer Journal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deepen your prayer life with guided journals, requests, and answered prayer tracking
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <EnhancedPrayerJournal />
        </div>
      </div>
    </MainLayout>
  );
}