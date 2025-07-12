/**
 * Cosmic Wave Harmonics System
 * Replaces chaotic random motion with harmonic wave patterns
 */

interface WaveSource {
  angle: number;      // Origin angle on circle
  intensity: number;  // 0-1 wave strength
  frequency: number;  // Wave frequency multiplier
  type: 'solar' | 'wind' | 'cosmic' | 'data';
  phase: number;      // Current phase offset
}

interface HarmonicField {
  primaryWaves: WaveSource[];
  secondaryWaves: WaveSource[];
  globalPhase: number;
  dampingFactor: number;
}

/**
 * Perlin-like noise function for smooth organic variation
 */
function smoothNoise(x: number, y: number = 0): number {
  // Simple 2D noise approximation using sine waves
  const a = Math.sin(x * 0.1 + y * 0.07) * 0.5;
  const b = Math.sin(x * 0.2 + y * 0.13) * 0.25;
  const c = Math.sin(x * 0.4 + y * 0.23) * 0.125;
  return (a + b + c) * 0.8; // Normalized to roughly -0.8 to 0.8
}

/**
 * Create harmonic field based on current conditions
 */
export function createHarmonicField(
  solarActivity: number = 0.5,
  windIntensity: number = 0.3,
  windDirection: number = 0,
  time: number = Date.now()
): HarmonicField {
  const primaryWaves: WaveSource[] = [];
  const secondaryWaves: WaveSource[] = [];
  
  const basePhase = (time * 0.00008) % (Math.PI * 2); // Very slow global rhythm
  
  // Solar wave sources (emanating from sun position)
  if (solarActivity > 0.1) {
    const currentHour = new Date().getHours();
    const sunAngle = (currentHour / 24) * Math.PI * 2 - Math.PI / 2;
    
    primaryWaves.push({
      angle: sunAngle,
      intensity: solarActivity * 0.8,
      frequency: 1.2,
      type: 'solar',
      phase: basePhase
    });
    
    // Solar harmonics - opposite side gets mirrored solar energy
    secondaryWaves.push({
      angle: sunAngle + Math.PI,
      intensity: solarActivity * 0.3,
      frequency: 2.4,
      type: 'solar',
      phase: basePhase + Math.PI * 0.5
    });
  }
  
  // Wind wave sources
  if (windIntensity > 0.1) {
    primaryWaves.push({
      angle: windDirection,
      intensity: windIntensity * 0.6,
      frequency: 0.8,
      type: 'wind',
      phase: basePhase * 1.5
    });
    
    // Wind creates trailing waves
    for (let i = 1; i <= 3; i++) {
      secondaryWaves.push({
        angle: windDirection + (i * Math.PI * 0.3),
        intensity: windIntensity * (0.4 / i),
        frequency: 0.8 + i * 0.2,
        type: 'wind',
        phase: basePhase * 1.5 + i * Math.PI * 0.25
      });
    }
  }
  
  // Cosmic background waves (always present, very gentle)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    secondaryWaves.push({
      angle,
      intensity: 0.15 + smoothNoise(time * 0.0001 + i, angle) * 0.1,
      frequency: 0.3 + i * 0.1,
      type: 'cosmic',
      phase: basePhase * (0.7 + i * 0.1)
    });
  }
  
  return {
    primaryWaves,
    secondaryWaves,
    globalPhase: basePhase,
    dampingFactor: 0.85 // Gentle damping for smooth motion
  };
}

/**
 * Calculate harmonic influence at a specific angle
 */
export function calculateHarmonicInfluence(
  targetAngle: number,
  harmonicField: HarmonicField,
  time: number = Date.now()
): {
  displacement: number;
  curvature: number;
  intensity: number;
  dominantType: string;
} {
  let totalDisplacement = 0;
  let totalCurvature = 0;
  let totalIntensity = 0;
  let dominantIntensity = 0;
  let dominantType = 'cosmic';
  
  const currentPhase = (time * 0.0001) % (Math.PI * 2);
  
  // Process primary waves
  for (const wave of harmonicField.primaryWaves) {
    const distance = Math.abs(targetAngle - wave.angle);
    const normalizedDistance = Math.min(distance, Math.PI * 2 - distance);
    
    // Wave influence decreases with distance but wraps around circle
    const influence = Math.max(0, 1 - (normalizedDistance / Math.PI));
    const wavePhase = currentPhase * wave.frequency + wave.phase;
    
    // Mexican wave propagation - waves travel around the circle
    const propagationSpeed = 0.5; // Slow propagation
    const propagationPhase = (targetAngle - wave.angle) * propagationSpeed + wavePhase;
    
    const displacement = influence * wave.intensity * Math.sin(propagationPhase) * 25;
    const curvature = influence * wave.intensity * Math.cos(propagationPhase * 0.5) * 0.4;
    
    totalDisplacement += displacement;
    totalCurvature += curvature;
    totalIntensity += influence * wave.intensity;
    
    if (influence * wave.intensity > dominantIntensity) {
      dominantIntensity = influence * wave.intensity;
      dominantType = wave.type;
    }
  }
  
  // Process secondary waves (gentler, more diffuse)
  for (const wave of harmonicField.secondaryWaves) {
    const distance = Math.abs(targetAngle - wave.angle);
    const normalizedDistance = Math.min(distance, Math.PI * 2 - distance);
    
    // Broader influence for secondary waves
    const influence = Math.max(0, 1 - (normalizedDistance / (Math.PI * 1.5)));
    const wavePhase = currentPhase * wave.frequency + wave.phase;
    
    const displacement = influence * wave.intensity * Math.sin(wavePhase) * 15;
    const curvature = influence * wave.intensity * Math.cos(wavePhase * 0.7) * 0.2;
    
    totalDisplacement += displacement * 0.6; // Secondary waves are gentler
    totalCurvature += curvature * 0.6;
    totalIntensity += influence * wave.intensity * 0.4;
  }
  
  // Apply harmonic damping for smooth, organic motion
  const dampedDisplacement = totalDisplacement * harmonicField.dampingFactor;
  const dampedCurvature = Math.max(0, Math.min(1, totalCurvature * harmonicField.dampingFactor));
  
  // Add gentle organic noise
  const organicNoise = smoothNoise(targetAngle * 10, currentPhase * 0.1) * 3;
  
  return {
    displacement: dampedDisplacement + organicNoise,
    curvature: dampedCurvature,
    intensity: Math.min(1, totalIntensity),
    dominantType
  };
}

/**
 * Calculate gravitational attraction between ray segments
 */
export function calculateGravitationalPull(
  sourceAngle: number,
  targetAngle: number,
  sourceIntensity: number,
  distance: number
): number {
  const angleDifference = Math.abs(sourceAngle - targetAngle);
  const normalizedDistance = Math.min(angleDifference, Math.PI * 2 - angleDifference);
  
  // Inverse square law with gentle falloff
  const gravitationalStrength = sourceIntensity / (1 + normalizedDistance * normalizedDistance);
  
  // Direction of pull (positive = clockwise, negative = counterclockwise)
  const pullDirection = angleDifference <= Math.PI ? 
    Math.sign(targetAngle - sourceAngle) : 
    -Math.sign(targetAngle - sourceAngle);
  
  return gravitationalStrength * pullDirection * 5; // Scale factor for visible effect
}

/**
 * Create wave source points based on data activity
 */
export function createDataWaveSources(
  mobilitySpikes: number[] = [],
  moodTransitions: number[] = [],
  insightMoments: number[] = []
): WaveSource[] {
  const sources: WaveSource[] = [];
  const currentTime = Date.now();
  
  // Mobility-based wave sources
  mobilitySpikes.forEach((spike, index) => {
    const angle = (spike * Math.PI * 2) % (Math.PI * 2);
    sources.push({
      angle,
      intensity: 0.4 + Math.random() * 0.3,
      frequency: 1.5,
      type: 'data',
      phase: (currentTime * 0.0001 + index) % (Math.PI * 2)
    });
  });
  
  // Mood transition sources
  moodTransitions.forEach((transition, index) => {
    const angle = (transition * Math.PI * 2) % (Math.PI * 2);
    sources.push({
      angle,
      intensity: 0.3 + Math.random() * 0.4,
      frequency: 0.9,
      type: 'data',
      phase: (currentTime * 0.0001 + index + 100) % (Math.PI * 2)
    });
  });
  
  return sources;
}