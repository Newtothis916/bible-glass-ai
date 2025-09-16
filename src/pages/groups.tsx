import { EnhancedGroups } from "@/components/groups/enhanced-groups";
import { MainLayout } from "@/components/layout/main-layout";
import { Users } from "lucide-react";

export default function Groups() {
  return (
    <MainLayout currentTab="groups">
      <div className="space-y-8">
        {/* Professional Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Study Groups</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow believers in meaningful Bible study and fellowship
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <EnhancedGroups />
        </div>
      </div>
    </MainLayout>
  );
}