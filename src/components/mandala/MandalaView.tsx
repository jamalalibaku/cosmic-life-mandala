/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Phase 28 – Live Visual Composition with Breathing, Sleep Animation, and Time Rotation
 */

import React from "react";
import { motion } from "framer-motion";
import { RadialLayerSystem } from "@/components/mandala/RadialLayerSystem";
import mandalaExpressiveTheme from "@/themes/mandala-expressive";

// Life dimension data layers for radial system - refined color palette
const createLayerData = () => [
  {
    name: "Moon",
    data: [{ phase: "waxing", luminosity: 0.7 }],
    color: "hsl(240, 25%, 65%)",
    radius: 260
  },
  {
    name: "Weather", 
    data: [{ temp: 22, clouds: 0.3, wind: 0.5 }],
    color: "hsl(200, 30%, 60%)",
    radius: 220
  },
  {
    name: "Plans",
    data: [{ event: "meeting", priority: 0.8 }, { event: "workout", priority: 0.6 }],
    color: "hsl(260, 25%, 70%)",
    radius: 180
  },
  {
    name: "Mobility",
    data: [
      { activity: "walk", intensity: 0.4, distance: 30 },
      { activity: "run", intensity: 0.8, distance: 70 },
      { activity: "bike", intensity: 0.6, distance: 120 }
    ],
    color: "hsl(140, 25%, 65%)",
    radius: 140
  },
  {
    name: "Places",
    data: [{ location: "home", duration: 8 }, { location: "work", duration: 9 }],
    color: "hsl(30, 30%, 70%)",
    radius: 100
  },
  {
    name: "Mood",
    data: [
      { emotion: "joy", valence: 0.8, energy: 0.6 },
      { emotion: "calm", valence: 0.3, energy: 0.3 },
      { emotion: "focus", valence: 0.1, energy: 0.5 }
    ],
    color: "hsl(340, 30%, 70%)",
    radius: 70
  }
];

const getCurrentTimeAngle = (): number => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  return -(totalMinutes / 1440) * 360; // rotate counter-clockwise to keep NOW at top
};

export const MandalaView = () => {
  const rotationAngle = getCurrentTimeAngle();
  const layerData = createLayerData();

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-background-subtle via-background to-background-vignette" />
      </div>
      
      <motion.svg
        viewBox="-320 -320 640 640"
        width="85%"
        height="85%"
        className="max-w-5xl max-h-screen relative z-10"
        style={{
          filter: "drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))"
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Full radial system rotation to keep NOW at top */}
        <motion.g
          animate={{ rotate: rotationAngle }}
          transition={{ type: "tween", duration: 3, ease: "easeInOut" }}
        >
          {/* Radial Layer Architecture System */}
          <RadialLayerSystem 
            layers={layerData}
            currentZoom="month"
            centerRadius={45}
            layerSpacing={60}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};