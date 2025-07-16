/**
 * Performance Mode Toggle Button - Direct user control for performance optimization
 * Floating button with clear visual feedback for performance state
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAdaptivePerformance } from './AdaptivePerformanceManager';
import { Monitor, MonitorOff } from 'lucide-react';

interface PerformanceModeToggleProps {
  className?: string;
}

export const PerformanceModeToggle: React.FC<PerformanceModeToggleProps> = ({ 
  className = '' 
}) => {
  const { 
    performanceLevel, 
    isEmergencyMode, 
    enablePerformanceMode, 
    disablePerformanceMode,
    metrics 
  } = useAdaptivePerformance();

  // Check if manual performance mode is active (emergency + low FPS indicates manual mode)
  const isPerformanceModeActive = isEmergencyMode || performanceLevel.level === 'low';

  const handleToggle = () => {
    if (isPerformanceModeActive) {
      disablePerformanceMode();
    } else {
      enablePerformanceMode();
    }
  };

  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <Button
        onClick={handleToggle}
        variant={isPerformanceModeActive ? "destructive" : "outline"}
        size="sm"
        className={`
          backdrop-blur-md border font-medium select-none cursor-pointer
          transition-all duration-200 ease-out
          ${isPerformanceModeActive 
            ? 'bg-destructive/90 text-destructive-foreground border-destructive/50 hover:bg-destructive/95 shadow-lg' 
            : 'bg-background/80 text-foreground border-border/50 hover:bg-background/90 hover:border-border/70'
          }
        `}
      >
        {isPerformanceModeActive ? (
          <>
            <MonitorOff className="mr-2 h-4 w-4" />
            ON
          </>
        ) : (
          <>
            <Monitor className="mr-2 h-4 w-4" />
            OFF
          </>
        )}
      </Button>
      
      {/* Performance indicator when active */}
      {isPerformanceModeActive && (
        <div className="mt-2 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded text-xs animate-fade-in">
          <div className="font-semibold">⚡ Performance Mode</div>
          <div className="text-xs opacity-75">
            FPS: {metrics.currentFPS} | {performanceLevel.level.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};