import { MainLayout } from "@/components/layout/main-layout";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { User, Crown, Calendar, BookOpen, Award } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");

  const isPremium = false; // TODO: Add subscription logic
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

  return (
    <MainLayout>
      <div className="min-h-screen p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xl bg-gradient-primary text-white">
                    {displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="display-name">Display Name</Label>
                  {isEditing ? (
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {displayName || "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {joinDate}
                  </p>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={() => setIsEditing(false)}>
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Subscription Status */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                {isPremium ? (
                  <>
                    <Badge className="bg-gradient-primary text-white">
                      Premium Member
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      You have access to all premium features
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Plan:</span>
                        <span className="font-medium">Premium Monthly</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Badge variant="outline">Free Plan</Badge>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to unlock premium features
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                {!isPremium && (
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    Upgrade to Premium
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Reading Stats */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Reading Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">47</div>
                  <div className="text-xs text-muted-foreground">Days Read</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">Books Complete</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">156</div>
                  <div className="text-xs text-muted-foreground">Verses Read</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">23</div>
                  <div className="text-xs text-muted-foreground">Notes Taken</div>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>

          {/* Achievements */}
          <LiquidGlassCard variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">First Chapter</h4>
                  <p className="text-xs text-muted-foreground">
                    Complete your first chapter
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">7 Day Streak</h4>
                  <p className="text-xs text-muted-foreground">
                    Read for 7 consecutive days
                  </p>
                </div>
              </div>
            </CardContent>
          </LiquidGlassCard>
        </div>
      </div>
    </MainLayout>
  );
}