/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TimeScale } from './fractal-time-zoom-manager';

interface ZoomDialControlProps {
  currentScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
  disabled?: boolean;
  className?: string;
}

const scaleHierarchy: TimeScale[] = ['day', 'week', 'month', 'year'];
const scaleLabels = {
  day: 'D',
  week: 'W', 
  month: 'M',
  year: 'Y'
};

export const ZoomDialControl: React.FC<ZoomDialControlProps> = ({
  currentScale,
  onScaleChange,
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dialRef = useRef<SVGSVGElement>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  // Calculate rotation from current scale
  useEffect(() => {
    const currentIndex = scaleHierarchy.indexOf(currentScale);
    const targetRotation = (currentIndex / (scaleHierarchy.length - 1)) * 270; // 0-270 degrees
    setRotation(targetRotation);
  }, [currentScale]);

  // Update center reference
  useEffect(() => {
    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;

    const center = centerRef.current;
    const deltaX = e.clientX - center.x;
    const deltaY = e.clientY - center.y;
    
    // Calculate angle from center
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    // Normalize to 0-360
    const normalizedAngle = ((angle + 360) % 360);
    
    // Map to our 270-degree range (starting from top)
    let dialAngle = normalizedAngle - 90; // Offset so 0 degrees is at top
    if (dialAngle < 0) dialAngle += 360;
    
    // Clamp to 270 degree range
    dialAngle = Math.max(0, Math.min(270, dialAngle));
    
    // Convert to scale index
    const scaleIndex = Math.round((dialAngle / 270) * (scaleHierarchy.length - 1));
    const newScale = scaleHierarchy[scaleIndex];
    
    if (newScale !== currentScale) {
      onScaleChange(newScale);
    }
  }, [isDragging, disabled, currentScale, onScaleChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    
    // Update center for touch
    if (dialRef.current) {
      const rect = dialRef.current.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || disabled || !e.touches[0]) return;
    
    const touch = e.touches[0];
    const center = centerRef.current;
    const deltaX = touch.clientX - center.x;
    const deltaY = touch.clientY - center.y;
    
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const normalizedAngle = ((angle + 360) % 360);
    
    let dialAngle = normalizedAngle - 90;
    if (dialAngle < 0) dialAngle += 360;
    dialAngle = Math.max(0, Math.min(270, dialAngle));
    
    const scaleIndex = Math.round((dialAngle / 270) * (scaleHierarchy.length - 1));
    const newScale = scaleHierarchy[scaleIndex];
    
    if (newScale !== currentScale) {
      onScaleChange(newScale);
    }
  }, [isDragging, disabled, currentScale, onScaleChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  return (
    <div className={`zoom-dial-control ${className}`}>
      <svg
        ref={dialRef}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className={`cursor-pointer transition-opacity duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <defs>
          <linearGradient id="dial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(45 70% 60%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(45 90% 70%)" stopOpacity="0.6" />
          </linearGradient>
          
          <filter id="dial-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Dial background track */}
        <path
          d="M 40 10 A 30 30 0 0 1 67.32 57.32"
          fill="none"
          stroke="hsl(45 30% 40%)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Scale markers */}
        {scaleHierarchy.map((scale, index) => {
          const angle = (index / (scaleHierarchy.length - 1)) * 270 - 90;
          const markerRadius = 32;
          const x = 40 + Math.cos(angle * Math.PI / 180) * markerRadius;
          const y = 40 + Math.sin(angle * Math.PI / 180) * markerRadius;
          const isActive = scale === currentScale;
          
          return (
            <g key={scale}>
              <circle
                cx={x}
                cy={y}
                r={isActive ? 6 : 4}
                fill={isActive ? "hsl(45 80% 70%)" : "hsl(45 50% 50%)"}
                opacity={isActive ? 1 : 0.6}
                filter={isActive ? "url(#dial-glow)" : undefined}
                className="transition-all duration-300"
              />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                className="text-xs font-medium fill-white"
                opacity={isActive ? 1 : 0.7}
              >
                {scaleLabels[scale]}
              </text>
            </g>
          );
        })}

        {/* Active track */}
        <path
          d="M 40 10 A 30 30 0 0 1 67.32 57.32"
          fill="none"
          stroke="url(#dial-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - (rotation / 270) * 100}
          filter="url(#dial-glow)"
          className="transition-all duration-300"
        />

        {/* Center indicator */}
        <circle
          cx="40"
          cy="40"
          r="8"
          fill="hsl(45 60% 55%)"
          stroke="hsl(45 80% 70%)"
          strokeWidth="2"
          filter="url(#dial-glow)"
        />
        
        {/* Pointer */}
        <g transform={`rotate(${rotation - 90} 40 40)`}>
          <line
            x1="40"
            y1="40"
            x2="40"
            y2="18"
            stroke="hsl(45 90% 80%)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#dial-glow)"
          />
          <circle
            cx="40"
            cy="18"
            r="3"
            fill="hsl(45 100% 85%)"
            filter="url(#dial-glow)"
          />
        </g>
      </svg>
      
      <div className="text-center mt-1">
        <div className="text-xs text-white/60">temporal scale</div>
        <div className="text-sm text-yellow-200 font-medium capitalize">
          {currentScale}
        </div>
      </div>
    </div>
  );
};