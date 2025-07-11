/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { DataBlob } from '../components/data-blob-ring';

// Enhanced coherent life data generators - Phase 21
export const generateMockLifeData = (type: 'mobility' | 'mood' | 'sleep'): DataBlob[] => {
  switch (type) {
    case 'mobility':
      return Array.from({ length: 24 }, (_, hour) => {
        let intensity: number;
        let duration: number;
        
        // Realistic movement patterns
        if (hour >= 2 && hour <= 7) {
          // Sleep hours - minimal movement
          intensity = 0.05 + Math.random() * 0.1;
          duration = 0.1 + Math.random() * 0.2;
        } else if (hour >= 8 && hour <= 11) {
          // Morning activity peak
          intensity = 0.6 + Math.random() * 0.4;
          duration = 0.7 + Math.random() * 0.3;
        } else if (hour >= 12 && hour <= 14) {
          // Lunch break - moderate activity
          intensity = 0.4 + Math.random() * 0.3;
          duration = 0.5 + Math.random() * 0.3;
        } else if (hour >= 15 && hour <= 18) {
          // Afternoon work - lower movement
          intensity = 0.2 + Math.random() * 0.3;
          duration = 0.3 + Math.random() * 0.4;
        } else if (hour >= 19 && hour <= 22) {
          // Evening activity - second peak
          intensity = 0.5 + Math.random() * 0.3;
          duration = 0.6 + Math.random() * 0.4;
        } else {
          // Late night wind-down
          intensity = 0.1 + Math.random() * 0.2;
          duration = 0.2 + Math.random() * 0.3;
        }
        
        return {
          hour,
          type: 'mobility',
          intensity,
          duration,
          value: Math.round(intensity * 100),
          sourceLayer: 'mobility',
          dataPoint: `${hour}:00`
        };
      });
    
    case 'mood':
      return Array.from({ length: 24 }, (_, hour) => {
        let baseIntensity: number;
        
        // Realistic mood patterns correlated with sleep/circadian rhythm
        if (hour >= 2 && hour <= 6) {
          // Deep sleep - minimal mood registration
          baseIntensity = 0.1 + Math.random() * 0.2;
        } else if (hour >= 7 && hour <= 9) {
          // Wake-up adjustment period
          baseIntensity = 0.3 + Math.random() * 0.3;
        } else if (hour >= 10 && hour <= 12) {
          // Morning peak energy
          baseIntensity = 0.7 + Math.random() * 0.3;
        } else if (hour >= 13 && hour <= 15) {
          // Post-lunch dip
          baseIntensity = 0.4 + Math.random() * 0.3;
        } else if (hour >= 16 && hour <= 18) {
          // Afternoon recovery
          baseIntensity = 0.6 + Math.random() * 0.3;
        } else if (hour >= 19 && hour <= 21) {
          // Evening social peak
          baseIntensity = 0.6 + Math.random() * 0.4;
        } else {
          // Night wind-down
          baseIntensity = 0.3 + Math.random() * 0.3;
        }
        
        return {
          hour,
          type: 'mood',
          intensity: Math.min(1, baseIntensity),
          duration: 0.8 + Math.random() * 0.2,
          value: Math.round(baseIntensity * 10),
          sourceLayer: 'mood',
          dataPoint: `${hour}:00`
        };
      });
    
    case 'sleep':
      return Array.from({ length: 24 }, (_, hour) => {
        let intensity: number;
        let duration: number;
        
        // Realistic sleep pattern: 23:00 - 07:00 core sleep
        if (hour >= 23 || hour <= 1) {
          // Light sleep / falling asleep
          intensity = 0.5 + Math.random() * 0.3;
          duration = 0.8 + Math.random() * 0.2;
        } else if (hour >= 2 && hour <= 5) {
          // Deep sleep core
          intensity = 0.9 + Math.random() * 0.1;
          duration = 0.95 + Math.random() * 0.05;
        } else if (hour >= 6 && hour <= 7) {
          // REM / light sleep before waking
          intensity = 0.6 + Math.random() * 0.2;
          duration = 0.7 + Math.random() * 0.2;
        } else if (hour >= 14 && hour <= 15) {
          // Optional afternoon nap
          intensity = Math.random() * 0.4;
          duration = Math.random() * 0.5;
        } else {
          // Fully awake hours - no sleep
          intensity = 0;
          duration = 0;
        }
        
        return {
          hour,
          type: 'sleep',
          intensity,
          duration,
          value: Math.round(intensity * 8),
          sourceLayer: 'sleep',
          dataPoint: `${hour}:00`
        };
      });
    
    default:
      return [];
  }
};

// Pre-generated coherent data for the demo
export const mockMobilityData: DataBlob[] = generateMockLifeData('mobility');
export const mockMoodData: DataBlob[] = generateMockLifeData('mood');
export const mockSleepData: DataBlob[] = generateMockLifeData('sleep');