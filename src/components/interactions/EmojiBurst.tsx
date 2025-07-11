/**
 * Emoji Burst Animation
 * Playful particle effects that celebrate user interactions
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmojiBurstProps {
  emojis: string[];
  isActive: boolean;
  centerX: number;
  centerY: number;
  onComplete?: () => void;
}

export const EmojiBurst: React.FC<EmojiBurstProps> = ({
  emojis,
  isActive,
  centerX,
  centerY,
  onComplete,
}) => {
  const burstParticles = emojis.map((emoji, index) => {
    const angle = (index / emojis.length) * 2 * Math.PI;
    const distance = 40 + Math.random() * 20;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    return {
      emoji,
      endX,
      endY,
      delay: index * 0.1,
      rotation: Math.random() * 360,
    };
  });

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {burstParticles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl"
              style={{
                left: centerX,
                top: centerY,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: particle.endX - centerX,
                y: particle.endY - centerY,
                scale: [0, 1.2, 0.8, 0],
                rotate: particle.rotation,
                opacity: [1, 1, 0.8, 0],
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1.8,
                delay: particle.delay,
                ease: "easeOut",
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};