/**
 * (c) 2025 Cosmic Life Mandala – Realistic Sleep Data
 * Based on actual sleep tracking patterns from modern devices
 * Shows fragmented sleep sessions, micro-naps, and tracking artifacts
 */

import { DataBlob } from '../components/data-blob-ring';

// Realistic sleep session data based on actual Apple Health/wearable tracking
export interface SleepSession {
  timestamp: string;
  durationHours: number;
  layerType: 'sleep';
  intensity?: number;
  quality?: 'deep' | 'light' | 'rem' | 'awake' | 'tracking-artifact';
}

// Your actual sleep data patterns
export const realisticSleepSessions: SleepSession[] = [
  // July 10th - fragmented morning tracking
  { timestamp: '2025-07-10T07:59:48+02:00', durationHours: 0.05, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-10T08:03:30+02:00', durationHours: 0.19, layerType: 'sleep', quality: 'light' },
  
  // July 11th - main sleep block followed by fragmented tracking
  { timestamp: '2025-07-11T00:15:00+02:00', durationHours: 4.46, layerType: 'sleep', quality: 'deep' },
  { timestamp: '2025-07-11T04:43:13+02:00', durationHours: 1.88, layerType: 'sleep', quality: 'rem' },
  { timestamp: '2025-07-11T06:36:31+02:00', durationHours: 0.0, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T06:36:37+02:00', durationHours: 0.04, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:03:12+02:00', durationHours: 0.01, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:34:07+02:00', durationHours: 0.01, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:35:05+02:00', durationHours: 0.01, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:36:36+02:00', durationHours: 0.02, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:38:23+02:00', durationHours: 0.02, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T07:39:36+02:00', durationHours: 0.02, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T08:13:20+02:00', durationHours: 0.01, layerType: 'sleep', quality: 'tracking-artifact' },
  { timestamp: '2025-07-11T08:14:20+02:00', durationHours: 0.0, layerType: 'sleep', quality: 'tracking-artifact' },
];

// Convert realistic sessions to radial data blobs for visualization
export const generateRealisticSleepData = (): DataBlob[] => {
  const hourlyData: Record<number, { totalDuration: number; maxIntensity: number; sessions: number }> = {};
  
  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { totalDuration: 0, maxIntensity: 0, sessions: 0 };
  }
  
  // Process each sleep session
  realisticSleepSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const hour = date.getHours();
    
    // Skip tracking artifacts for visualization
    if (session.quality === 'tracking-artifact' && session.durationHours < 0.1) {
      return;
    }
    
    // Map quality to intensity
    let intensity = 0;
    switch (session.quality) {
      case 'deep':
        intensity = 0.9;
        break;
      case 'rem':
        intensity = 0.7;
        break;
      case 'light':
        intensity = 0.4;
        break;
      case 'awake':
        intensity = 0.1;
        break;
      default:
        intensity = 0.2;
    }
    
    hourlyData[hour].totalDuration += session.durationHours;
    hourlyData[hour].maxIntensity = Math.max(hourlyData[hour].maxIntensity, intensity);
    hourlyData[hour].sessions += 1;
  });
  
  // Convert to DataBlob format
  return Array.from({ length: 24 }, (_, hour) => {
    const data = hourlyData[hour];
    const normalizedDuration = Math.min(1, data.totalDuration / 2); // Normalize against 2-hour max
    
    return {
      hour,
      type: 'sleep',
      intensity: data.maxIntensity,
      duration: normalizedDuration,
      value: Math.round(data.totalDuration * 60), // Convert to minutes
      sourceLayer: 'sleep',
      dataPoint: `${hour}:00 (${data.sessions} sessions)`
    };
  });
};

// Extended realistic pattern generator for other days
export const generateVariedRealisticSleepData = (date: Date): DataBlob[] => {
  const dayOfWeek = date.getDay();
  const basePatterns = {
    // Weekend pattern - later sleep, more fragmented
    weekend: [
      { hour: 1, duration: 3.2, quality: 'deep' },
      { hour: 4, duration: 1.5, quality: 'rem' },
      { hour: 8, duration: 0.3, quality: 'light' },
      { hour: 14, duration: 0.8, quality: 'light' }, // Afternoon nap
    ],
    // Weekday pattern - earlier but still fragmented
    weekday: [
      { hour: 23, duration: 1.2, quality: 'light' },
      { hour: 1, duration: 4.0, quality: 'deep' },
      { hour: 5, duration: 1.8, quality: 'rem' },
      { hour: 7, duration: 0.2, quality: 'light' },
    ],
    // Stressed pattern - very fragmented
    stressed: [
      { hour: 0, duration: 2.1, quality: 'light' },
      { hour: 3, duration: 1.2, quality: 'light' },
      { hour: 5, duration: 0.8, quality: 'light' },
      { hour: 7, duration: 0.5, quality: 'light' },
      { hour: 15, duration: 0.3, quality: 'light' },
    ]
  };
  
  let pattern;
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    pattern = basePatterns.weekend;
  } else if (Math.random() > 0.7) {
    pattern = basePatterns.stressed;
  } else {
    pattern = basePatterns.weekday;
  }
  
  // Initialize all hours
  const hourlyData: Record<number, { intensity: number; duration: number; sessions: number }> = {};
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { intensity: 0, duration: 0, sessions: 0 };
  }
  
  // Apply pattern with some randomness
  pattern.forEach(({ hour, duration, quality }) => {
    const adjustedHour = hour;
    const adjustedDuration = duration * (0.8 + Math.random() * 0.4); // ±20% variance
    
    let intensity = 0;
    switch (quality) {
      case 'deep':
        intensity = 0.8 + Math.random() * 0.2;
        break;
      case 'rem':
        intensity = 0.6 + Math.random() * 0.2;
        break;
      case 'light':
        intensity = 0.3 + Math.random() * 0.3;
        break;
    }
    
    hourlyData[adjustedHour].intensity = Math.max(hourlyData[adjustedHour].intensity, intensity);
    hourlyData[adjustedHour].duration += adjustedDuration;
    hourlyData[adjustedHour].sessions += 1;
    
    // Add micro-fragments around main sleep (realistic tracking artifacts)
    if (adjustedDuration > 1 && Math.random() > 0.5) {
      const fragmentHour = (adjustedHour + 1) % 24;
      hourlyData[fragmentHour].duration += 0.05 + Math.random() * 0.1;
      hourlyData[fragmentHour].intensity = Math.max(hourlyData[fragmentHour].intensity, 0.2);
      hourlyData[fragmentHour].sessions += 1;
    }
  });
  
  // Convert to DataBlob format
  return Array.from({ length: 24 }, (_, hour) => {
    const data = hourlyData[hour];
    const normalizedDuration = Math.min(1, data.duration / 3); // Normalize against 3-hour max
    
    return {
      hour,
      type: 'sleep',
      intensity: data.intensity,
      duration: normalizedDuration,
      value: Math.round(data.duration * 60), // Convert to minutes
      sourceLayer: 'sleep',
      dataPoint: data.sessions > 0 ? `${hour}:00 (${data.sessions} sessions)` : `${hour}:00`
    };
  });
};

// Export both current realistic data and generator
export const realisticSleepData: DataBlob[] = generateRealisticSleepData();