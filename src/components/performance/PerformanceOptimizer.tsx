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
  const emergencyModeRef = useRef(false);

  useEffect(() => {
    // Emergency optimizations when FPS drops below 5
    if (currentFPS < 5 && !emergencyModeRef.current) {
      emergencyModeRef.current = true;
      
      const optimizations = [];
      
      // Disable non-essential animations
      const style = document.createElement('style');
      style.textContent = `
        /* Emergency performance mode */
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: -0.01ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
        }
        
        /* Disable transform animations */
        .animate-spin, .animate-pulse, .animate-bounce {
          animation: none !important;
        }
        
        /* Force hardware acceleration off for problematic elements */
        svg, canvas {
          will-change: auto !important;
          transform: translateZ(0) !important;
        }
      `;
      document.head.appendChild(style);
      optimizations.push('Disabled animations');

      // Reduce SVG complexity
      const svgs = document.querySelectorAll('svg');
      svgs.forEach(svg => {
        const paths = svg.querySelectorAll('path');
        if (paths.length > 20) {
          // Hide excess paths
          paths.forEach((path, index) => {
            if (index > 10) {
              (path as any).style.display = 'none';
            }
          });
        }
      });
      optimizations.push('Reduced SVG complexity');

      // Disable particle systems
      const particles = document.querySelectorAll('[data-particle], .particle');
      particles.forEach(particle => {
        (particle as HTMLElement).style.display = 'none';
      });
      optimizations.push('Disabled particles');

      setOptimizationsApplied(optimizations);

      console.warn('🚨 Emergency Performance Mode Activated', {
        currentFPS,
        optimizations
      });
    }
    
    // Reset emergency mode when performance improves
    if (currentFPS > 20 && emergencyModeRef.current) {
      emergencyModeRef.current = false;
      setOptimizationsApplied([]);
      
      // Remove emergency styles
      const emergencyStyles = document.querySelectorAll('style');
      emergencyStyles.forEach(style => {
        if (style.textContent?.includes('Emergency performance mode')) {
          style.remove();
        }
      });
      
      // Restore hidden elements
      const hiddenElements = document.querySelectorAll('[style*="display: none"]');
      hiddenElements.forEach(element => {
        (element as HTMLElement).style.display = '';
      });
      
      console.info('✅ Emergency Performance Mode Deactivated');
    }
  }, [currentFPS]);

  return (
    <>
      {children}
      
      {/* Performance status overlay */}
      {optimizationsApplied.length > 0 && (
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