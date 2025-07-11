import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/theme/van-gogh/van-gogh";

const moodData = [
  { angle: 0, valence: 0.6, energy: 0.8 },
  { angle: 60, valence: -0.3, energy: 0.5 },
  { angle: 120, valence: 0.2, energy: 0.3 },
  { angle: 180, valence: 0.9, energy: 0.9 }
];

export const VanGoghView = () => {
  return (
    <motion.svg
      viewBox="-350 -350 700 700"
      width="100%"
      height="100%"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="cursor-pointer"
      style={{ pointerEvents: 'all' }}
    >
      <defs>
        <radialGradient id="starrySky" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#0a0f2c" />
          <stop offset="100%" stopColor="#1b1d47" />
        </radialGradient>
      </defs>

      {/* Background gradient */}
      <rect width="1000" height="1000" x="-500" y="-500" fill="url(#starrySky)" />

      {/* Mood arcs with expressive strokes */}
      {moodData.map((mood, i) => {
        const color = vanGoghTheme.getMoodColor(mood.valence, mood.energy);
        const strokeMotion = vanGoghTheme.getStrokeMotion(mood.energy);
        const r = 200;

        const x = r * Math.cos((mood.angle * Math.PI) / 180);
        const y = r * Math.sin((mood.angle * Math.PI) / 180);

        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={20 + mood.energy * 20}
            fill={color}
            opacity={0.8}
            animate={{
              scale: strokeMotion.scale,
              rotate: strokeMotion.rotate,
            }}
            transition={strokeMotion.transition}
            onClick={() => console.log(`Van Gogh mood stroke clicked: valence=${mood.valence}, energy=${mood.energy}`)}
            style={{ cursor: 'pointer' }}
          />
        );
      })}
    </motion.svg>
  );
};