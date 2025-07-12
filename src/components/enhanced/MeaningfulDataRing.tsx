/**
 * (c) 2025 Cosmic Life Mandala – Enhanced Data Blob Ring
 * More meaningful data geometry - shaped by actual data patterns
 */

import React, { useMemo } from 'react';
import { goldenRatio } from '../../utils/golden-ratio';
import { BreathingLayer, FloatingParticles } from './OrganicMotionDrift';

export interface DataBlob {
  hour: number;
  type: string;
  intensity: number;
  duration: number;
  value: number;
  sourceLayer: string;
  dataPoint: string;
}

interface EnhancedDataBlobRingProps {
  data: DataBlob[];
  centerX: number;
  centerY: number;
  innerRadius: number;
  outerRadius: number;
  type: 'mobility' | 'mood' | 'sleep';
  theme?: string;
  onDataClick?: (blob: DataBlob) => void;
}

export const EnhancedDataBlobRing: React.FC<EnhancedDataBlobRingProps> = ({
  data,
  centerX,
  centerY,
  innerRadius,
  outerRadius,
  type,
  theme = 'default',
  onDataClick
}) => {
  
  // Create meaningful data shapes based on actual values
  const dataShapes = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const shapes = [];
    const segmentAngle = 360 / 24; // 24 hours
    
    data.forEach((blob, index) => {
      const angle = (blob.hour / 24) * 360;
      const hasData = blob.intensity > 0.1;
      
      if (!hasData) return; // Skip empty data points - creates natural gaps
      
      // Shape size based on data intensity and duration
      const radiusVariation = blob.intensity * (outerRadius - innerRadius) * 0.4;
      const blobRadius = innerRadius + radiusVariation;
      
      // Create organic bulges where data is rich
      const bulgeFactor = 1 + (blob.duration * 0.3);
      const actualRadius = blobRadius * bulgeFactor;
      
      // Position calculation
      const rad = goldenRatio.toRadians(angle - 90);
      const x = centerX + Math.cos(rad) * actualRadius;
      const y = centerY + Math.sin(rad) * actualRadius;
      
      // Width based on duration - longer activities get wider shapes
      const blobWidth = 8 + (blob.duration * 12);
      const blobHeight = 6 + (blob.intensity * 10);
      
      // Connection threads to previous data point
      const connectionThread = index > 0 && data[index - 1].intensity > 0.1 ? {
        prevAngle: (data[index - 1].hour / 24) * 360,
        prevIntensity: data[index - 1].intensity,
        currentAngle: angle,
        currentIntensity: blob.intensity
      } : null;
      
      shapes.push({
        id: `${type}-${blob.hour}`,
        x,
        y,
        angle,
        width: blobWidth,
        height: blobHeight,
        intensity: blob.intensity,
        duration: blob.duration,
        value: blob.value,
        blob,
        connectionThread,
        hasData: true
      });
    });
    
    return shapes;
  }, [data, centerX, centerY, innerRadius, outerRadius, type]);
  
  // Color schemes for each data type
  const colorSchemes = {
    mobility: {
      base: 'hsl(120, 60%, 60%)',
      glow: 'hsl(120, 80%, 70%)',
      thread: 'hsl(120, 40%, 50%)'
    },
    mood: {
      base: 'hsl(280, 60%, 65%)',
      glow: 'hsl(280, 80%, 75%)',
      thread: 'hsl(280, 40%, 55%)'
    },
    sleep: {
      base: 'hsl(260, 50%, 65%)',
      glow: 'hsl(260, 70%, 75%)',
      thread: 'hsl(260, 30%, 55%)'
    }
  };
  
  const colors = colorSchemes[type];
  
  // Create connection threads between related data points
  const connectionPaths = useMemo(() => {
    const paths = [];
    
    dataShapes.forEach((shape, index) => {
      if (shape.connectionThread && index > 0) {
        const prevShape = dataShapes[index - 1];
        if (prevShape) {
          // Create a smooth curve between data points
          const midX = (shape.x + prevShape.x) / 2;
          const midY = (shape.y + prevShape.y) / 2;
          
          // Control points for smooth curve
          const cp1X = prevShape.x + (midX - prevShape.x) * 0.5;
          const cp1Y = prevShape.y + (midY - prevShape.y) * 0.5;
          const cp2X = shape.x + (midX - shape.x) * 0.5;
          const cp2Y = shape.y + (midY - shape.y) * 0.5;
          
          const pathData = `M ${prevShape.x},${prevShape.y} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${shape.x},${shape.y}`;
          
          paths.push({
            id: `connection-${prevShape.id}-${shape.id}`,
            pathData,
            opacity: Math.min(shape.intensity, prevShape.intensity) * 0.6
          });
        }
      }
    });
    
    return paths;
  }, [dataShapes]);
  
  return (
    <BreathingLayer intensity={0.3} rhythm="calm">
      <g className={`enhanced-data-blob-ring ${type}`}>
        <defs>
          <radialGradient id={`${type}-blob-gradient`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.9" />
            <stop offset="60%" stopColor={colors.base} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.base} stopOpacity="0.3" />
          </radialGradient>
          
          {/* Enhanced glow with better depth */}
          <filter id={`${type}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feOffset in="coloredBlur" dx="0" dy="0" result="offsetBlur"/>
            <feMerge>
              <feMergeNode in="offsetBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      
      {/* Connection threads showing data relationships */}
      {connectionPaths.map(path => (
        <path
          key={path.id}
          d={path.pathData}
          fill="none"
          stroke={colors.thread}
          strokeWidth="1"
          opacity={path.opacity}
          filter={`url(#${type}-glow)`}
          className="pointer-events-none"
        />
      ))}
      
        {/* Data-driven organic shapes with motion */}
        {dataShapes.map(shape => (
          <FloatingParticles key={shape.id} intensity={0.15}>
            <g className="data-blob-shape">
              <ellipse
                cx={shape.x}
                cy={shape.y}
                rx={shape.width}
                ry={shape.height}
                fill={`url(#${type}-blob-gradient)`}
                opacity={0.4 + shape.intensity * 0.5}
                filter={`url(#${type}-glow)`}
                transform={`rotate(${shape.angle} ${shape.x} ${shape.y})`}
                className="cursor-pointer transition-all duration-300 hover:opacity-95 hover:scale-110"
                onClick={() => onDataClick?.(shape.blob)}
                style={{
                  filter: `url(#${type}-glow) drop-shadow(0 0 8px ${colors.glow}40)`
                }}
              />
              
              {/* Enhanced data value indicator */}
              {shape.intensity > 0.7 && (
                <circle
                  cx={shape.x}
                  cy={shape.y}
                  r="4"
                  fill={colors.glow}
                  opacity="0.9"
                  filter={`url(#${type}-glow)`}
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          </FloatingParticles>
        ))}
      
        {/* Enhanced guide ring with better visibility */}
        <circle
          cx={centerX}
          cy={centerY}
          r={(innerRadius + outerRadius) / 2}
          fill="none"
          stroke={colors.base}
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray={dataShapes.length > 0 ? "3,12" : "none"}
          className="pointer-events-none"
          filter={`url(#${type}-glow)`}
        />
      </g>
    </BreathingLayer>
  );
};