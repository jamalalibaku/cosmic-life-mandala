import React from "react";
import { motion } from "framer-motion";
import vanGoghTheme from "@/theme/van-gogh/van-gogh";

// Real data points scattered as brushstrokes
const moodData = [
  { angle: 0, valence: 0.6, energy: 0.8, emotion: "joy", type: "arc", time: "09:00", intensity: 0.9 },
  { angle: 60, valence: -0.3, energy: 0.5, emotion: "contemplative", type: "arc", time: "11:30", intensity: 0.6 },
  { angle: 120, valence: 0.2, energy: 0.3, emotion: "calm", type: "arc", time: "14:15", intensity: 0.4 },
  { angle: 180, valence: 0.9, energy: 0.9, emotion: "ecstatic", type: "arc", time: "16:45", intensity: 0.95 },
  { angle: 240, valence: -0.1, energy: 0.7, emotion: "restless", type: "arc", time: "19:20", intensity: 0.7 },
  { angle: 300, valence: 0.4, energy: 0.4, emotion: "focused", type: "inward", time: "21:30", intensity: 0.5 }
];

const sleepData = [
  { angle: 45, depth: 0.8, phase: "deep", type: "spiral", duration: 180, time: "02:00" },
  { angle: 135, depth: 0.4, phase: "REM", type: "spiral", duration: 90, time: "04:30" },
  { angle: 225, depth: 0.2, phase: "light", type: "spiral", duration: 60, time: "06:15" }
];

// Generate mosaic-like brushstrokes to fill the entire canvas like Starry Night
const generateStarryNightMosaic = (density: number) => {
  const brushstrokes = [];
  const gridSize = 25; // Size of each mosaic cell
  
  for (let x = -400; x <= 400; x += gridSize) {
    for (let y = -400; y <= 400; y += gridSize) {
      const distance = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Create swirling pattern like Van Gogh's sky
      const swirl = Math.sin(distance * 0.02 + angle * 3) * 0.5;
      const offsetX = x + Math.random() * 12 - 6 + swirl * 15;
      const offsetY = y + Math.random() * 12 - 6 + Math.cos(distance * 0.015) * 10;
      
      // Van Gogh Starry Night color palette
      const colors = [
        'hsl(220, 70%, 25%)', // Deep night blue
        'hsl(230, 80%, 30%)', // Midnight blue
        'hsl(240, 60%, 35%)', // Darker blue
        'hsl(210, 90%, 20%)', // Very deep blue
        'hsl(45, 90%, 70%)',  // Starry yellow
        'hsl(42, 85%, 75%)',  // Light yellow
        'hsl(200, 40%, 40%)', // Muted blue-gray
      ];
      
      const colorIndex = Math.floor(Math.random() * colors.length);
      const isYellow = colorIndex >= 4; // Yellow stars scattered
      
      if (Math.random() < density || (isYellow && Math.random() < 0.15)) {
        brushstrokes.push({
          x: offsetX,
          y: offsetY,
          size: 3 + Math.random() * 5,
          color: colors[colorIndex],
          rotation: angle * 180 / Math.PI + Math.random() * 30 - 15,
          intensity: Math.random(),
          swirl: swirl,
          isYellow: isYellow
        });
      }
    }
  }
  return brushstrokes;
};

export const VanGoghView = () => {
  // Generate Van Gogh Starry Night mosaic background
  const starryNightMosaic = generateStarryNightMosaic(0.4); // 40% density
  
  return (
    <motion.svg
      viewBox="-400 -400 800 800"
      width="100%"
      height="100%"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 6, ease: [0.2, 0, 0.1, 1] }}
      className="cursor-pointer"
      style={{ pointerEvents: 'all' }}
    >
      <defs>
        {/* Van Gogh's Starry Night gradient - Enhanced atmosphere */}
        <radialGradient id="starrySky" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#0a0f2c" />
          <stop offset="30%" stopColor="#1b1d47" />
          <stop offset="60%" stopColor="#2d3561" />
          <stop offset="85%" stopColor="#1a2040" />
          <stop offset="100%" stopColor="#0f1419" />
        </radialGradient>

        {/* Exhibition-quality sun core with soft inner glow */}
        <radialGradient id="sunCoreGradient" cx="50%" cy="50%" r="100%">
          <stop offset="0%" stopColor="hsl(45, 100%, 90%)" />
          <stop offset="20%" stopColor="hsl(42, 98%, 78%)" />
          <stop offset="50%" stopColor="hsl(40, 95%, 68%)" />
          <stop offset="80%" stopColor="hsl(38, 90%, 58%)" />
          <stop offset="100%" stopColor="hsl(35, 85%, 45%)" />
        </radialGradient>

        {/* Enhanced sun rays with gradient fade */}
        <radialGradient id="sunRaysEnhanced" cx="50%" cy="50%" r="200%">
          <stop offset="0%" stopColor="hsl(45, 85%, 75%)" stopOpacity="0.4" />
          <stop offset="30%" stopColor="hsl(42, 75%, 65%)" stopOpacity="0.2" />
          <stop offset="60%" stopColor="hsl(40, 65%, 55%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(38, 60%, 50%)" stopOpacity="0" />
        </radialGradient>

        {/* Atmospheric fog gradient */}
        <radialGradient id="atmosphericFog" cx="50%" cy="50%" r="150%">
          <stop offset="0%" stopColor="hsl(230, 40%, 15%)" stopOpacity="0" />
          <stop offset="60%" stopColor="hsl(220, 50%, 20%)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(210, 60%, 25%)" stopOpacity="0.3" />
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

        {/* Oil Canvas Texture - Fixed to avoid white artifacts */}
        <filter id="oilCanvasTexture" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence 
            baseFrequency="0.6 0.8" 
            numOctaves="2" 
            result="canvasNoise"
            type="fractalNoise"
            stitchTiles="stitch"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="canvasNoise" 
            scale="1.5"
          />
          <feGaussianBlur stdDeviation="0.3" />
        </filter>

        {/* Van Gogh Brushstroke - Simplified to avoid white layers */}
        <filter id="vanGoghBrushstroke" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            baseFrequency="1.0 0.6" 
            numOctaves="2" 
            result="brushTexture"
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="brushTexture" 
            scale="1.8"
          />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>

        {/* Paint stroke filter */}
        <filter id="paintStroke" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence baseFrequency="0.8 0.4" numOctaves="2" result="texture" />
          <feDisplacementMap in="SourceGraphic" in2="texture" scale="1.5" />
        </filter>

        {/* Soft inner glow for core */}
        <filter id="softInnerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="innerGlow"/>
          <feOffset dx="0" dy="0" result="innerGlow"/>
          <feMerge>
            <feMergeNode in="innerGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Fuzzy sleep glow filter */}
        <filter id="fuzzyGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="fuzzyBlur"/>
          <feOffset dx="0" dy="0" result="fuzzyBlur"/>
          <feMerge>
            <feMergeNode in="fuzzyBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Star twinkle filter */}
        <filter id="starTwinkle" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="starGlow"/>
          <feMerge>
            <feMergeNode in="starGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background starry night with gentle drift */}
      <motion.rect 
        width="1000" 
        height="1000" 
        x="-500" 
        y="-500" 
        fill="url(#starrySky)"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      />

      {/* Oil Canvas Wind Currents - Kandinsky-inspired flowing forms */}
      <motion.path
        d="M -350,0 Q -250,150 -100,50 Q 50,-80 200,20 Q 300,120 350,0"
        fill="none"
        stroke="hsl(220, 45%, 35%)" // Deep oil paint blue
        strokeWidth="6"
        strokeOpacity="0.25"
        filter="url(#swirl)"
        animate={{
          d: [
            "M -350,0 Q -250,150 -100,50 Q 50,-80 200,20 Q 300,120 350,0",
            "M -350,25 Q -250,125 -100,75 Q 50,-55 200,45 Q 300,95 350,25",
            "M -350,0 Q -250,150 -100,50 Q 50,-80 200,20 Q 300,120 350,0"
          ],
          strokeWidth: [4, 8, 4],
          strokeOpacity: [0.15, 0.35, 0.15]
        }}
        transition={{
          duration: 28, // Slower, more stable
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Van Gogh Starry Night Mosaic Background */}
      {starryNightMosaic.map((brush, i) => (
        <motion.ellipse
          key={`starry-mosaic-${i}`}
          cx={brush.x}
          cy={brush.y}
          rx={brush.size * 1.8}
          ry={brush.size * 0.8}
          fill={brush.color}
          opacity={brush.isYellow ? 0.4 + brush.intensity * 0.3 : 0.15 + brush.intensity * 0.2}
          filter={brush.isYellow ? "url(#starTwinkle)" : "url(#brushTexture)"}
          transform={`rotate(${brush.rotation} ${brush.x} ${brush.y})`}
          animate={{
            scale: brush.isYellow ? [0.8, 1.2, 0.8] : [0.98, 1.02, 0.98],
            opacity: brush.isYellow ? 
              [0.3, 0.7, 0.3] : 
              [0.1 + brush.intensity * 0.15, 0.25 + brush.intensity * 0.2, 0.1 + brush.intensity * 0.15],
            rotate: [brush.rotation, brush.rotation + (brush.swirl * 5), brush.rotation]
          }}
          transition={{
            duration: brush.isYellow ? 4 + i * 0.1 : 45 + i * 0.3, // Stars twinkle faster
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}

      {/* Atmospheric fog layer */}
      <motion.circle
        cx={0}
        cy={0}
        r={350}
        fill="url(#atmosphericFog)"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 300,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Enhanced breathing sun rays with gradient fade */}
      <motion.circle
        cx={0}
        cy={0}
        r={90}
        fill="url(#sunRaysEnhanced)"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 12, 0],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Van Gogh's sun core with soft inner glow pulse */}
      <motion.circle
        cx={0}
        cy={0}
        r={35}
        fill="url(#sunCoreGradient)"
        filter="url(#softInnerGlow)"
        animate={{
          scale: [1, 1.02, 1],
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

      {/* Floating geometric forms - Kandinsky style with oil texture */}
      <motion.ellipse
        cx={-150}
        cy={-100}
        rx={40}
        ry={20}
        fill="hsl(42, 70%, 55%)" // Rich oil paint ochre
        opacity="0.25"
        filter="url(#emotionalGlow)"
        animate={{
          cx: [-150, -135, -150], // Stabilized motion
          cy: [-100, -115, -100],
          rotate: [0, 8, 0], // Reduced rotation
          opacity: [0.18, 0.32, 0.18]
        }}
        transition={{
          duration: 24, // Slower, more stable
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.rect
        x={120}
        y={80}
        width={30}
        height={15}
        fill="hsl(280, 70%, 55%)" // Rich purple oil paint
        opacity="0.22"
        filter="url(#brushTexture)"
        animate={{
          x: [120, 132, 120], // Stabilized motion
          y: [80, 68, 80],
          rotate: [0, -6, 0], // Reduced rotation
          scale: [1, 1.05, 1],
          opacity: [0.18, 0.28, 0.18]
        }}
        transition={{
          duration: 26, // Slower, more stable
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Radial time structure with slow orbital motion */}
      {[80, 120, 160, 200, 240].map((radius, ringIndex) => (
        <motion.g
          key={`ring-orbit-${radius}`}
          animate={{ rotate: [0, 360] }}
          transition={{ 
            duration: 120 + ringIndex * 30, 
            repeat: Infinity, 
            ease: "linear",
            delay: ringIndex * 8
          }}
        >
          <motion.circle
            cx={0}
            cy={0}
            r={radius}
            fill="none"
            stroke="hsl(220, 50%, 40%)"
            strokeWidth="1.5"
            strokeOpacity="0.2"
            strokeDasharray={`${radius * 0.08}, ${radius * 0.06}`}
            filter="url(#brushTexture)"
            animate={{
              strokeOpacity: [0.1, 0.3, 0.1],
              strokeWidth: [1, 2.5, 1]
            }}
            transition={{
              duration: 8 + ringIndex * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ringIndex * 1.5
            }}
          />
        </motion.g>
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

      {/* Sleep spirals with fuzzy glow - Exhibition quality */}
      {sleepData.map((sleep, i) => {
        const spiralRadius = 80 + i * 20;
        const x = spiralRadius * Math.cos((sleep.angle * Math.PI) / 180);
        const y = spiralRadius * Math.sin((sleep.angle * Math.PI) / 180);
        const spiralColor = sleep.phase === "deep" ? "hsl(230, 60%, 30%)" : 
                           sleep.phase === "REM" ? "hsl(280, 70%, 50%)" : 
                           "hsl(200, 40%, 60%)";
        
        return (
          <motion.g key={`sleep-spiral-${i}`}>
            {/* Fuzzy background glow for sleep elements */}
            <motion.circle
              cx={x}
              cy={y}
              r={15 + sleep.depth * 10}
              fill={spiralColor}
              opacity={0.1 + sleep.depth * 0.15}
              filter="url(#fuzzyGlow)"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.25, 0.05]
              }}
              transition={{
                duration: 8 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5
              }}
            />
            {/* Sharp spiral path */}
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


      {/* Calendar Hour Markers with Data Visualization */}
      {Array.from({ length: 24 }, (_, hour) => {
        const angle = (hour * 15) * Math.PI / 180; // 24 hours = 360°
        const x = 280 * Math.cos(angle);
        const y = 280 * Math.sin(angle);
        const isCurrentHour = new Date().getHours() === hour;
        const hasData = hour % 3 === 0; // Simulate data points every 3 hours
        
        return (
          <motion.g key={`hour-${hour}`}>
            {/* Hour marker */}
            <motion.circle
              cx={x}
              cy={y}
              r={isCurrentHour ? 4 : 2}
              fill={isCurrentHour ? "hsl(45, 100%, 80%)" : "hsl(220, 40%, 60%)"}
              opacity={isCurrentHour ? 1 : 0.5}
              animate={{
                scale: isCurrentHour ? [1, 1.3, 1] : [1, 1.1, 1],
                opacity: isCurrentHour ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: isCurrentHour ? 2 : 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: hour * 0.1
              }}
              onClick={() => console.log(`Hour: ${hour}:00`)}
              style={{ cursor: 'pointer' }}
            />
            
            {/* Data visualization for significant hours */}
            {hasData && (
              <motion.path
                d={`M ${x} ${y} Q ${x + 15} ${y - 15} ${x + 10} ${y + 10}`}
                fill="none"
                stroke="hsl(45, 70%, 60%)"
                strokeWidth="2"
                opacity="0.6"
                filter="url(#paintStroke)"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: hour * 0.2
                }}
              />
            )}
            
            {/* Hour label */}
            <motion.text
              x={x * 1.1}
              y={y * 1.1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(220, 40%, 70%)"
              fontSize="8"
              opacity="0.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: hour * 0.05 }}
            >
              {hour}
            </motion.text>
          </motion.g>
        );
      })}

      {/* Exhibition-quality twinkling stars with slow rotation */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 400, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 20 }, (_, i) => {
          const baseAngle = (i * 18) * Math.PI / 180;
          const radius = 260 + Math.sin(i * 0.7) * 80;
          const baseX = radius * Math.cos(baseAngle);
          const baseY = radius * Math.sin(baseAngle);
          const starSize = 1.2 + Math.sin(i * 0.3) * 1.8;
          
          return (
            <motion.circle
              key={`star-${i}`}
              cx={baseX}
              cy={baseY}
              r={starSize}
              fill="hsl(45, 85%, 85%)"
              filter="url(#starTwinkle)"
              animate={{
                scale: [0.8, 1.4 + Math.sin(i) * 0.3, 0.8],
                opacity: [0.3, 0.95, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          );
        })}
      </motion.g>

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

      {/* Exhibition-quality central quote with breathing typography */}
      <motion.text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="hsl(45, 75%, 75%)"
        fontSize="14"
        opacity="0.7"
        fontFamily="Dancing Script, cursive"
        fontWeight="500"
        animate={{
          y: [0, -3, 0],
          opacity: [0.6, 0.8, 0.6],
          scale: [1, 1.01, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        style={{ filter: "drop-shadow(0 0 8px hsl(45, 80%, 60%, 0.3))" }}
      >
        "I dream my painting and I paint my dream"
      </motion.text>
    </motion.svg>
  );
};