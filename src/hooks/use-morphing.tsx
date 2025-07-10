/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect, useCallback } from 'react';

interface MorphData {
  intensity: number;   // 0-1 how strong the data is
  duration: number;    // in minutes how long the event lasts
  emotion?: 'stress' | 'joy' | 'focus' | 'drift' | 'calm';
  timestamp?: number;  // when this data occurred
}

interface MorphState {
  scale: number;       // base scale multiplier
  curvature: number;   // how curved the segment becomes
  sharpness: number;   // how pointy vs smooth
  gravityOffset: number; // how much it pulls toward/away from center
}

export const useMorphing = (data: MorphData, isActive: boolean = true) => {
  const [morphState, setMorphState] = useState<MorphState>({
    scale: 1,
    curvature: 0,
    sharpness: 0,
    gravityOffset: 0
  });

  const calculateMorph = useCallback((morphData: MorphData) => {
    // Base scale from intensity
    const intensityScale = 0.8 + (morphData.intensity * 0.4); // 0.8 to 1.2

    // Curvature from duration (longer events = smoother curves)
    const durationCurvature = Math.min(morphData.duration / 120, 1); // normalize to 2h max

    // Sharpness from emotion
    const emotionSharpness = (() => {
      switch (morphData.emotion) {
        case 'stress': return 0.8;
        case 'joy': return 0.2;
        case 'focus': return 0.6;
        case 'drift': return 0.1;
        case 'calm': return 0.0;
        default: return 0.3;
      }
    })();

    // Gravity based on energy level (high intensity pulls outward)
    const gravityOffset = (morphData.intensity - 0.5) * 20; // -10 to +10 pixels

    return {
      scale: intensityScale,
      curvature: durationCurvature,
      sharpness: emotionSharpness,
      gravityOffset
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      setMorphState({ scale: 1, curvature: 0, sharpness: 0, gravityOffset: 0 });
      return;
    }

    const targetMorph = calculateMorph(data);
    
    // Smooth transition to new morph state
    const duration = 1000; // 1 second transition
    const startTime = Date.now();
    const startMorph = { ...morphState };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation
      const eased = 1 - Math.pow(1 - progress, 3);

      setMorphState({
        scale: startMorph.scale + (targetMorph.scale - startMorph.scale) * eased,
        curvature: startMorph.curvature + (targetMorph.curvature - startMorph.curvature) * eased,
        sharpness: startMorph.sharpness + (targetMorph.sharpness - startMorph.sharpness) * eased,
        gravityOffset: startMorph.gravityOffset + (targetMorph.gravityOffset - startMorph.gravityOffset) * eased
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [data, isActive, calculateMorph]);

  // Generate SVG path for morphed segment
  const generateMorphedPath = useCallback((
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const adjustedInnerRadius = innerRadius + morphState.gravityOffset;
    const adjustedOuterRadius = (outerRadius + morphState.gravityOffset) * morphState.scale;
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate control points for curvature
    const midAngle = (startRad + endRad) / 2;
    const curvatureOffset = morphState.curvature * 15; // Max 15 pixel curve
    
    // Inner arc points
    const innerStart = {
      x: centerX + Math.cos(startRad) * adjustedInnerRadius,
      y: centerY + Math.sin(startRad) * adjustedInnerRadius
    };
    const innerEnd = {
      x: centerX + Math.cos(endRad) * adjustedInnerRadius,
      y: centerY + Math.sin(endRad) * adjustedInnerRadius
    };
    
    // Outer arc points with curvature
    const outerStart = {
      x: centerX + Math.cos(startRad) * adjustedOuterRadius,
      y: centerY + Math.sin(startRad) * adjustedOuterRadius
    };
    const outerEnd = {
      x: centerX + Math.cos(endRad) * adjustedOuterRadius,
      y: centerY + Math.sin(endRad) * adjustedOuterRadius
    };
    
    // Curvature control point
    const curveControl = {
      x: centerX + Math.cos(midAngle) * (adjustedOuterRadius + curvatureOffset),
      y: centerY + Math.sin(midAngle) * (adjustedOuterRadius + curvatureOffset)
    };

    // Build path with sharpness consideration
    if (morphState.sharpness > 0.5) {
      // Sharp/spiky path
      return `M ${innerStart.x} ${innerStart.y} 
              L ${outerStart.x} ${outerStart.y} 
              L ${curveControl.x} ${curveControl.y}
              L ${outerEnd.x} ${outerEnd.y} 
              L ${innerEnd.x} ${innerEnd.y} Z`;
    } else {
      // Smooth curved path
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
      
      return `M ${innerStart.x} ${innerStart.y} 
              L ${outerStart.x} ${outerStart.y} 
              Q ${curveControl.x} ${curveControl.y} ${outerEnd.x} ${outerEnd.y}
              L ${innerEnd.x} ${innerEnd.y} 
              A ${adjustedInnerRadius} ${adjustedInnerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y} Z`;
    }
  }, [morphState]);

  return {
    morphState,
    generateMorphedPath,
    isActive
  };
};