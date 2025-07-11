/**
 * [Phase: Digest / ZIP9-beta / Lap 3] Layer Interconnection Visual Engine
 * Real-time cross-layer visual effects based on data correlations
 * 
 * Purpose: Apply visual interconnection effects between layers
 * Features: Mood-sleep dimming, weather-mobility clouding, sleep-breathing sync
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimeAxis } from '@/contexts/TimeAxisContext';
import {
  getLayerAggregateData,
  applyMoodToSleepEffect,
  applyWeatherToMobilityEffect,
  applySleepToBreathingEffect,
  calculateSystemGlow,
  LayerInterconnectionState
} from '@/utils/layer-interconnection';

interface LayerInterconnectionEngineProps {
  centerX: number;
  centerY: number;
  isActive?: boolean;
  onEffectsUpdate?: (effects: LayerInterconnectionState) => void;
}

export const LayerInterconnectionEngine: React.FC<LayerInterconnectionEngineProps> = ({
  centerX,
  centerY,
  isActive = true,
  onEffectsUpdate
}) => {
  const { timeSlices } = useTimeAxis();
  const [interconnectionState, setInterconnectionState] = useState<LayerInterconnectionState>({
    moodToSleepDimming: 0,
    weatherToMobilityCloudiness: 0,
    sleepToBreathingAmplitude: 1,
    systemGlowIntensity: 0
  });

  // Calculate and apply interconnection effects
  useEffect(() => {
    if (!isActive || timeSlices.length === 0) return;

    console.log('🔗 LayerInterconnectionEngine calculating effects:', {
      timeSliceCount: timeSlices.length,
      timestamp: new Date().toLocaleTimeString()
    });

    // Get aggregated data for each layer
    const moodData = getLayerAggregateData(timeSlices, 'mood');
    const sleepData = getLayerAggregateData(timeSlices, 'sleep');
    const weatherData = getLayerAggregateData(timeSlices, 'weather');

    if (!moodData || !sleepData || !weatherData) {
      console.log('⚠️ LayerInterconnectionEngine: Missing layer data', {
        hasMood: !!moodData,
        hasSleep: !!sleepData,
        hasWeather: !!weatherData
      });
      return;
    }

    // Calculate mood-to-sleep dimming effect
    const moodToSleepEffect = applyMoodToSleepEffect(moodData.averageValence);
    const moodToSleepDimming = 1 - moodToSleepEffect.opacity;

    // Calculate weather-to-mobility cloudiness effect
    const weatherToMobilityEffect = applyWeatherToMobilityEffect(
      weatherData.dominantCondition, 
      weatherData.averageIntensity
    );
    const weatherToMobilityCloudiness = 1 - weatherToMobilityEffect.opacity;

    // Calculate sleep-to-breathing amplitude effect
    const sleepToBreathingEffect = applySleepToBreathingEffect(sleepData.averageQuality);
    const sleepToBreathingAmplitude = sleepToBreathingEffect.scale;

    // Calculate system-wide glow
    const systemGlowIntensity = calculateSystemGlow(
      moodData.averageValence,
      sleepData.averageQuality,
      weatherData.dominantCondition
    );

    const newState: LayerInterconnectionState = {
      moodToSleepDimming,
      weatherToMobilityCloudiness,
      sleepToBreathingAmplitude,
      systemGlowIntensity
    };

    setInterconnectionState(newState);
    onEffectsUpdate?.(newState);

    console.log('🎭 Layer interconnection effects applied:', {
      moodValence: moodData.averageValence.toFixed(2),
      sleepQuality: sleepData.averageQuality.toFixed(2),
      weatherCondition: weatherData.dominantCondition,
      effects: {
        moodToSleepDimming: moodToSleepDimming.toFixed(2),
        weatherToMobilityCloudiness: weatherToMobilityCloudiness.toFixed(2),
        sleepToBreathingAmplitude: sleepToBreathingAmplitude.toFixed(2),
        systemGlowIntensity: systemGlowIntensity.toFixed(2)
      }
    });

  }, [timeSlices, isActive, onEffectsUpdate]);

  // Visual representation of active interconnections
  return (
    <g>
      {/* Mood-to-Sleep Connection Arc */}
      {interconnectionState.moodToSleepDimming > 0.1 && (
        <motion.path
          d={`M ${centerX - 60} ${centerY - 60} Q ${centerX} ${centerY - 100} ${centerX + 40} ${centerY - 40}`}
          stroke="hsl(280, 50%, 60%)"
          strokeWidth="1"
          fill="none"
          opacity={interconnectionState.moodToSleepDimming}
          strokeDasharray="2,3"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            opacity: [interconnectionState.moodToSleepDimming * 0.5, interconnectionState.moodToSleepDimming, interconnectionState.moodToSleepDimming * 0.5]
          }}
          transition={{
            pathLength: { duration: 1.5 },
            opacity: { duration: 3, repeat: Infinity }
          }}
        />
      )}

      {/* Weather-to-Mobility Connection Arc */}
      {interconnectionState.weatherToMobilityCloudiness > 0.1 && (
        <motion.path
          d={`M ${centerX + 80} ${centerY} Q ${centerX + 120} ${centerY - 40} ${centerX + 60} ${centerY - 80}`}
          stroke="hsl(200, 60%, 70%)"
          strokeWidth="1"
          fill="none"
          opacity={interconnectionState.weatherToMobilityCloudiness}
          strokeDasharray="3,2"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            opacity: [interconnectionState.weatherToMobilityCloudiness * 0.6, interconnectionState.weatherToMobilityCloudiness, interconnectionState.weatherToMobilityCloudiness * 0.6]
          }}
          transition={{
            pathLength: { duration: 2 },
            opacity: { duration: 4, repeat: Infinity }
          }}
        />
      )}

      {/* System Glow Overlay */}
      {interconnectionState.systemGlowIntensity > 0.1 && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="200"
          fill="none"
          stroke="hsl(45, 80%, 75%)"
          strokeWidth="1"
          opacity={interconnectionState.systemGlowIntensity * 0.3}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.98, 1.02, 0.98],
            opacity: [interconnectionState.systemGlowIntensity * 0.2, interconnectionState.systemGlowIntensity * 0.4, interconnectionState.systemGlowIntensity * 0.2]
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity },
            opacity: { duration: 6, repeat: Infinity }
          }}
          style={{
            filter: `drop-shadow(0 0 ${interconnectionState.systemGlowIntensity * 20}px hsl(45, 80%, 75%))`
          }}
        />
      )}

      {/* Sleep-to-Breathing Visual Indicator */}
      {interconnectionState.sleepToBreathingAmplitude !== 1 && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="25"
          fill="none"
          stroke="hsl(240, 60%, 70%)"
          strokeWidth="0.5"
          opacity="0.4"
          animate={{ 
            scale: [1, interconnectionState.sleepToBreathingAmplitude, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: interconnectionState.sleepToBreathingAmplitude > 1.2 ? 5 : 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </g>
  );
};