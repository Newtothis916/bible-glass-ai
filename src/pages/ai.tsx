import { MainLayout } from "@/components/layout/main-layout";
import { EnhancedAIAssistant } from "@/components/ai/enhanced-ai-assistant";

export default function AI() {
  return (
    <MainLayout currentTab="ai">
      <div className="container mx-auto px-4 py-6">
        <EnhancedAIAssistant />
      </div>
    </MainLayout>
  );
}