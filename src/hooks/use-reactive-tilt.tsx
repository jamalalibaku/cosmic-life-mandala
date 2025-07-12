/**
 * Gentle Organic Wind & Gravity Tilt System
 * Ultra-slow, gentle motion affected by light wind touch and gravity's drag
 * All frequencies slowed 10x for meditative, organic feel
 */

import { useEffect, useState, useRef, useCallback } from 'react';

// Frequency data sources interface
interface FrequencyData {
  // Biological frequencies
  heartRate?: number; // BPM
  breathingRate?: number; // breaths per minute
  
  // Astronomical frequencies
  timeOfDay: number; // 0-1 (0 = midnight, 0.5 = noon)
  dayOfYear: number; // 0-1 (0 = Jan 1, 1 = Dec 31)
  moonPhase: number; // 0-1 (0 = new moon, 0.5 = full moon)
  
  // Environmental data
  soundLevel?: number; // 0-1 (ambient volume)
  temperature?: number; // celsius
  atmosphericPressure?: number; // hPa
  
  // Emotional/flow states
  stressLevel: number; // 0-1 (0 = calm, 1 = stressed)
  flowState: number; // 0-1 (0 = distracted, 1 = deep flow)
  activityIntensity: number; // 0-1
  
  // Real-time interaction data
  mouseVelocity: number; // pixels/second
  scrollVelocity: number; // pixels/second
  interactionFrequency: number; // interactions per minute
  
  // System rhythms
  currentSecond: number; // 0-59
  currentMinute: number; // 0-59
  currentHour: number; // 0-23
}

interface ReactiveTiltOptions {
  layerType: 'core' | 'weather' | 'plans' | 'mobility' | 'mood' | 'sleep' | 'ui';
  sensitivity?: number; // 0-1, how much data affects tilt
  dampening?: number; // 0-1, smoothing factor
  baseAmplitude?: number; // base tilt amount in degrees (much smaller now)
  windStrength?: number; // 0-1, how much wind affects the motion
  gravityStrength?: number; // 0-1, how much gravity drag affects motion
}

// Organic wind and gravity constants
const MOTION_SLOWDOWN = 10; // 10x slower than before
const WIND_RANDOMNESS = 0.3; // Random wind variation
const GRAVITY_PULL = 0.8; // Gravity drag coefficient
const ORGANIC_NOISE_SCALE = 0.05; // Subtle organic noise
const PENDULUM_DAMPENING = 0.95; // Natural pendulum decay

// Living frequency mappings - all slowed down 10x for gentle organic motion
const FrequencyMappings = {
  // Biological rhythms (in Hz) - ultra slow for meditative feel
  heartbeat: {
    resting: 0.1,   // Was 1.0, now 60 BPM over 10 seconds
    active: 0.2,    // Was 2.0, now 120 BPM over 10 seconds  
    stressed: 0.25  // Was 2.5, now 150 BPM over 10 seconds
  },
  breathing: {
    calm: 0.025,    // Was 0.25, now 15 breaths over 10 minutes
    normal: 0.033,  // Was 0.33, now 20 breaths over 10 minutes
    anxious: 0.05   // Was 0.5, now 30 breaths over 10 minutes
  },
  
  // Astronomical cycles (ultra slow for cosmic feel)
  earthRotation: 1 / (240 * 60 * 60), // 240 hours (10x slower)
  moonCycle: 1 / (295 * 24 * 60 * 60), // 295 days (10x slower)
  seasonalCycle: 1 / (3650 * 24 * 60 * 60), // 3650 days (10x slower)
  
  // Real-time rhythms - gentle and slow
  second: 0.1,        // Was 1.0, now 10 seconds per cycle
  minute: 1 / 600,    // Was 1/60, now 600 seconds per cycle
  hour: 1 / (36000),  // Was 1/3600, now 36000 seconds per cycle
  
  // Flow state frequencies - meditative slow
  deepFocus: 0.01,    // Was 0.1, very slow meditative
  creative: 0.08,     // Was 0.8, slower creative flow
  stressed: 0.3,      // Was 3.0, much calmer even when stressed
  
  // Environmental rhythms - gentle breeze-like
  windBreezePattern: 0.02,  // New: gentle wind simulation
  gravityPendulum: 0.015,   // New: pendulum-like gravity sway
  organicNoise: 0.008,      // New: subtle organic variation
  soundWaves: 0.05,         // Was 0.5, much gentler
  temperature: 0.002,       // Was 0.02, barely perceptible
  weather: 0.005            // Was 0.05, very gentle
};

export const useReactiveTilt = ({
  layerType,
  sensitivity = 0.3,      // Much lower sensitivity for gentleness
  dampening = 0.95,       // Higher dampening for smoother motion
  baseAmplitude = 0.8,    // Much smaller amplitude for subtle movement
  windStrength = 0.6,     // Wind effect strength
  gravityStrength = 0.7   // Gravity drag strength
}: ReactiveTiltOptions) => {
  const [tiltAngle, setTiltAngle] = useState(0);
  const [windOffset, setWindOffset] = useState(0);
  const [gravityMomentum, setGravityMomentum] = useState(0);
  const [organicNoise, setOrganicNoise] = useState(0);
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({
    timeOfDay: 0,
    dayOfYear: 0,
    moonPhase: 0,
    stressLevel: 0.1,      // Much lower baseline stress
    flowState: 0.8,        // Higher baseline flow state
    activityIntensity: 0.2, // Lower baseline activity
    mouseVelocity: 0,
    scrollVelocity: 0,
    interactionFrequency: 0,
    currentSecond: 0,
    currentMinute: 0,
    currentHour: 0
  });
  
  const mousePos = useRef({ x: 0, y: 0, lastTime: Date.now() });
  const scrollPos = useRef({ y: 0, lastTime: Date.now() });
  const interactionCount = useRef(0);
  const lastInteractionTime = useRef(Date.now());

  // Real-time data collection
  const updateTimeData = useCallback(() => {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    // Calculate moon phase (approximate)
    const moonCycle = 29.53059;
    const knownNewMoon = new Date('2024-01-11'); // Known new moon date
    const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const moonPhase = (daysSinceNewMoon % moonCycle) / moonCycle;
    
    setFrequencyData(prev => ({
      ...prev,
      timeOfDay: (now.getTime() - dayStart.getTime()) / (24 * 60 * 60 * 1000),
      dayOfYear: (now.getTime() - yearStart.getTime()) / (365 * 24 * 60 * 60 * 1000),
      moonPhase,
      currentSecond: now.getSeconds(),
      currentMinute: now.getMinutes(),
      currentHour: now.getHours()
    }));
  }, []);

  // Gentle mouse tracking with heavy dampening
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const deltaTime = (now - mousePos.current.lastTime) / 1000;
    const deltaX = e.clientX - mousePos.current.x;
    const deltaY = e.clientY - mousePos.current.y;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
    
    mousePos.current = { x: e.clientX, y: e.clientY, lastTime: now };
    
    // Much gentler velocity response
    setFrequencyData(prev => ({
      ...prev,
      mouseVelocity: Math.min(velocity / 5000, 0.3) // 5x less sensitive, max 0.3
    }));
    
    // Track interaction frequency
    interactionCount.current++;
    lastInteractionTime.current = now;
  }, []);

  // Gentle scroll tracking
  const handleScroll = useCallback((e: Event) => {
    const now = Date.now();
    const deltaTime = (now - scrollPos.current.lastTime) / 1000;
    const deltaY = Math.abs(window.scrollY - scrollPos.current.y);
    const velocity = deltaY / deltaTime;
    
    scrollPos.current = { y: window.scrollY, lastTime: now };
    
    // Much gentler scroll response
    setFrequencyData(prev => ({
      ...prev,
      scrollVelocity: Math.min(velocity / 3000, 0.2) // 3x less sensitive, max 0.2
    }));
  }, []);

  // Audio level detection (if available)
  const initAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        
        // Much gentler audio response
        setFrequencyData(prev => ({
          ...prev,
          soundLevel: (average / 255) * 0.4 // Cap at 40% for gentleness
        }));
        
        requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (err) {
      console.log('Audio monitoring not available:', err);
    }
  }, []);

  // Gentle biological simulation - much calmer baseline
  const simulateBiologicalData = useCallback(() => {
    const baseHeart = 65; // Lower resting heart rate
    const stressMultiplier = 1 + (frequencyData.stressLevel * 0.2); // Much less stress impact
    const activityMultiplier = 1 + (frequencyData.activityIntensity * 0.1); // Minimal activity impact
    
    setFrequencyData(prev => ({
      ...prev,
      heartRate: baseHeart * stressMultiplier * activityMultiplier,
      breathingRate: 14 * (1 + prev.stressLevel * 0.2), // Calmer breathing
      // Gentle stress simulation with natural decay
      stressLevel: Math.max(0, Math.min(0.3, prev.stressLevel + 
        (prev.mouseVelocity * 0.02) + 
        (prev.scrollVelocity * 0.01) - 0.005)), // Faster natural decay
      // Higher baseline flow state, less disruption
      flowState: Math.max(0.5, Math.min(1, 0.9 - prev.stressLevel * 0.3 - prev.mouseVelocity * 0.1))
    }));
  }, [frequencyData.stressLevel, frequencyData.activityIntensity]);

  // Generate organic wind and gravity effects
  const updateOrganicMotion = useCallback(() => {
    const now = Date.now() / 1000;
    
    // Simulate gentle wind with random variations
    const windBase = Math.sin(now * FrequencyMappings.windBreezePattern * 2 * Math.PI);
    const windGust = Math.sin(now * FrequencyMappings.windBreezePattern * 3.7 * Math.PI) * 0.3;
    const windRandomness = (Math.random() - 0.5) * WIND_RANDOMNESS;
    setWindOffset((windBase + windGust + windRandomness) * windStrength);
    
    // Simulate gravity pendulum effect with natural decay
    setGravityMomentum(prev => {
      const gravityPull = Math.sin(now * FrequencyMappings.gravityPendulum * 2 * Math.PI);
      const newMomentum = (prev * PENDULUM_DAMPENING) + (gravityPull * gravityStrength * 0.1);
      return newMomentum;
    });
    
    // Generate subtle organic noise for natural feel
    const noiseValue = (Math.sin(now * FrequencyMappings.organicNoise * 2 * Math.PI) + 
                       Math.sin(now * FrequencyMappings.organicNoise * 1.7 * Math.PI)) * 0.5;
    setOrganicNoise(noiseValue * ORGANIC_NOISE_SCALE);
  }, [windStrength, gravityStrength]);

  // Calculate gentle, organic tilt based on all frequencies
  const calculateReactiveTilt = useCallback(() => {
    const now = Date.now() / 1000;
    let combinedTilt = 0;
    
    // Layer-specific frequency preferences with much gentler amplitudes
    const layerFrequencies: Record<string, Record<string, number>> = {
      core: {
        heartbeat: 0.3,      // Was 0.8, much gentler
        breathing: 0.4,      // Was 0.6, slightly gentler
        earthRotation: 0.6,  // Was 1.0, gentler
        timeOfDay: 0.2       // Was 0.4, much gentler
      },
      weather: {
        temperature: 0.4,         // Was 0.9, much gentler
        atmosphericPressure: 0.3, // Was 0.7, gentler
        soundLevel: 0.2,          // Was 0.5, much gentler
        seasonalCycle: 0.3        // Was 0.8, gentler
      },
      plans: {
        flowState: 0.4,    // Was 0.9, much gentler
        timeOfDay: 0.3,    // Was 0.7, gentler
        minute: 0.2,       // Was 0.6, much gentler
        hour: 0.3          // Was 0.8, gentler
      },
      mobility: {
        mouseVelocity: 0.3,      // Was 0.9, much gentler
        scrollVelocity: 0.2,     // Was 0.8, much gentler
        activityIntensity: 0.4,  // Was 1.0, gentler
        heartbeat: 0.2           // Was 0.6, much gentler
      },
      mood: {
        stressLevel: 0.4,   // Was 1.0, much gentler
        flowState: 0.3,     // Was 0.8, gentler
        moonPhase: 0.3,     // Was 0.6, gentler
        soundLevel: 0.2     // Was 0.7, much gentler
      },
      sleep: {
        breathing: 0.5,       // Was 1.0, gentler
        moonPhase: 0.3,       // Was 0.8, gentler
        timeOfDay: 0.4,       // Was 0.9, gentler
        stressLevel: -0.2     // Was -0.5, gentler inverse
      },
      ui: {
        mouseVelocity: 0.2,         // Was 0.7, much gentler
        interactionFrequency: 0.3,  // Was 0.8, gentler
        second: 0.1                 // Was 0.3, much gentler
      }
    };
    
    const preferences = layerFrequencies[layerType] || layerFrequencies.core;
    
    // Ultra-gentle biological rhythms (10x slower)
    if (frequencyData.heartRate && preferences.heartbeat) {
      const heartFreq = (frequencyData.heartRate / 60) / MOTION_SLOWDOWN;
      combinedTilt += Math.sin(now * heartFreq * 2 * Math.PI) * 
                     baseAmplitude * 0.15 * preferences.heartbeat; // Was 0.3, now 0.15
    }
    
    if (frequencyData.breathingRate && preferences.breathing) {
      const breathFreq = (frequencyData.breathingRate / 60) / MOTION_SLOWDOWN;
      combinedTilt += Math.sin(now * breathFreq * 2 * Math.PI) * 
                     baseAmplitude * 0.25 * preferences.breathing; // Was 0.5, now 0.25
    }
    
    // Ultra-slow astronomical cycles
    if (preferences.earthRotation) {
      combinedTilt += Math.sin(frequencyData.timeOfDay * 2 * Math.PI) * 
                     baseAmplitude * 0.1 * preferences.earthRotation; // Was 0.2, now 0.1
    }
    
    if (preferences.moonPhase) {
      combinedTilt += Math.sin(frequencyData.moonPhase * 2 * Math.PI) * 
                     baseAmplitude * 0.08 * preferences.moonPhase; // Was 0.15, now 0.08
    }
    
    // Gentle real-time rhythms
    if (preferences.second) {
      combinedTilt += Math.sin((frequencyData.currentSecond / 60) * 2 * Math.PI / MOTION_SLOWDOWN) * 
                     baseAmplitude * 0.05 * preferences.second; // Was 0.1, now 0.05
    }
    
    if (preferences.minute) {
      combinedTilt += Math.sin((frequencyData.currentMinute / 60) * 2 * Math.PI / MOTION_SLOWDOWN) * 
                     baseAmplitude * 0.1 * preferences.minute; // Was 0.2, now 0.1
    }
    
    // Ultra-gentle environmental and interaction data
    if (frequencyData.mouseVelocity && preferences.mouseVelocity) {
      combinedTilt += frequencyData.mouseVelocity * baseAmplitude * 0.2 * preferences.mouseVelocity; // Was 0.4, now 0.2
    }
    
    if (frequencyData.stressLevel && preferences.stressLevel) {
      const stressComponent = Math.sin(now * 0.3 * 2 * Math.PI) * // Was 3, now 0.3
                             frequencyData.stressLevel * baseAmplitude * 0.15; // Was 0.3, now 0.15
      combinedTilt += stressComponent * preferences.stressLevel;
    }
    
    if (frequencyData.flowState && preferences.flowState) {
      // Flow state creates ultra-slow, harmonious movement
      const flowComponent = Math.sin(now * 0.01 * 2 * Math.PI) * // Was 0.1, now 0.01
                           frequencyData.flowState * baseAmplitude * 0.2; // Was 0.4, now 0.2
      combinedTilt += flowComponent * preferences.flowState;
    }
    
    if (frequencyData.soundLevel && preferences.soundLevel) {
      combinedTilt += Math.sin(now * 0.05 * 2 * Math.PI) * // Was 0.5, now 0.05
                     frequencyData.soundLevel * baseAmplitude * 0.12 * preferences.soundLevel; // Was 0.25, now 0.12
    }
    
    // Add organic wind and gravity effects
    combinedTilt += windOffset * baseAmplitude * 0.3;
    combinedTilt += gravityMomentum * baseAmplitude * 0.4;
    combinedTilt += organicNoise * baseAmplitude * 0.5;
    
    // Apply sensitivity and much higher dampening for ultra-smooth motion
    const finalTilt = combinedTilt * sensitivity * dampening;
    
    setTiltAngle(finalTilt);
  }, [frequencyData, layerType, sensitivity, dampening, baseAmplitude, windOffset, gravityMomentum, organicNoise]);

  // Setup event listeners and intervals
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Update time data every 2 seconds (slower updates)
    const timeInterval = setInterval(updateTimeData, 2000);
    
    // Update biological simulation every 10 seconds (much slower)
    const bioInterval = setInterval(simulateBiologicalData, 10000);
    
    // Update organic motion every 100ms for smooth wind/gravity
    const organicInterval = setInterval(updateOrganicMotion, 100);
    
    
    // Calculate interaction frequency every 2 minutes (slower tracking)
    const interactionInterval = setInterval(() => {
      const now = Date.now();
      const minutesSinceLastInteraction = (now - lastInteractionTime.current) / (60 * 1000);
      const interactionsPerMinute = interactionCount.current / Math.max(minutesSinceLastInteraction, 1);
      
      setFrequencyData(prev => ({
        ...prev,
        interactionFrequency: Math.min(interactionsPerMinute / 120, 0.5) // Much gentler normalization
      }));
      
      interactionCount.current = 0;
    }, 120000); // Every 2 minutes instead of 1
    
    // Initialize audio monitoring
    initAudioMonitoring();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
      clearInterval(bioInterval);
      clearInterval(interactionInterval);
      clearInterval(organicInterval);
    };
  }, [handleMouseMove, handleScroll, updateTimeData, simulateBiologicalData, updateOrganicMotion, initAudioMonitoring]);

  // Use a ref to track tilt and update it in animation frame without causing re-renders
  const currentTiltRef = useRef(0);
  
  // Calculate tilt in animation frame without setState loops
  useEffect(() => {
    let animationFrame: number;
    
    const updateTilt = () => {
      const now = Date.now() / 1000;
      let combinedTilt = 0;
      
      const layerFrequencies: Record<string, Record<string, number>> = {
        core: { heartbeat: 0.3, breathing: 0.4, earthRotation: 0.6, timeOfDay: 0.2 },
        weather: { temperature: 0.4, atmosphericPressure: 0.3, soundLevel: 0.2, seasonalCycle: 0.3 },
        plans: { flowState: 0.4, timeOfDay: 0.3, minute: 0.2, hour: 0.3 },
        mobility: { mouseVelocity: 0.3, scrollVelocity: 0.2, activityIntensity: 0.4, heartbeat: 0.2 },
        mood: { stressLevel: 0.4, flowState: 0.3, moonPhase: 0.3, soundLevel: 0.2 },
        sleep: { breathing: 0.5, moonPhase: 0.3, timeOfDay: 0.4, stressLevel: -0.2 },
        ui: { mouseVelocity: 0.2, interactionFrequency: 0.3, second: 0.1 }
      };
      
      const preferences = layerFrequencies[layerType] || layerFrequencies.core;
      
      // Calculate all frequency components without setState
      if (frequencyData.heartRate && preferences.heartbeat) {
        const heartFreq = (frequencyData.heartRate / 60) / MOTION_SLOWDOWN;
        combinedTilt += Math.sin(now * heartFreq * 2 * Math.PI) * 
                       baseAmplitude * 0.15 * preferences.heartbeat;
      }
      
      if (frequencyData.breathingRate && preferences.breathing) {
        const breathFreq = (frequencyData.breathingRate / 60) / MOTION_SLOWDOWN;
        combinedTilt += Math.sin(now * breathFreq * 2 * Math.PI) * 
                       baseAmplitude * 0.25 * preferences.breathing;
      }
      
      if (preferences.earthRotation) {
        combinedTilt += Math.sin(frequencyData.timeOfDay * 2 * Math.PI) * 
                       baseAmplitude * 0.1 * preferences.earthRotation;
      }
      
      if (preferences.moonPhase) {
        combinedTilt += Math.sin(frequencyData.moonPhase * 2 * Math.PI) * 
                       baseAmplitude * 0.08 * preferences.moonPhase;
      }
      
      // Add organic motion without setState
      combinedTilt += windOffset * baseAmplitude * 0.3;
      combinedTilt += gravityMomentum * baseAmplitude * 0.4;
      combinedTilt += organicNoise * baseAmplitude * 0.5;
      
      const finalTilt = combinedTilt * sensitivity * dampening;
      currentTiltRef.current = finalTilt;
      
      // Only update state occasionally to prevent loops
      if (Math.abs(finalTilt - tiltAngle) > 0.01) {
        setTiltAngle(finalTilt);
      }
      
      animationFrame = requestAnimationFrame(updateTilt);
    };
    
    updateTilt();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [layerType, sensitivity, dampening, baseAmplitude]); // Removed calculateReactiveTilt dependency

  // Generate transform strings
  const getTiltTransform = (additionalTransforms = '') => {
    const tilt = `rotate(${tiltAngle}deg)`;
    return additionalTransforms ? `${additionalTransforms} ${tilt}` : tilt;
  };

  const getSVGTiltTransform = (centerX: number, centerY: number, additionalTransforms = '') => {
    const tilt = `rotate(${tiltAngle} ${centerX} ${centerY})`;
    return additionalTransforms ? `${additionalTransforms} ${tilt}` : tilt;
  };

  return {
    tiltAngle,
    frequencyData,
    getTiltTransform,
    getSVGTiltTransform,
    // Expose gentle frequency components for visualization
    windComponent: windOffset,
    gravityComponent: gravityMomentum,
    organicNoiseComponent: organicNoise,
    heartbeatComponent: frequencyData.heartRate ? Math.sin(Date.now() / 1000 * (frequencyData.heartRate / 60) / MOTION_SLOWDOWN * 2 * Math.PI) : 0,
    breathingComponent: frequencyData.breathingRate ? Math.sin(Date.now() / 1000 * (frequencyData.breathingRate / 60) / MOTION_SLOWDOWN * 2 * Math.PI) : 0,
    stressComponent: frequencyData.stressLevel * 0.5, // Gentler visualization
    flowComponent: frequencyData.flowState,
    mouseComponent: frequencyData.mouseVelocity * 0.5, // Gentler visualization
    timeComponent: Math.sin(frequencyData.timeOfDay * 2 * Math.PI) * 0.3 // Gentler visualization
  };
};