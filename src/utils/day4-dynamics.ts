/**
 * [Phase: ZIP9-Zeta | Lap 6: Thematic Integration of Day 4 Dynamics]
 * Day 4 Dynamics Engine - Universal behaviors for all themes
 * 
 * Purpose: Apply core mandala behaviors (heartbeat, drift, sunburst) across all themes
 * Features: Theme-specific interpretations of universal motion patterns
 * Dependencies: theme-configs, unified motion engine
 */

import { Theme, ThemeConfig } from '@/utils/theme-configs';
import { MotionState } from '@/hooks/useUnifiedMotion';

export interface Day4DynamicsConfig {
  // Heartbeat/Pulse settings
  heartbeat: {
    intensity: number;      // 0-1 scale
    frequency: number;      // beats per minute
    waveform: 'sine' | 'pulse' | 'organic' | 'sharp';
  };
  
  // Wind & Gravity Drift
  drift: {
    strength: number;       // 0-1 scale
    direction: 'inward' | 'spiral' | 'random' | 'orbital';
    bounds: number;         // max drift distance
  };
  
  // Sunburst/Radiation effects
  sunburst: {
    type: 'rays' | 'pulse' | 'shimmer' | 'flicker' | 'data';
    intensity: number;      // 0-1 scale
    reach: number;          // distance from center
    color: string;          // theme-specific color
  };
  
  // Layer geometry consistency
  geometry: {
    layerSpacing: number;   // consistent across themes
    ringThickness: number;  // theme-specific interpretation
    nowMarkerSize: number;  // consistent NOW indicator
  };
}

// Theme-specific Day 4 dynamics configurations
export const day4DynamicsConfigs: Record<Theme, Day4DynamicsConfig> = {
  cosmic: {
    heartbeat: {
      intensity: 0.6,
      frequency: 60,
      waveform: 'sine'
    },
    drift: {
      strength: 0.4,
      direction: 'spiral',
      bounds: 8
    },
    sunburst: {
      type: 'rays',
      intensity: 0.8,
      reach: 50,
      color: 'hsl(45 100% 70%)'
    },
    geometry: {
      layerSpacing: 40,
      ringThickness: 2,
      nowMarkerSize: 6
    }
  },

  interface: {
    heartbeat: {
      intensity: 0.8,
      frequency: 90,
      waveform: 'pulse'
    },
    drift: {
      strength: 0.2,
      direction: 'random',
      bounds: 4
    },
    sunburst: {
      type: 'data',
      intensity: 1.0,
      reach: 40,
      color: 'hsl(180 100% 70%)'
    },
    geometry: {
      layerSpacing: 35,
      ringThickness: 1,
      nowMarkerSize: 4
    }
  },

  mandala: {
    heartbeat: {
      intensity: 0.7,
      frequency: 45,
      waveform: 'organic'
    },
    drift: {
      strength: 0.6,
      direction: 'orbital',
      bounds: 12
    },
    sunburst: {
      type: 'shimmer',
      intensity: 0.9,
      reach: 60,
      color: 'hsl(280 80% 70%)'
    },
    geometry: {
      layerSpacing: 45,
      ringThickness: 3,
      nowMarkerSize: 8
    }
  },

  vangogh: {
    heartbeat: {
      intensity: 0.9,
      frequency: 50,
      waveform: 'organic'
    },
    drift: {
      strength: 0.7,
      direction: 'spiral',
      bounds: 15
    },
    sunburst: {
      type: 'flicker',
      intensity: 1.0,
      reach: 70,
      color: 'hsl(45 90% 65%)'
    },
    geometry: {
      layerSpacing: 50,
      ringThickness: 4,
      nowMarkerSize: 10
    }
  },

  horizons: {
    heartbeat: {
      intensity: 0.3,
      frequency: 30,
      waveform: 'sine'
    },
    drift: {
      strength: 0.3,
      direction: 'inward',
      bounds: 6
    },
    sunburst: {
      type: 'shimmer',
      intensity: 0.5,
      reach: 35,
      color: 'hsl(330 60% 70%)'
    },
    geometry: {
      layerSpacing: 38,
      ringThickness: 2,
      nowMarkerSize: 5
    }
  }
};

/**
 * Apply Day 4 dynamics to motion state based on theme
 */
export const applyDay4Dynamics = (
  themeId: Theme,
  motionState: MotionState,
  timeAccumulator: number
): MotionState => {
  const config = day4DynamicsConfigs[themeId];
  let enhancedState = { ...motionState };

  // Apply theme-specific heartbeat
  const heartbeatPhase = (timeAccumulator % (60000 / config.heartbeat.frequency)) / (60000 / config.heartbeat.frequency);
  
  switch (config.heartbeat.waveform) {
    case 'sine':
      enhancedState.heartbeat = Math.sin(heartbeatPhase * Math.PI * 2) * config.heartbeat.intensity * 0.1;
      break;
    case 'pulse':
      enhancedState.heartbeat = heartbeatPhase < 0.2 ? 
        Math.sin(heartbeatPhase * Math.PI * 10) * config.heartbeat.intensity * 0.15 : 0;
      break;
    case 'organic':
      enhancedState.heartbeat = (Math.sin(heartbeatPhase * Math.PI * 2) + 
        Math.sin(heartbeatPhase * Math.PI * 3) * 0.3) * config.heartbeat.intensity * 0.08;
      break;
    case 'sharp':
      enhancedState.heartbeat = heartbeatPhase < 0.1 ? 
        config.heartbeat.intensity * 0.2 : -config.heartbeat.intensity * 0.05;
      break;
  }

  // Apply theme-specific drift
  const driftMultiplier = config.drift.strength;
  switch (config.drift.direction) {
    case 'spiral':
      enhancedState.drift.x = Math.cos(timeAccumulator * 0.001) * driftMultiplier * 3;
      enhancedState.drift.y = Math.sin(timeAccumulator * 0.001) * driftMultiplier * 3;
      break;
    case 'orbital':
      enhancedState.drift.x = Math.cos(timeAccumulator * 0.0005) * driftMultiplier * 4;
      enhancedState.drift.y = Math.sin(timeAccumulator * 0.0005) * driftMultiplier * 4;
      break;
    case 'inward':
      const inwardForce = Math.sin(timeAccumulator * 0.002) * driftMultiplier;
      enhancedState.drift.x *= (1 - inwardForce * 0.1);
      enhancedState.drift.y *= (1 - inwardForce * 0.1);
      break;
    case 'random':
      // Keep existing random drift, just scale it
      enhancedState.drift.x *= driftMultiplier;
      enhancedState.drift.y *= driftMultiplier;
      break;
  }

  // Bound drift within theme limits
  const maxDrift = config.drift.bounds;
  enhancedState.drift.x = Math.max(-maxDrift, Math.min(maxDrift, enhancedState.drift.x));
  enhancedState.drift.y = Math.max(-maxDrift, Math.min(maxDrift, enhancedState.drift.y));

  return enhancedState;
};

/**
 * Get sunburst effect properties for theme
 */
export const getSunburstEffect = (
  themeId: Theme,
  timeAccumulator: number,
  centerX: number,
  centerY: number
) => {
  const config = day4DynamicsConfigs[themeId];
  const phase = (timeAccumulator % 3000) / 3000; // 3-second cycle
  
  const baseProps = {
    centerX,
    centerY,
    color: config.sunburst.color,
    intensity: config.sunburst.intensity,
    reach: config.sunburst.reach
  };

  switch (config.sunburst.type) {
    case 'rays':
      return {
        ...baseProps,
        rayCount: 8,
        rayLength: config.sunburst.reach * (0.8 + Math.sin(phase * Math.PI * 2) * 0.2),
        opacity: 0.3 + Math.sin(phase * Math.PI * 2) * 0.2,
        rotation: timeAccumulator * 0.01
      };
      
    case 'pulse':
      return {
        ...baseProps,
        radius: config.sunburst.reach * (0.5 + Math.sin(phase * Math.PI * 4) * 0.3),
        opacity: 0.4 + Math.sin(phase * Math.PI * 4) * 0.3,
        strokeWidth: 2 + Math.sin(phase * Math.PI * 2) * 1
      };
      
    case 'shimmer':
      return {
        ...baseProps,
        shimmerCount: 12,
        shimmerRadius: config.sunburst.reach,
        opacity: 0.2 + Math.sin(phase * Math.PI * 3) * 0.15,
        shimmerPhase: phase
      };
      
    case 'flicker':
      return {
        ...baseProps,
        flickerIntensity: 0.5 + Math.random() * 0.5,
        strokeCount: 6,
        strokeLength: config.sunburst.reach * (0.7 + Math.random() * 0.3),
        opacity: 0.4 + Math.random() * 0.4
      };
      
    case 'data':
      return {
        ...baseProps,
        nodeCount: 16,
        nodeRadius: config.sunburst.reach,
        pulsePhase: phase,
        opacity: 0.6 + Math.sin(phase * Math.PI * 6) * 0.3,
        nodeSize: 2 + Math.sin(phase * Math.PI * 4) * 1
      };
      
    default:
      return baseProps;
  }
};

/**
 * Get theme-specific layer geometry
 */
export const getThemeGeometry = (themeId: Theme) => {
  return day4DynamicsConfigs[themeId].geometry;
};
