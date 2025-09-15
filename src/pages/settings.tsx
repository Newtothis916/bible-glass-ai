import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Moon, Volume2, Bell, Shield, Palette, BookOpen, Download } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your app experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Appearance Settings */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Reading Theme</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose reading theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Reading Preferences */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Reading Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Default Bible Version</Label>
                <Select defaultValue="niv">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Bible version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="niv">NIV</SelectItem>
                    <SelectItem value="esv">ESV</SelectItem>
                    <SelectItem value="kjv">KJV</SelectItem>
                    <SelectItem value="nlt">NLT</SelectItem>
                    <SelectItem value="nasb">NASB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Show Verse Numbers</Label>
                  <p className="text-xs text-muted-foreground">
                    Display verse numbers in reading view
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Cross References</Label>
                  <p className="text-xs text-muted-foreground">
                    Show related verses while reading
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Audio Settings */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for interactions
                  </p>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto-play Audio</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically play next audio chapter
                  </p>
                </div>
                <Switch
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Audio Speed</Label>
                <Select defaultValue="1x">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose playback speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5x">0.5x</SelectItem>
                    <SelectItem value="0.75x">0.75x</SelectItem>
                    <SelectItem value="1x">1x (Normal)</SelectItem>
                    <SelectItem value="1.25x">1.25x</SelectItem>
                    <SelectItem value="1.5x">1.5x</SelectItem>
                    <SelectItem value="2x">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Notifications */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications on this device
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Daily Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Get reminded to read daily
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Prayer Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive prayer reminder notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Privacy & Data */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Analytics</Label>
                  <p className="text-xs text-muted-foreground">
                    Help improve the app with usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Offline Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Download content for offline reading
                  </p>
                </div>
                <Switch
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}