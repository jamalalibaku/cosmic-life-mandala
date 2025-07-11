/**
 * CameraView.tsx – Radial Layer Architecture View
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React from "react";
import { motion } from "framer-motion";
import { RadialLayerSystem } from "@/components/mandala/RadialLayerSystem";

interface CameraViewProps {
  zoomLevel?: "year" | "month" | "week" | "day" | "hour";
}

const createLayerData = () => [
  {
    name: "Moon",
    data: [{ phase: "waxing", luminosity: 0.7 }],
    color: "hsl(240, 30%, 70%)",
    radius: 250
  },
  {
    name: "Weather",
    data: [{ temp: 22, clouds: 0.3, wind: 0.5 }],
    color: "hsl(200, 60%, 60%)",
    radius: 210
  },
  {
    name: "Plans",
    data: [
      { event: "meeting", priority: 0.8 },
      { event: "workout", priority: 0.6 }
    ],
    color: "hsl(280, 50%, 65%)",
    radius: 170
  },
  {
    name: "Mobility",
    data: [
      { activity: "walk", intensity: 0.4, distance: 30 },
      { activity: "run", intensity: 0.8, distance: 70 },
      { activity: "bike", intensity: 0.6, distance: 120 }
    ],
    color: "hsl(120, 60%, 55%)",
    radius: 130
  },
  {
    name: "Places",
    data: [
      { location: "home", duration: 8 },
      { location: "work", duration: 9 }
    ],
    color: "hsl(30, 70%, 60%)",
    radius: 90
  },
  {
    name: "Mood",
    data: [
      { emotion: "joy", valence: 0.8, energy: 0.6 },
      { emotion: "calm", valence: 0.3, energy: 0.3 },
      { emotion: "focus", valence: 0.1, energy: 0.5 }
    ],
    color: "hsl(340, 80%, 65%)",
    radius: 60
  }
];

export const CameraView: React.FC<CameraViewProps> = ({ 
  zoomLevel = "month" 
}) => {
  const layerData = createLayerData();

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
        <motion.g
          animate={{ rotate: 0 }}
          transition={{ type: "tween", duration: 2 }}
        >
          <RadialLayerSystem
            layers={layerData}
            currentZoom={zoomLevel}
            centerRadius={40}
            layerSpacing={50}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};