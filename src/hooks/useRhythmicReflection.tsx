/**
 * [Lap 12: Future Jamal Features]
 * Rhythmic Reflection Engine - Gentle awareness reminders during active sessions
 * 
 * Purpose: Create a breathing system that periodically invites reflection
 * Features: Smart timing, poetic prompts, dismissible awareness
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { LifePhase } from '@/utils/life-phase-detection';

export interface ReflectionPrompt {
  id: string;
  text: string;
  poeticHint?: string;
  phase?: LifePhase;
  sophisticationLevel?: number;
  timestamp: string;
}

interface ReflectionState {
  currentPrompt: ReflectionPrompt | null;
  isVisible: boolean;
  dismissCount: number;
  lastPromptTime: number;
  sessionStartTime: number;
}

const REFLECTION_INTERVAL = 15 * 60 * 1000; // 15 minutes
const MIN_ACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes minimum before first prompt

export const useRhythmicReflection = (
  isActive: boolean = true,
  currentPhase?: LifePhase | null,
  sophisticationLevel: number = 1
) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [reflectionState, setReflectionState] = useState<ReflectionState>({
    currentPrompt: null,
    isVisible: false,
    dismissCount: 0,
    lastPromptTime: 0,
    sessionStartTime: Date.now()
  });

  // Phase-aware reflection prompts
  const generateReflectionPrompt = useCallback((phase?: LifePhase | null, level: number = 1): ReflectionPrompt => {
    const basePrompts = {
      awakening: [
        { text: "Pause. What new awareness is stirring?", poeticHint: "Something fresh wants to be seen..." },
        { text: "What's awakening in your inner landscape?", poeticHint: "The dawn of understanding approaches..." },
        { text: "Notice what feels different now than before.", poeticHint: "Change whispers before it speaks..." }
      ],
      building: [
        { text: "What are you constructing in your life right now?", poeticHint: "Every creation begins with intention..." },
        { text: "How are your foundations feeling today?", poeticHint: "Strong roots allow for tall growth..." },
        { text: "What needs your focused energy?", poeticHint: "Direction transforms potential into reality..." }
      ],
      flowing: [
        { text: "How does your natural rhythm feel today?", poeticHint: "The river knows its course..." },
        { text: "What wants to move through you?", poeticHint: "Flow requires both motion and surrender..." },
        { text: "Where do you feel most in harmony?", poeticHint: "Harmony is the music between the notes..." }
      ],
      deepening: [
        { text: "What wisdom is quietly emerging?", poeticHint: "The deepest insights arrive like gentle mist..." },
        { text: "How has your understanding shifted lately?", poeticHint: "Wisdom accumulates like sediment in still water..." },
        { text: "What truth feels ready to surface?", poeticHint: "The pearl forms in the darkness before it shines..." }
      ],
      integrating: [
        { text: "How are the pieces of your journey connecting?", poeticHint: "The tapestry reveals its pattern..." },
        { text: "What aspects of yourself are coming together?", poeticHint: "Unity emerges from acknowledged diversity..." },
        { text: "How do you feel your wholeness today?", poeticHint: "Integration is the art of being beautifully complete..." }
      ],
      releasing: [
        { text: "What feels ready to be released?", poeticHint: "Letting go creates space for what's meant to arrive..." },
        { text: "How does it feel to trust the process of change?", poeticHint: "Release is trust in the wisdom of flow..." },
        { text: "What are you making room for?", poeticHint: "Empty hands can receive the unexpected gift..." }
      ],
      renewing: [
        { text: "What fresh energy do you notice?", poeticHint: "Renewal begins as a whisper of possibility..." },
        { text: "How are you feeling renewed lately?", poeticHint: "Spring begins before winter fully ends..." },
        { text: "What new chapter wants to begin?", poeticHint: "Every ending is a beginning in disguise..." }
      ]
    };

    const genericPrompts = [
      { text: "Pause. What are you noticing right now?", poeticHint: "Awareness is the first gift..." },
      { text: "How does this moment feel in your body?", poeticHint: "The body holds the wisdom of the present..." },
      { text: "What's asking for your attention today?", poeticHint: "The important whispers before it shouts..." },
      { text: "What would you like to remember about now?", poeticHint: "This moment will never come again..." }
    ];

    const phasePrompts = phase ? basePrompts[phase] : null;
    const promptPool = phasePrompts || genericPrompts;
    
    // Select more sophisticated prompts for higher levels
    const selectedPrompt = level >= 3 
      ? promptPool[Math.floor(Math.random() * promptPool.length)]
      : promptPool[0]; // Use first (simpler) prompt for beginners

    return {
      id: `reflection-${Date.now()}`,
      text: selectedPrompt.text,
      poeticHint: selectedPrompt.poeticHint,
      phase,
      sophisticationLevel: level,
      timestamp: new Date().toISOString()
    };
  }, []);

  // Start the rhythmic reflection cycle
  const startReflectionCycle = useCallback(() => {
    if (!isActive) return;

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Wait for minimum activity time before first prompt
    activityTimeoutRef.current = setTimeout(() => {
      // Then start regular interval
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const timeSinceLastPrompt = now - reflectionState.lastPromptTime;
        
        // Only show if enough time has passed and no prompt is currently visible
        if (timeSinceLastPrompt >= REFLECTION_INTERVAL && !reflectionState.isVisible) {
          const prompt = generateReflectionPrompt(currentPhase, sophisticationLevel);
          
          setReflectionState(prev => ({
            ...prev,
            currentPrompt: prompt,
            isVisible: true,
            lastPromptTime: now
          }));
        }
      }, REFLECTION_INTERVAL);
    }, MIN_ACTIVITY_TIME);

  }, [isActive, currentPhase, sophisticationLevel, generateReflectionPrompt, reflectionState.lastPromptTime, reflectionState.isVisible]);

  // Stop the cycle
  const stopReflectionCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = undefined;
    }
  }, []);

  // Dismiss current prompt
  const dismissPrompt = useCallback((saveReflection?: string) => {
    if (saveReflection && reflectionState.currentPrompt) {
      // Store reflection in localStorage
      const reflections = JSON.parse(localStorage.getItem('rhythmic-reflections') || '[]');
      reflections.push({
        promptId: reflectionState.currentPrompt.id,
        promptText: reflectionState.currentPrompt.text,
        userReflection: saveReflection,
        timestamp: new Date().toISOString(),
        phase: currentPhase
      });
      localStorage.setItem('rhythmic-reflections', JSON.stringify(reflections));
    }

    setReflectionState(prev => ({
      ...prev,
      currentPrompt: null,
      isVisible: false,
      dismissCount: prev.dismissCount + 1
    }));
  }, [reflectionState.currentPrompt, currentPhase]);

  // Manually trigger a reflection prompt
  const triggerReflection = useCallback(() => {
    if (!reflectionState.isVisible) {
      const prompt = generateReflectionPrompt(currentPhase, sophisticationLevel);
      setReflectionState(prev => ({
        ...prev,
        currentPrompt: prompt,
        isVisible: true,
        lastPromptTime: Date.now()
      }));
    }
  }, [currentPhase, sophisticationLevel, generateReflectionPrompt, reflectionState.isVisible]);

  // Start/stop cycle based on activity
  useEffect(() => {
    if (isActive) {
      startReflectionCycle();
    } else {
      stopReflectionCycle();
    }

    return () => {
      stopReflectionCycle();
    };
  }, [isActive, startReflectionCycle, stopReflectionCycle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopReflectionCycle();
    };
  }, [stopReflectionCycle]);

  return {
    reflectionState,
    dismissPrompt,
    triggerReflection,
    isActive: isActive && reflectionState.isVisible,
    sessionDuration: Date.now() - reflectionState.sessionStartTime,
    promptHistory: JSON.parse(localStorage.getItem('rhythmic-reflections') || '[]')
  };
};