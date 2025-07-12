/**
 * Frame Rate Monitor & Performance Controller
 * Real-time animation performance management
 */

import React, { useState, useEffect } from 'react';
import { useUltimateAnimationFlow } from '@/hooks/useUltimateAnimationFlow';

export const PerformanceMonitor: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
  const { metrics, isEmergencyMode, activeAnimationCount } = useUltimateAnimationFlow();
  const [isVisible, setIsVisible] = useState(false);

  // Show monitor when performance drops
  useEffect(() => {
    if (metrics.frameRate < 50 || activeAnimationCount > 8) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [metrics.frameRate, activeAnimationCount]);

  if (!showDetails && !isVisible) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return '#10B981'; // green
    if (fps >= 45) return '#F59E0B'; // yellow
    if (fps >= 30) return '#EF4444'; // red
    return '#DC2626'; // dark red
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono border border-white/20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: getPerformanceColor(metrics.frameRate) }}
          />
          <span>{metrics.frameRate} FPS</span>
        </div>
        
        <div className="text-white/60">
          {activeAnimationCount} animations
        </div>
        
        {isEmergencyMode && (
          <div className="text-red-400 font-bold">
            EMERGENCY MODE
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 space-y-1 text-xs text-white/50">
          <div>Dropped frames: {metrics.droppedFrames}</div>
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
        </div>
      )}
    </div>
  );
};