/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import mandalaExpressiveTheme from "@/themes/mandala-expressive";

interface EmotionalCreatureProps {
  startAngle: number;
  arcLength: number;
  intensity: number;
  valence: number;
  arousal: number;
  emotion: string;
}

export const EmotionalCreature = ({ startAngle, arcLength, intensity, valence, arousal, emotion }: EmotionalCreatureProps) => {
  const radius = 120 + intensity * 40; // Dynamic radius based on intensity
  const color = mandalaExpressiveTheme.getEmotionColor(emotion, valence, intensity);
  
  // Create organic, flowing path with bezier curves
  const endAngle = (arcLength * Math.PI) / 180;
  const curvature = valence * 20; // Positive valence curves upward, negative downward
  
  // Control points for bezier curves
  const midRadius = radius * (0.8 + arousal * 0.3);
  const cp1x = (radius * 0.6) * Math.cos(endAngle * 0.3);
  const cp1y = (radius * 0.6) * Math.sin(endAngle * 0.3) + curvature;
  const cp2x = (radius * 0.8) * Math.cos(endAngle * 0.7);
  const cp2y = (radius * 0.8) * Math.sin(endAngle * 0.7) + curvature;
  
  const endX = radius * Math.cos(endAngle);
  const endY = radius * Math.sin(endAngle);
  
  // Organic flowing path
  const path = `
    M 0 0 
    L ${radius * 0.4} 0 
    Q ${cp1x} ${cp1y} ${midRadius * Math.cos(endAngle * 0.5)} ${midRadius * Math.sin(endAngle * 0.5) + curvature * 0.5}
    Q ${cp2x} ${cp2y} ${endX} ${endY}
    L 0 0
  `;
  
  return (
    <g transform={`rotate(${startAngle})`}>
      <defs>
        <filter id={`emotionGlow-${emotion}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d={path} 
        fill={color} 
        opacity={0.6 + arousal * 0.2} 
        filter={`url(#emotionGlow-${emotion})`}
      />
    </g>
  );
};