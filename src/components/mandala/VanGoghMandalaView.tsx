/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Mandala – Structured radial timeline with painterly expression
 */

import React from "react";
import { motion } from "framer-motion";
import { CoreCircle } from "@/components/mandala/CoreCircle";
import { VanGoghEmotionalRibbon } from "./VanGoghEmotionalRibbon";
import { VanGoghSleepRing } from "./VanGoghSleepRing";
import { VanGoghMobilityComet } from "./VanGoghMobilityComet";

import { RadialUIDemo } from "../ui/RadialUIDemo";

// Structured data following mandala pattern
const moodSegments = [
  { start: 0, emotion: "joy", valence: 0.8, energy: 0.9, duration: 2, arousal: 0.8 },
  { start: 45, emotion: "stress", valence: -0.5, energy: 1.0, duration: 1.5, arousal: 1.0 },
  { start: 90, emotion: "calm", valence: 0.4, energy: 0.2, duration: 4, arousal: 0.1 },
  { start: 135, emotion: "creative", valence: 0.7, energy: 0.8, duration: 3, arousal: 0.6 },
  { start: 200, emotion: "focus", valence: 0.2, energy: 0.6, duration: 2, arousal: 0.4 }
];

const sleepData = [
  { phase: "deep" as const, depth: 0.9, duration: 180, startAngle: 30 },
  { phase: "REM" as const, depth: 0.4, duration: 90, startAngle: 120 },
  { phase: "light" as const, depth: 0.2, duration: 60, startAngle: 210 }
];

const mobilityData = [
  { activity: "walk" as const, intensity: 0.4, distance: 40, angle: 45, time: "08:30" },
  { activity: "run" as const, intensity: 0.9, distance: 80, angle: 135, time: "18:15" },
  { activity: "bike" as const, intensity: 0.7, distance: 120, angle: 270, time: "12:45" }
];

const getCurrentTimeAngle = (): number => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  // Fixed calculation to prevent jumping - only update time rotation based on minutes
  return -(totalMinutes / 1440) * 360;
};

export const VanGoghMandalaView = () => {
  // Calculate rotation once to prevent constant recalculation causing loops
  const rotationAngle = getCurrentTimeAngle();

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden">
      
      
      <motion.svg
        viewBox="-350 -350 700 700"
        width="85%"
        height="85%"
        className="max-w-4xl max-h-screen relative z-10 cursor-pointer"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Van Gogh artistic filters */}
        <defs>
          <filter id="vanGoghGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feTurbulence 
              baseFrequency="0.02 0.03" 
              numOctaves="2" 
              stitchTiles="stitch"
              type="fractalNoise"
            />
            <feColorMatrix values="1 0.9 0.3 0 0 0.8 0.9 0.2 0 0 0.2 0.3 1 0 0 0 0 0 1 0"/>
            <feComposite in2="coloredBlur" operator="multiply"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <radialGradient id="vanGoghRadial" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style={{stopColor: 'hsl(45, 90%, 15%)', stopOpacity: 0.3}} />
            <stop offset="40%" style={{stopColor: 'hsl(220, 60%, 8%)', stopOpacity: 0.6}} />
            <stop offset="100%" style={{stopColor: 'hsl(230, 40%, 5%)', stopOpacity: 0.9}} />
          </radialGradient>
        </defs>

        {/* Background radial gradient */}
        <circle 
          cx={0} cy={0} r={350}
          fill="url(#vanGoghRadial)"
          opacity={0.8}
        />

        {/* Time-aligned rotation group - Stable Van Gogh motion */}
        <motion.g
          style={{ transform: `rotate(${rotationAngle}deg)` }}
          transition={{ type: "tween", duration: 2, ease: "easeInOut" }}
        >
          {/* Sleep Rings - Inner peaceful orbits */}
          {sleepData.map((sleep, i) => (
            <motion.g
              key={i}
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 1.5
              }}
            >
              <VanGoghSleepRing 
                depth={sleep.depth} 
                phase={sleep.phase} 
                duration={sleep.duration}
                startAngle={sleep.startAngle}
                radius={80 + i * 25}
              />
            </motion.g>
          ))}

          {/* Emotional Ribbons - Spiraling mood currents */}
          {moodSegments.map((mood, i) => (
            <motion.g
              key={i}
              animate={{ 
                scale: [1, 1.03 + mood.energy * 0.02, 1],
                rotate: [0, mood.valence * 2, 0]
              }}
              transition={{ 
                duration: 4 + mood.energy * 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.8
              }}
            >
              <VanGoghEmotionalRibbon
                startAngle={mood.start}
                arcLength={mood.duration * 18}
                intensity={mood.energy}
                valence={mood.valence}
                arousal={mood.arousal}
                emotion={mood.emotion}
                radius={180 + i * 15}
              />
            </motion.g>
          ))}

          {/* Mobility Comets - Shooting star trails */}
          {mobilityData.map((mobility, i) => (
            <motion.g
              key={i}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3 + mobility.intensity * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 1.5
              }}
            >
              <VanGoghMobilityComet
                activity={mobility.activity}
                intensity={mobility.intensity}
                distance={mobility.distance}
                angle={(mobility.angle * Math.PI) / 180}
                time={mobility.time}
                radius={250}
              />
            </motion.g>
          ))}

          {/* Core breathing center - Van Gogh's glowing sun */}
          <motion.g
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut"
            }}
          >
            <g filter="url(#vanGoghGlow)">
              <CoreCircle />
            </g>
          </motion.g>
        </motion.g>
      </motion.svg>
      
      {/* Radial UI Demo Layer - Interactive circular elements */}
      <RadialUIDemo className="absolute inset-0 pointer-events-auto z-30" />
    </div>
  );
};