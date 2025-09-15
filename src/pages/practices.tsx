import { MainLayout } from "@/components/layout/main-layout";
import { PracticeSession } from "@/components/practices/practice-session";

export default function Practices() {
  return (
    <MainLayout currentTab="practices">
      <div className="container mx-auto px-4 py-6">
        <PracticeSession />
      </div>
    </MainLayout>
  );
}