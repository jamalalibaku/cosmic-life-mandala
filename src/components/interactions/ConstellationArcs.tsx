import React from 'react';
import { motion } from 'framer-motion';
import { getConstellationColors } from '../../utils/constellation-engine';

interface SliceMatch {
  sliceId1: string;
  sliceId2: string;
  correlationScore: number;
  dataContext: string;
  narrativeLabel: string;
  layerType: string;
  timeDifference: number;
}

interface LayerData {
  name: string;
  data: any[];
  color: string;
  radius: number;
  zoomLevel?: "year" | "month" | "week" | "day" | "hour";
  layerType?: "mood" | "places" | "mobility" | "plans" | "weather" | "moon";
  isWeek?: boolean;
}

interface ConstellationArcsProps {
  constellations: SliceMatch[];
  layers: LayerData[];
  centerRadius: number;
  layerSpacing: number;
}

export const ConstellationArcs: React.FC<ConstellationArcsProps> = ({
  constellations,
  layers,
  centerRadius,
  layerSpacing
}) => {
  const colors = getConstellationColors();
  
  const findSlicePosition = (sliceId: string) => {
    for (const layer of layers) {
      const sliceIndex = layer.data?.findIndex(item => 
        `${layer.name}-${item.angle || Math.random()}` === sliceId
      );
      
      if (sliceIndex !== -1 && layer.data) {
        const slice = layer.data[sliceIndex];
        const radius = centerRadius + (layers.indexOf(layer) * layerSpacing);
        const angle = slice.angle || (sliceIndex / layer.data.length) * 360;
        const radian = (angle * Math.PI) / 180;
        
        return {
          x: radius * Math.cos(radian),
          y: radius * Math.sin(radian),
          radius,
          angle: radian
        };
      }
    }
    return null;
  };

  const createArcPath = (pos1: any, pos2: any) => {
    if (!pos1 || !pos2) return '';
    
    // Calculate control points for a graceful arc
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2;
    const distance = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
    
    // Arc height based on distance (more curve for longer distances)
    const arcHeight = Math.min(distance * 0.3, 150);
    const controlX = midX;
    const controlY = midY - arcHeight;
    
    return `M ${pos1.x} ${pos1.y} Q ${controlX} ${controlY} ${pos2.x} ${pos2.y}`;
  };

  return (
    <g className="constellation-arcs">
      {constellations.map((constellation, index) => {
        const pos1 = findSlicePosition(constellation.sliceId1);
        const pos2 = findSlicePosition(constellation.sliceId2);
        
        if (!pos1 || !pos2) return null;
        
        const pathData = createArcPath(pos1, pos2);
        const color = colors[constellation.layerType] || colors.all;
        const opacity = Math.max(0.2, constellation.correlationScore * 0.8);
        
        return (
          <g key={`constellation-${index}`}>
            {/* Main arc */}
            <motion.path
              d={pathData}
              stroke={color}
              strokeWidth="2"
              fill="none"
              opacity={opacity}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
              className="constellation-arc"
            />
            
            {/* Glow effect */}
            <motion.path
              d={pathData}
              stroke={color}
              strokeWidth="6"
              fill="none"
              opacity={opacity * 0.3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: opacity * 0.3 }}
              transition={{ duration: 1.5, delay: index * 0.1 }}
              filter="blur(3px)"
              className="constellation-glow"
            />
            
            {/* Animated pulse traveling the arc */}
            <motion.circle
              r="3"
              fill={color}
              opacity={opacity}
              initial={{ offset: 0 }}
              animate={{ offset: 1 }}
              transition={{
                duration: 3,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                begin={`${index * 0.2}s`}
              >
                <mpath href={`#constellation-path-${index}`} />
              </animateMotion>
            </motion.circle>
            
            {/* Hidden path for animation reference */}
            <path
              id={`constellation-path-${index}`}
              d={pathData}
              fill="none"
              stroke="none"
            />
            
            {/* Connection points */}
            <motion.circle
              cx={pos1.x}
              cy={pos1.y}
              r="4"
              fill={color}
              opacity={opacity * 0.8}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="constellation-node"
            />
            <motion.circle
              cx={pos2.x}
              cy={pos2.y}
              r="4"
              fill={color}
              opacity={opacity * 0.8}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="constellation-node"
            />
          </g>
        );
      })}
      
      {/* Tooltip on hover */}
      {constellations.map((constellation, index) => {
        const pos1 = findSlicePosition(constellation.sliceId1);
        const pos2 = findSlicePosition(constellation.sliceId2);
        
        if (!pos1 || !pos2) return null;
        
        const midX = (pos1.x + pos2.x) / 2;
        const midY = (pos1.y + pos2.y) / 2 - 50;
        
        return (
          <g
            key={`constellation-tooltip-${index}`}
            className="constellation-tooltip opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <rect
              x={midX - 80}
              y={midY - 20}
              width="160"
              height="40"
              rx="8"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.9"
            />
            <text
              x={midX}
              y={midY - 5}
              textAnchor="middle"
              fontSize="12"
              fill="hsl(var(--foreground))"
              className="font-medium"
            >
              {constellation.narrativeLabel}
            </text>
            <text
              x={midX}
              y={midY + 8}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
            >
              {Math.round(constellation.timeDifference)} days apart
            </text>
          </g>
        );
      })}
    </g>
  );
};