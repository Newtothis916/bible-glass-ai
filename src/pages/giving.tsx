import { MainLayout } from "@/components/layout/main-layout";
import { Heart } from "lucide-react";

export default function Giving() {
  return (
    <MainLayout currentTab="giving">
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Giving
            <Heart className="w-5 h-5 text-red-500" />
          </h1>
          <p className="text-muted-foreground">
            Support your church and ministries through digital giving
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Digital Giving</h3>
            <p className="text-muted-foreground">
              Make secure donations to your church or favorite Christian ministries.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-2">Giving History</h3>
            <p className="text-muted-foreground">
              Track your giving and manage recurring donations.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}