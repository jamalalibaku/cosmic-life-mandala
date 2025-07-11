/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Mandala Theme Definition for Adria's Final Visual Skin
 */

export const mandalaExpressiveTheme = {
  id: "mandala-expressive",
  name: "Mandala Expressive",
  description: "A living, breathing skin that visualizes emotion, sleep, and mobility as poetic, organic shapes.",

  // Layer radii (in pixels from center)
  layout: {
    center: 0,
    coreRadius: 50,
    experienceMin: 90,
    experienceMax: 250,
    cosmicStart: 250,
    sleepDepth: 80
  },

  // Breathing rhythm per emotional state (in seconds)
  breathingRhythms: {
    joy: 0.8,
    stress: 1.5,
    calm: 6,
    tired: 8,
    focus: 3
  },

  // Emotion color generator
  getEmotionColor: (emotion: string, valence: number, energy: number): string => {
    const baseHueMap: Record<string, number> = {
      joy: 45,
      calm: 200,
      stress: 0,
      focus: 280
    };
    const hue = baseHueMap[emotion] + valence * 15;
    const saturation = 60 + energy * 30;
    const lightness = 50 + valence * 20;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  // Sleep color mapping
  getSleepColor: (phase: 'deep' | 'REM' | 'light'): string => {
    return {
      deep: 'hsl(240, 60%, 15%)',
      REM: 'hsl(280, 50%, 25%)',
      light: 'hsl(220, 55%, 35%)'
    }[phase];
  },

  // Activity color mapping
  getActivityColor: (activity: 'walk' | 'run' | 'bike'): string => {
    return {
      walk: 'hsl(120, 50%, 45%)',
      run: 'hsl(0, 65%, 50%)',
      bike: 'hsl(200, 60%, 55%)'
    }[activity];
  }
};

export default mandalaExpressiveTheme;