import React, { useMemo, useEffect, useState } from 'react';
import { goldenRatio, PHI } from '../utils/golden-ratio';

interface CosmicSunburstLayerProps {
  centerX: number;
  centerY: number;
  innerRadius: number;
  maxRadius: number;
  poetryMode?: boolean;
  theme?: 'sunfire' | 'moonshadow' | 'pastelwave';
  className?: string;
}

export const CosmicSunburstLayer: React.FC<CosmicSunburstLayerProps> = ({
  centerX,
  centerY,
  innerRadius,
  maxRadius,
  poetryMode = false,
  theme = 'sunfire',
  className = ''
}) => {
  const [time, setTime] = useState(0);

  // Breathing animation timer
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      setTime((Date.now() - startTime) / 1000);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Theme color palettes
  const themeColors = {
    sunfire: {
      primary: 'hsl(45 100% 70%)',
      secondary: 'hsl(35 90% 60%)',
      accent: 'hsl(25 80% 55%)',
      glow: 'hsl(45 100% 80%)',
      ribbon: 'hsl(40 95% 65%)'
    },
    moonshadow: {
      primary: 'hsl(230 50% 60%)',
      secondary: 'hsl(220 40% 50%)',
      accent: 'hsl(210 45% 45%)',
      glow: 'hsl(230 60% 70%)',
      ribbon: 'hsl(225 55% 65%)'
    },
    pastelwave: {
      primary: 'hsl(300 40% 70%)',
      secondary: 'hsl(280 35% 65%)',
      accent: 'hsl(260 40% 60%)',
      glow: 'hsl(300 50% 80%)',
      ribbon: 'hsl(290 45% 75%)'
    }
  };

  const colors = themeColors[theme];

  // Breathing scale calculation
  const breathingScale = useMemo(() => {
    return goldenRatio.breathingScale(time * 1000, 8000); // 8 second breathing cycle
  }, [time]);

  // Golden spiral flame shapes
  const flameShapes = useMemo(() => {
    const flameCount = 12;
    const flames = [];
    
    for (let i = 0; i < flameCount; i++) {
      const angle = (i / flameCount) * 360 + (time * 5); // Slow rotation
      const spiralRadius = innerRadius + (i / flameCount) * (maxRadius - innerRadius) * 0.6;
      
      // Golden spiral calculation
      const spiralAngle = angle + (i * PHI * 10);
      const rad = goldenRatio.toRadians(spiralAngle);
      
      const x = centerX + Math.cos(rad) * spiralRadius;
      const y = centerY + Math.sin(rad) * spiralRadius;
      
      // Flame shape using Bézier curves
      const flameHeight = 30 + Math.sin(time * 2 + i) * 10;
      const flameWidth = 8 + Math.sin(time * 1.5 + i * 0.5) * 3;
      
      flames.push({
        id: i,
        x,
        y,
        height: flameHeight,
        width: flameWidth,
        angle: spiralAngle,
        opacity: 0.3 + Math.sin(time + i) * 0.2
      });
    }
    
    return flames;
  }, [centerX, centerY, innerRadius, maxRadius, time]);

  // Golden ribbon trails
  const ribbonTrails = useMemo(() => {
    const trailCount = 8;
    const trails = [];
    
    for (let i = 0; i < trailCount; i++) {
      const baseAngle = (i / trailCount) * 360;
      const points = [];
      
      for (let r = innerRadius; r < maxRadius; r += 10) {
        const waveOffset = Math.sin((r / 30) + time + i) * 20;
        const angle = baseAngle + waveOffset;
        const rad = goldenRatio.toRadians(angle);
        
        points.push({
          x: centerX + Math.cos(rad) * r,
          y: centerY + Math.sin(rad) * r
        });
      }
      
      trails.push({
        id: i,
        points,
        opacity: 0.2 + Math.sin(time * 0.5 + i) * 0.1
      });
    }
    
    return trails;
  }, [centerX, centerY, innerRadius, maxRadius, time]);

  return (
    <g className={`cosmic-sunburst-layer ${className}`}>
      {/* Gradient definitions */}
      <defs>
        <radialGradient
          id={`cosmic-aura-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
          <stop offset="30%" stopColor={colors.primary} stopOpacity="0.6" />
          <stop offset="70%" stopColor={colors.secondary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.1" />
        </radialGradient>
        
        <linearGradient
          id={`flame-gradient-${theme}`}
          x1="0%"
          y1="100%"
          x2="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.8" />
          <stop offset="50%" stopColor={colors.primary} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.glow} stopOpacity="0.2" />
        </linearGradient>
        
        <filter id="cosmic-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Central breathing aura */}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius * breathingScale}
        fill={`url(#cosmic-aura-${theme})`}
        filter="url(#cosmic-glow)"
        opacity="0.4"
        className="pointer-events-none"
      />
      
      {/* Golden ribbon trails */}
      {ribbonTrails.map(trail => (
        <path
          key={`ribbon-${trail.id}`}
          d={`M ${trail.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
          fill="none"
          stroke={colors.ribbon}
          strokeWidth="1"
          opacity={trail.opacity}
          filter="url(#cosmic-glow)"
          className="pointer-events-none"
        />
      ))}
      
      {/* Spiral flame shapes */}
      {flameShapes.map(flame => (
        <g key={`flame-${flame.id}`} className="pointer-events-none">
          <ellipse
            cx={flame.x}
            cy={flame.y}
            rx={flame.width}
            ry={flame.height}
            fill={`url(#flame-gradient-${theme})`}
            opacity={flame.opacity}
            filter="url(#cosmic-glow)"
            transform={`rotate(${flame.angle} ${flame.x} ${flame.y})`}
          />
        </g>
      ))}
      
      {/* Floating layer labels (unless in poetry mode) */}
      {!poetryMode && (
        <g className="layer-labels">
          <text
            x={centerX}
            y={centerY - maxRadius - 20}
            textAnchor="middle"
            className="fill-yellow-200 text-sm font-light opacity-70"
            style={{
              transform: `translateY(${Math.sin(time * 0.5) * 3}px)`
            }}
          >
            cosmic timeline
          </text>
        </g>
      )}
      
      {/* Breathing pulse ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={innerRadius + 20}
        fill="none"
        stroke={colors.glow}
        strokeWidth="1"
        opacity={0.3 + Math.sin(time * 2) * 0.2}
        filter="url(#cosmic-glow)"
        className="pointer-events-none"
      />
    </g>
  );
};