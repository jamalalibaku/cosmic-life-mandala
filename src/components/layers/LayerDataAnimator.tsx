/**
 * [Phase: ZIP9-Beta | Lap 2: Visual Confirmation]
 * Layer Data Animator - Mock data injection and visualization
 * 
 * Purpose: Populate layers with animated mock data
 * Features: Sleep waves, mood colors, weather arcs
 * Dependencies: TimeAxisContext, useUnifiedMotion
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTimeAxis } from '@/contexts/TimeAxisContext';

// Mock data generators
const generateSleepData = (timeSlices: any[]) => {
  return timeSlices.map((slice, index) => ({
    timestamp: slice.date.toISOString(),
    quality: 0.3 + Math.sin(index * 0.8) * 0.4, // Wave pattern 0.1-0.9
    duration: 6 + Math.random() * 3, // 6-9 hours
    deepSleepRatio: 0.2 + Math.random() * 0.3,
    angle: slice.angle,
    intensity: 0.5 + Math.sin(index * 0.6) * 0.3
  }));
};

const generateMoodData = (timeSlices: any[]) => {
  return timeSlices.map((slice, index) => ({
    timestamp: slice.date.toISOString(),
    emotion: ['joy', 'calm', 'excited', 'contemplative'][index % 4],
    valence: 0.4 + Math.sin(index * 0.9) * 0.3, // Emotional positivity
    energy: 0.3 + Math.cos(index * 0.7) * 0.4, // Energy level
    angle: slice.angle,
    color: `hsl(${280 + index * 20}, 60%, ${60 + Math.sin(index) * 20}%)`
  }));
};

const generateWeatherData = (timeSlices: any[]) => {
  return timeSlices.map((slice, index) => ({
    timestamp: slice.date.toISOString(),
    condition: ['sunny', 'cloudy', 'rainy', 'clear'][index % 4],
    temperature: 15 + Math.sin(index * 0.5) * 10, // 5-25°C
    intensity: 0.4 + Math.sin(index * 0.4) * 0.3,
    angle: slice.angle,
    color: `hsl(${200 + index * 15}, 70%, ${50 + Math.sin(index * 0.3) * 25}%)`
  }));
};

interface LayerDataAnimatorProps {
  centerX: number;
  centerY: number;
  isActive?: boolean;
}

export const LayerDataAnimator: React.FC<LayerDataAnimatorProps> = ({
  centerX,
  centerY,
  isActive = true
}) => {
  const { timeSlices, updateLayerData, zoomLevel } = useTimeAxis();

  // Generate and inject mock data
  useEffect(() => {
    if (!isActive || timeSlices.length === 0) return;

    console.log('🔄 LayerDataAnimator injecting mock data:', {
      zoomLevel,
      sliceCount: timeSlices.length,
      timestamp: new Date().toLocaleTimeString()
    });

    // Generate data for each layer
    const sleepData = generateSleepData(timeSlices);
    const moodData = generateMoodData(timeSlices);
    const weatherData = generateWeatherData(timeSlices);

    // Inject into TimeAxis
    updateLayerData('sleep', sleepData);
    updateLayerData('mood', moodData);
    updateLayerData('weather', weatherData);

  }, [timeSlices, zoomLevel, isActive, updateLayerData]);

  return (
    <g>
      {/* Sleep Layer Visualization - Inner waves */}
      {timeSlices.map((slice, index) => {
        if (!slice.data.sleep) return null;
        
        const sleepRadius = 80 + slice.data.sleep.intensity * 20;
        const radian = (slice.angle * Math.PI) / 180;
        const x = centerX + sleepRadius * Math.cos(radian);
        const y = centerY + sleepRadius * Math.sin(radian);
        
        return (
          <motion.circle
            key={`sleep-${slice.id}`}
            cx={x}
            cy={y}
            r="4"
            fill="hsl(240, 60%, 70%)"
            opacity="0.7"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        );
      })}

      {/* Mood Layer Visualization - Color pulses */}
      {timeSlices.map((slice, index) => {
        if (!slice.data.mood) return null;
        
        const moodRadius = 120;
        const radian = (slice.angle * Math.PI) / 180;
        const x = centerX + moodRadius * Math.cos(radian);
        const y = centerY + moodRadius * Math.sin(radian);
        
        return (
          <motion.g key={`mood-${slice.id}`}>
            <motion.circle
              cx={x}
              cy={y}
              r="6"
              fill={slice.data.mood.color}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.4, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
            
            {/* Mood ripple */}
            <motion.circle
              cx={x}
              cy={y}
              r="10"
              fill="none"
              stroke={slice.data.mood.color}
              strokeWidth="1"
              opacity="0.3"
              animate={{
                r: [8, 16, 8],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.3
              }}
            />
          </motion.g>
        );
      })}

      {/* Weather Layer Visualization - Outer arcs */}
      {timeSlices.map((slice, index) => {
        if (!slice.data.weather) return null;
        
        const weatherRadius = 160;
        const arcLength = 20;
        const startAngle = slice.angle - arcLength / 2;
        const endAngle = slice.angle + arcLength / 2;
        
        const startRadian = (startAngle * Math.PI) / 180;
        const endRadian = (endAngle * Math.PI) / 180;
        
        const x1 = centerX + weatherRadius * Math.cos(startRadian);
        const y1 = centerY + weatherRadius * Math.sin(startRadian);
        const x2 = centerX + weatherRadius * Math.cos(endRadian);
        const y2 = centerY + weatherRadius * Math.sin(endRadian);
        
        return (
          <motion.path
            key={`weather-${slice.id}`}
            d={`M ${x1} ${y1} A ${weatherRadius} ${weatherRadius} 0 0 1 ${x2} ${y2}`}
            stroke={slice.data.weather.color}
            strokeWidth="3"
            fill="none"
            opacity="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0.4, 0.8, 0.4],
              strokeWidth: [2, 4, 2]
            }}
            transition={{
              pathLength: { duration: 1, delay: index * 0.1 },
              opacity: { duration: 3, repeat: Infinity },
              strokeWidth: { duration: 3, repeat: Infinity }
            }}
          />
        );
      })}
    </g>
  );
};