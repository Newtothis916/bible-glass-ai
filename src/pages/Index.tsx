import { MainLayout } from "@/components/layout/main-layout";
import { Dashboard } from "@/components/home/dashboard";

const Index = () => {
  return (
    <MainLayout currentTab="home">
      <Dashboard />
    </MainLayout>
  );
};

export default Index;