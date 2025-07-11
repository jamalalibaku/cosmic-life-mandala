import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/theme/van-gogh/van-gogh";

const moodData = [
  { angle: 0, valence: 0.6, energy: 0.8, emotion: "joy", type: "arc" },
  { angle: 60, valence: -0.3, energy: 0.5, emotion: "contemplative", type: "arc" },
  { angle: 120, valence: 0.2, energy: 0.3, emotion: "calm", type: "arc" },
  { angle: 180, valence: 0.9, energy: 0.9, emotion: "ecstatic", type: "arc" },
  { angle: 240, valence: -0.1, energy: 0.7, emotion: "restless", type: "arc" },
  { angle: 300, valence: 0.4, energy: 0.4, emotion: "focused", type: "inward" }
];

const sleepData = [
  { angle: 45, depth: 0.8, phase: "deep", type: "spiral" },
  { angle: 135, depth: 0.4, phase: "REM", type: "spiral" },
  { angle: 225, depth: 0.2, phase: "light", type: "spiral" }
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

        {/* Breathing sun core */}
        <radialGradient id="sunCore" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="hsl(45, 100%, 85%)" />
          <stop offset="30%" stopColor="hsl(42, 95%, 70%)" />
          <stop offset="70%" stopColor="hsl(38, 90%, 60%)" />
          <stop offset="100%" stopColor="hsl(35, 85%, 50%)" />
        </radialGradient>

        {/* Sun rays gradient */}
        <radialGradient id="sunRays" cx="50%" cy="50%" r="150%">
          <stop offset="0%" stopColor="hsl(45, 80%, 70%)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(42, 70%, 60%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(38, 60%, 50%)" stopOpacity="0" />
        </radialGradient>

        {/* Enhanced brush texture */}
        <filter id="brushTexture" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence baseFrequency="0.9 1.2" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        {/* Emotional glow with jitter */}
        <filter id="emotionalGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feTurbulence baseFrequency="0.3" numOctaves="2" result="jitter" />
          <feDisplacementMap in="coloredBlur" in2="jitter" scale="2" />
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Enhanced swirl pattern */}
        <filter id="swirl" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence baseFrequency="0.02 0.03" numOctaves="2" result="swirl" />
          <feDisplacementMap in="SourceGraphic" in2="swirl" scale="8" />
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* Paint stroke filter */}
        <filter id="paintStroke" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence baseFrequency="0.8 0.4" numOctaves="2" result="texture" />
          <feDisplacementMap in="SourceGraphic" in2="texture" scale="1.5" />
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

      {/* Breathing sun rays */}
      <motion.circle
        cx={0}
        cy={0}
        r={80}
        fill="url(#sunRays)"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced breathing center - Van Gogh's sun */}
      <motion.circle
        cx={0}
        cy={0}
        r={30}
        fill="url(#sunCore)"
        filter="url(#emotionalGlow)"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 6,
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

      {/* Semantic Van Gogh Elements */}
      {moodData.map((mood, i) => {
        const color = vanGoghTheme.getMoodColor(mood.valence, mood.energy);
        const strokeMotion = vanGoghTheme.getStrokeMotion(mood.energy);
        
        // Depth layering - closer elements are larger and brighter
        const depthRadius = 120 + i * 25;
        const depthScale = 1 + (5 - i) * 0.1; // Closer = larger
        const depthOpacity = 0.4 + (5 - i) * 0.12; // Closer = brighter
        
        const x = depthRadius * Math.cos((mood.angle * Math.PI) / 180);
        const y = depthRadius * Math.sin((mood.angle * Math.PI) / 180);

        if (mood.type === "arc") {
          // Mood arcs with breathing motion and stroke variation
          const arcLength = 60 + mood.energy * 40;
          const strokeDash = `${mood.energy * 10 + 5}, ${mood.energy * 5 + 2}`;
          
          return (
            <motion.g key={`mood-arc-${i}`}>
              <motion.path
                d={`M ${x - arcLength/2} ${y} A ${depthRadius} ${depthRadius} 0 0 1 ${x + arcLength/2} ${y}`}
                fill="none"
                stroke={color}
                strokeWidth={6 + mood.energy * 8}
                strokeLinecap="round"
                strokeDasharray={strokeDash}
                opacity={depthOpacity}
                filter="url(#brushTexture)"
                animate={{
                  scale: [depthScale, depthScale * 1.05, depthScale],
                  strokeDashoffset: [0, 20, 0],
                  opacity: [depthOpacity * 0.7, depthOpacity, depthOpacity * 0.7]
                }}
                transition={{
                  duration: 3 + mood.energy * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
                onClick={() => console.log(`Van Gogh mood arc: ${mood.emotion}`)}
                style={{ cursor: 'pointer' }}
              />
            </motion.g>
          );
        } else if (mood.type === "inward") {
          // Focus inward lines with orbital wobble
          return (
            <motion.g key={`focus-line-${i}`}>
              <motion.line
                x1={x * 0.6}
                y1={y * 0.6}
                x2={x * 1.4}
                y2={y * 1.4}
                stroke={color}
                strokeWidth={4 + mood.energy * 6}
                strokeLinecap="round"
                strokeDasharray="8,4"
                opacity={depthOpacity}
                filter="url(#emotionalGlow)"
                animate={{
                  scale: [depthScale, depthScale * 1.1, depthScale],
                  x1: [x * 0.6, x * 0.65, x * 0.6],
                  y1: [y * 0.6, y * 0.65, y * 0.6],
                  opacity: [depthOpacity * 0.8, depthOpacity, depthOpacity * 0.8]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
                onClick={() => console.log(`Van Gogh focus line: ${mood.emotion}`)}
                style={{ cursor: 'pointer' }}
              />
            </motion.g>
          );
        }
      })}

      {/* Sleep spirals with gentle drift */}
      {sleepData.map((sleep, i) => {
        const spiralRadius = 80 + i * 20;
        const x = spiralRadius * Math.cos((sleep.angle * Math.PI) / 180);
        const y = spiralRadius * Math.sin((sleep.angle * Math.PI) / 180);
        const spiralColor = sleep.phase === "deep" ? "hsl(230, 60%, 30%)" : 
                           sleep.phase === "REM" ? "hsl(280, 70%, 50%)" : 
                           "hsl(200, 40%, 60%)";
        
        return (
          <motion.g key={`sleep-spiral-${i}`}>
            <motion.path
              d={`M ${x} ${y} Q ${x + 20} ${y - 20} ${x + 15} ${y + 15} Q ${x - 10} ${y + 25} ${x} ${y}`}
              fill="none"
              stroke={spiralColor}
              strokeWidth={3 + sleep.depth * 4}
              strokeLinecap="round"
              opacity={0.3 + sleep.depth * 0.4}
              filter="url(#swirl)"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 12 + i * 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
              onClick={() => console.log(`Sleep phase: ${sleep.phase}`)}
              style={{ cursor: 'pointer' }}
            />
          </motion.g>
        );
      })}

      {/* Enhanced swirling stars with drift motion */}
      {Array.from({ length: 16 }, (_, i) => {
        const baseAngle = (i * 22.5) * Math.PI / 180;
        const radius = 260 + Math.sin(i * 0.7) * 60;
        const baseX = radius * Math.cos(baseAngle);
        const baseY = radius * Math.sin(baseAngle);
        const starSize = 1.5 + Math.sin(i * 0.3) * 1.5;
        
        return (
          <motion.circle
            key={`star-${i}`}
            r={starSize}
            fill="hsl(45, 80%, 80%)"
            filter="url(#emotionalGlow)"
            animate={{
              cx: [baseX, baseX + Math.sin(i) * 15, baseX],
              cy: [baseY, baseY + Math.cos(i) * 15, baseY],
              scale: [1, 1.3 + Math.sin(i) * 0.2, 1],
              opacity: [0.5, 0.9, 0.5]
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
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

      {/* Floating central text with gentle motion */}
      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="hsl(45, 70%, 70%)"
        fontSize="12"
        opacity="0.6"
        fontStyle="italic"
        animate={{
          y: [0, -2, 0],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        initial={{ opacity: 0, y: 10 }}
      >
        "I dream my painting and I paint my dream"
      </motion.text>
    </motion.svg>
  );
};