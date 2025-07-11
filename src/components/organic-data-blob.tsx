/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo } from 'react';
import { DataBlobType } from './data-blob-ring';

interface OrganicDataBlobProps {
  x: number;
  y: number;
  size: number;
  intensity: number;
  duration: number;
  type: DataBlobType;
  time: number;
  index: number;
  opacity: number;
  colors: {
    primary: string;
    secondary: string;
    glow: string;
  };
  onHover?: (hovered: boolean) => void;
  isHovered?: boolean;
}

export const OrganicDataBlob: React.FC<OrganicDataBlobProps> = ({
  x,
  y,
  size,
  intensity,
  duration,
  type,
  time,
  index,
  opacity,
  colors,
  onHover,
  isHovered = false
}) => {
  const pathData = useMemo(() => {
    const baseRadius = size;
    const pulseScale = 1 + Math.sin(time * 2 + index) * (intensity * 0.15);
    const breatheScale = 1 + Math.sin(time * 0.8 + index * 0.3) * 0.1;
    const finalSize = baseRadius * pulseScale * breatheScale;
    
    switch (type) {
      case 'sleep': {
        // Droplet/teardrop shape for sleep - soft, flowing
        const width = finalSize;
        const height = finalSize * (1 + duration * 0.5); // Duration affects elongation
        const deform = Math.sin(time * 0.5 + index) * (intensity * 0.2);
        
        return `M ${x} ${y - height/2}
                C ${x + width/2 + deform} ${y - height/3} 
                  ${x + width/2 + deform} ${y + height/3} 
                  ${x} ${y + height/2}
                C ${x - width/2 - deform} ${y + height/3} 
                  ${x - width/2 - deform} ${y - height/3} 
                  ${x} ${y - height/2} Z`;
      }
      
      case 'mood': {
        // Petal/flower shape for mood - organic, emotional
        const petals = 5;
        const outerRadius = finalSize;
        const innerRadius = finalSize * 0.6;
        const emotion = Math.sin(time * 1.5 + index) * (intensity * 0.3);
        
        let path = '';
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          const nextAngle = ((i + 1) / petals) * Math.PI * 2;
          
          const outerX = x + Math.cos(angle) * (outerRadius + emotion);
          const outerY = y + Math.sin(angle) * (outerRadius + emotion);
          const innerX = x + Math.cos(angle + Math.PI / petals) * innerRadius;
          const innerY = y + Math.sin(angle + Math.PI / petals) * innerRadius;
          const nextOuterX = x + Math.cos(nextAngle) * (outerRadius + emotion);
          const nextOuterY = y + Math.sin(nextAngle) * (outerRadius + emotion);
          
          if (i === 0) {
            path += `M ${outerX} ${outerY}`;
          }
          
          path += ` Q ${innerX} ${innerY} ${nextOuterX} ${nextOuterY}`;
        }
        path += ' Z';
        
        return path;
      }
      
      case 'mobility': {
        // Dynamic wave/energy shape for mobility - angular, kinetic
        const segments = 8;
        const wave = Math.sin(time * 3 + index) * (intensity * 0.4);
        const movement = Math.cos(time * 2 + index) * (duration * 0.3);
        
        let path = '';
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const radius = finalSize + 
                        Math.sin(angle * 3 + time + index) * (intensity * finalSize * 0.3) +
                        wave + movement;
          
          const pointX = x + Math.cos(angle) * radius;
          const pointY = y + Math.sin(angle) * radius;
          
          if (i === 0) {
            path += `M ${pointX} ${pointY}`;
          } else {
            path += ` L ${pointX} ${pointY}`;
          }
        }
        path += ' Z';
        
        return path;
      }
      
      default:
        // Fallback circle
        return `M ${x - finalSize} ${y} 
                A ${finalSize} ${finalSize} 0 1 1 ${x + finalSize} ${y}
                A ${finalSize} ${finalSize} 0 1 1 ${x - finalSize} ${y}`;
    }
  }, [x, y, size, intensity, duration, type, time, index]);

  const gradientId = `organic-gradient-${type}-${index}`;
  const filterId = `organic-glow-${type}-${index}`;

  return (
    <g>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
          <stop offset="40%" stopColor={colors.primary} stopOpacity="0.8" />
          <stop offset="80%" stopColor={colors.secondary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2" />
        </radialGradient>
        
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={isHovered ? "4" : "2"} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main organic shape */}
      <path
        d={pathData}
        fill={`url(#${gradientId})`}
        opacity={isHovered ? 1 : opacity}
        filter={`url(#${filterId})`}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
        className="transition-all duration-300 ease-out cursor-pointer"
        style={{
          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          transformOrigin: `${x}px ${y}px`
        }}
      />
      
      {/* Subtle inner highlight for depth */}
      <path
        d={pathData}
        fill="none"
        stroke={colors.glow}
        strokeWidth={isHovered ? "1.5" : "0.8"}
        opacity={opacity * 0.6}
        className="pointer-events-none transition-all duration-300"
        style={{
          transform: isHovered ? 'scale(0.8)' : 'scale(0.7)',
          transformOrigin: `${x}px ${y}px`
        }}
      />
    </g>
  );
};