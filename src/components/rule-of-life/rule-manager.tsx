import { useState, useEffect } from "react";
import { LiquidGlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Check, X, Sun, Sunset, Clock, Target } from "lucide-react";
import { ruleOfLifeAPI, LifeRule, RuleCompletion } from "@/lib/rule-of-life-api";
import { useToast } from "@/hooks/use-toast";

interface PracticeItem {
  name: string;
  duration_minutes?: number;
  description?: string;
}

export function RuleManager() {
  const [rules, setRules] = useState<LifeRule[]>([]);
  const [completions, setCompletions] = useState<RuleCompletion[]>([]);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    title: "",
    description: "",
    morning_practices: [] as PracticeItem[],
    midday_practices: [] as PracticeItem[],
    evening_practices: [] as PracticeItem[]
  });
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRuleData();
  }, []);

  const loadRuleData = async () => {
    try {
      const [rulesData, completionsData] = await Promise.all([
        ruleOfLifeAPI.getUserRules(),
        ruleOfLifeAPI.getTodayCompletions(new Date().toISOString().split('T')[0])
      ]);
      
      setRules(rulesData);
      setCompletions(completionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rule data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    if (!newRule.title.trim()) return;
    
    try {
      await ruleOfLifeAPI.createRule(
        newRule.title,
        newRule.description,
        newRule.morning_practices,
        newRule.midday_practices,
        newRule.evening_practices
      );
      
      setNewRule({
        title: "",
        description: "",
        morning_practices: [],
        midday_practices: [],
        evening_practices: []
      });
      setShowNewRuleForm(false);
      loadRuleData();
      
      toast({
        title: "Success",
        description: "Rule of Life created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create rule",
        variant: "destructive"
      });
    }
  };

  const handleCompleteTimeSlot = async (ruleId: string, timeSlot: 'morning' | 'midday' | 'evening') => {
    try {
      await ruleOfLifeAPI.completeTimeSlot(ruleId, timeSlot);
      loadRuleData();
      toast({
        title: "Completed",
        description: `${timeSlot} practices completed!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark completion",
        variant: "destructive"
      });
    }
  };

  const addPracticeToNewRule = (timeSlot: 'morning_practices' | 'midday_practices' | 'evening_practices') => {
    setNewRule(prev => ({
      ...prev,
      [timeSlot]: [...prev[timeSlot], { name: "", duration_minutes: 10 }]
    }));
  };

  const updatePracticeInNewRule = (
    timeSlot: 'morning_practices' | 'midday_practices' | 'evening_practices',
    index: number,
    field: string,
    value: string | number
  ) => {
    setNewRule(prev => ({
      ...prev,
      [timeSlot]: prev[timeSlot].map((practice, i) => 
        i === index ? { ...practice, [field]: value } : practice
      )
    }));
  };

  const removePracticeFromNewRule = (
    timeSlot: 'morning_practices' | 'midday_practices' | 'evening_practices',
    index: number
  ) => {
    setNewRule(prev => ({
      ...prev,
      [timeSlot]: prev[timeSlot].filter((_, i) => i !== index)
    }));
  };

  const isTimeSlotCompleted = (ruleId: string, timeSlot: string): boolean => {
    return completions.some(c => c.rule_id === ruleId && c.time_slot === timeSlot);
  };

  const renderPracticesList = (practices: PracticeItem[], timeSlot: string, iconComponent: React.ReactNode) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {iconComponent}
        <span className="capitalize">{timeSlot}</span>
      </div>
      {practices.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No practices set</p>
      ) : (
        <div className="space-y-1">
          {practices.map((practice, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{practice.name}</span>
              {practice.duration_minutes && (
                <Badge variant="outline">{practice.duration_minutes}min</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          <h1 className="text-2xl font-bold">Rule of Life</h1>
          <p className="text-muted-foreground">Create and follow daily spiritual practices</p>
        </div>
        <LiquidGlassButton onClick={() => setShowNewRuleForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </LiquidGlassButton>
      </div>

      {/* Today's Progress */}
      {rules.length > 0 && (
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.filter(rule => rule.is_active).map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">{rule.title}</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Morning */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <span className="text-sm font-medium">Morning</span>
                      </div>
                      {isTimeSlotCompleted(rule.id, 'morning') ? (
                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <LiquidGlassButton
                          size="sm"
                          onClick={() => handleCompleteTimeSlot(rule.id, 'morning')}
                        >
                          Mark Done
                        </LiquidGlassButton>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.morning_practices.length} practices
                    </div>
                  </div>

                  {/* Midday */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Midday</span>
                      </div>
                      {isTimeSlotCompleted(rule.id, 'midday') ? (
                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <LiquidGlassButton
                          size="sm"
                          onClick={() => handleCompleteTimeSlot(rule.id, 'midday')}
                        >
                          Mark Done
                        </LiquidGlassButton>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.midday_practices.length} practices
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4" />
                        <span className="text-sm font-medium">Evening</span>
                      </div>
                      {isTimeSlotCompleted(rule.id, 'evening') ? (
                        <Badge variant="default">
                          <Check className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <LiquidGlassButton
                          size="sm"
                          onClick={() => handleCompleteTimeSlot(rule.id, 'evening')}
                        >
                          Mark Done
                        </LiquidGlassButton>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {rule.evening_practices.length} practices
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </LiquidGlassCard>
      )}

      {/* New Rule Form */}
      {showNewRuleForm && (
        <LiquidGlassCard>
          <CardHeader>
            <CardTitle>Create New Rule of Life</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Rule title (e.g., Daily Spiritual Practices)"
                value={newRule.title}
                onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newRule.description}
                onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Practice Time Slots */}
            {(['morning_practices', 'midday_practices', 'evening_practices'] as const).map((timeSlot) => {
              const displayName = timeSlot.replace('_practices', '');
              const icon = timeSlot === 'morning_practices' ? <Sun className="w-4 h-4" /> :
                          timeSlot === 'midday_practices' ? <Clock className="w-4 h-4" /> :
                          <Sunset className="w-4 h-4" />;
              
              return (
                <div key={timeSlot} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon}
                      <h4 className="font-medium capitalize">{displayName} Practices</h4>
                    </div>
                    <LiquidGlassButton
                      size="sm"
                      variant="outline"
                      onClick={() => addPracticeToNewRule(timeSlot)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </LiquidGlassButton>
                  </div>
                  
                  <div className="space-y-2">
                    {newRule[timeSlot].map((practice, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Practice name"
                          value={practice.name}
                          onChange={(e) => updatePracticeInNewRule(timeSlot, index, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Minutes"
                          className="w-24"
                          value={practice.duration_minutes || ''}
                          onChange={(e) => updatePracticeInNewRule(timeSlot, index, 'duration_minutes', parseInt(e.target.value))}
                        />
                        <LiquidGlassButton
                          size="sm"
                          variant="outline"
                          onClick={() => removePracticeFromNewRule(timeSlot, index)}
                        >
                          <X className="w-3 h-3" />
                        </LiquidGlassButton>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2">
              <LiquidGlassButton onClick={handleCreateRule}>
                Create Rule
              </LiquidGlassButton>
              <LiquidGlassButton variant="outline" onClick={() => setShowNewRuleForm(false)}>
                Cancel
              </LiquidGlassButton>
            </div>
          </CardContent>
        </LiquidGlassCard>
      )}

      {/* Existing Rules */}
      <LiquidGlassCard>
        <CardHeader>
          <CardTitle>Your Rules of Life</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No rules created yet. Start by creating your first Rule of Life!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{rule.title}</h3>
                      {rule.description && (
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {rule.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                      <LiquidGlassButton size="sm" variant="outline">
                        <Edit2 className="w-3 h-3" />
                      </LiquidGlassButton>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {renderPracticesList(rule.morning_practices, 'morning', <Sun className="w-4 h-4" />)}
                    {renderPracticesList(rule.midday_practices, 'midday', <Clock className="w-4 h-4" />)}
                    {renderPracticesList(rule.evening_practices, 'evening', <Sunset className="w-4 h-4" />)}
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
