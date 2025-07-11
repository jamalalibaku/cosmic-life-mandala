import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/theme/van-gogh/van-gogh";

const moodData = [
  { angle: 0, valence: 0.6, energy: 0.8, emotion: "joy" },
  { angle: 60, valence: -0.3, energy: 0.5, emotion: "contemplative" },
  { angle: 120, valence: 0.2, energy: 0.3, emotion: "calm" },
  { angle: 180, valence: 0.9, energy: 0.9, emotion: "ecstatic" },
  { angle: 240, valence: -0.1, energy: 0.7, emotion: "restless" },
  { angle: 300, valence: 0.4, energy: 0.4, emotion: "focused" }
];

export const VanGoghView = () => {
  return (
    <motion.svg
      viewBox="-400 -400 800 800"
      width="100%"
      height="100%"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
      className="cursor-pointer"
      style={{ pointerEvents: 'all' }}
    >
      <defs>
        {/* Van Gogh's Starry Night gradient */}
        <radialGradient id="starrySky" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#0a0f2c" />
          <stop offset="40%" stopColor="#1b1d47" />
          <stop offset="80%" stopColor="#2d3561" />
          <stop offset="100%" stopColor="#0f1419" />
        </radialGradient>

        {/* Turbulence for brush texture */}
        <filter id="brushTexture">
          <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          <feGaussianBlur stdDeviation="1" />
        </filter>

        {/* Glow effect for emotional strokes */}
        <filter id="emotionalGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Swirl pattern for motion */}
        <filter id="swirl">
          <feTurbulence baseFrequency="0.02" numOctaves="1" result="swirl" />
          <feDisplacementMap in="SourceGraphic" in2="swirl" scale="10" />
        </filter>
      </defs>

      {/* Background starry night */}
      <motion.rect 
        width="1000" 
        height="1000" 
        x="-500" 
        y="-500" 
        fill="url(#starrySky)"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* Breathing center - Van Gogh's sun */}
      <motion.circle
        cx={0}
        cy={0}
        r={30}
        fill="hsl(45, 90%, 65%)"
        filter="url(#emotionalGlow)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={() => console.log("Van Gogh's sun clicked - the center of all emotion")}
        style={{ cursor: 'pointer' }}
      />

      {/* Radial time structure - emotional ribbons */}
      {[80, 120, 160, 200, 240].map((radius, ringIndex) => (
        <motion.circle
          key={`ring-${radius}`}
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke="hsl(220, 60%, 40%)"
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeDasharray={`${radius * 0.1}, ${radius * 0.05}`}
          filter="url(#brushTexture)"
          animate={{
            rotate: ringIndex % 2 === 0 ? 360 : -360,
            strokeOpacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 20 + ringIndex * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Van Gogh's emotional brushstrokes */}
      {moodData.map((mood, i) => {
        const color = vanGoghTheme.getMoodColor(mood.valence, mood.energy);
        const strokeMotion = vanGoghTheme.getStrokeMotion(mood.energy);
        
        // Calculate position on the radial timeline
        const baseRadius = 150 + mood.energy * 80;
        const x = baseRadius * Math.cos((mood.angle * Math.PI) / 180);
        const y = baseRadius * Math.sin((mood.angle * Math.PI) / 180);
        
        // Brush stroke size based on energy
        const strokeWidth = 8 + mood.energy * 12;
        const strokeLength = 20 + mood.energy * 30;

        return (
          <g key={`emotion-${i}`}>
            {/* Main emotional stroke */}
            <motion.ellipse
              cx={x}
              cy={y}
              rx={strokeLength}
              ry={strokeWidth}
              fill={color}
              opacity={0.7 + mood.energy * 0.3}
              filter="url(#brushTexture)"
              transform={`rotate(${mood.angle} ${x} ${y})`}
              animate={{
                scale: strokeMotion.scale,
                rotate: [mood.angle, mood.angle + strokeMotion.rotate[1], mood.angle + strokeMotion.rotate[2], mood.angle],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={strokeMotion.transition}
              onClick={() => console.log(`Van Gogh emotion: ${mood.emotion}, valence=${mood.valence}, energy=${mood.energy}`)}
              style={{ cursor: 'pointer' }}
            />
            
            {/* Trailing motion blur */}
            <motion.ellipse
              cx={x * 0.9}
              cy={y * 0.9}
              rx={strokeLength * 0.6}
              ry={strokeWidth * 0.6}
              fill={color}
              opacity={0.3}
              filter="url(#swirl)"
              transform={`rotate(${mood.angle - 10} ${x * 0.9} ${y * 0.9})`}
              animate={{
                scale: [0.8, 1.1, 0.8],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: strokeMotion.transition.duration * 1.5,
                repeat: Infinity,
                ease: strokeMotion.transition.ease
              }}
            />
          </g>
        );
      })}

      {/* Swirling stars - Van Gogh's signature */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const radius = 280 + Math.sin(i * 0.5) * 40;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <motion.circle
            key={`star-${i}`}
            cx={x}
            cy={y}
            r={2 + Math.sin(i) * 2}
            fill="hsl(45, 80%, 80%)"
            filter="url(#emotionalGlow)"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
              rotate: 360
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        );
      })}

      {/* Emotional wind currents */}
      <motion.path
        d="M -300,0 Q -200,100 -100,0 Q 0,-100 100,0 Q 200,100 300,0"
        fill="none"
        stroke="hsl(220, 70%, 60%)"
        strokeWidth="3"
        strokeOpacity="0.4"
        filter="url(#swirl)"
        animate={{
          d: [
            "M -300,0 Q -200,100 -100,0 Q 0,-100 100,0 Q 200,100 300,0",
            "M -300,20 Q -200,80 -100,20 Q 0,-80 100,20 Q 200,80 300,20",
            "M -300,0 Q -200,100 -100,0 Q 0,-100 100,0 Q 200,100 300,0"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Central text - subtle */}
      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="hsl(45, 70%, 70%)"
        fontSize="12"
        opacity="0.6"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
      >
        "I dream my painting and I paint my dream"
      </motion.text>
    </motion.svg>
  );
};