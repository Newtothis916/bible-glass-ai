import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Users, Plus, MessageCircle, Globe, Lock, Crown } from "lucide-react";
import { groupsAPI, Group } from "@/lib/groups-api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [publicGroups, setPublicGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, [user]);

  const loadGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userGroups, discoveredGroups] = await Promise.all([
        groupsAPI.getUserGroups(),
        groupsAPI.getPublicGroups()
      ]);
      
      setGroups(userGroups);
      setPublicGroups(discoveredGroups);
    } catch (error) {
      toast({
        title: "Error loading groups",
        description: "Failed to load groups. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await groupsAPI.joinGroup(groupId);
      toast({
        title: "Joined group",
        description: "You have successfully joined the group!"
      });
      await loadGroups();
    } catch (error) {
      toast({
        title: "Failed to join group",
        description: "Unable to join the group. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getVisibilityIcon = (visibility: Group['visibility']) => {
    switch (visibility) {
      case 'public': return <Globe className="w-4 h-4 text-success" />;
      case 'private': return <Lock className="w-4 h-4 text-muted-foreground" />;
      case 'invite_only': return <Crown className="w-4 h-4 text-primary" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <LiquidGlassCard variant="divine" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-divine opacity-10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Users className="w-6 h-6" />
            Community Groups
          </CardTitle>
          <p className="text-sm text-primary-foreground/80">
            Connect with fellow believers and grow together in faith
          </p>
        </CardHeader>
      </LiquidGlassCard>

      {/* Tabs */}
      <div className="flex gap-2">
        <LiquidGlassButton
          variant={activeTab === 'my-groups' ? "default" : "ghost"}
          onClick={() => setActiveTab('my-groups')}
          className="flex-1"
        >
          My Groups ({groups.length})
        </LiquidGlassButton>
        <LiquidGlassButton
          variant={activeTab === 'discover' ? "default" : "ghost"}
          onClick={() => setActiveTab('discover')}
          className="flex-1"
        >
          Discover
        </LiquidGlassButton>
      </div>

      {/* Create Group Button */}
      <LiquidGlassButton variant="outline" className="w-full">
        <Plus className="w-4 h-4" />
        Create New Group
      </LiquidGlassButton>

      {/* Groups List */}
      <div className="space-y-4">
        {activeTab === 'my-groups' && (
          <>
            {groups.length === 0 ? (
              <LiquidGlassCard variant="outline">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No groups yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join or create a group to start connecting with others
                  </p>
                  <LiquidGlassButton variant="outline">
                    <Plus className="w-4 h-4" />
                    Create Group
                  </LiquidGlassButton>
                </CardContent>
              </LiquidGlassCard>
            ) : (
              groups.map((group) => (
                <LiquidGlassCard key={group.id} variant="elevated">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{group.name}</h3>
                          {getVisibilityIcon(group.visibility)}
                          {group.is_premium_only && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {group.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {group.member_count} members
                        </p>
                      </div>
                    </div>
                    <LiquidGlassButton variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4" />
                      Open Chat
                    </LiquidGlassButton>
                  </CardContent>
                </LiquidGlassCard>
              ))
            )}
          </>
        )}

        {activeTab === 'discover' && (
          <>
            {publicGroups.map((group) => (
              <LiquidGlassCard key={group.id} variant="default">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{group.name}</h3>
                        {getVisibilityIcon(group.visibility)}
                        {group.is_premium_only && (
                          <Crown className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {group.description || "No description"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {group.member_count} members
                      </p>
                    </div>
                  </div>
                  <LiquidGlassButton 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <Plus className="w-4 h-4" />
                    Join Group
                  </LiquidGlassButton>
                </CardContent>
              </LiquidGlassCard>
            ))}
          </>
        )}
      </div>
    </div>
  );
}