import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, BookOpen, Headphones, Heart, Users, Settings } from "lucide-react";

const helpTopics = [
  { icon: BookOpen, title: "Reading the Bible", description: "Learn how to navigate and use the Bible reader" },
  { icon: Headphones, title: "Audio Features", description: "Guide to listening to audio Bible" },
  { icon: Heart, title: "Prayer Journal", description: "How to use the prayer journal effectively" },
  { icon: Users, title: "Community Groups", description: "Joining and participating in groups" },
  { icon: Settings, title: "Account Settings", description: "Managing your profile and preferences" },
];

export default function HelpPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-muted-foreground">Find answers and get support</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <LiquidGlassCard variant="elevated">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search help articles..." className="pl-10" />
              </div>
            </CardContent>
          </LiquidGlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic, index) => (
              <LiquidGlassCard key={index} variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <topic.icon className="w-5 h-5" />
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{topic.description}</p>
                </CardContent>
              </LiquidGlassCard>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}