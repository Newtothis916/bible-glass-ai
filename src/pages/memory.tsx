import { MainLayout } from "@/components/layout/main-layout";
import { MemoryDeckComponent } from "@/components/memory/memory-deck";

export default function Memory() {
  return (
    <MainLayout currentTab="memory">
      <div className="container mx-auto px-4 py-6">
        <MemoryDeckComponent />
      </div>
    </MainLayout>
  );
}