import { MainLayout } from "@/components/layout/main-layout";
import { Crown } from "lucide-react";

export default function Analytics() {
  return (
    <MainLayout currentTab="analytics">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Progress Analytics
            <Crown className="w-5 h-5 text-primary" />
          </h1>
          <p className="text-muted-foreground">
            Track your Bible reading progress and spiritual growth
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Reading Statistics</h3>
            <p className="text-muted-foreground">
              Your reading progress, streaks, and spiritual growth metrics will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}