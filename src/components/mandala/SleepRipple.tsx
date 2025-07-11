/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import mandalaExpressiveTheme from "@/themes/mandala-expressive";

interface SleepRippleProps {
  depth: number;  // 0 (deep) to 1 (light)
  phase: 'deep' | 'REM' | 'light';
  duration: number; // in minutes
}

export const SleepRipple = ({ depth, phase, duration }: SleepRippleProps) => {
  const baseRadius = 50;
  const r = baseRadius + (1 - depth) * 30; // Deeper sleep = smaller radius
  const color = mandalaExpressiveTheme.getSleepColor(phase);
  const strokeWidth = 2 + depth * 3; // Deeper sleep = thicker stroke
  const opacity = 0.4 + depth * 0.3; // Deeper sleep = more visible
  
  // Add complexity for REM sleep with multiple concentric circles
  if (phase === 'REM') {
    return (
      <g>
        <defs>
          <filter id="sleepGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle 
          cx={0} cy={0} r={r} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none" 
          opacity={opacity}
          filter="url(#sleepGlow)"
        />
        <circle 
          cx={0} cy={0} r={r - 10} 
          stroke={color} 
          strokeWidth={1} 
          fill="none" 
          opacity={opacity * 0.5}
          strokeDasharray="5,5"
        />
      </g>
    );
  }
  
  return (
    <circle 
      cx={0} cy={0} r={r} 
      stroke={color} 
      strokeWidth={strokeWidth} 
      fill="none" 
      opacity={opacity} 
    />
  );
};