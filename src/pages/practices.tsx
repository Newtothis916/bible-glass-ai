import { MainLayout } from "@/components/layout/main-layout";
import { PracticeSession } from "@/components/practices/practice-session";

export default function Practices() {
  return (
    <MainLayout currentTab="practices">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <PracticeSession practiceSlug="lectio-divina" />
      </div>
    </MainLayout>
  );
}