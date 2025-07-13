/**
 * Midnight Arc Burst - Inspired by Weather Report "Night Passage"
 * A radiant arc of color that bursts at midnight, tracing the past day like a solar flare
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MidnightArcBurstProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  isActive?: boolean;
  className?: string;
}

export const MidnightArcBurst: React.FC<MidnightArcBurstProps> = ({
  centerX,
  centerY,
  radius,
  theme,
  isActive = false,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMidnightBurst, setIsMidnightBurst] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for midnight trigger (within 30 seconds of midnight)
  useEffect(() => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Trigger midnight burst at 00:00:00 to 00:00:30
    const isMidnight = hours === 0 && minutes === 0 && seconds <= 30;
    
    if (isMidnight && !isMidnightBurst) {
      setIsMidnightBurst(true);
      // Reset after the animation completes (8 seconds)
      setTimeout(() => setIsMidnightBurst(false), 8000);
    }
  }, [currentTime, isMidnightBurst]);

  // Theme-specific colors for the arc burst
  const themeColors = useMemo(() => {
    const colors = {
      default: { 
        primary: 'hsl(45 100% 70%)', 
        secondary: 'hsl(30 90% 65%)',
        accent: 'hsl(60 80% 75%)'
      },
      tattoo: { 
        primary: 'hsl(0 100% 60%)', 
        secondary: 'hsl(15 90% 55%)',
        accent: 'hsl(345 80% 65%)'
      },
      floral: { 
        primary: 'hsl(300 80% 70%)', 
        secondary: 'hsl(320 70% 65%)',
        accent: 'hsl(280 90% 75%)'
      },
      techHUD: { 
        primary: 'hsl(180 100% 60%)', 
        secondary: 'hsl(160 90% 55%)',
        accent: 'hsl(200 80% 65%)'
      },
      vinyl: { 
        primary: 'hsl(45 90% 65%)', 
        secondary: 'hsl(35 80% 60%)',
        accent: 'hsl(55 70% 70%)'
      },
      noir: { 
        primary: 'hsl(240 50% 50%)', 
        secondary: 'hsl(220 60% 45%)',
        accent: 'hsl(260 40% 55%)'
      },
      pastelParadise: { 
        primary: 'hsl(280 60% 75%)', 
        secondary: 'hsl(300 50% 70%)',
        accent: 'hsl(260 70% 80%)'
      }
    };
    return colors[theme] || colors.default;
  }, [theme]);

  // Generate arc path for the past day trail
  const generateArcPath = (startAngle: number, endAngle: number, r: number) => {
    const start = {
      x: centerX + Math.cos((startAngle * Math.PI) / 180) * r,
      y: centerY + Math.sin((startAngle * Math.PI) / 180) * r
    };
    const end = {
      x: centerX + Math.cos((endAngle * Math.PI) / 180) * r,
      y: centerY + Math.sin((endAngle * Math.PI) / 180) * r
    };
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  if (!isMidnightBurst && !isActive) return null;

  return (
    <g className={`midnight-arc-burst ${className}`}>
      <defs>
        <radialGradient
          id={`midnight-gradient-${theme}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor={themeColors.accent} stopOpacity="1" />
          <stop offset="50%" stopColor={themeColors.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={themeColors.secondary} stopOpacity="0.3" />
        </radialGradient>
        
        <filter id="midnight-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="midnight-flare" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main arc burst - traces the full day (360 degrees) */}
      <motion.path
        d={generateArcPath(-90, 270, radius)}
        fill="none"
        stroke={`url(#midnight-gradient-${theme})`}
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#midnight-flare)"
        initial={{ 
          pathLength: 0, 
          opacity: 0,
          strokeWidth: 2
        }}
        animate={isMidnightBurst ? {
          pathLength: [0, 1],
          opacity: [0, 1, 1, 0],
          strokeWidth: [2, 12, 8, 4]
        } : {}}
        transition={{
          pathLength: { duration: 4, ease: "easeOut" },
          opacity: { duration: 8, times: [0, 0.2, 0.8, 1] },
          strokeWidth: { duration: 6, ease: "easeInOut" }
        }}
      />

      {/* Secondary arc layers for depth */}
      {[1, 2, 3].map((layer) => (
        <motion.path
          key={layer}
          d={generateArcPath(-90, 270, radius + layer * 15)}
          fill="none"
          stroke={themeColors.primary}
          strokeWidth={6 - layer}
          strokeLinecap="round"
          filter="url(#midnight-glow)"
          initial={{ 
            pathLength: 0, 
            opacity: 0
          }}
          animate={isMidnightBurst ? {
            pathLength: [0, 1],
            opacity: [0, 0.6 / layer, 0]
          } : {}}
          transition={{
            pathLength: { 
              duration: 4 + layer * 0.5, 
              ease: "easeOut",
              delay: layer * 0.3
            },
            opacity: { 
              duration: 6, 
              ease: "easeInOut",
              delay: layer * 0.2
            }
          }}
        />
      ))}

      {/* Radial flares at key points */}
      {[0, 90, 180, 270].map((angle, index) => {
        const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
        const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <motion.g key={angle}>
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill={themeColors.accent}
              filter="url(#midnight-flare)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isMidnightBurst ? {
                scale: [0, 2, 1],
                opacity: [0, 1, 0]
              } : {}}
              transition={{
                duration: 3,
                delay: index * 0.5 + 1,
                ease: "easeOut"
              }}
            />
            {/* Radial burst lines */}
            <motion.line
              x1={x}
              y1={y}
              x2={x + Math.cos((angle * Math.PI) / 180) * 40}
              y2={y + Math.sin((angle * Math.PI) / 180) * 40}
              stroke={themeColors.primary}
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#midnight-glow)"
              initial={{ 
                pathLength: 0, 
                opacity: 0
              }}
              animate={isMidnightBurst ? {
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0]
              } : {}}
              transition={{
                duration: 2,
                delay: index * 0.3 + 2,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        );
      })}

      {/* Central burst point */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="12"
        fill={`url(#midnight-gradient-${theme})`}
        filter="url(#midnight-flare)"
        initial={{ scale: 0, opacity: 0 }}
        animate={isMidnightBurst ? {
          scale: [0, 3, 1.5, 1],
          opacity: [0, 1, 0.8, 0]
        } : {}}
        transition={{
          duration: 5,
          ease: "easeOut"
        }}
      />
    </g>
  );
};