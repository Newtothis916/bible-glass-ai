import { EnhancedPrayerJournal } from "@/components/prayer/enhanced-prayer-journal";
import { MainLayout } from "@/components/layout/main-layout";

export default function Pray() {
  return (
    <MainLayout currentTab="pray">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <EnhancedPrayerJournal />
      </div>
    </MainLayout>
  );
}