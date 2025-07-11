/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Mandala – A living painting of time and emotion
 */

import React from "react";
import { motion } from "framer-motion";
import { VanGoghCoreVortex } from "./VanGoghCoreVortex";
import { VanGoghEmotionalStroke } from "./VanGoghEmotionalStroke";
import { VanGoghSleepSwirl } from "./VanGoghSleepSwirl";
import { VanGoghMobilityTrail } from "./VanGoghMobilityTrail";
import { VanGoghStarryBackground } from "./VanGoghStarryBackground";

// Mock data for Van Gogh visualization
const moodSegments = [
  { start: 0, emotion: "joy", valence: 0.8, energy: 0.9, duration: 2, arousal: 0.8 },
  { start: 45, emotion: "stress", valence: -0.5, energy: 1.0, duration: 1.5, arousal: 1.0 },
  { start: 90, emotion: "calm", valence: 0.4, energy: 0.2, duration: 4, arousal: 0.1 },
  { start: 135, emotion: "creative", valence: 0.7, energy: 0.8, duration: 3, arousal: 0.6 },
  { start: 200, emotion: "focus", valence: 0.2, energy: 0.6, duration: 2, arousal: 0.4 }
];

const sleepData = [
  { phase: "deep" as const, depth: 0.9, duration: 180, angle: 30 },
  { phase: "REM" as const, depth: 0.4, duration: 90, angle: 120 },
  { phase: "light" as const, depth: 0.2, duration: 60, angle: 210 }
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
  return -(totalMinutes / 1440) * 360;
};

export const VanGoghMandalaView = () => {
  const rotationAngle = getCurrentTimeAngle();

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ background: 'hsl(230, 40%, 8%)' }}>
      
      {/* Van Gogh Starry Background */}
      <VanGoghStarryBackground />
      
      <motion.svg
        viewBox="-400 -400 800 800"
        width="90%"
        height="90%"
        className="max-w-5xl max-h-screen relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        {/* Van Gogh brushwork filters */}
        <defs>
          <filter id="vanGoghBrush" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence 
              baseFrequency="0.04 0.06" 
              numOctaves="4" 
              stitchTiles="stitch"
              type="fractalNoise"
            />
            <feColorMatrix values="0 0 0 0 0.9 0 0 0 0 0.8 0 0 0 0 0.2 0 0 0 1 0"/>
            <feComposite in2="SourceGraphic" operator="multiply"/>
          </filter>
          
          <filter id="starryGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Time-aligned rotation group */}
        <motion.g
          animate={{ rotate: rotationAngle }}
          transition={{ type: "spring", stiffness: 50, damping: 20, duration: 3 }}
        >
          {/* Van Gogh Core Vortex (NOW) */}
          <motion.g
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.5, 0.8, 1]
            }}
          >
            <VanGoghCoreVortex />
          </motion.g>

          {/* Sleep Swirls */}
          {sleepData.map((sleep, i) => (
            <motion.g
              key={i}
              animate={{ 
                scale: [1, 1.03, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 8 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 1.5
              }}
            >
              <VanGoghSleepSwirl 
                depth={sleep.depth} 
                phase={sleep.phase} 
                duration={sleep.duration}
                angle={sleep.angle}
              />
            </motion.g>
          ))}

          {/* Emotional Brushstrokes */}
          {moodSegments.map((mood, i) => (
            <motion.g
              key={i}
              animate={{ 
                scale: [1, 1.05 + mood.energy * 0.05, 1],
                rotate: [0, mood.valence * 3, 0]
              }}
              transition={{ 
                duration: 2 + mood.energy * 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.8
              }}
            >
              <VanGoghEmotionalStroke
                startAngle={mood.start}
                arcLength={mood.duration * 18}
                intensity={mood.energy}
                valence={mood.valence}
                arousal={mood.arousal}
                emotion={mood.emotion}
              />
            </motion.g>
          ))}

          {/* Mobility Trails (like shooting stars) */}
          {mobilityData.map((mobility, i) => (
            <motion.g
              key={i}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4 + mobility.intensity * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 2
              }}
            >
              <VanGoghMobilityTrail
                activity={mobility.activity}
                intensity={mobility.intensity}
                distance={mobility.distance}
                angle={(mobility.angle * Math.PI) / 180}
                time={mobility.time}
              />
            </motion.g>
          ))}
        </motion.g>
      </motion.svg>
    </div>
  );
};