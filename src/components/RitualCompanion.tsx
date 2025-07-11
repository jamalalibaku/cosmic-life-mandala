import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, Star, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Ritual, 
  RitualStep, 
  RitualSession, 
  getRitualsForPhase, 
  getRitualById,
  saveRitualSession 
} from '@/utils/ritual-library';
import { LifePhase } from '@/utils/life-phase-detection';
import { rippleEngine } from '@/utils/ripple-consciousness';

interface RitualCompanionProps {
  currentPhase: LifePhase;
  isOpen: boolean;
  onClose: () => void;
  centerX?: number;
  centerY?: number;
}

type RitualState = 'selection' | 'preparation' | 'active' | 'reflection' | 'complete';

export const RitualCompanion: React.FC<RitualCompanionProps> = ({
  currentPhase,
  isOpen,
  onClose,
  centerX = 350,
  centerY = 350
}) => {
  const { toast } = useToast();
  const [state, setState] = useState<RitualState>('selection');
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStartTime, setStepStartTime] = useState<Date | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [energyBefore, setEnergyBefore] = useState<number>(5);
  const [energyAfter, setEnergyAfter] = useState<number>(5);
  const [reflection, setReflection] = useState('');
  const [insights, setInsights] = useState<string[]>([]);

  const availableRituals = getRitualsForPhase(currentPhase);
  const currentStep = selectedRitual?.steps[currentStepIndex];

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setState('selection');
      setSelectedRitual(null);
      setCurrentStepIndex(0);
      setStepStartTime(null);
      setSessionStartTime(null);
      setEnergyBefore(5);
      setEnergyAfter(5);
      setReflection('');
      setInsights([]);
    }
  }, [isOpen]);

  const handleRitualSelect = (ritual: Ritual) => {
    setSelectedRitual(ritual);
    setState('preparation');
  };

  const handleStartRitual = () => {
    setSessionStartTime(new Date());
    setStepStartTime(new Date());
    setState('active');
    
    // Create consciousness event
    rippleEngine.createRitualEvent(centerX, centerY, currentPhase, selectedRitual!.id);
    
    toast({
      title: "Ritual Begun",
      description: `${selectedRitual!.name} has started with sacred intention.`,
    });
  };

  const handleNextStep = () => {
    if (!selectedRitual) return;
    
    if (currentStepIndex < selectedRitual.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setStepStartTime(new Date());
    } else {
      setState('reflection');
    }
  };

  const handleCompleteRitual = () => {
    if (!selectedRitual || !sessionStartTime) return;

    const session: RitualSession = {
      ritualId: selectedRitual.id,
      startTime: sessionStartTime.toISOString(),
      endTime: new Date().toISOString(),
      reflection,
      energyBefore,
      energyAfter,
      insights,
      phase: currentPhase
    };

    saveRitualSession(session);
    
    // Create completion consciousness event
    rippleEngine.createAwarenessEvent(centerX, centerY, currentPhase);
    
    setState('complete');
    
    toast({
      title: "Ritual Complete",
      description: selectedRitual.completionReward,
    });
  };

  const addInsight = (insight: string) => {
    if (insight.trim() && !insights.includes(insight.trim())) {
      setInsights([...insights, insight.trim()]);
    }
  };

  const renderSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Sacred Practices for {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose a ritual that resonates with your current season of becoming
        </p>
      </div>
      
      {availableRituals.map((ritual) => (
        <Card 
          key={ritual.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRitualSelect(ritual)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="text-lg">{ritual.name}</span>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {ritual.duration}m
              </Badge>
            </CardTitle>
            <CardDescription>{ritual.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              {ritual.intention}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPreparation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">{selectedRitual!.name}</h3>
        <p className="text-muted-foreground italic">{selectedRitual!.intention}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sacred Preparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Take {selectedRitual!.preparationTime} minutes to create sacred space. 
            Find a quiet place where you won't be disturbed.
          </p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your energy level right now (1-10):</label>
            <Slider
              value={[energyBefore]}
              onValueChange={(value) => setEnergyBefore(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground text-center">{energyBefore}/10</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setState('selection')}>
          Choose Different Ritual
        </Button>
        <Button onClick={handleStartRitual} className="flex-1">
          Begin Sacred Practice
        </Button>
      </div>
    </div>
  );

  const renderActive = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{selectedRitual!.name}</h3>
        <Badge variant="outline">
          Step {currentStepIndex + 1} of {selectedRitual!.steps.length}
        </Badge>
      </div>

      <Progress 
        value={((currentStepIndex + 1) / selectedRitual!.steps.length) * 100} 
        className="w-full"
      />

      {currentStep && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="w-4 h-4" />
              {currentStep.title}
            </CardTitle>
            <CardDescription>
              <Clock className="w-3 h-3 inline mr-1" />
              {currentStep.duration} minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{currentStep.description}</p>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm italic text-muted-foreground">
                {currentStep.guidance}
              </p>
            </div>
            
            <Button onClick={handleNextStep} className="w-full">
              {currentStepIndex < selectedRitual!.steps.length - 1 ? 'Next Step' : 'Complete Practice'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReflection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Sacred Reflection</h3>
        <p className="text-sm text-muted-foreground">
          Take a moment to receive what this practice has offered you
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your energy level after the practice (1-10):</label>
          <Slider
            value={[energyAfter]}
            onValueChange={(value) => setEnergyAfter(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground text-center">{energyAfter}/10</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">What arose for you during this practice?</label>
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Share any insights, feelings, or discoveries that emerged..."
            rows={4}
          />
        </div>

        {insights.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Insights gathered:</label>
            <div className="flex flex-wrap gap-2">
              {insights.map((insight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {insight}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={handleCompleteRitual} className="w-full">
        Complete Sacred Practice
      </Button>
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-8 h-8 text-primary" />
      </motion.div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Practice Complete</h3>
        <p className="text-muted-foreground italic mb-4">
          {selectedRitual!.completionReward}
        </p>
        
        <div className="bg-muted/20 p-4 rounded-lg text-sm">
          <p>Energy shift: {energyBefore} → {energyAfter}</p>
          {reflection && (
            <p className="mt-2 italic">"{reflection}"</p>
          )}
        </div>
      </div>

      <Button onClick={onClose} className="w-full">
        Return to Mandala
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Ritual Companion
          </DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state === 'selection' && renderSelection()}
            {state === 'preparation' && renderPreparation()}
            {state === 'active' && renderActive()}
            {state === 'reflection' && renderReflection()}
            {state === 'complete' && renderComplete()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};