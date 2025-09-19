import { MainLayout } from "@/components/layout/main-layout";

export default function Privacy() {
  return (
    <MainLayout currentTab="privacy">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Terms & Privacy</h1>
          <p className="text-muted-foreground">
            Our commitment to protecting your privacy and data
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <p className="text-muted-foreground">
              Learn how we collect, use, and protect your personal information.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Terms of Service</h3>
            <p className="text-muted-foreground">
              Read our terms and conditions for using this Bible app.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}