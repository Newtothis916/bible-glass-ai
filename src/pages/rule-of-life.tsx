import { MainLayout } from "@/components/layout/main-layout";
import { RuleManager } from "@/components/rule-of-life/rule-manager";

export default function RuleOfLife() {
  return (
    <MainLayout currentTab="rule-of-life">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <RuleManager />
      </div>
    </MainLayout>
  );
}