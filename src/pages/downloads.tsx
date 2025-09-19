import { MainLayout } from "@/components/layout/main-layout";
import { Crown } from "lucide-react";

export default function Downloads() {
  return (
    <MainLayout currentTab="downloads">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Downloads
            <Crown className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-muted-foreground">
            Download Bible versions and audio for offline reading
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Offline Content</h3>
            <p className="text-muted-foreground">
              Download Bible translations and audio versions for offline access.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}