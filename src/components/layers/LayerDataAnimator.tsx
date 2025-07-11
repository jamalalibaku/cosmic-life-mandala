/**
 * [Phase: ZIP9-Beta | Lap 3: Layer Interconnection]
 * Layer Data Animator - Mock data injection with interconnected visual effects
 * 
 * Purpose: Populate layers with animated mock data and apply cross-layer effects
 * Features: Sleep waves, mood colors, weather arcs, interconnection styling
 * Dependencies: TimeAxisContext, LayerInterconnectionEngine
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimeAxis } from '@/contexts/TimeAxisContext';
import { LayerInterconnectionEngine } from '@/components/layers/LayerInterconnectionEngine';
import { 
  LayerInterconnectionState,
  applyMoodToSleepEffect,
  applyWeatherToMobilityEffect,
  getLayerAggregateData
} from '@/utils/layer-interconnection';

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
  const [interconnectionEffects, setInterconnectionEffects] = useState<LayerInterconnectionState>({
    moodToSleepDimming: 0,
    weatherToMobilityCloudiness: 0,
    sleepToBreathingAmplitude: 1,
    systemGlowIntensity: 0
  });

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

  // Calculate mood-based effects for sleep layer styling
  const moodData = getLayerAggregateData(timeSlices, 'mood');
  const sleepEffects = moodData ? applyMoodToSleepEffect(moodData.averageValence) : { opacity: 1, saturation: 1, scale: 1 };

  return (
    <g>
      {/* Layer Interconnection Engine */}
      <LayerInterconnectionEngine
        centerX={centerX}
        centerY={centerY}
        isActive={isActive}
        onEffectsUpdate={setInterconnectionEffects}
      />

      {/* Sleep Layer - Only if data exists, with mood-based effects */}
      {timeSlices.filter(slice => slice.data.sleep).length > 0 && (
        <g>
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
                r="3"
                fill="hsl(240, 50%, 65%)"
                opacity={sleepEffects.opacity * 0.8} // Apply mood-based dimming
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [sleepEffects.scale, sleepEffects.scale * 1.1, sleepEffects.scale], // Apply mood-based scaling
                  opacity: [sleepEffects.opacity * 0.6, sleepEffects.opacity * 0.9, sleepEffects.opacity * 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut"
                }}
                style={{
                  filter: `saturate(${sleepEffects.saturation})` // Apply mood-based saturation
                }}
              />
            );
          })}
        </g>
      )}

      {/* Mood Layer - Only if data exists */}
      {timeSlices.filter(slice => slice.data.mood).length > 0 && (
        <g>
          {timeSlices.map((slice, index) => {
            if (!slice.data.mood) return null;
            
            const moodRadius = 120;
            const radian = (slice.angle * Math.PI) / 180;
            const x = centerX + moodRadius * Math.cos(radian);
            const y = centerY + moodRadius * Math.sin(radian);
            
            return (
              <motion.circle
                key={`mood-${slice.id}`}
                cx={x}
                cy={y}
                r="4"
                fill={slice.data.mood.color}
                opacity="0.7"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.15
                }}
              />
            );
          })}
        </g>
      )}

      {/* Weather Layer - Only if data exists, with mobility interconnection indication */}
      {timeSlices.filter(slice => slice.data.weather).length > 0 && (
        <g>
          {timeSlices.map((slice, index) => {
            if (!slice.data.weather) return null;
            
            const weatherRadius = 160;
            const arcLength = 15;
            const startAngle = slice.angle - arcLength / 2;
            const endAngle = slice.angle + arcLength / 2;
            
            const startRadian = (startAngle * Math.PI) / 180;
            const endRadian = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + weatherRadius * Math.cos(startRadian);
            const y1 = centerY + weatherRadius * Math.sin(startRadian);
            const x2 = centerX + weatherRadius * Math.cos(endRadian);
            const y2 = centerY + weatherRadius * Math.sin(endRadian);
            
            // Apply weather-to-mobility visual effects
            const weatherToMobilityEffect = applyWeatherToMobilityEffect(
              slice.data.weather.condition, 
              slice.data.weather.intensity
            );
            
            return (
              <motion.path
                key={`weather-${slice.id}`}
                d={`M ${x1} ${y1} A ${weatherRadius} ${weatherRadius} 0 0 1 ${x2} ${y2}`}
                stroke={slice.data.weather.color}
                strokeWidth="2"
                strokeDasharray={weatherToMobilityEffect.strokeDashArray}
                fill="none"
                opacity={weatherToMobilityEffect.opacity * 0.7}
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1,
                  opacity: [weatherToMobilityEffect.opacity * 0.5, weatherToMobilityEffect.opacity * 0.8, weatherToMobilityEffect.opacity * 0.5]
                }}
                transition={{
                  pathLength: { duration: 0.8, delay: index * 0.08 },
                  opacity: { duration: 3, repeat: Infinity }
                }}
                style={{
                  filter: weatherToMobilityEffect.blur > 0 ? `blur(${weatherToMobilityEffect.blur}px)` : 'none'
                }}
              />
            );
          })}
        </g>
      )}
    </g>
  );
};