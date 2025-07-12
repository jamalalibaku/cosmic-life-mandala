/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * ZIP11-GOLF: Kandinsky-Inspired Data Visualization Marbles
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useVisualSkin } from '../visual-skin-provider';
import { OrganicMotionDrift } from './OrganicMotionDrift';

interface DataMarble {
  id: string;
  x: number;
  y: number;
  type: 'mood' | 'sleep' | 'activity' | 'plan';
  value: number; // 0-1
  energy?: number; // 0-1
  timestamp: Date;
}

interface KandinskyDataMarblesProps {
  marbles: DataMarble[];
  className?: string;
}

export const KandinskyDataMarbles: React.FC<KandinskyDataMarblesProps> = ({
  marbles,
  className = ''
}) => {
  const { themeConfig, currentTheme } = useVisualSkin();

  const getMarbleStyle = (marble: DataMarble) => {
    const baseSize = 8 + (marble.value * 12); // 8-20px based on value
    const energy = marble.energy || 0.5;
    
    // Kandinsky-inspired shapes and colors
    switch (marble.type) {
      case 'mood':
        return {
          size: baseSize,
          shape: 'circle',
          color: `hsl(${45 + marble.value * 180} ${60 + energy * 30}% ${50 + marble.value * 20}%)`,
          strokeColor: themeConfig.colors.accent,
          strokeWidth: energy > 0.7 ? 2 : 1
        };
      
      case 'sleep':
        return {
          size: baseSize * 0.8,
          shape: 'crescent',
          color: `hsl(${240 + marble.value * 40} ${40 + energy * 20}% ${30 + marble.value * 30}%)`,
          strokeColor: themeConfig.colors.secondary,
          strokeWidth: 1
        };
      
      case 'activity':
        return {
          size: baseSize * 1.2,
          shape: 'spiral',
          color: `hsl(${0 + marble.value * 120} ${70 + energy * 20}% ${40 + marble.value * 20}%)`,
          strokeColor: themeConfig.colors.primary,
          strokeWidth: 2
        };
      
      case 'plan':
        return {
          size: baseSize,
          shape: 'triangle',
          color: `hsl(${280 + marble.value * 60} ${50 + energy * 30}% ${45 + marble.value * 25}%)`,
          strokeColor: themeConfig.colors.glow,
          strokeWidth: 1
        };
      
      default:
        return {
          size: baseSize,
          shape: 'circle',
          color: themeConfig.colors.primary,
          strokeColor: themeConfig.colors.accent,
          strokeWidth: 1
        };
    }
  };

  const renderMarbleShape = (marble: DataMarble, style: any) => {
    const { size, shape, color, strokeColor, strokeWidth } = style;
    
    switch (shape) {
      case 'circle':
        return (
          <motion.circle
            cx={marble.x}
            cy={marble.y}
            r={size / 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: currentTheme === 'vangogh' ? [0, 5, 0] : 0
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'crescent':
        return (
          <motion.path
            d={`M ${marble.x - size/2} ${marble.y} A ${size/2} ${size/2} 0 1 1 ${marble.x + size/2} ${marble.y} A ${size/3} ${size/3} 0 1 0 ${marble.x - size/2} ${marble.y} Z`}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'spiral':
        const spiralPath = [];
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          const r = (size / 2) * (1 - i / 3);
          const x = marble.x + Math.cos(angle) * r;
          const y = marble.y + Math.sin(angle) * r;
          spiralPath.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
        }
        
        return (
          <motion.path
            d={spiralPath.join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 1}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      case 'triangle':
        return (
          <motion.polygon
            points={`${marble.x},${marble.y - size/2} ${marble.x - size/2},${marble.y + size/2} ${marble.x + size/2},${marble.y + size/2}`}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: currentTheme === 'interface' ? [0, 90, 0] : [0, 10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <OrganicMotionDrift type="gentle-rotation" intensity={0.3} duration={90}>
      <g className={className}>
        <defs>
          {/* Enhanced blur filters */}
          <filter id="kandinsky-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {marbles.map((marble) => {
          const style = getMarbleStyle(marble);
          return (
            <OrganicMotionDrift key={marble.id} type="float-drift" intensity={0.2}>
              <g>
                {renderMarbleShape(marble, style)}
                
                {/* Enhanced glow effect with better blur */}
                {marble.value > 0.7 && (
                  <motion.circle
                    cx={marble.x}
                    cy={marble.y}
                    r={style.size * 1.2}
                    fill="none"
                    stroke={style.color}
                    strokeWidth={2}
                    opacity={0.4}
                    filter="url(#kandinsky-glow)"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </g>
            </OrganicMotionDrift>
          );
        })}
      </g>
    </OrganicMotionDrift>
  );
};