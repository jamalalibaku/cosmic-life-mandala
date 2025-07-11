/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Starry Background – The cosmic canvas
 */

import React from "react";
import { motion } from "framer-motion";

export const VanGoghStarryBackground = () => {
  // Generate starry sky pattern
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    brightness: Math.random() * 0.8 + 0.2,
    twinkleDelay: Math.random() * 4
  }));

  // Generate swirling cloud patterns
  const cloudSwirls = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (Math.random() * 80) + 10,
    y: (Math.random() * 80) + 10,
    scale: Math.random() * 1.5 + 0.5,
    rotation: Math.random() * 360,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Base starry night gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, hsl(230, 60%, 15%) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, hsl(240, 50%, 12%) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 40%, hsl(250, 40%, 8%) 0%, transparent 50%),
            linear-gradient(180deg, hsl(230, 40%, 8%) 0%, hsl(240, 50%, 5%) 100%)
          `
        }}
      />

      {/* Twinkling stars */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {stars.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="hsl(45, 80%, 85%)"
            opacity={star.brightness}
            filter="url(#starGlow)"
            animate={{
              opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.twinkleDelay
            }}
          />
        ))}
      </svg>

      {/* Van Gogh style swirling clouds */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="cloudGlow">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feTurbulence baseFrequency="0.02 0.03" numOctaves="3" type="fractalNoise"/>
            <feColorMatrix values="0.2 0.3 1 0 0 0.1 0.2 0.8 0 0 0.05 0.1 0.6 0 0 0 0 0 1 0"/>
            <feComposite in2="blur" operator="multiply"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Swirling cloud pattern */}
          <path
            id="cloudSwirl"
            d="M 0,0 Q 5,2 10,0 Q 15,-2 20,0 Q 25,3 30,0 Q 35,-1 40,1 Q 45,3 50,0"
            stroke="hsl(220, 60%, 25%)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />
        </defs>

        {cloudSwirls.map((cloud) => (
          <motion.g
            key={cloud.id}
            transform={`translate(${cloud.x}, ${cloud.y}) scale(${cloud.scale})`}
            opacity={cloud.opacity}
            animate={{
              rotate: [cloud.rotation, cloud.rotation + 360],
              opacity: [cloud.opacity * 0.5, cloud.opacity, cloud.opacity * 0.5]
            }}
            transition={{
              duration: 40 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <use href="#cloudSwirl" filter="url(#cloudGlow)" />
            <use
              href="#cloudSwirl"
              transform="rotate(45)"
              filter="url(#cloudGlow)"
              opacity="0.6"
            />
            <use
              href="#cloudSwirl"
              transform="rotate(90)"
              filter="url(#cloudGlow)"
              opacity="0.4"
            />
          </motion.g>
        ))}
      </svg>

      {/* Ambient light wisps */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 25% 75%, hsl(45, 40%, 8%) 0%, transparent 50%),
            radial-gradient(ellipse 600px 300px at 75% 25%, hsl(35, 30%, 6%) 0%, transparent 50%)
          `
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};