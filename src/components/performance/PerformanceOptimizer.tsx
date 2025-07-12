/**
 * Performance Optimizer - Emergency performance fixes
 * Addresses critical FPS drops seen in console logs
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSmoothFlowContext } from './SmoothFlowProvider';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const { currentFPS, performanceLevel } = useSmoothFlowContext();
  const [optimizationsApplied, setOptimizationsApplied] = useState<string[]>([]);
  const emergencyModeRef = useRef(false); // Always disabled for 100% result

  useEffect(() => {
    // PERFORMANCE OPTIMIZATIONS DISABLED - Show full visual experience
    // Emergency mode permanently disabled to show 100% result
    console.log('🎨 Performance optimizations disabled - showing 100% visual result');
  }, [currentFPS]);

  return (
    <>
      {children}
      
      {/* Performance status overlay - DISABLED for 100% result */}
      {false && optimizationsApplied.length > 0 && (
        <div className="fixed top-4 left-4 bg-destructive/90 text-destructive-foreground p-3 rounded-lg text-xs max-w-xs z-50">
          <div className="font-semibold mb-1">🚨 Performance Mode</div>
          <div className="space-y-1">
            {optimizationsApplied.map((opt, index) => (
              <div key={index}>• {opt}</div>
            ))}
          </div>
          <div className="text-xs opacity-75 mt-2">
            FPS: {Math.round(currentFPS)}
          </div>
        </div>
      )}
    </>
  );
};