import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Heart, Check, Archive, Edit2, Calendar, Filter } from "lucide-react";
import { prayerAPI, Prayer } from "@/lib/prayer-api";
import { useToast } from "@/hooks/use-toast";

export function EnhancedPrayerJournal() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [filteredPrayers, setFilteredPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState({ title: "", body: "", tags: [] as string[] });
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'answered' | 'archived'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPrayers();
  }, []);

  useEffect(() => {
    filterPrayersByStatus();
  }, [prayers, filterStatus]);

  const loadPrayers = async () => {
    try {
      const prayersData = await prayerAPI.getUserPrayers();
      setPrayers(prayersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load prayers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPrayersByStatus = () => {
    if (filterStatus === 'all') {
      setFilteredPrayers(prayers);
    } else {
      setFilteredPrayers(prayers.filter(prayer => prayer.status === filterStatus));
    }
  };

  const handleAddPrayer = async () => {
    if (!newPrayer.title.trim()) return;
    
    try {
      await prayerAPI.addPrayer(newPrayer.title, newPrayer.body, newPrayer.tags);
      setNewPrayer({ title: "", body: "", tags: [] });
      setShowAddDialog(false);
      loadPrayers();
      toast({
        title: "Prayer Added",
        description: "Your prayer has been added to your journal"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add prayer",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePrayerStatus = async (prayerId: string, status: 'active' | 'answered' | 'archived') => {
    try {
      await prayerAPI.updatePrayerStatus(prayerId, status);
      loadPrayers();
      toast({
        title: "Updated",
        description: `Prayer marked as ${status}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prayer",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePrayer = async () => {
    if (!editingPrayer) return;
    
    try {
      await prayerAPI.updatePrayer(editingPrayer.id, editingPrayer.title, editingPrayer.body, editingPrayer.tags);
      setEditingPrayer(null);
      loadPrayers();
      toast({
        title: "Updated",
        description: "Prayer has been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prayer",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'answered': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Heart className="w-3 h-3" />;
      case 'answered': return <Check className="w-3 h-3" />;
      case 'archived': return <Archive className="w-3 h-3" />;
      default: return <Heart className="w-3 h-3" />;
    }
  };

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
          <h1 className="text-2xl font-bold">Prayer Journal</h1>
          <p className="text-muted-foreground">Track your prayers and see God's faithfulness</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <LiquidGlassButton>
              <Plus className="w-4 h-4 mr-2" />
              Add Prayer
            </LiquidGlassButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Prayer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Prayer title"
                value={newPrayer.title}
                onChange={(e) => setNewPrayer(prev => ({ ...prev, title: e.target.value }))}
                className="mobile-input"
              />
              <Textarea
                placeholder="Prayer details (optional)"
                value={newPrayer.body}
                onChange={(e) => setNewPrayer(prev => ({ ...prev, body: e.target.value }))}
                rows={4}
                className="mobile-input"
              />
              <div className="flex gap-2">
                <LiquidGlassButton onClick={handleAddPrayer} className="mobile-touch-target">
                  Add Prayer
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" onClick={() => setShowAddDialog(false)} className="mobile-touch-target">
                  Cancel
                </LiquidGlassButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prayer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {prayers.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Prayers</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {prayers.filter(p => p.status === 'answered').length}
            </div>
            <div className="text-sm text-muted-foreground">Answered</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {prayers.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Prayers</div>
          </CardContent>
        </LiquidGlassCard>
        
        <LiquidGlassCard variant="outline">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {prayers.filter(p => p.status === 'archived').length}
            </div>
            <div className="text-sm text-muted-foreground">Archived</div>
          </CardContent>
        </LiquidGlassCard>
      </div>

      {/* Filter */}
      <LiquidGlassCard>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4" />
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prayers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </LiquidGlassCard>

      {/* Prayers List */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle>Your Prayers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPrayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No prayers found. Start by adding your first prayer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrayers.map((prayer) => (
                <div key={prayer.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{prayer.title}</h3>
                      {prayer.body && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {prayer.body}
                        </p>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(prayer.status)} text-white`}>
                      {getStatusIcon(prayer.status)}
                      <span className="ml-1 capitalize">{prayer.status}</span>
                    </Badge>
                  </div>

                  {prayer.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {prayer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created {new Date(prayer.created_at).toLocaleDateString()}
                    </div>
                    {prayer.answered_at && (
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Answered {new Date(prayer.answered_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {prayer.status === 'active' && (
                      <>
                        <LiquidGlassButton
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdatePrayerStatus(prayer.id, 'answered')}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark Answered
                        </LiquidGlassButton>
                        <LiquidGlassButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdatePrayerStatus(prayer.id, 'archived')}
                        >
                          <Archive className="w-3 h-3 mr-1" />
                          Archive
                        </LiquidGlassButton>
                      </>
                    )}
                    
                    {prayer.status === 'answered' && (
                      <LiquidGlassButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdatePrayerStatus(prayer.id, 'active')}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Mark Active
                      </LiquidGlassButton>
                    )}
                    
                    <LiquidGlassButton
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingPrayer(prayer)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </LiquidGlassButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </LiquidGlassCard>

      {/* Edit Prayer Dialog */}
      {editingPrayer && (
        <Dialog open={!!editingPrayer} onOpenChange={() => setEditingPrayer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Prayer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Prayer title"
                value={editingPrayer.title}
                onChange={(e) => setEditingPrayer(prev => prev ? { ...prev, title: e.target.value } : null)}
              />
              <Textarea
                placeholder="Prayer details (optional)"
                value={editingPrayer.body || ''}
                onChange={(e) => setEditingPrayer(prev => prev ? { ...prev, body: e.target.value } : null)}
                rows={4}
              />
              <div className="flex gap-2">
                <LiquidGlassButton onClick={handleUpdatePrayer}>
                  Update Prayer
                </LiquidGlassButton>
                <LiquidGlassButton variant="outline" onClick={() => setEditingPrayer(null)}>
                  Cancel
                </LiquidGlassButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}