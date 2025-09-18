import { EnhancedGroups } from "@/components/groups/enhanced-groups";
import { MainLayout } from "@/components/layout/main-layout";

export default function Groups() {
  return (
    <MainLayout currentTab="groups">
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <EnhancedGroups />
      </div>
    </MainLayout>
  );
}