/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Phase 28 – Live Visual Composition with Breathing Animation
 */

import React from "react";
import { motion } from "framer-motion";
import { CoreCircle } from "@/components/mandala/CoreCircle";
import { EmotionalCreature } from "@/components/mandala/EmotionalCreature";
import { SleepRipple } from "@/components/mandala/SleepRipple";
import { MobilitySpirit } from "@/components/mandala/MobilitySpirit";
import mandalaExpressiveTheme from "@/themes/mandala-expressive";

// Mock Data (can be replaced with store-driven real data)
const moodSegments = [
  { start: 0, emotion: "joy", valence: 0.8, energy: 0.6, duration: 2, arousal: 0.7 },
  { start: 45, emotion: "stress", valence: -0.4, energy: 0.8, duration: 1.5, arousal: 0.9 },
  { start: 90, emotion: "calm", valence: 0.3, energy: 0.3, duration: 3, arousal: 0.2 },
  { start: 135, emotion: "focus", valence: 0.1, energy: 0.5, duration: 2, arousal: 0.4 }
];

const sleepData = [
  { phase: "deep" as const, depth: 0.9, duration: 120 },
  { phase: "REM" as const, depth: 0.5, duration: 90 },
  { phase: "light" as const, depth: 0.2, duration: 60 }
];

const mobilityData = [
  { activity: "walk" as const, intensity: 0.4, distance: 30, angle: 20 },
  { activity: "run" as const, intensity: 0.8, distance: 70, angle: 90 },
  { activity: "bike" as const, intensity: 0.6, distance: 120, angle: 160 }
];

export const MandalaView = () => {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-background">
      <motion.svg
        viewBox="-300 -300 600 600"
        width="80%"
        height="80%"
        className="max-w-4xl max-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Core breathing center */}
        <motion.g
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CoreCircle />
        </motion.g>

        {/* Sleep ripples */}
        {sleepData.map((sleep, i) => (
          <SleepRipple key={i} depth={sleep.depth} phase={sleep.phase} duration={sleep.duration} />
        ))}

        {/* Emotional Creatures */}
        {moodSegments.map((mood, i) => {
          const breathDur = mandalaExpressiveTheme.breathingRhythms[mood.emotion] || 4;
          return (
            <motion.g
              key={i}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: breathDur, repeat: Infinity, ease: "easeInOut" }}
            >
              <EmotionalCreature
                startAngle={mood.start}
                arcLength={mood.duration * 15}
                intensity={mood.energy}
                valence={mood.valence}
                arousal={mood.arousal}
                emotion={mood.emotion}
              />
            </motion.g>
          );
        })}

        {/* Cosmic Mobility Trails */}
        {mobilityData.map((m, i) => (
          <MobilitySpirit
            key={i}
            activity={m.activity}
            intensity={m.intensity}
            distance={m.distance}
            angle={(m.angle * Math.PI) / 180}
          />
        ))}
      </motion.svg>
    </div>
  );
};