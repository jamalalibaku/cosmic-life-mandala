/**
 * Reactive Living Frequency Tilt System
 * Connects tilt effects to heartbeat, earth orbit, real-time data, and all living frequencies
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
  baseAmplitude?: number; // base tilt amount in degrees
}

// Living frequency mappings
const FrequencyMappings = {
  // Biological rhythms (in Hz)
  heartbeat: {
    resting: 1.0, // 60 BPM
    active: 2.0,  // 120 BPM
    stressed: 2.5 // 150 BPM
  },
  breathing: {
    calm: 0.25,    // 15 breaths/min
    normal: 0.33,  // 20 breaths/min
    anxious: 0.5   // 30 breaths/min
  },
  
  // Astronomical cycles (in Hz - very slow)
  earthRotation: 1 / (24 * 60 * 60), // 24 hours
  moonCycle: 1 / (29.5 * 24 * 60 * 60), // 29.5 days
  seasonalCycle: 1 / (365 * 24 * 60 * 60), // 365 days
  
  // Real-time rhythms
  second: 1.0,
  minute: 1 / 60,
  hour: 1 / (60 * 60),
  
  // Flow state frequencies
  deepFocus: 0.1,   // Very slow, meditative
  creative: 0.8,    // Faster, more dynamic
  stressed: 3.0,    // Rapid, agitated
  
  // Environmental rhythms
  soundWaves: 0.5,  // Ambient sound response
  temperature: 0.02, // Slow thermal changes
  weather: 0.05     // Weather pattern changes
};

export const useReactiveTilt = ({
  layerType,
  sensitivity = 0.7,
  dampening = 0.8,
  baseAmplitude = 2.0
}: ReactiveTiltOptions) => {
  const [tiltAngle, setTiltAngle] = useState(0);
  const [frequencyData, setFrequencyData] = useState<FrequencyData>({
    timeOfDay: 0,
    dayOfYear: 0,
    moonPhase: 0,
    stressLevel: 0.3,
    flowState: 0.6,
    activityIntensity: 0.5,
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

  // Mouse tracking for velocity
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const deltaTime = (now - mousePos.current.lastTime) / 1000;
    const deltaX = e.clientX - mousePos.current.x;
    const deltaY = e.clientY - mousePos.current.y;
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;
    
    mousePos.current = { x: e.clientX, y: e.clientY, lastTime: now };
    
    setFrequencyData(prev => ({
      ...prev,
      mouseVelocity: Math.min(velocity / 1000, 1) // Normalize to 0-1
    }));
    
    // Track interaction frequency
    interactionCount.current++;
    lastInteractionTime.current = now;
  }, []);

  // Scroll tracking
  const handleScroll = useCallback((e: Event) => {
    const now = Date.now();
    const deltaTime = (now - scrollPos.current.lastTime) / 1000;
    const deltaY = Math.abs(window.scrollY - scrollPos.current.y);
    const velocity = deltaY / deltaTime;
    
    scrollPos.current = { y: window.scrollY, lastTime: now };
    
    setFrequencyData(prev => ({
      ...prev,
      scrollVelocity: Math.min(velocity / 1000, 1)
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
        
        setFrequencyData(prev => ({
          ...prev,
          soundLevel: average / 255
        }));
        
        requestAnimationFrame(updateAudioLevel);
      };
      
      updateAudioLevel();
    } catch (err) {
      console.log('Audio monitoring not available:', err);
    }
  }, []);

  // Simulate biological data (in real app, this would come from sensors)
  const simulateBiologicalData = useCallback(() => {
    const baseHeart = 70; // resting heart rate
    const stressMultiplier = 1 + (frequencyData.stressLevel * 0.5);
    const activityMultiplier = 1 + (frequencyData.activityIntensity * 0.3);
    
    setFrequencyData(prev => ({
      ...prev,
      heartRate: baseHeart * stressMultiplier * activityMultiplier,
      breathingRate: 16 * (1 + prev.stressLevel * 0.4),
      // Simulate stress based on interaction patterns
      stressLevel: Math.max(0, Math.min(1, prev.stressLevel + 
        (prev.mouseVelocity * 0.1) + 
        (prev.scrollVelocity * 0.05) - 0.01)), // Natural decay
      // Flow state inversely related to stress and mouse movement
      flowState: Math.max(0, Math.min(1, 0.8 - prev.stressLevel * 0.6 - prev.mouseVelocity * 0.3))
    }));
  }, [frequencyData.stressLevel, frequencyData.activityIntensity]);

  // Calculate tilt based on all frequencies
  const calculateReactiveTilt = useCallback(() => {
    const now = Date.now() / 1000;
    let combinedTilt = 0;
    
    // Layer-specific frequency preferences with flexible typing
    const layerFrequencies: Record<string, Record<string, number>> = {
      core: {
        heartbeat: 0.8,
        breathing: 0.6,
        earthRotation: 1.0,
        timeOfDay: 0.4
      },
      weather: {
        temperature: 0.9,
        atmosphericPressure: 0.7,
        soundLevel: 0.5,
        seasonalCycle: 0.8
      },
      plans: {
        flowState: 0.9,
        timeOfDay: 0.7,
        minute: 0.6,
        hour: 0.8
      },
      mobility: {
        mouseVelocity: 0.9,
        scrollVelocity: 0.8,
        activityIntensity: 1.0,
        heartbeat: 0.6
      },
      mood: {
        stressLevel: 1.0,
        flowState: 0.8,
        moonPhase: 0.6,
        soundLevel: 0.7
      },
      sleep: {
        breathing: 1.0,
        moonPhase: 0.8,
        timeOfDay: 0.9,
        stressLevel: -0.5 // inverse relationship
      },
      ui: {
        mouseVelocity: 0.7,
        interactionFrequency: 0.8,
        second: 0.3
      }
    };
    
    const preferences = layerFrequencies[layerType] || layerFrequencies.core;
    
    // Biological rhythms
    if (frequencyData.heartRate && preferences.heartbeat) {
      const heartFreq = frequencyData.heartRate / 60; // Convert BPM to Hz
      combinedTilt += Math.sin(now * heartFreq * 2 * Math.PI) * 
                     baseAmplitude * 0.3 * preferences.heartbeat;
    }
    
    if (frequencyData.breathingRate && preferences.breathing) {
      const breathFreq = frequencyData.breathingRate / 60;
      combinedTilt += Math.sin(now * breathFreq * 2 * Math.PI) * 
                     baseAmplitude * 0.5 * preferences.breathing;
    }
    
    // Astronomical cycles
    if (preferences.earthRotation) {
      combinedTilt += Math.sin(frequencyData.timeOfDay * 2 * Math.PI) * 
                     baseAmplitude * 0.2 * preferences.earthRotation;
    }
    
    if (preferences.moonPhase) {
      combinedTilt += Math.sin(frequencyData.moonPhase * 2 * Math.PI) * 
                     baseAmplitude * 0.15 * preferences.moonPhase;
    }
    
    // Real-time rhythms
    if (preferences.second) {
      combinedTilt += Math.sin((frequencyData.currentSecond / 60) * 2 * Math.PI) * 
                     baseAmplitude * 0.1 * preferences.second;
    }
    
    if (preferences.minute) {
      combinedTilt += Math.sin((frequencyData.currentMinute / 60) * 2 * Math.PI) * 
                     baseAmplitude * 0.2 * preferences.minute;
    }
    
    // Environmental and interaction data
    if (frequencyData.mouseVelocity && preferences.mouseVelocity) {
      combinedTilt += frequencyData.mouseVelocity * baseAmplitude * 0.4 * preferences.mouseVelocity;
    }
    
    if (frequencyData.stressLevel && preferences.stressLevel) {
      const stressComponent = Math.sin(now * 3 * 2 * Math.PI) * 
                             frequencyData.stressLevel * baseAmplitude * 0.3;
      combinedTilt += stressComponent * preferences.stressLevel;
    }
    
    if (frequencyData.flowState && preferences.flowState) {
      // Flow state creates slower, more harmonious movement
      const flowComponent = Math.sin(now * 0.1 * 2 * Math.PI) * 
                           frequencyData.flowState * baseAmplitude * 0.4;
      combinedTilt += flowComponent * preferences.flowState;
    }
    
    if (frequencyData.soundLevel && preferences.soundLevel) {
      combinedTilt += Math.sin(now * 0.5 * 2 * Math.PI) * 
                     frequencyData.soundLevel * baseAmplitude * 0.25 * preferences.soundLevel;
    }
    
    // Apply sensitivity and dampening
    const finalTilt = combinedTilt * sensitivity * dampening;
    
    setTiltAngle(finalTilt);
  }, [frequencyData, layerType, sensitivity, dampening, baseAmplitude]);

  // Setup event listeners and intervals
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Update time data every second
    const timeInterval = setInterval(updateTimeData, 1000);
    
    // Update biological simulation every 5 seconds
    const bioInterval = setInterval(simulateBiologicalData, 5000);
    
    // Calculate interaction frequency every minute
    const interactionInterval = setInterval(() => {
      const now = Date.now();
      const minutesSinceLastInteraction = (now - lastInteractionTime.current) / (60 * 1000);
      const interactionsPerMinute = interactionCount.current / Math.max(minutesSinceLastInteraction, 1);
      
      setFrequencyData(prev => ({
        ...prev,
        interactionFrequency: Math.min(interactionsPerMinute / 60, 1) // Normalize
      }));
      
      interactionCount.current = 0;
    }, 60000);
    
    // Initialize audio monitoring
    initAudioMonitoring();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
      clearInterval(bioInterval);
      clearInterval(interactionInterval);
    };
  }, [handleMouseMove, handleScroll, updateTimeData, simulateBiologicalData, initAudioMonitoring]);

  // Calculate tilt in animation frame
  useEffect(() => {
    let animationFrame: number;
    
    const updateTilt = () => {
      calculateReactiveTilt();
      animationFrame = requestAnimationFrame(updateTilt);
    };
    
    updateTilt();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [calculateReactiveTilt]);

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
    // Expose individual frequency components for debugging/visualization
    heartbeatComponent: frequencyData.heartRate ? Math.sin(Date.now() / 1000 * (frequencyData.heartRate / 60) * 2 * Math.PI) : 0,
    breathingComponent: frequencyData.breathingRate ? Math.sin(Date.now() / 1000 * (frequencyData.breathingRate / 60) * 2 * Math.PI) : 0,
    stressComponent: frequencyData.stressLevel,
    flowComponent: frequencyData.flowState,
    mouseComponent: frequencyData.mouseVelocity,
    timeComponent: Math.sin(frequencyData.timeOfDay * 2 * Math.PI)
  };
};