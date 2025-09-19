import { MainLayout } from "@/components/layout/main-layout";

export default function Notes() {
  return (
    <MainLayout currentTab="notes">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Notes & Highlights</h1>
          <p className="text-muted-foreground">
            Your personal Bible study notes and highlighted verses
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Recent Notes</h3>
            <p className="text-muted-foreground">
              Your notes and highlights will appear here as you study Scripture.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}