/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Core Vortex – The pulsing yellow heart of NOW
 */

import React from "react";
import { motion } from "framer-motion";

export const VanGoghCoreVortex = () => {
  // Create swirling vortex paths
  const createVortexPath = (radius: number, spirals: number = 3) => {
    let path = `M ${radius} 0`;
    const steps = 60;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const angle = progress * Math.PI * 2 * spirals;
      const r = radius * (1 - progress * 0.7);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      if (i === 0) {
        path += ` M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };

  return (
    <g>
      <defs>
        {/* Van Gogh style radial gradient */}
        <radialGradient id="vanGoghVortex" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor: 'hsl(45, 100%, 75%)', stopOpacity: 1}} />
          <stop offset="40%" style={{stopColor: 'hsl(35, 100%, 65%)', stopOpacity: 0.9}} />
          <stop offset="80%" style={{stopColor: 'hsl(25, 100%, 55%)', stopOpacity: 0.7}} />
          <stop offset="100%" style={{stopColor: 'hsl(220, 80%, 40%)', stopOpacity: 0.3}} />
        </radialGradient>

        {/* Swirling brush texture */}
        <filter id="vortexGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feTurbulence baseFrequency="0.1" numOctaves="2" />
          <feColorMatrix values="1 0.8 0.2 0 0 0.9 0.7 0.1 0 0 0.3 0.5 1 0 0 0 0 0 1 0"/>
          <feComposite in2="coloredBlur" operator="multiply"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main vortex body */}
      <motion.circle
        cx={0} cy={0} r={45}
        fill="url(#vanGoghVortex)"
        filter="url(#vortexGlow)"
        style={{ cursor: 'pointer', pointerEvents: 'all' }}
        onClick={() => console.log('Van Gogh core clicked!')}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Swirling brush strokes */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={createVortexPath(35 - i * 8, 2 + i)}
          stroke="hsl(45, 90%, 70%)"
          strokeWidth={3 - i * 0.5}
          fill="none"
          opacity={0.7 - i * 0.1}
          filter="url(#vortexGlow)"
          strokeLinecap="round"
          animate={{
            rotate: [0, 360],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Outer energy rings */}
      {[1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={0} cy={0} 
          r={50 + i * 15}
          stroke="hsl(45, 80%, 60%)"
          strokeWidth={2}
          fill="none"
          opacity={0.4 - i * 0.1}
          strokeDasharray={`${8 + i * 4},${4 + i * 2}`}
          animate={{
            rotate: [0, i % 2 === 0 ? 360 : -360],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Central NOW text with Van Gogh styling */}
      <motion.text
        x={0} y={8}
        textAnchor="middle"
        fill="hsl(230, 40%, 8%)"
        fontSize={16}
        fontWeight="bold"
        fontFamily="serif"
        style={{
          textShadow: '0 0 8px hsl(45, 100%, 70%)',
          filter: 'drop-shadow(0 0 4px hsl(45, 90%, 60%))'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        NOW
      </motion.text>
    </g>
  );
};