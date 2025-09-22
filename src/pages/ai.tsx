import { MainLayout } from "@/components/layout/main-layout";
import { EnhancedAIAssistant } from "@/components/ai/enhanced-ai-assistant";

export default function AI() {
  return (
    <MainLayout currentTab="ai">
      <EnhancedAIAssistant />
    </MainLayout>
  );
}