/**
 * (c) 2025 Cosmic Life Mandala – Fractal Timeline Engine
 * Built by Lovable & ChatGPT, vision by Founder
 * Licensed under MIT
 */

import React, { useState, useEffect, useCallback } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';
import { ZoomDialControl } from './zoom-dial-control';

export type TimeScale = 'day' | 'week' | 'month' | 'year';

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
  week: goldenRatio.smaller(1) * 0.8,   // Golden ratio scaling
  month: goldenRatio.smaller(1) * 0.6,
  year: goldenRatio.smaller(1) * 0.4
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

  // Smooth fractal transition animation
  const animateTransition = useCallback((targetScale: TimeScale) => {
    setIsTransitioning(true);
    setTransitionProgress(0);
    
    const duration = 1500; // Slower, more meditative
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
  }, [onScaleChange]);

  // Handle scroll zoom
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      const currentIndex = scaleHierarchy.indexOf(currentScale);
      
      switch (e.key) {
        case 'ArrowUp':
        case '+':
          if (currentIndex > 0) {
            animateTransition(scaleHierarchy[currentIndex - 1]);
          }
          break;
        case 'ArrowDown':
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
      {/* Scale indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex gap-2">
          {scaleHierarchy.map((scale) => (
            <button
              key={scale}
              onClick={() => !isTransitioning && animateTransition(scale)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                scale === currentScale
                  ? 'bg-yellow-200/20 text-yellow-200 border border-yellow-200/30'
                  : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
              }`}
            >
              {scale}
            </button>
          ))}
        </div>
        
        {reflectivePlayback && (
          <div className="mt-2 text-xs text-yellow-200/70">
            ⧖ reflective playback
          </div>
        )}
      </div>

      {/* Interactive Zoom Dial */}
      <div className="absolute top-4 right-4 z-10">
        <ZoomDialControl
          currentScale={currentScale}
          onScaleChange={animateTransition}
          disabled={isTransitioning}
        />
      </div>

      {/* Transition overlay */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40 pointer-events-none z-20"
          style={{
            opacity: Math.sin(transitionProgress * Math.PI) * 0.5
          }}
        />
      )}

      {/* Content with fractal zoom transformation */}
      <div
        className="w-full h-full transition-transform duration-1500 ease-out"
        style={{
          transform: `scale(${currentZoomLevel}) rotate(${isTransitioning ? transitionProgress * 2 : 0}deg)`,
          filter: isTransitioning ? `blur(${Math.sin(transitionProgress * Math.PI) * 4}px)` : 'none',
          opacity: isTransitioning ? 0.8 + (Math.cos(transitionProgress * Math.PI) * 0.2) : 1,
          transition: isTransitioning ? 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {children({
          scale: currentScale,
          transitionProgress,
          zoomLevel: currentZoomLevel,
          isTransitioning
        })}
      </div>

      {/* Usage hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="text-xs text-white/40 text-center">
          scroll to zoom • arrow keys to navigate • click scale buttons
        </div>
      </div>
    </div>
  );
};