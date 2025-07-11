/**
 * [Phase: ZIP9-Zeta | Lap 6: Thematic Integration of Day 4 Dynamics]
 * Theme Sunburst Renderer - Universal sunburst effects for all themes
 * 
 * Purpose: Render theme-specific sunburst/radiation effects
 * Features: Rays, pulses, shimmers, flickers, data nodes
 * Dependencies: day4-dynamics, theme-configs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '@/utils/theme-configs';
import { getSunburstEffect } from '@/utils/day4-dynamics';

interface ThemeSunburstProps {
  theme: Theme;
  centerX: number;
  centerY: number;
  timeAccumulator: number;
  isActive?: boolean;
}

export const ThemeSunburst: React.FC<ThemeSunburstProps> = ({
  theme,
  centerX,
  centerY,
  timeAccumulator,
  isActive = true
}) => {
  if (!isActive) return null;

  const effect = getSunburstEffect(theme, timeAccumulator, centerX, centerY);

  const renderCosmicRays = () => {
    const rays = [];
    const rayCount = 'rayCount' in effect ? effect.rayCount : 8;
    const rayLength = 'rayLength' in effect ? effect.rayLength : effect.reach;
    const rotation = 'rotation' in effect ? effect.rotation : 0;
    const opacity = 'opacity' in effect ? effect.opacity : 0.5;
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * 360 / rayCount) + rotation;
      const radian = (angle * Math.PI) / 180;
      const endX = centerX + rayLength * Math.cos(radian);
      const endY = centerY + rayLength * Math.sin(radian);
      
      rays.push(
        <motion.line
          key={`ray-${i}`}
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke={effect.color}
          strokeWidth="1"
          opacity={opacity}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
      );
    }
    return <g>{rays}</g>;
  };

  const renderInterfacePulse = () => {
    const radius = 'radius' in effect ? effect.radius : effect.reach;
    const strokeWidth = 'strokeWidth' in effect ? effect.strokeWidth : 2;
    const opacity = 'opacity' in effect ? effect.opacity : 0.5;
    
    return (
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={effect.color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        animate={{
          r: [radius * 0.5, radius, radius * 0.5],
          opacity: [opacity * 0.3, opacity, opacity * 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  };

  const renderMandalaShimmer = () => {
    const shimmerCount = 'shimmerCount' in effect ? effect.shimmerCount : 12;
    const shimmerRadius = 'shimmerRadius' in effect ? effect.shimmerRadius : effect.reach;
    const opacity = 'opacity' in effect ? effect.opacity : 0.5;
    
    const shimmers = [];
    for (let i = 0; i < shimmerCount; i++) {
      const angle = i * 360 / shimmerCount;
      const radian = (angle * Math.PI) / 180;
      const x = centerX + shimmerRadius * Math.cos(radian);
      const y = centerY + shimmerRadius * Math.sin(radian);
      
      shimmers.push(
        <motion.circle
          key={`shimmer-${i}`}
          cx={x}
          cy={y}
          r="3"
          fill={effect.color}
          opacity={opacity}
          animate={{
            scale: [0.5, 1.2, 0.5],
            opacity: [opacity * 0.3, opacity, opacity * 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      );
    }
    return <g>{shimmers}</g>;
  };

  const renderVanGoghFlicker = () => {
    const strokeCount = 'strokeCount' in effect ? effect.strokeCount : 6;
    const strokeLength = 'strokeLength' in effect ? effect.strokeLength : effect.reach;
    const flickerIntensity = 'flickerIntensity' in effect ? effect.flickerIntensity : 0.8;
    const opacity = 'opacity' in effect ? effect.opacity : 0.5;
    
    const strokes = [];
    for (let i = 0; i < strokeCount; i++) {
      const angle = (i * 60) + (Math.random() * 30 - 15); // Van Gogh-style irregular angles
      const radian = (angle * Math.PI) / 180;
      const length = strokeLength + (Math.random() * 20 - 10);
      const endX = centerX + length * Math.cos(radian);
      const endY = centerY + length * Math.sin(radian);
      
      // Van Gogh brush stroke path
      const controlX = centerX + (length * 0.6) * Math.cos(radian) + (Math.random() * 10 - 5);
      const controlY = centerY + (length * 0.6) * Math.sin(radian) + (Math.random() * 10 - 5);
      
      strokes.push(
        <motion.path
          key={`stroke-${i}`}
          d={`M ${centerX} ${centerY} Q ${controlX} ${controlY} ${endX} ${endY}`}
          stroke={effect.color}
          strokeWidth="2"
          fill="none"
          opacity={opacity * flickerIntensity}
          animate={{
            opacity: [opacity * 0.3, opacity * flickerIntensity, opacity * 0.2]
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      );
    }
    return <g>{strokes}</g>;
  };

  const renderHorizonsShimmer = () => {
    const shimmerRadius = 'shimmerRadius' in effect ? effect.shimmerRadius : effect.reach;
    const opacity = 'opacity' in effect ? effect.opacity : 0.3;
    
    const waves = [];
    for (let i = 0; i < 3; i++) {
      const radius = shimmerRadius + i * 15;
      waves.push(
        <motion.circle
          key={`wave-${i}`}
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={effect.color}
          strokeWidth="1"
          opacity={opacity * (1 - i * 0.3)}
          animate={{
            r: [radius * 0.8, radius * 1.2, radius * 0.8],
            opacity: [opacity * 0.1, opacity * (1 - i * 0.3), opacity * 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        />
      );
    }
    return <g>{waves}</g>;
  };

  const renderDataNodes = () => {
    const nodeCount = 'nodeCount' in effect ? effect.nodeCount : 16;
    const nodeRadius = 'nodeRadius' in effect ? effect.nodeRadius : effect.reach;
    const nodeSize = 'nodeSize' in effect ? effect.nodeSize : 2;
    const opacity = 'opacity' in effect ? effect.opacity : 0.6;
    
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = i * 360 / nodeCount;
      const radian = (angle * Math.PI) / 180;
      const x = centerX + nodeRadius * Math.cos(radian);
      const y = centerY + nodeRadius * Math.sin(radian);
      
      nodes.push(
        <motion.circle
          key={`node-${i}`}
          cx={x}
          cy={y}
          r={nodeSize}
          fill={effect.color}
          opacity={opacity}
          animate={{
            r: [nodeSize * 0.5, nodeSize * 1.5, nodeSize * 0.5],
            opacity: [opacity * 0.4, opacity, opacity * 0.4]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      );
    }
    return <g>{nodes}</g>;
  };

  // Render based on theme
  switch (theme) {
    case 'cosmic':
      return renderCosmicRays();
    case 'interface':
      return renderDataNodes();
    case 'mandala':
      return renderMandalaShimmer();
    case 'vangogh':
      return renderVanGoghFlicker();
    case 'horizons':
      return renderHorizonsShimmer();
    default:
      return renderCosmicRays();
  }
};