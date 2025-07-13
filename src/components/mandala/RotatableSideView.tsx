/**
 * Rotatable Side View - Vertical 3D Timeline with Interactive Rotation
 * A celestial column of time that users can rotate and explore
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { WeatherSunburstRing } from '@/components/weather-sunburst-ring';
import { PlansLayerRing } from '@/components/plans-layer-ring';
import { FriendOrbitRing } from '@/components/friend-orbit-ring';
import { InsightOrbitRing } from '@/components/insight-orbit-ring';
import { EmotionalTideRings } from '@/components/emotional-tide-rings';
import { DataBlobRing } from '@/components/data-blob-ring';
import { DynamicNowIndicator } from '@/components/time/DynamicNowIndicator';
import { useSmoothFlowContext } from '@/components/performance/SmoothFlowProvider';
import { SmoothTransition } from '@/components/ui/SmoothTransition';
import { mockFriends } from '@/data/mock-friend-data';
import { mockInsightData } from '@/data/mock-insight-data';
import { enhancedWeatherData } from '@/data/enhanced-weather-data';
import { mockPlansData } from '@/data/mock-plans-data';

interface RotatableSideViewProps {
  currentDate: Date;
  theme: string;
  centerX?: number;
  centerY?: number;
  radius?: number;
}

export const RotatableSideView: React.FC<RotatableSideViewProps> = ({
  currentDate,
  theme,
  centerX = 400,
  centerY = 400,
  radius = 200
}) => {
  const { enabledFeatures, performanceLevel } = useSmoothFlowContext();
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  
  // Motion values for smooth rotation control
  const rotationY = useMotionValue(0);
  const lightIntensity = useTransform(rotationY, [-180, 0, 180], [0.3, 1, 0.3]);
  const shadowOffset = useTransform(rotationY, [-180, 0, 180], [-10, 0, 10]);

  const layerRadius = radius * 0.8;

  // Layer configurations with adaptive complexity
  const layers = [
    { 
      name: 'celestial-core',
      depth: 100,
      scale: 0.6,
      priority: 'high' as const,
      component: () => (
        <div className="w-24 h-24 rounded-full bg-gradient-radial from-primary via-primary/60 to-transparent opacity-80 shadow-2xl shadow-primary/30" />
      )
    },
    { 
      name: 'weather',
      depth: 60,
      scale: 0.85,
      priority: 'high' as const,
      component: () => (
        <WeatherSunburstRing
          weatherData={Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            condition: 'sunny' as const,
            temperature: 20 + Math.sin(i / 24 * Math.PI * 2) * 10
          }))}
          centerX={centerX}
          centerY={centerY}
          innerRadius={layerRadius * 0.8}
          outerRadius={layerRadius}
          theme="cosmic"
        />
      )
    },
    { 
      name: 'plans',
      depth: 20,
      scale: 0.9,
      priority: 'medium' as const,
      component: () => (
        <PlansLayerRing
          plansData={mockPlansData}
          centerX={centerX}
          centerY={centerY}
          radius={layerRadius * 0.9}
          theme={theme}
        />
      )
    },
    { 
      name: 'friends',
      depth: -20,
      scale: 0.95,
      priority: 'medium' as const,
      component: () => (
        <FriendOrbitRing
          friends={mockFriends}
          centerX={centerX}
          centerY={centerY}
          radius={layerRadius * 0.8 * 0.875}
          theme={theme}
        />
      )
    },
    { 
      name: 'insights',
      depth: -60,
      scale: 1.0,
      priority: 'low' as const,
      component: () => (
        <InsightOrbitRing
          insights={mockInsightData}
          centerX={centerX}
          centerY={centerY}
          baseRadius={layerRadius * 0.7}
          isVisible={true}
          currentTimeScale="side"
          theme={theme}
        />
      )
    },
    { 
      name: 'emotions',
      depth: -100,
      scale: 1.05,
      priority: 'high' as const,
      component: () => (
        <EmotionalTideRings
          centerX={centerX}
          centerY={centerY}
          connections={[]}
          isActive={true}
        />
      )
    },
    { 
      name: 'sleep',
      depth: -140,
      scale: 1.1,
      priority: 'medium' as const,
      component: () => (
        <DataBlobRing
          data={Array.from({ length: 12 }, (_, i) => ({
            hour: i * 2,
            type: 'sleep' as const,
            intensity: Math.random() * 0.8 + 0.2,
            duration: 0.5
          }))}
          centerX={centerX}
          centerY={centerY}
          innerRadius={layerRadius * 0.4}
          outerRadius={layerRadius * 0.5}
          type="sleep"
        />
      )
    }
  ];

  // Filter layers based on performance
  const activeLayers = layers.filter(layer => {
    if (performanceLevel === 'poor') {
      return layer.priority === 'high';
    }
    if (performanceLevel === 'fair') {
      return layer.priority !== 'low';
    }
    return true;
  });

  // Handle drag rotation
  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const deltaX = info.delta.x;
    const currentRotation = rotationY.get();
    const newRotation = currentRotation + deltaX * 0.5;
    rotationY.set(newRotation);
  }, [rotationY]);

  // Handle drag start/end
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setIsAutoRotating(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Resume auto-rotation after 3 seconds of inactivity
    setTimeout(() => {
      if (!isDragging) {
        setIsAutoRotating(true);
      }
    }, 3000);
  }, [isDragging]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-background via-background/90 to-background/80">
      {/* Celestial background with lighting */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-background/90" />
      
      {/* Main rotatable container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Rotatable column */}
        <motion.div
          className="relative w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            rotateY: rotationY,
            transformStyle: "preserve-3d"
          }}
          animate={isAutoRotating ? {
            rotateY: [0, 360],
            rotateX: -15
          } : {
            rotateX: -15
          }}
        >
          {/* Dynamic lighting overlay */}
          {enabledFeatures.backgroundEffects && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: useTransform(
                  rotationY,
                  [-180, -90, 0, 90, 180],
                  [
                    'radial-gradient(circle at 20% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 30%, rgba(255,215,0,0.2) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 70%, rgba(255,215,0,0.2) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255,215,0,0.1) 0%, transparent 50%)'
                  ]
                )
              }}
            />
          )}

          {/* Layer stack */}
          {activeLayers.map((layer, index) => {
            const LayerComponent = layer.component;
            
            return (
              <motion.div
                key={layer.name}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${layer.depth}px) scale(${layer.scale})`,
                  filter: enabledFeatures.backgroundEffects ? 
                    `drop-shadow(0 ${Math.abs(layer.depth) / 10}px ${Math.abs(layer.depth) / 5}px hsl(var(--primary) / ${0.3 - Math.abs(layer.depth) / 500}))` : 
                    'none'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: layer.scale }}
                transition={{ 
                  delay: index * 0.1,
                  duration: performanceLevel === 'poor' ? 0.3 : 0.6
                }}
              >
                {/* Layer shadow for depth */}
                {enabledFeatures.backgroundEffects && performanceLevel !== 'poor' && (
                  <motion.div
                    className="absolute inset-0 rounded-full blur-md opacity-20"
                    style={{
                      background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
                      translateZ: -5,
                      translateX: shadowOffset,
                      scale: 0.9
                    }}
                  />
                )}
                
                {/* Actual layer component */}
                <div className="relative z-10">
                  <LayerComponent />
                </div>
              </motion.div>
            );
          })}

          {/* Now indicator floating above */}
          <motion.div
            className="absolute"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(140px) scale(0.7)',
              filter: enabledFeatures.backgroundEffects ? 
                'drop-shadow(0 15px 30px hsl(var(--primary) / 0.4))' : 'none'
            }}
            animate={{ 
              y: [0, -3, 0],
              scale: [0.7, 0.72, 0.7]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <DynamicNowIndicator
              centerX={centerX}
              centerY={centerY}
              radius={layerRadius * 1.2}
              timeScale="side"
              theme={theme}
            />
          </motion.div>
        </motion.div>

        {/* Rotation control hint */}
        {!isDragging && (
          <SmoothTransition 
            variant="fade"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground/60 text-center"
          >
            <div className="flex items-center gap-2">
              <span>🌪</span>
              <span>Drag to rotate • Auto-spinning when idle</span>
            </div>
          </SmoothTransition>
        )}

        {/* Performance indicator */}
        {performanceLevel === 'poor' && (
          <div className="absolute top-4 right-4 bg-destructive/80 text-destructive-foreground px-2 py-1 rounded text-xs">
            Simplified view for performance
          </div>
        )}
      </motion.div>

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10 pointer-events-none" />
      
      {/* Date Display */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-foreground/90">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            Rotatable Side View — Cosmic Column
          </div>
        </div>
      </motion.div>
    </div>
  );
};