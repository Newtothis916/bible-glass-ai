import { MainLayout } from "@/components/layout/main-layout";
import { EnhancedAIAssistant } from "@/components/ai/enhanced-ai-assistant";

export default function AI() {
  return (
    <MainLayout currentTab="ai">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <EnhancedAIAssistant />
      </div>
    </MainLayout>
  );
}