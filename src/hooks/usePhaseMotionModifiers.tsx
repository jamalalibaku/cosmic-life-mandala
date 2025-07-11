/**
 * [Lap 12: Future Jamal Features]
 * Phase Motion Modifiers - Emotion-based animation variants
 * 
 * Purpose: Let each life phase feel like a different tempo/rhythm
 * Features: Phase-specific motion parameters, breathing patterns, energy levels
 */

import { useMemo } from 'react';
import { LifePhase } from '@/utils/life-phase-detection';
import { MotionConfig } from '@/hooks/useUnifiedMotion';

export interface PhaseMotionProfile {
  pulseSpeed: number;
  driftStrength: number;
  glowRate: number;
  breathingDepth: number;
  energyLevel: number;
  directionality: 'inward' | 'outward' | 'horizontal' | 'spiral' | 'still';
  animationPersonality: string;
}

export const usePhaseMotionModifiers = (currentPhase?: LifePhase | null): {
  motionProfile: PhaseMotionProfile;
  motionConfigOverrides: Partial<MotionConfig>;
  animationClasses: string;
} => {
  
  const motionProfile = useMemo((): PhaseMotionProfile => {
    if (!currentPhase) {
      return {
        pulseSpeed: 1.0,
        driftStrength: 0.5,
        glowRate: 1.0,
        breathingDepth: 0.02,
        energyLevel: 0.5,
        directionality: 'horizontal',
        animationPersonality: 'neutral'
      };
    }

    const phaseProfiles: Record<LifePhase, PhaseMotionProfile> = {
      awakening: {
        pulseSpeed: 1.4,           // Faster, more alert
        driftStrength: 0.8,        // Higher energy movement
        glowRate: 1.3,             // Brighter, more vibrant
        breathingDepth: 0.035,     // Deeper breaths, awakening
        energyLevel: 0.8,          // High energy
        directionality: 'outward', // Expanding awareness
        animationPersonality: 'awakening'
      },
      
      building: {
        pulseSpeed: 1.2,           // Steady, focused rhythm
        driftStrength: 0.3,        // Controlled, purposeful movement
        glowRate: 1.1,             // Warm, steady glow
        breathingDepth: 0.025,     // Controlled breathing
        energyLevel: 0.7,          // Sustained energy
        directionality: 'inward',  // Focused inward
        animationPersonality: 'focused'
      },
      
      flowing: {
        pulseSpeed: 0.9,           // Relaxed, natural rhythm
        driftStrength: 0.7,        // Gentle, flowing movement
        glowRate: 0.8,             // Soft, flowing glow
        breathingDepth: 0.04,      // Deep, natural breathing
        energyLevel: 0.6,          // Moderate, sustained energy
        directionality: 'horizontal', // Side-to-side flow
        animationPersonality: 'flowing'
      },
      
      deepening: {
        pulseSpeed: 0.6,           // Slow, contemplative
        driftStrength: 0.2,        // Minimal movement
        glowRate: 0.5,             // Subtle, deep glow
        breathingDepth: 0.015,     // Shallow, meditative breathing
        energyLevel: 0.3,          // Low, conserved energy
        directionality: 'inward',  // Deep introspection
        animationPersonality: 'meditative'
      },
      
      integrating: {
        pulseSpeed: 1.0,           // Balanced rhythm
        driftStrength: 0.5,        // Balanced movement
        glowRate: 1.0,             // Even, integrated glow
        breathingDepth: 0.03,      // Balanced breathing
        energyLevel: 0.6,          // Balanced energy
        directionality: 'spiral',  // Integrative spiral motion
        animationPersonality: 'balanced'
      },
      
      releasing: {
        pulseSpeed: 0.7,           // Slower, releasing rhythm
        driftStrength: 0.6,        // Gentle outward movement
        glowRate: 0.6,             // Fading, releasing glow
        breathingDepth: 0.045,     // Deep exhale focus
        energyLevel: 0.4,          // Lower energy, letting go
        directionality: 'outward', // Releasing outward
        animationPersonality: 'releasing'
      },
      
      renewing: {
        pulseSpeed: 1.3,           // Fresh, renewing rhythm
        driftStrength: 0.9,        // Vibrant, new movement
        glowRate: 1.2,             // Bright, fresh glow
        breathingDepth: 0.04,      // Fresh, renewed breathing
        energyLevel: 0.8,          // High, renewed energy
        directionality: 'spiral',  // Upward spiral renewal
        animationPersonality: 'vibrant'
      }
    };

    return phaseProfiles[currentPhase];
  }, [currentPhase]);

  const motionConfigOverrides = useMemo((): Partial<MotionConfig> => {
    return {
      heartbeatIntensity: motionProfile.pulseSpeed * 0.025,
      heartbeatInterval: 3000 / motionProfile.pulseSpeed,
      
      driftSpeed: motionProfile.driftStrength * 0.0008,
      windStrength: motionProfile.driftStrength * 0.0015,
      
      breathingDepth: motionProfile.breathingDepth,
      breathingCycle: 6000 / Math.max(0.5, motionProfile.glowRate),
      
      // Adjust friction based on energy level
      friction: 0.99 - (motionProfile.energyLevel * 0.02),
      
      // Adjust gravity based on directionality
      gravity: motionProfile.directionality === 'inward' ? 0.002 : 
               motionProfile.directionality === 'outward' ? 0.0005 : 0.001
    };
  }, [motionProfile]);

  const animationClasses = useMemo(() => {
    const baseClasses = 'transition-all duration-500 ease-out';
    
    const personalityClasses = {
      awakening: 'animate-pulse brightness-110',
      focused: 'contrast-105 saturate-110',
      flowing: 'brightness-95 saturate-90',
      meditative: 'brightness-90 contrast-90',
      balanced: 'brightness-100 saturate-100',
      releasing: 'brightness-85 saturate-80 opacity-90',
      vibrant: 'brightness-115 saturate-120 contrast-105',
      neutral: 'brightness-100'
    };

    return `${baseClasses} ${personalityClasses[motionProfile.animationPersonality] || personalityClasses.neutral}`;
  }, [motionProfile.animationPersonality]);

  return {
    motionProfile,
    motionConfigOverrides,
    animationClasses
  };
};