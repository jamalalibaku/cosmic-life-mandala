/**
 * Radial Layer Architecture System
 * Hierarchical, concentric timeline structure for life dimensions
 */

import React from "react";
import { motion } from "framer-motion";

interface LayerData {
  name: string;
  data: any[];
  color: string;
  radius: number;
  zoomLevel?: "year" | "month" | "week" | "day" | "hour";
}

interface RadialLayerSystemProps {
  layers: LayerData[];
  currentZoom?: "year" | "month" | "week" | "day" | "hour";
  centerRadius?: number;
  layerSpacing?: number;
}

const RingLabel: React.FC<{ name: string; radius: number; color: string }> = ({ 
  name, 
  radius, 
  color 
}) => {
  return (
    <motion.text
      x={0}
      y={-radius - 18}
      textAnchor="middle"
      fill={color}
      fontSize={10}
      fontWeight="300"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="0.05em"
      opacity={0.85}
      initial={{ opacity: 0, y: -radius - 25 }}
      animate={{ opacity: 0.85, y: -radius - 18 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {name.toUpperCase()}
    </motion.text>
  );
};

const Layer: React.FC<{ 
  name: string; 
  data: any[]; 
  radius: number; 
  color: string;
  zoomLevel: string;
  layerIndex: number;
  totalLayers: number;
}> = ({ name, data, radius, color, zoomLevel, layerIndex, totalLayers }) => {
  const getDetailLevel = () => {
    switch (zoomLevel) {
      case "year": return "outline";
      case "month": return "trends";
      case "week": return "segments";
      case "day": return "detail";
      case "hour": return "micro";
      default: return "outline";
    }
  };

  const detailLevel = getDetailLevel();

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.1 * (totalLayers - layerIndex), ease: "easeOut" }}
    >
      {/* Ring shadow */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        stroke="none"
        fill="none"
        style={{
          filter: `drop-shadow(0 0 ${radius * 0.02}px ${color}40)`
        }}
      />
      
      {/* Ring outline */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        stroke={color}
        strokeWidth={detailLevel === "outline" ? 0.8 : 1.2}
        fill="none"
        opacity={0.75}
        style={{
          filter: `drop-shadow(0 0 3px ${color}30)`,
          strokeLinecap: "round"
        }}
        animate={{ 
          strokeDasharray: detailLevel === "outline" ? "3,6" : "none",
          opacity: [0.75, 0.9, 0.75]
        }}
        transition={{
          strokeDasharray: { duration: 0 },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Data visualization based on zoom level */}
      {detailLevel !== "outline" && data.map((item, index) => {
        const angle = (index / data.length) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.g key={index}>
            {detailLevel === "trends" && (
              <motion.circle
                cx={x}
                cy={y}
                r={2.5}
                fill={color}
                opacity={0.8}
                style={{
                  filter: `drop-shadow(0 0 4px ${color}60)`
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {detailLevel === "segments" && (
              <motion.path
                d={`M ${x * 0.95} ${y * 0.95} L ${x * 1.05} ${y * 1.05}`}
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.85}
                style={{
                  filter: `drop-shadow(0 0 2px ${color}40)`
                }}
                animate={{ 
                  pathLength: [0, 1],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{ 
                  pathLength: { duration: 1.5, delay: index * 0.1 },
                  opacity: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                }}
              />
            )}

            {(detailLevel === "detail" || detailLevel === "micro") && (
              <motion.circle
                cx={x}
                cy={y}
                r={detailLevel === "micro" ? 4 : 3}
                fill={color}
                opacity={0.9}
                style={{
                  filter: `drop-shadow(0 0 6px ${color}50)`
                }}
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.g>
        );
      })}

      {/* Ring label */}
      <RingLabel name={name} radius={radius} color={color} />
    </motion.g>
  );
};

const GlowingCore: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <motion.g>
      <defs>
        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 70%, 75%)" stopOpacity={1} />
          <stop offset="40%" stopColor="hsl(35, 60%, 65%)" stopOpacity={0.9} />
          <stop offset="80%" stopColor="hsl(25, 50%, 50%)" stopOpacity={0.6} />
          <stop offset="100%" stopColor="hsl(15, 40%, 35%)" stopOpacity={0.2} />
        </radialGradient>
        <radialGradient id="coreInnerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 90%, 85%)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="hsl(45, 90%, 85%)" stopOpacity={0} />
        </radialGradient>
      </defs>
      
      {/* Outer glow ring */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius * 1.3}
        fill="url(#coreInnerGlow)"
        opacity={0.3}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Core self - breathing center */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        fill="url(#coreGradient)"
        filter="url(#coreGlow)"
        animate={{ 
          scale: [1, 1.06, 1],
          opacity: [0.95, 0.8, 0.95]
        }}
        transition={{ 
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner pulse ring */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius * 0.75}
        stroke="hsl(45, 80%, 85%)"
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
        style={{
          filter: "drop-shadow(0 0 4px hsl(45, 80%, 85%))"
        }}
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Center label */}
      <motion.text
        x={0}
        y={4}
        textAnchor="middle"
        fill="hsl(45, 70%, 90%)"
        fontSize={8}
        fontWeight="300"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.1em"
        opacity={0.9}
        animate={{
          opacity: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        NOW
      </motion.text>
    </motion.g>
  );
};

export const RadialLayerSystem: React.FC<RadialLayerSystemProps> = ({
  layers,
  currentZoom = "month",
  centerRadius = 40,
  layerSpacing = 50
}) => {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Render layers from outside to inside */}
      {layers.slice().reverse().map((layer, index) => (
        <Layer
          key={layer.name}
          name={layer.name}
          data={layer.data}
          radius={layer.radius}
          color={layer.color}
          zoomLevel={currentZoom}
          layerIndex={index}
          totalLayers={layers.length}
        />
      ))}

      {/* Glowing center - Self */}
      <GlowingCore radius={centerRadius} />
    </motion.g>
  );
};