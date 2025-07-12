import React from 'react';
import { motion } from 'framer-motion';
import { EssenceData, getMoodPattern, getEnergySpeed } from '../../data/mock-essence-data';

interface EssenceLayerProps {
  essenceData: EssenceData[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  currentDate: Date;
}

const EssenceLayer: React.FC<EssenceLayerProps> = ({
  essenceData,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  currentDate
}) => {
  // Get current essence data
  const currentEssence = essenceData.find(essence => 
    essence.timestamp.toDateString() === currentDate.toDateString()
  );

  if (!currentEssence) return null;

  const { essence, mood, energy } = currentEssence;
  
  // Calculate visual properties based on essence score
  const opacity = Math.max(0.3, essence / 100);
  const thickness = Math.max(8, (essence / 100) * (outerRadius - innerRadius));
  const radius = innerRadius + thickness / 2;
  
  // Get pattern and speed based on mood and energy
  const pattern = getMoodPattern(mood);
  const speed = getEnergySpeed(energy);
  
  // Create pattern-specific path modifications
  const getPatternPath = (baseRadius: number, pattern: string): string => {
    const points = 72; // Number of points for smooth circle
    const angleStep = (2 * Math.PI) / points;
    let pathData = "";
    
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      let radiusModifier = 1;
      
      switch (pattern) {
        case "spiky":
          radiusModifier = 1 + Math.sin(angle * 8) * 0.15;
          break;
        case "radiant":
          radiusModifier = 1 + Math.sin(angle * 6) * 0.1 + Math.cos(angle * 12) * 0.05;
          break;
        case "wavy":
          radiusModifier = 1 + Math.sin(angle * 4) * 0.08;
          break;
        case "explosive":
          radiusModifier = 1 + Math.sin(angle * 10) * 0.2 + Math.random() * 0.1;
          break;
        case "muted":
          radiusModifier = 0.9 + Math.sin(angle * 2) * 0.05;
          break;
        case "gentle":
          radiusModifier = 1 + Math.sin(angle * 3) * 0.06;
          break;
        default: // smooth
          radiusModifier = 1;
      }
      
      const x = centerX + Math.cos(angle) * (baseRadius * radiusModifier);
      const y = centerY + Math.sin(angle) * (baseRadius * radiusModifier);
      
      if (i === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    }
    
    return pathData + " Z";
  };

  // Color based on essence score
  const getEssenceColor = (score: number): string => {
    if (score >= 80) return "hsl(120, 70%, 50%)"; // Vibrant green
    if (score >= 60) return "hsl(60, 80%, 55%)"; // Golden yellow
    if (score >= 40) return "hsl(30, 75%, 60%)"; // Warm orange
    return "hsl(0, 60%, 55%)"; // Soft red
  };

  const essenceColor = getEssenceColor(essence);

  return (
    <g className="essence-layer">
      {/* Outer glow ring */}
      <motion.path
        d={getPatternPath(outerRadius, pattern)}
        fill="none"
        stroke={essenceColor}
        strokeWidth="2"
        opacity={opacity * 0.3}
        filter="url(#essence-glow)"
        animate={{
          strokeDasharray: ["0 100", "50 50", "0 100"],
          rotate: 360
        }}
        transition={{
          strokeDasharray: {
            duration: 4 / speed,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20 / speed,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
      />
      
      {/* Main essence ring */}
      <motion.path
        d={getPatternPath(radius, pattern)}
        fill="none"
        stroke={essenceColor}
        strokeWidth={thickness / 4}
        opacity={opacity}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [opacity, opacity * 1.2, opacity]
        }}
        transition={{
          duration: 2 / speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
      />
      
      {/* Inner pulse ring */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={innerRadius}
        fill={essenceColor}
        opacity={opacity * 0.1}
        animate={{
          r: [innerRadius, innerRadius + 10, innerRadius],
          opacity: [opacity * 0.1, opacity * 0.3, opacity * 0.1]
        }}
        transition={{
          duration: 3 / speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Energy particles for high energy states */}
      {energy === "High" && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={centerX}
              cy={centerY}
              r="2"
              fill={essenceColor}
              opacity={0.6}
              animate={{
                x: [0, Math.cos(i * Math.PI / 3) * 30, 0],
                y: [0, Math.sin(i * Math.PI / 3) * 30, 0],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* SVG Filters */}
      <defs>
        <filter id="essence-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Mood and energy label */}
      <text
        x={centerX}
        y={centerY + radius + 20}
        textAnchor="middle"
        fill={essenceColor}
        fontSize="10"
        opacity={0.7}
        className="font-light"
      >
        {mood} • {essence}%
      </text>
    </g>
  );
};

export default EssenceLayer;