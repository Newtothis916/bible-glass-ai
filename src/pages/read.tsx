import { EnhancedBibleReader } from "@/components/bible/enhanced-bible-reader";
import { MainLayout } from "@/components/layout/main-layout";

export default function ReadPage() {
  return (
    <MainLayout currentTab="read">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <EnhancedBibleReader />
      </div>
    </MainLayout>
  );
}