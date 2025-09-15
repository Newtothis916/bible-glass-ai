import { EnhancedGroups } from "@/components/groups/enhanced-groups";
import { MainLayout } from "@/components/layout/main-layout";

export default function Groups() {
  return (
    <MainLayout currentTab="groups">
      <EnhancedGroups />
    </MainLayout>
  );
}