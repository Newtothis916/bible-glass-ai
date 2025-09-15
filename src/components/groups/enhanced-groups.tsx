import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Plus, MessageSquare, Heart, Share2, Crown, 
  Settings, UserPlus, Search, Filter, Clock, BookOpen 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { groupsAPI, Group, GroupMember } from "@/lib/groups-api";

interface GroupWithMembers extends Group {
  members?: GroupMember[];
  memberCount: number;
}

export function EnhancedGroups() {
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupWithMembers[]>([]);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    visibility: "public" as const
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      // Sample data - in real app would come from groupsAPI
      const sampleGroups: GroupWithMembers[] = [
        {
          id: '1',
          name: 'Bible Study Warriors',
          description: 'Daily Bible study and discussion group focusing on New Testament',
          visibility: 'public',
          owner_id: 'user1',
          member_count: 45,
          memberCount: 45,
          is_premium_only: false,
          invite_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Prayer Circle',
          description: 'Join us for daily prayer requests and encouragement',
          visibility: 'public',
          owner_id: 'user2',
          member_count: 32,
          memberCount: 32,
          is_premium_only: false,
          invite_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Youth Ministry Connect',
          description: 'Connecting young believers through faith and fellowship',
          visibility: 'public',
          owner_id: 'user3',
          member_count: 78,
          memberCount: 78,
          is_premium_only: false,
          invite_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const joinedSample: GroupWithMembers[] = [
        {
          id: '4',
          name: 'My Study Group',
          description: 'Personal study group with close friends',
          visibility: 'private',
          owner_id: 'currentUser',
          member_count: 8,
          memberCount: 8,
          is_premium_only: false,
          invite_code: 'ABC123',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setGroups(sampleGroups);
      setJoinedGroups(joinedSample);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load groups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) return;
    
    try {
      // In real app: await groupsAPI.createGroup(newGroup.name, newGroup.description, newGroup.visibility);
      setNewGroup({ name: "", description: "", visibility: "public" });
      setShowCreateDialog(false);
      loadGroups();
      
      toast({
        title: "Group Created",
        description: "Your group has been created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive"
      });
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      // In real app: await groupsAPI.joinGroup(groupId);
      toast({
        title: "Joined Group",
        description: "You have successfully joined the group!"
      });
      loadGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive"
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      // In real app: await groupsAPI.leaveGroup(groupId);
      toast({
        title: "Left Group",
        description: "You have left the group"
      });
      loadGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive"
      });
    }
  };

  const handleShareGroup = (group: GroupWithMembers) => {
    const shareText = `Join "${group.name}" on Bible App! ${group.description}`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Link Copied",
      description: "Group invitation copied to clipboard!"
    });
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || group.visibility === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="h-48 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Community Groups
          </h1>
          <p className="text-muted-foreground">
            Connect with believers and grow together in faith
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <LiquidGlassButton>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </LiquidGlassButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Group name"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
              />
              <Textarea
                placeholder="Group description"
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="flex gap-2">
                <LiquidGlassButton onClick={handleCreateGroup}>
                  Create Group
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </LiquidGlassButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Groups */}
      {joinedGroups.length > 0 && (
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              My Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {joinedGroups.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.visibility === 'private' && (
                        <Badge variant="outline">Private</Badge>
                      )}
                      <Badge variant="default">Owner</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {group.memberCount} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {new Date(group.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <LiquidGlassButton size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </LiquidGlassButton>
                    <LiquidGlassButton size="sm" variant="outline">
                      <MessageSquare className="w-3 h-3" />
                    </LiquidGlassButton>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </LiquidGlassCard>
      )}

      {/* Search and Filter */}
      <LiquidGlassCard>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <LiquidGlassButton
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </LiquidGlassButton>
              <LiquidGlassButton
                variant={filterType === 'public' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('public')}
              >
                Public
              </LiquidGlassButton>
              <LiquidGlassButton
                variant={filterType === 'private' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('private')}
              >
                Private
              </LiquidGlassButton>
            </div>
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Public Groups */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle>Discover Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No groups found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or create a new group!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{group.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {group.visibility}
                        </Badge>
                        {group.is_premium_only && (
                          <Badge variant="secondary" className="bg-gradient-primary text-white">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.description}
                      </p>
                      
                      {/* Member Avatars */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <Avatar key={i} className="w-6 h-6 border-2 border-background">
                              <AvatarFallback className="text-xs bg-gradient-primary text-white">
                                {String.fromCharCode(65 + i)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {group.memberCount} members
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          Active discussions
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          Bible study focused
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <LiquidGlassButton
                        size="sm"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Join
                      </LiquidGlassButton>
                      <div className="flex gap-1">
                        <LiquidGlassButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShareGroup(group)}
                        >
                          <Share2 className="w-3 h-3" />
                        </LiquidGlassButton>
                        <LiquidGlassButton
                          size="sm"
                          variant="ghost"
                        >
                          <Heart className="w-3 h-3" />
                        </LiquidGlassButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </LiquidGlassCard>
    </div>
  );
}