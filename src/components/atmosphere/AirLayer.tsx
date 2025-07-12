import React from 'react';
import { useBreathingPulse } from '@/hooks/use-breathing-pulse';

interface AirLayerProps {
  center: { x: number; y: number };
  outerRadius: number;
  timeOfDay?: Date;
  visible?: boolean;
}

const getTimeOfDayRatio = (date: Date): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours + minutes / 60) / 24;
};

const getSkyColors = (timeRatio: number) => {
  // Pre-dawn (4-6am): 0.17 - 0.25
  if (timeRatio >= 0.17 && timeRatio < 0.25) {
    const t = (timeRatio - 0.17) / 0.08;
    return {
      inner: `hsl(${240 + t * 20}, ${70 - t * 30}%, ${15 + t * 25}%)`,
      outer: `hsl(${250 + t * 30}, ${60 - t * 20}%, ${10 + t * 15}%)`
    };
  }
  
  // Dawn (6-8am): 0.25 - 0.33
  if (timeRatio >= 0.25 && timeRatio < 0.33) {
    const t = (timeRatio - 0.25) / 0.08;
    return {
      inner: `hsl(${280 + t * 40}, ${40 + t * 30}%, ${40 + t * 20}%)`,
      outer: `hsl(${320 + t * 40}, ${50 + t * 20}%, ${25 + t * 25}%)`
    };
  }
  
  // Morning (8am-12pm): 0.33 - 0.5
  if (timeRatio >= 0.33 && timeRatio < 0.5) {
    const t = (timeRatio - 0.33) / 0.17;
    return {
      inner: `hsl(${200 + t * 10}, ${60 + t * 20}%, ${70 + t * 15}%)`,
      outer: `hsl(${210 + t * 10}, ${50 + t * 20}%, ${50 + t * 25}%)`
    };
  }
  
  // Midday (12pm-4pm): 0.5 - 0.67
  if (timeRatio >= 0.5 && timeRatio < 0.67) {
    return {
      inner: `hsl(210, 80%, 85%)`,
      outer: `hsl(220, 70%, 75%)`
    };
  }
  
  // Afternoon (4pm-6pm): 0.67 - 0.75
  if (timeRatio >= 0.67 && timeRatio < 0.75) {
    const t = (timeRatio - 0.67) / 0.08;
    return {
      inner: `hsl(${210 - t * 60}, ${80 - t * 20}%, ${85 - t * 25}%)`,
      outer: `hsl(${220 - t * 80}, ${70 - t * 30}%, ${75 - t * 35}%)`
    };
  }
  
  // Sunset (6pm-8pm): 0.75 - 0.83
  if (timeRatio >= 0.75 && timeRatio < 0.83) {
    const t = (timeRatio - 0.75) / 0.08;
    return {
      inner: `hsl(${30 - t * 20}, ${70 + t * 20}%, ${60 - t * 20}%)`,
      outer: `hsl(${280 + t * 40}, ${60 + t * 20}%, ${40 - t * 15}%)`
    };
  }
  
  // Twilight (8pm-10pm): 0.83 - 0.92
  if (timeRatio >= 0.83 && timeRatio < 0.92) {
    const t = (timeRatio - 0.83) / 0.09;
    return {
      inner: `hsl(${250 + t * 20}, ${50 - t * 20}%, ${30 - t * 15}%)`,
      outer: `hsl(${240 + t * 20}, ${60 - t * 30}%, ${20 - t * 10}%)`
    };
  }
  
  // Night (10pm-4am): 0.92 - 0.17
  return {
    inner: `hsl(240, 30%, 15%)`,
    outer: `hsl(260, 40%, 10%)`
  };
};

export const AirLayer: React.FC<AirLayerProps> = ({
  center,
  outerRadius,
  timeOfDay = new Date(),
  visible = true
}) => {
  const { breathingState } = useBreathingPulse(); // Gentle breathing cycle
  
  if (!visible) return null;
  
  const timeRatio = getTimeOfDayRatio(timeOfDay);
  const colors = getSkyColors(timeRatio);
  
  // Create gentle atmospheric undulation
  const atmosphereRadius = outerRadius * 1.4;
  const innerAtmosphereRadius = outerRadius * 1.1;
  
  // Breathing effect for the atmosphere
  const radiusVariation = 1 + (breathingState.scale - 1) * 0.3;
  const opacityVariation = 0.3 + breathingState.opacity * 0.4;
  
  return (
    <g opacity={opacityVariation}>
      {/* Outer atmospheric glow */}
      <circle
        cx={center.x}
        cy={center.y}
        r={atmosphereRadius * radiusVariation}
        fill={`url(#airGradientOuter-${timeRatio.toFixed(2)})`}
        opacity="0.4"
      />
      
      {/* Inner atmospheric layer */}
      <circle
        cx={center.x}
        cy={center.y}
        r={innerAtmosphereRadius * radiusVariation}
        fill={`url(#airGradientInner-${timeRatio.toFixed(2)})`}
        opacity="0.6"
      />
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient 
          id={`airGradientOuter-${timeRatio.toFixed(2)}`}
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor={colors.inner} stopOpacity="0" />
          <stop offset="70%" stopColor={colors.outer} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.outer} stopOpacity="0.6" />
        </radialGradient>
        
        <radialGradient 
          id={`airGradientInner-${timeRatio.toFixed(2)}`}
          cx="50%" 
          cy="50%" 
          r="50%"
        >
          <stop offset="0%" stopColor={colors.inner} stopOpacity="0" />
          <stop offset="60%" stopColor={colors.inner} stopOpacity="0.2" />
          <stop offset="100%" stopColor={colors.outer} stopOpacity="0.4" />
        </radialGradient>
      </defs>
    </g>
  );
};