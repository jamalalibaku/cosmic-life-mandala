/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Emotional Stroke – Painterly mood expressions
 */

import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/themes/van-gogh";

interface VanGoghEmotionalStrokeProps {
  startAngle: number;
  arcLength: number;
  intensity: number;
  valence: number;
  arousal: number;
  emotion: string;
}

export const VanGoghEmotionalStroke = ({ 
  startAngle, 
  arcLength, 
  intensity, 
  valence, 
  arousal, 
  emotion 
}: VanGoghEmotionalStrokeProps) => {
  const radius = 140 + intensity * 60;
  const color = vanGoghTheme.getEmotionColor(emotion, valence, intensity);
  const brushwork = vanGoghTheme.brushwork[emotion] || vanGoghTheme.brushwork.calm;
  
  // Create Van Gogh style curved brush strokes
  const createBrushStroke = () => {
    const endAngle = (arcLength * Math.PI) / 180;
    const curvature = valence * brushwork.curvature * 30;
    const strokeCount = Math.max(3, Math.floor(intensity * 8));
    
    let paths = [];
    
    for (let i = 0; i < strokeCount; i++) {
      const offset = (i - strokeCount / 2) * 8;
      const r = radius + offset;
      const turbulence = (Math.random() - 0.5) * brushwork.turbulence * 20;
      
      // Create organic, flowing stroke with multiple control points
      const cp1x = (r * 0.3) * Math.cos(endAngle * 0.2) + turbulence;
      const cp1y = (r * 0.3) * Math.sin(endAngle * 0.2) + curvature * 0.3;
      
      const cp2x = (r * 0.6) * Math.cos(endAngle * 0.5) + turbulence * 0.7;
      const cp2y = (r * 0.6) * Math.sin(endAngle * 0.5) + curvature * 0.7;
      
      const cp3x = (r * 0.8) * Math.cos(endAngle * 0.8) + turbulence * 0.4;
      const cp3y = (r * 0.8) * Math.sin(endAngle * 0.8) + curvature * 0.9;
      
      const endX = r * Math.cos(endAngle);
      const endY = r * Math.sin(endAngle) + curvature;
      
      const path = `
        M ${r * 0.2} ${turbulence * 0.3}
        C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cp3x} ${cp3y}
        S ${endX - 10} ${endY - 10}, ${endX} ${endY}
      `;
      
      paths.push({
        d: path,
        opacity: 0.7 - i * 0.1,
        strokeWidth: brushwork.strokeWidth - i * 0.5
      });
    }
    
    return paths;
  };

  const strokes = createBrushStroke();

  return (
    <g transform={`rotate(${startAngle})`}>
      <defs>
        <filter id={`vanGoghBrush-${emotion}`} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence 
            baseFrequency={`${0.02 + brushwork.turbulence * 0.05} ${0.03 + brushwork.turbulence * 0.08}`}
            numOctaves="3"
            type="fractalNoise"
          />
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/>
          <feComposite in2="SourceGraphic" operator="multiply"/>
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <linearGradient id={`strokeGradient-${emotion}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: color, stopOpacity: 0.9}} />
          <stop offset="50%" style={{stopColor: color, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: color, stopOpacity: 0.6}} />
        </linearGradient>
      </defs>

      {/* Main brush strokes */}
      {strokes.map((stroke, i) => (
        <motion.path
          key={i}
          d={stroke.d}
          stroke={`url(#strokeGradient-${emotion})`}
          strokeWidth={stroke.strokeWidth}
          fill="none"
          opacity={stroke.opacity}
          filter={`url(#vanGoghBrush-${emotion})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            opacity: [stroke.opacity * 0.7, stroke.opacity, stroke.opacity * 0.7],
            strokeWidth: [stroke.strokeWidth * 0.8, stroke.strokeWidth, stroke.strokeWidth * 0.8]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}

      {/* Energy highlights for intense emotions */}
      {intensity > 0.7 && (
        <motion.path
          d={strokes[0]?.d}
          stroke="hsl(45, 100%, 80%)"
          strokeWidth={2}
          fill="none"
          opacity={0.4}
          strokeLinecap="round"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            strokeWidth: [1, 3, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </g>
  );
};