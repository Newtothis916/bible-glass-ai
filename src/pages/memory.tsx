import { MainLayout } from "@/components/layout/main-layout";
import { MemoryDeckComponent } from "@/components/memory/memory-deck";
import { Brain } from "lucide-react";

export default function Memory() {
  return (
    <MainLayout currentTab="memory">
      <div className="space-y-8">
        {/* Professional Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Memory Verses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hide God's word in your heart through interactive study cards and spaced repetition
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <MemoryDeckComponent />
        </div>
      </div>
    </MainLayout>
  );
}