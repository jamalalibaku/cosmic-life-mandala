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
      y={-radius - 15}
      textAnchor="middle"
      fill={color}
      fontSize={12}
      fontWeight="600"
      opacity={0.8}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {name}
    </motion.text>
  );
};

const Layer: React.FC<{ 
  name: string; 
  data: any[]; 
  radius: number; 
  color: string;
  zoomLevel: string;
}> = ({ name, data, radius, color, zoomLevel }) => {
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      {/* Ring outline */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        stroke={color}
        strokeWidth={detailLevel === "outline" ? 1 : 2}
        fill="none"
        opacity={0.6}
        animate={{ 
          strokeDasharray: detailLevel === "outline" ? "5,5" : "none",
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
              <circle
                cx={x}
                cy={y}
                r={3}
                fill={color}
                opacity={0.7}
              />
            )}
            
            {detailLevel === "segments" && (
              <motion.path
                d={`M ${x} ${y} L ${x * 1.1} ${y * 1.1}`}
                stroke={color}
                strokeWidth={2}
                opacity={0.8}
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            )}

            {(detailLevel === "detail" || detailLevel === "micro") && (
              <motion.circle
                cx={x}
                cy={y}
                r={detailLevel === "micro" ? 5 : 4}
                fill={color}
                opacity={0.9}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.9, 0.6, 0.9]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
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
        <filter id="selfGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="selfGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 90%, 80%)" stopOpacity={1} />
          <stop offset="50%" stopColor="hsl(35, 80%, 60%)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="hsl(25, 70%, 40%)" stopOpacity={0.4} />
        </radialGradient>
      </defs>
      
      {/* Core self - breathing center */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        fill="url(#selfGradient)"
        filter="url(#selfGlow)"
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.9, 0.7, 0.9]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner pulse */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius * 0.7}
        stroke="hsl(45, 100%, 90%)"
        strokeWidth={1}
        fill="none"
        opacity={0.5}
        animate={{ 
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
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
        />
      ))}

      {/* Glowing center - Self */}
      <GlowingCore radius={centerRadius} />
    </motion.g>
  );
};