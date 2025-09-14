import { GroupsPage } from "@/components/groups/groups-page";
import { MainLayout } from "@/components/layout/main-layout";

export default function Groups() {
  return (
    <MainLayout currentTab="groups">
      <GroupsPage />
    </MainLayout>
  );
}