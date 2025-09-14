import { PrayerJournal } from "@/components/prayer/prayer-journal";
import { MainLayout } from "@/components/layout/main-layout";

export default function Pray() {
  return (
    <MainLayout currentTab="pray">
      <PrayerJournal />
    </MainLayout>
  );
}