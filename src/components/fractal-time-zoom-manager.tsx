/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

import React, { useState, useEffect, useCallback } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';
import { DollyZoomTransition } from './cinematic/DollyZoomTransition';

export type TimeScale = 'day' | 'week' | 'month' | 'year' | 'side';

interface FractalTimeZoomManagerProps {
  currentScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
  children: (props: {
    scale: TimeScale;
    transitionProgress: number;
    zoomLevel: number;
    isTransitioning: boolean;
  }) => React.ReactNode;
  reflectivePlayback?: boolean;
  className?: string;
}

const scaleHierarchy: TimeScale[] = ['day', 'week', 'month', 'year'];
const zoomLevels = {
  day: 1,
  week: Math.max(goldenRatio.smaller(1) * 0.85, 0.7),   // Clamped minimum
  month: Math.max(goldenRatio.smaller(1) * 0.75, 0.6),
  year: Math.max(goldenRatio.smaller(1) * 0.65, 0.5)
};

export const FractalTimeZoomManager: React.FC<FractalTimeZoomManagerProps> = ({
  currentScale,
  onScaleChange,
  children,
  reflectivePlayback = false,
  className = ''
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Reflective playback animation
  useEffect(() => {
    if (!reflectivePlayback) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPlaybackTime(elapsed);
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [reflectivePlayback]);

  // Store previous scale for dolly-zoom transition
  const [previousScale, setPreviousScale] = useState<TimeScale>(currentScale);
  
  // Smooth fractal transition animation with dolly-zoom
  const animateTransition = useCallback((targetScale: TimeScale) => {
    if (isTransitioning) return; // Prevent overlapping transitions
    
    setPreviousScale(currentScale);
    setIsTransitioning(true);
    setTransitionProgress(0);
    
    const duration = 2000; // Extended for cinematic effect
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Triple-phase golden ratio easing for scale → morph → settle
      let easedProgress;
      if (progress < 0.3) {
        // Scale phase - gentle zoom
        easedProgress = Math.pow(progress / 0.3, 1 / PHI);
      } else if (progress < 0.7) {
        // Morph phase - segment transformation
        const morphProgress = (progress - 0.3) / 0.4;
        easedProgress = 0.3 + (morphProgress * 0.4);
      } else {
        // Settle phase - final positioning
        const settleProgress = (progress - 0.7) / 0.3;
        easedProgress = 0.7 + (Math.pow(settleProgress, PHI) * 0.3);
      }
      
      setTransitionProgress(easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        setTransitionProgress(0);
      }
    };
    
    requestAnimationFrame(animate);
    onScaleChange(targetScale);
  }, [currentScale, isTransitioning, onScaleChange]);

  // Scroll zoom disabled - now using manual controls
  // This prevents conflicts with page scrolling and provides more deliberate interaction
  /*
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning) return;
      
      e.preventDefault();
      const currentIndex = scaleHierarchy.indexOf(currentScale);
      
      if (e.deltaY > 0 && currentIndex < scaleHierarchy.length - 1) {
        // Zoom out
        animateTransition(scaleHierarchy[currentIndex + 1]);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        // Zoom in
        animateTransition(scaleHierarchy[currentIndex - 1]);
      }
    };

    const element = document.querySelector('.fractal-zoom-container');
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, [currentScale, isTransitioning, animateTransition]);
  */

  // Handle keyboard navigation with Z shortcuts and DWMY scale switching
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      const currentIndex = scaleHierarchy.indexOf(currentScale);
      
      switch (e.key.toLowerCase()) {
        // Z shortcuts for zoom
        case 'z':
          if (e.shiftKey) {
            // Shift + Z: zoom out
            if (currentIndex < scaleHierarchy.length - 1) {
              animateTransition(scaleHierarchy[currentIndex + 1]);
            }
          } else {
            // Z: zoom in
            if (currentIndex > 0) {
              animateTransition(scaleHierarchy[currentIndex - 1]);
            }
          }
          e.preventDefault();
          break;
        
        // Direct scale switching
        case 'd':
          animateTransition('day');
          e.preventDefault();
          break;
        case 'w':
          animateTransition('week');
          e.preventDefault();
          break;
        case 'm':
          animateTransition('month');
          e.preventDefault();
          break;
        case 'y':
          animateTransition('year');
          e.preventDefault();
          break;
        
        // Legacy arrow/plus/minus support
        case 'arrowup':
        case '+':
          if (currentIndex > 0) {
            animateTransition(scaleHierarchy[currentIndex - 1]);
          }
          break;
        case 'arrowdown':
        case '-':
          if (currentIndex < scaleHierarchy.length - 1) {
            animateTransition(scaleHierarchy[currentIndex + 1]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentScale, isTransitioning, animateTransition]);

  const currentZoomLevel = zoomLevels[currentScale];

  return (
    <div className={`fractal-zoom-container ${className}`}>

      {/* Interactive Zoom Dial - REMOVED */}
      {/* Replaced with ManualZoomControls in top-right position */}

      {/* Transition overlay */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40 pointer-events-none z-20"
          style={{
            opacity: Math.sin(transitionProgress * Math.PI) * 0.5
          }}
        />
      )}

      {/* Content with cinematic dolly-zoom transformation */}
      <DollyZoomTransition
        fromScale={previousScale}
        toScale={currentScale}
        isActive={isTransitioning}
        duration={2000}
        onComplete={() => {
          // Transition complete - cleanup handled by animateTransition
        }}
      >
        <div
          className="w-full h-full"
          style={{
            transform: `scale(${currentZoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {children({
            scale: currentScale,
            transitionProgress,
            zoomLevel: currentZoomLevel,
            isTransitioning
          })}
        </div>
      </DollyZoomTransition>

      {/* Usage hint - updated for manual controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-xs text-white/40 text-center">
          use zoom controls • D/W/M/Y keys • click scale buttons
        </div>
      </div>
    </div>
  );
};