import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LiquidGlassCard, CardContent, CardHeader } from "@/components/ui/liquid-glass-card";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Play, Pause, Check, Save } from "lucide-react";
import { practicesAPI, Practice, PracticePrompt } from "@/lib/practices-api";
import { useToast } from "@/hooks/use-toast";

interface PracticeSessionProps {
  practiceSlug: string;
  passageRef?: string;
}

export function PracticeSession({ practiceSlug, passageRef }: PracticeSessionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [practice, setPractice] = useState<Practice | null>(null);
  const [prompts, setPrompts] = useState<PracticePrompt[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stepData, setStepData] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  
  const timerRef = useRef<NodeJS.Timeout>();
  const autosaveRef = useRef<NodeJS.Timeout>();

  // Load practice data and start session
  useEffect(() => {
    loadPracticeData();
  }, [practiceSlug]);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Auto-save effect
  useEffect(() => {
    if (sessionId && Object.keys(stepData).length > 0) {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
      
      autosaveRef.current = setTimeout(() => {
        saveProgress();
      }, 5000); // Auto-save every 5 seconds
    }

    return () => {
      if (autosaveRef.current) {
        clearTimeout(autosaveRef.current);
      }
    };
  }, [stepData, sessionId]);

  const loadPracticeData = async () => {
    try {
      setIsLoading(true);
      const [practiceData, promptsData] = await Promise.all([
        practicesAPI.getPracticeBySlug(practiceSlug),
        practicesAPI.getPracticePrompts(practiceSlug)
      ]);

      if (!practiceData) {
        toast({
          title: "Practice not found",
          description: "The requested practice could not be found.",
          variant: "destructive"
        });
        navigate('/practices');
        return;
      }

      setPractice(practiceData);
      setPrompts(promptsData);

      // Start the session
      const newSessionId = await practicesAPI.startPracticeSession(practiceSlug, passageRef);
      setSessionId(newSessionId);
      setIsTimerRunning(true);

    } catch (error) {
      console.error('Failed to load practice:', error);
      toast({
        title: "Error loading practice",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!sessionId) return;

    try {
      await practicesAPI.updatePracticeSession(sessionId, {
        steps_completed: currentStep + 1,
        step_data: stepData
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleStepDataChange = (step: number, value: string) => {
    setStepData(prev => ({
      ...prev,
      [step]: value
    }));
  };

  const nextStep = async () => {
    if (!practice || currentStep >= practice.steps - 1) return;
    
    await saveProgress();
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    setCurrentStep(prev => prev - 1);
  };

  const completeSession = async () => {
    if (!sessionId || !practice) return;

    try {
      setIsTimerRunning(false);
      const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
      
      await Promise.all([
        practicesAPI.updatePracticeSession(sessionId, {
          steps_completed: practice.steps,
          step_data: stepData,
          notes_md: Object.values(stepData).join('\n\n')
        }),
        practicesAPI.completePracticeSession(sessionId, durationSec)
      ]);

      toast({
        title: "Practice completed!",
        description: `You've completed ${practice.title} in ${formatTime(durationSec)}.`
      });

      navigate('/practices/completed');
    } catch (error) {
      console.error('Failed to complete session:', error);
      toast({
        title: "Error completing session",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || !practice || !prompts.length) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LiquidGlassCard>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading practice...</p>
          </CardContent>
        </LiquidGlassCard>
      </div>
    );
  }

  const currentPrompt = prompts[currentStep];
  const progress = ((currentStep + 1) / practice.steps) * 100;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <LiquidGlassButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/practices')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Practices
          </LiquidGlassButton>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {formatTime(timerSeconds)}
            </div>
            <span>•</span>
            <span>Step {currentStep + 1} of {practice.steps}</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">{practice.title}</h1>
        {practice.description && (
          <p className="text-muted-foreground mb-4">{practice.description}</p>
        )}

        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <LiquidGlassCard className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium">
            {currentPrompt?.prompt_text || `Step ${currentStep + 1}`}
          </h2>
        </CardHeader>
        
        <CardContent>
          {/* Passage Reference */}
          {passageRef && currentStep === 0 && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Today's Passage:</p>
              <p className="font-medium">{passageRef}</p>
            </div>
          )}

          {/* Step Content */}
          {practice.slug === 'lectio_divina' && (
            <div className="space-y-4">
              {currentStep < 3 ? (
                <Textarea
                  placeholder="Write your thoughts and reflections..."
                  value={stepData[currentStep] || ''}
                  onChange={(e) => handleStepDataChange(currentStep, e.target.value)}
                  className="min-h-32 resize-none"
                />
              ) : (
                // Contemplation step - just timer
                <div className="text-center py-8">
                  <div className="text-4xl font-light mb-4">{formatTime(timerSeconds)}</div>
                  <p className="text-muted-foreground">
                    Rest in God's presence. Simply be with God.
                  </p>
                </div>
              )}
            </div>
          )}

          {practice.slug === 'daily_examen' && (
            <Textarea
              placeholder="Reflect on your day and God's presence..."
              value={stepData[currentStep] || ''}
              onChange={(e) => handleStepDataChange(currentStep, e.target.value)}
              className="min-h-32 resize-none"
            />
          )}

          {practice.slug === 'breath_prayer' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your prayer phrase (e.g., 'Jesus, mercy' or 'Be still, my soul')"
                value={stepData[currentStep] || ''}
                onChange={(e) => handleStepDataChange(currentStep, e.target.value)}
                className="min-h-20 resize-none"
              />
              <div className="text-center py-8">
                <div className="text-4xl font-light mb-4">{formatTime(timerSeconds)}</div>
                <p className="text-muted-foreground">
                  Breathe slowly and pray your phrase with each breath.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </LiquidGlassCard>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <LiquidGlassButton
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </LiquidGlassButton>

        <div className="flex gap-2">
          <LiquidGlassButton
            variant="ghost"
            onClick={saveProgress}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </LiquidGlassButton>

          {currentStep < practice.steps - 1 ? (
            <LiquidGlassButton onClick={nextStep}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </LiquidGlassButton>
          ) : (
            <LiquidGlassButton onClick={completeSession}>
              <Check className="w-4 h-4 mr-2" />
              Complete Practice
            </LiquidGlassButton>
          )}
        </div>
      </div>
    </div>
  );
}