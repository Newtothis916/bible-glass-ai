import { EnhancedPrayerJournal } from "@/components/prayer/enhanced-prayer-journal";
import { MainLayout } from "@/components/layout/main-layout";

export default function Pray() {
  return (
    <MainLayout currentTab="pray">
      <EnhancedPrayerJournal />
    </MainLayout>
  );
}