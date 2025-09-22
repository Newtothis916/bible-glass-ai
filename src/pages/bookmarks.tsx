import { MainLayout } from "@/components/layout/main-layout";

export default function Bookmarks() {
  return (
    <MainLayout currentTab="bookmarks">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Bookmarks</h1>
          <p className="text-muted-foreground">
            Save and organize your favorite Bible verses and passages
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Saved Verses</h3>
            <p className="text-muted-foreground">
              Your bookmarked verses and passages will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}