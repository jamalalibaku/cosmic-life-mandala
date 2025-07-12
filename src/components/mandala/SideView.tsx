import React from 'react';
import { motion } from 'framer-motion';
import { WeatherSunburstRing } from '../weather-sunburst-ring';
import { PlansLayerRing } from '../plans-layer-ring';
import { FriendOrbitRing } from '../friend-orbit-ring';
import { InsightOrbitRing } from '../insight-orbit-ring';
import { EmotionalTideRings } from '../emotional-tide-rings';
import { DataBlobRing } from '../data-blob-ring';
import { NowIndicator } from '../now-indicator';
import { mockFriends } from '../../data/mock-friend-data';
import { mockInsightData } from '../../data/mock-insight-data';
import { enhancedWeatherData } from '../../data/enhanced-weather-data';
import { mockPlansData } from '../../data/mock-plans-data';

interface SideViewProps {
  currentDate: Date;
  theme: string;
  centerX?: number;
  centerY?: number;
  radius?: number;
}

export const SideView: React.FC<SideViewProps> = ({
  currentDate,
  theme,
  centerX = 400,
  centerY = 400,
  radius = 200
}) => {
  const layerRadius = radius * 0.8;
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-background via-background/90 to-background/80">
      {/* Celestial Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-background/90" />
      
      {/* 3D Container */}
      <div 
        className="relative w-full h-full"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
      >
        <motion.div
          className="relative w-full h-full flex flex-col items-center justify-center"
          style={{
            transformStyle: 'preserve-3d'
          }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -15 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Celestial Core - Top Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(100px) scale(0.6)'
            }}
            animate={{ 
              rotateZ: 360,
              scale: [0.6, 0.65, 0.6]
            }}
            transition={{ 
              rotateZ: { duration: 120, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-radial from-primary via-primary/60 to-transparent opacity-80 shadow-2xl shadow-primary/30" />
          </motion.div>

          {/* Weather Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(60px) scale(0.85)',
              filter: 'drop-shadow(0 10px 20px hsl(var(--primary) / 0.2))'
            }}
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
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
          </motion.div>

          {/* Plans Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(20px) scale(0.9)',
              filter: 'drop-shadow(0 8px 16px hsl(var(--primary) / 0.15))'
            }}
            animate={{ 
              rotateZ: [0, -360],
              y: [0, -2, 0]
            }}
            transition={{ 
              rotateZ: { duration: 80, repeat: Infinity, ease: "linear" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <PlansLayerRing
              plansData={mockPlansData}
              centerX={centerX}
              centerY={centerY}
              radius={layerRadius * 0.9}
              theme={theme}
            />
          </motion.div>

          {/* Friends Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-20px) scale(0.95)',
              filter: 'drop-shadow(0 6px 12px hsl(var(--primary) / 0.1))'
            }}
            animate={{ 
              rotateZ: [0, 360],
              x: [0, 1, 0]
            }}
            transition={{ 
              rotateZ: { duration: 60, repeat: Infinity, ease: "linear" },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <FriendOrbitRing
              friends={mockFriends}
              centerX={centerX}
              centerY={centerY}
              radius={layerRadius * 0.8 * 0.875}
              theme={theme}
            />
          </motion.div>

          {/* Insight Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-60px) scale(1.0)',
              filter: 'drop-shadow(0 4px 8px hsl(var(--primary) / 0.08))'
            }}
            animate={{ 
              rotateZ: [0, -360],
              scale: [1.0, 1.02, 1.0]
            }}
            transition={{ 
              rotateZ: { duration: 90, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <InsightOrbitRing
              insights={mockInsightData}
              centerX={centerX}
              centerY={centerY}
              baseRadius={layerRadius * 0.7}
              isVisible={true}
              currentTimeScale="side"
              theme={theme}
            />
          </motion.div>

          {/* Emotional Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-100px) scale(1.05)',
              filter: 'drop-shadow(0 2px 4px hsl(var(--primary) / 0.05))'
            }}
            animate={{ 
              rotateZ: [0, 360],
              y: [0, -1, 0, 1, 0]
            }}
            transition={{ 
              rotateZ: { duration: 70, repeat: Infinity, ease: "linear" },
              y: { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <EmotionalTideRings
              centerX={centerX}
              centerY={centerY}
              connections={[]}
              isActive={true}
            />
          </motion.div>

          {/* Data/Sleep Layer */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(-140px) scale(1.1)',
              opacity: 0.8
            }}
            animate={{ 
              rotateZ: [0, -360],
              scale: [1.1, 1.08, 1.1]
            }}
            transition={{ 
              rotateZ: { duration: 50, repeat: Infinity, ease: "linear" },
              scale: { duration: 14, repeat: Infinity, ease: "easeInOut" }
            }}
          >
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
          </motion.div>

          {/* NOW Indicator - Floating Above */}
          <motion.div
            className="absolute"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'translateZ(140px) scale(0.7)',
              filter: 'drop-shadow(0 15px 30px hsl(var(--primary) / 0.4))'
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
            <NowIndicator
              centerX={centerX}
              centerY={centerY}
              radius={layerRadius * 1.2}
              timeScale="side"
              theme={theme}
            />
          </motion.div>
        </motion.div>
      </div>

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
            Side View — Cosmic Stack
          </div>
        </div>
      </motion.div>
    </div>
  );
};