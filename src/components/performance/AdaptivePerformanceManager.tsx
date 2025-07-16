/**
 * Adaptive Performance Manager - ZIP 10 Performance Optimization
 * Deep optimization system to maintain 60 FPS while preserving visual essence
 */

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  currentFPS: number;
  frameTime: number;
  droppedFrames: number;
  activeAnimations: number;
  domNodes: number;
  memoryUsage: number;
}

interface PerformanceLevel {
  level: 'ultra' | 'high' | 'medium' | 'low' | 'emergency';
  enabledFeatures: {
    // Core visual features
    breathingAnimations: boolean;
    rotationAnimations: boolean;
    particleEffects: boolean;
    glowEffects: boolean;
    
    // Interactive features
    hoverTooltips: boolean;
    smoothTransitions: boolean;
    realTimeUpdates: boolean;
    
    // Advanced features
    windEffects: boolean;
    supernovaWaves: boolean;
    emotionalMorphing: boolean;
    backgroundPulse: boolean;
    
    // Layer complexity
    detailedSVGPaths: boolean;
    layerBlending: boolean;
    shadowEffects: boolean;
  };
  frameLimit: number;
  animationQuality: 'low' | 'medium' | 'high' | 'ultra';
}

const PERFORMANCE_LEVELS: Record<PerformanceLevel['level'], PerformanceLevel> = {
  ultra: {
    level: 'ultra',
    enabledFeatures: {
      breathingAnimations: true,
      rotationAnimations: true,
      particleEffects: true,
      glowEffects: true,
      hoverTooltips: true,
      smoothTransitions: true,
      realTimeUpdates: true,
      windEffects: true,
      supernovaWaves: true,
      emotionalMorphing: true,
      backgroundPulse: true,
      detailedSVGPaths: true,
      layerBlending: true,
      shadowEffects: true,
    },
    frameLimit: 60,
    animationQuality: 'ultra'
  },
  high: {
    level: 'high',
    enabledFeatures: {
      breathingAnimations: true,
      rotationAnimations: true,
      particleEffects: true,
      glowEffects: true,
      hoverTooltips: true,
      smoothTransitions: true,
      realTimeUpdates: true,
      windEffects: true,
      supernovaWaves: false,
      emotionalMorphing: true,
      backgroundPulse: true,
      detailedSVGPaths: true,
      layerBlending: true,
      shadowEffects: false,
    },
    frameLimit: 60,
    animationQuality: 'high'
  },
  medium: {
    level: 'medium',
    enabledFeatures: {
      breathingAnimations: true,
      rotationAnimations: true,
      particleEffects: false,
      glowEffects: true,
      hoverTooltips: true,
      smoothTransitions: true,
      realTimeUpdates: false,
      windEffects: false,
      supernovaWaves: false,
      emotionalMorphing: true,
      backgroundPulse: false,
      detailedSVGPaths: false,
      layerBlending: false,
      shadowEffects: false,
    },
    frameLimit: 45,
    animationQuality: 'medium'
  },
  low: {
    level: 'low',
    enabledFeatures: {
      breathingAnimations: true,
      rotationAnimations: false,
      particleEffects: false,
      glowEffects: false,
      hoverTooltips: false,
      smoothTransitions: false,
      realTimeUpdates: false,
      windEffects: false,
      supernovaWaves: false,
      emotionalMorphing: false,
      backgroundPulse: false,
      detailedSVGPaths: false,
      layerBlending: false,
      shadowEffects: false,
    },
    frameLimit: 30,
    animationQuality: 'low'
  },
  emergency: {
    level: 'emergency',
    enabledFeatures: {
      breathingAnimations: false,
      rotationAnimations: false,
      particleEffects: false,
      glowEffects: false,
      hoverTooltips: false,
      smoothTransitions: false,
      realTimeUpdates: false,
      windEffects: false,
      supernovaWaves: false,
      emotionalMorphing: false,
      backgroundPulse: false,
      detailedSVGPaths: false,
      layerBlending: false,
      shadowEffects: false,
    },
    frameLimit: 20,
    animationQuality: 'low'
  }
};

interface AdaptivePerformanceContextType {
  metrics: PerformanceMetrics;
  performanceLevel: PerformanceLevel;
  isEmergencyMode: boolean;
  
  // Feature checks
  shouldRender: (featureName: keyof PerformanceLevel['enabledFeatures']) => boolean;
  shouldLimitLayer: (zoomLevel: string, layerType: string) => boolean;
  getAnimationDuration: (baseDuration: number) => number;
  getThrottleInterval: (baseInterval: number) => number;
  
  // Manual controls
  setPerformanceMode: (level: PerformanceLevel['level']) => void;
  enablePerformanceMode: () => void;
  disablePerformanceMode: () => void;
}

const AdaptivePerformanceContext = createContext<AdaptivePerformanceContextType | undefined>(undefined);

export const useAdaptivePerformance = () => {
  const context = useContext(AdaptivePerformanceContext);
  if (!context) {
    throw new Error('useAdaptivePerformance must be used within AdaptivePerformanceProvider');
  }
  return context;
};

interface AdaptivePerformanceProviderProps {
  children: React.ReactNode;
}

export const AdaptivePerformanceProvider: React.FC<AdaptivePerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    currentFPS: 60,
    frameTime: 16.67,
    droppedFrames: 0,
    activeAnimations: 0,
    domNodes: 0,
    memoryUsage: 0
  });
  
  const [currentLevel, setCurrentLevel] = useState<PerformanceLevel['level']>('high');
  const [manualMode, setManualMode] = useState(false);
  const [performanceModeEnabled, setPerformanceModeEnabled] = useState(false);
  const [userToggled, setUserToggled] = useState(false);
  
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTime = useRef(performance.now());
  const animationFrameRef = useRef<number>();

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - lastFrameTime.current;
    
    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 120) { // Keep 2 seconds of data
      frameTimesRef.current.shift();
    }
    
    // Calculate metrics
    const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    const currentFPS = Math.min(60, Math.round(1000 / avgFrameTime));
    const droppedFrames = frameTimesRef.current.filter(time => time > 20).length;
    
    // Get DOM node count (simplified)
    const domNodes = document.querySelectorAll('*').length;
    
    // Get memory usage if available
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    setMetrics({
      currentFPS,
      frameTime: avgFrameTime,
      droppedFrames,
      activeAnimations: document.querySelectorAll('[style*="animation"], [style*="transition"]').length,
      domNodes,
      memoryUsage
    });
    
    // Auto-adjust performance level (only if not in manual mode)
    if (!manualMode) {
      let newLevel: PerformanceLevel['level'] = currentLevel;
      
      if (currentFPS >= 55 && droppedFrames < 5) {
        newLevel = 'ultra';
      } else if (currentFPS >= 45 && droppedFrames < 10) {
        newLevel = 'high';
      } else if (currentFPS >= 35 && droppedFrames < 20) {
        newLevel = 'medium';
      } else if (currentFPS >= 25) {
        newLevel = 'low';
      } else {
        newLevel = 'emergency';
      }
      
      if (newLevel !== currentLevel) {
        console.log(`🚨 Performance level changed: ${currentLevel} → ${newLevel} (FPS: ${currentFPS})`);
        setCurrentLevel(newLevel);
      }
    }
    
    lastFrameTime.current = now;
    animationFrameRef.current = requestAnimationFrame(monitorPerformance);
  }, [currentLevel, manualMode]);

  // Start performance monitoring
  useEffect(() => {
    monitorPerformance();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [monitorPerformance]);

  // Layer culling logic based on zoom level
  const shouldLimitLayer = useCallback((zoomLevel: string, layerType: string): boolean => {
    const level = PERFORMANCE_LEVELS[currentLevel];
    
    // Emergency mode culling
    if (level.level === 'emergency') {
      return !['core', 'time'].includes(layerType);
    }
    
    // Zoom-based culling
    switch (zoomLevel) {
      case 'year':
        return !['core', 'plans', 'mood'].includes(layerType);
      case 'month':
        return !['core', 'plans', 'mood', 'weather'].includes(layerType);
      case 'week':
        return false; // Show all layers
      case 'day':
        return false; // Show all layers
      default:
        return false;
    }
  }, [currentLevel]);

  // Feature rendering checks
  const shouldRender = useCallback((featureName: keyof PerformanceLevel['enabledFeatures']): boolean => {
    if (performanceModeEnabled) return false;
    return PERFORMANCE_LEVELS[currentLevel].enabledFeatures[featureName];
  }, [currentLevel, performanceModeEnabled]);

  // Animation duration scaling
  const getAnimationDuration = useCallback((baseDuration: number): number => {
    const level = PERFORMANCE_LEVELS[currentLevel];
    switch (level.animationQuality) {
      case 'ultra': return baseDuration;
      case 'high': return baseDuration * 0.8;
      case 'medium': return baseDuration * 0.6;
      case 'low': return baseDuration * 0.3;
      default: return baseDuration * 0.1;
    }
  }, [currentLevel]);

  // Throttle interval scaling
  const getThrottleInterval = useCallback((baseInterval: number): number => {
    const level = PERFORMANCE_LEVELS[currentLevel];
    switch (level.level) {
      case 'ultra': return baseInterval;
      case 'high': return baseInterval * 1.2;
      case 'medium': return baseInterval * 1.5;
      case 'low': return baseInterval * 2;
      case 'emergency': return baseInterval * 3;
      default: return baseInterval;
    }
  }, [currentLevel]);

  // Manual controls
  const setPerformanceMode = useCallback((level: PerformanceLevel['level']) => {
    setCurrentLevel(level);
    setManualMode(true);
    console.log(`🎛️ Manual performance mode set to: ${level}`);
  }, []);

  const enablePerformanceMode = useCallback(() => {
    setPerformanceModeEnabled(true);
    setUserToggled(true);
    setCurrentLevel('emergency');
    setManualMode(true);
    console.log('🚨 Performance mode ENABLED - Visual features limited');
  }, []);

  const disablePerformanceMode = useCallback(() => {
    setPerformanceModeEnabled(false);
    setUserToggled(true);
    setManualMode(false);
    console.log('🎨 Performance mode DISABLED - Full visual experience restored');
  }, []);

  const contextValue: AdaptivePerformanceContextType = {
    metrics,
    performanceLevel: PERFORMANCE_LEVELS[currentLevel],
    isEmergencyMode: currentLevel === 'emergency',
    shouldRender,
    shouldLimitLayer,
    getAnimationDuration,
    getThrottleInterval,
    setPerformanceMode,
    enablePerformanceMode,
    disablePerformanceMode
  };

  return (
    <AdaptivePerformanceContext.Provider value={contextValue}>
      {children}
      
      {/* Performance status indicator */}
      {(currentLevel === 'low' || currentLevel === 'emergency') && (
        <div className="fixed top-4 right-4 bg-destructive/90 text-destructive-foreground p-3 rounded-lg text-xs z-50">
          <div className="font-semibold">⚡ Performance Mode</div>
          <div className="text-xs opacity-75">
            Level: {currentLevel.toUpperCase()} | FPS: {metrics.currentFPS}
          </div>
        </div>
      )}
    </AdaptivePerformanceContext.Provider>
  );
};