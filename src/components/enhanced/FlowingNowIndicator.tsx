/**
 * Flowing NOW Indicator - "Cosmic Stream of Present Moment"
 * Implements Ad's vision of a continuous, flowing stream of light
 * Features organic pulse, celestial glow, and living energy
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FlowingNowIndicatorProps {
  centerX: number;
  centerY: number;
  radius: number;
  theme?: string;
  isStable?: boolean;
}

export const FlowingNowIndicator: React.FC<FlowingNowIndicatorProps> = ({
  centerX,
  centerY,
  radius,
  theme = 'cosmic',
  isStable = true
}) => {
  const time = useRef(0);
  
  useEffect(() => {
    const animate = () => {
      time.current += 0.016;
      requestAnimationFrame(animate);
    };
    animate();
    return () => {};
  }, []);

  // NOW is always at North (0°) but flows with organic energy
  const nowRadian = -Math.PI / 2;
  const baseLength = radius * 0.98 + 35;
  
  // Generate flowing stream points
  const streamPoints = Array.from({ length: 12 }, (_, i) => {
    const progress = i / 11;
    const currentRadius = radius * 0.3 + progress * (baseLength - radius * 0.3);
    
    // Add gentle wave motion to the stream
    const waveOffset = Math.sin(time.current * 2 + i * 0.3) * 2;
    const streamX = centerX + Math.cos(nowRadian) * currentRadius + waveOffset * Math.sin(nowRadian);
    const streamY = centerY + Math.sin(nowRadian) * currentRadius - waveOffset * Math.cos(nowRadian);
    
    return { x: streamX, y: streamY, progress };
  });

  const endPoint = streamPoints[streamPoints.length - 1];

  return (
    <g>
      <defs>
        {/* Flowing energy gradient */}
        <radialGradient id="flowing-now-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 90%, 70%)" stopOpacity="1" />
          <stop offset="30%" stopColor="hsl(50, 85%, 65%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(55, 80%, 55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(60, 75%, 45%)" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Stream glow filter */}
        <filter id="now-stream-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="softGlow"/>
          <feGaussianBlur stdDeviation="0.5" result="sharpGlow"/>
          <feGaussianBlur stdDeviation="4" result="atmosphereGlow"/>
          <feMerge>
            <feMergeNode in="atmosphereGlow"/>
            <feMergeNode in="softGlow"/>
            <feMergeNode in="sharpGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Celestial sparkle filter */}
        <filter id="celestial-sparkle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow"/>
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bright"/>
          <feMerge>
            <feMergeNode in="glow"/>
            <feMergeNode in="bright"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background aurora for the NOW stream */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={radius * 1.1}
        fill="none"
        stroke="url(#flowing-now-gradient)"
        strokeWidth="1"
        opacity="0.2"
        strokeDasharray={`${Math.PI * 0.3} ${Math.PI * 2}`}
        strokeDashoffset={0}
        animate={{
          strokeDashoffset: [0, -Math.PI * 2],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          strokeDashoffset: { duration: 8, repeat: Infinity, ease: "linear" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Flowing stream path */}
      <motion.path
        d={`M ${centerX} ${centerY} ${streamPoints.map((p, i) => 
          i === 0 ? `L ${p.x} ${p.y}` : `Q ${p.x} ${p.y} ${streamPoints[Math.min(i + 1, streamPoints.length - 1)].x} ${streamPoints[Math.min(i + 1, streamPoints.length - 1)].y}`
        ).join(' ')}`}
        stroke="hsl(45, 85%, 65%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        filter="url(#now-stream-glow)"
        opacity="0.8"
        animate={{
          strokeWidth: [2, 4, 2],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Energy flow particles along the stream */}
      {streamPoints.map((point, index) => (
        <motion.circle
          key={`flow-particle-${index}`}
          cx={point.x}
          cy={point.y}
          r={1 + point.progress * 2}
          fill="hsl(48, 95%, 75%)"
          opacity={0}
          filter="url(#celestial-sparkle)"
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
            r: [0.5, 2.5, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15
          }}
        />
      ))}

      {/* Main NOW marker - celestial beacon */}
      <motion.circle
        cx={endPoint.x}
        cy={endPoint.y}
        r="6"
        fill="url(#flowing-now-gradient)"
        filter="url(#now-stream-glow)"
        animate={isStable ? {
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
          r: [4, 8, 4]
        } : {
          scale: 1,
          opacity: 1,
          r: 6
        }}
        transition={isStable ? {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        } : { duration: 0 }}
      />

      {/* Inner core - pure energy */}
      <motion.circle
        cx={endPoint.x}
        cy={endPoint.y}
        r="2"
        fill="hsl(45, 100%, 85%)"
        opacity="1"
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Cosmic NOW label with enhanced typography - DISABLED */}
      {false && (
        <motion.text
          x={endPoint.x + 12}
          y={endPoint.y + 3}
          fill="hsl(45, 85%, 75%)"
          fontSize="11"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
          filter="url(#celestial-sparkle)"
          opacity="0.9"
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          NOW
        </motion.text>
      )}

      {/* Celestial time rays emanating from NOW */}
      {Array.from({ length: 6 }, (_, i) => {
        const rayAngle = nowRadian + (i - 2.5) * 0.2;
        const rayLength = 15 + i * 2;
        const rayStartX = endPoint.x + Math.cos(rayAngle) * 8;
        const rayStartY = endPoint.y + Math.sin(rayAngle) * 8;
        const rayEndX = endPoint.x + Math.cos(rayAngle) * rayLength;
        const rayEndY = endPoint.y + Math.sin(rayAngle) * rayLength;
        
        return (
          <motion.line
            key={`now-ray-${i}`}
            x1={rayStartX}
            y1={rayStartY}
            x2={rayEndX}
            y2={rayEndY}
            stroke="hsl(48, 80%, 60%)"
            strokeWidth="1"
            opacity="0.4"
            strokeLinecap="round"
            animate={{
              opacity: [0.2, 0.6, 0.2],
              strokeWidth: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        );
      })}
    </g>
  );
};