import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Cloud, HardDrive, BookOpen, Headphones, Trash2, Play, Pause, Crown, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface DownloadItem {
  id: string;
  title: string;
  type: 'bible' | 'audio' | 'plan';
  size: string;
  downloadedAt: string;
  status: 'completed' | 'downloading' | 'paused' | 'error';
  progress?: number;
  version?: string;
  language?: string;
}

const mockDownloads: DownloadItem[] = [
  {
    id: '1',
    title: 'NIV Bible (Complete)',
    type: 'bible',
    size: '45.2 MB',
    downloadedAt: '2024-01-15',
    status: 'completed',
    version: 'NIV',
    language: 'English',
  },
  {
    id: '2',
    title: 'John Audio Bible (NIV)',
    type: 'audio',
    size: '125.8 MB',
    downloadedAt: '2024-01-12',
    status: 'completed',
    version: 'NIV',
    language: 'English',
  },
  {
    id: '3',
    title: '7-Day Foundations Plan',
    type: 'plan',
    size: '2.1 MB',
    downloadedAt: '2024-01-10',
    status: 'completed',
  },
  {
    id: '4',
    title: 'ESV Audio - Romans',
    type: 'audio',
    size: '89.5 MB',
    downloadedAt: '2024-01-08',
    status: 'downloading',
    progress: 67,
    version: 'ESV',
    language: 'English',
  },
];

export default function DownloadsPage() {
  const { user } = useAuth();
  const [isOnline] = useState(true);
  
  const isPremium = false; // TODO: Add subscription logic
  
  const totalSize = mockDownloads
    .filter(d => d.status === 'completed')
    .reduce((acc, d) => acc + parseFloat(d.size), 0);

  const completedDownloads = mockDownloads.filter(d => d.status === 'completed');
  const activeDownloads = mockDownloads.filter(d => 
    d.status === 'downloading' || d.status === 'paused' || d.status === 'error'
  );

  const bibleDownloads = completedDownloads.filter(d => d.type === 'bible');
  const audioDownloads = completedDownloads.filter(d => d.type === 'audio');
  const planDownloads = completedDownloads.filter(d => d.type === 'plan');

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Downloads
          </h1>
          <p className="text-muted-foreground">
            Manage your offline content for study on the go
          </p>
        </div>

        {!isPremium && (
          <LiquidGlassCard variant="elevated" className="border-2 border-primary/20">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
              <p className="text-muted-foreground mb-4">
                Download Bible versions, audio, and plans for offline reading
              </p>
              <Button className="bg-gradient-primary hover:opacity-90">
                Upgrade to Premium
              </Button>
            </CardContent>
          </LiquidGlassCard>
        )}

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Connection Status
                </div>
              </CardContent>
            </LiquidGlassCard>
            
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{completedDownloads.length}</div>
                <div className="text-sm text-muted-foreground">Downloaded Items</div>
              </CardContent>
            </LiquidGlassCard>
            
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalSize.toFixed(1)} MB</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </CardContent>
            </LiquidGlassCard>
            
            <LiquidGlassCard variant="elevated">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{activeDownloads.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </LiquidGlassCard>
          </div>

          {/* Active Downloads */}
          {activeDownloads.length > 0 && (
            <LiquidGlassCard variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Active Downloads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeDownloads.map(download => (
                  <div key={download.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{download.title}</h4>
                        <Badge variant={
                          download.status === 'downloading' ? 'default' :
                          download.status === 'paused' ? 'secondary' : 'destructive'
                        }>
                          {download.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress 
                          value={download.progress || 0} 
                          className="flex-1 h-2"
                        />
                        <span className="text-sm text-muted-foreground">
                          {download.progress || 0}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {download.size} • {download.version} • {download.language}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        {download.status === 'downloading' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </LiquidGlassCard>
          )}

          {/* Downloaded Content Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({completedDownloads.length})</TabsTrigger>
              <TabsTrigger value="bible">Bible ({bibleDownloads.length})</TabsTrigger>
              <TabsTrigger value="audio">Audio ({audioDownloads.length})</TabsTrigger>
              <TabsTrigger value="plans">Plans ({planDownloads.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <DownloadsList downloads={completedDownloads} />
            </TabsContent>

            <TabsContent value="bible" className="space-y-4">
              <DownloadsList downloads={bibleDownloads} />
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <DownloadsList downloads={audioDownloads} />
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <DownloadsList downloads={planDownloads} />
            </TabsContent>
          </Tabs>

          {/* Download More Content */}
          {isPremium && (
            <LiquidGlassCard variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Download More Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">Bible Versions</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download additional translations
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Versions
                    </Button>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <Headphones className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">Audio Bibles</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Listen offline with audio downloads
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Audio
                    </Button>
                  </div>

                  <div className="p-4 border border-border/50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium mb-1">Reading Plans</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download plans for offline study
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </LiquidGlassCard>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function DownloadsList({ downloads }: { downloads: DownloadItem[] }) {
  if (downloads.length === 0) {
    return (
      <LiquidGlassCard variant="elevated">
        <CardContent className="p-8 text-center">
          <HardDrive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No downloads found</h3>
          <p className="text-muted-foreground">
            Download content to access it offline
          </p>
        </CardContent>
      </LiquidGlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {downloads.map(download => (
        <LiquidGlassCard key={download.id} variant="elevated">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {download.type === 'bible' && <BookOpen className="w-5 h-5 text-primary" />}
                  {download.type === 'audio' && <Headphones className="w-5 h-5 text-primary" />}
                  {download.type === 'plan' && <BookOpen className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{download.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{download.size}</span>
                    {download.version && <span>{download.version}</span>}
                    {download.language && <span>{download.language}</span>}
                    <span>Downloaded {new Date(download.downloadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">
                  Open
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </LiquidGlassCard>
      ))}
    </div>
  );
}