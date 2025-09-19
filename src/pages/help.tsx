import { MainLayout } from "@/components/layout/main-layout";

export default function Help() {
  return (
    <MainLayout currentTab="help">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground">
            Get answers to frequently asked questions and learn how to use the app
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Getting Started</h3>
            <p className="text-muted-foreground">
              Learn the basics of using our Bible app and its features.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
            <p className="text-muted-foreground">
              Find answers to common questions about reading plans, notes, and more.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}