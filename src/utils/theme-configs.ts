/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

export type Theme = 
  | 'cosmic'      // Cosmic Default
  | 'interface'   // Digital Interface (was techHUD)  
  | 'mandala'     // Mandala Expressive (was mandalaExpressive)
  | 'vangogh'     // Van Gogh: Starry Night (was vanGogh)
  | 'horizons';   // Soft Horizons (was pastelParadise)

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    glow: string;
  };
  typography: {
    primary: string;
    secondary: string;
    size: 'small' | 'medium' | 'large';
  };
  shapes: {
    rings: 'circular' | 'jagged' | 'organic' | 'angular' | 'vinyl';
    segments: 'smooth' | 'sharp' | 'flowing' | 'pixelated';
  };
  animations: {
    speed: 'slow' | 'medium' | 'fast';
    style: 'gentle' | 'pulsing' | 'mechanical' | 'organic';
  };
  icons: {
    weather: { [key: string]: string };
    mood: { [key: string]: string };
    time: string;
  };
  background: {
    pattern: 'stars' | 'grooves' | 'flowers' | 'grid' | 'noir' | 'pastel';
    intensity: number; // 0-1
  };
  haiku: string[];
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  cosmic: {
    name: 'Cosmic Default',
    description: 'Golden cosmic poetry in motion',
    colors: {
      primary: 'hsl(45 80% 60%)',
      secondary: 'hsl(240 60% 50%)',
      accent: 'hsl(280 70% 60%)',
      background: 'hsl(240 30% 8%)',
      text: 'hsl(45 30% 90%)',
      glow: 'hsl(45 100% 70%)'
    },
    typography: {
      primary: 'Inter',
      secondary: 'serif',
      size: 'medium'
    },
    shapes: {
      rings: 'circular',
      segments: 'smooth'
    },
    animations: {
      speed: 'medium',
      style: 'gentle'
    },
    icons: {
      weather: { sunny: '☀️', rainy: '🌧️', cloudy: '☁️' },
      mood: { calm: '🌙', creative: '💫', energetic: '⚡' },
      time: '🕐'
    },
    background: {
      pattern: 'stars',
      intensity: 0.6
    },
    haiku: [
      'Time flows like starlight / Through the cosmic mandala / Now is all we need',
      'Golden moments turn / In the wheel of endless days / Beauty lives in breath'
    ]
  },

  interface: {
    name: 'Digital Interface',
    description: 'Cyberpunk HUD aesthetics',
    colors: {
      primary: 'hsl(180 100% 50%)',
      secondary: 'hsl(120 100% 40%)',
      accent: 'hsl(60 100% 50%)',
      background: 'hsl(220 30% 5%)',
      text: 'hsl(180 80% 80%)',
      glow: 'hsl(180 100% 70%)'
    },
    typography: {
      primary: 'monospace',
      secondary: 'system-ui',
      size: 'small'
    },
    shapes: {
      rings: 'angular',
      segments: 'pixelated'
    },
    animations: {
      speed: 'fast',
      style: 'mechanical'
    },
    icons: {
      weather: { sunny: '☢️', rainy: '⚙️', cloudy: '🔋' },
      mood: { calm: '🔵', creative: '🟢', energetic: '🔴' },
      time: '⏱️'
    },
    background: {
      pattern: 'grid',
      intensity: 0.8
    },
    haiku: [
      'Data streams like rain / Through circuits of consciousness / We are the machine',
      'Binary heartbeat / Pulses through electric veins / Future becomes now'
    ]
  },

  mandala: {
    name: 'Mandala Expressive',
    description: 'Living, breathing visualization of emotion, sleep, and mobility',
    colors: {
      primary: 'hsl(280 70% 60%)',
      secondary: 'hsl(200 50% 40%)',
      accent: 'hsl(45 80% 70%)',
      background: 'hsl(240 20% 5%)',
      text: 'hsl(280 40% 85%)',
      glow: 'hsl(280 80% 70%)'
    },
    typography: {
      primary: 'serif',
      secondary: 'system-ui',
      size: 'medium'
    },
    shapes: {
      rings: 'organic',
      segments: 'flowing'
    },
    animations: {
      speed: 'slow',
      style: 'organic'
    },
    icons: {
      weather: { sunny: '🌸', rainy: '🌊', cloudy: '🌙' },
      mood: { calm: '🧘', creative: '🎨', energetic: '⚡' },
      time: '🌀'
    },
    background: {
      pattern: 'stars',
      intensity: 0.4
    },
    haiku: [
      'Emotions flow like rivers / Through the mandala of time / Each breath a new world',
      'Sleep ripples outward / While spirit trails dance in light / Being becomes form'
    ]
  },

  vangogh: {
    name: 'Van Gogh: Starry Night',
    description: 'A living painting of time - swirling, luminous, and deeply expressive',
    colors: {
      primary: 'hsl(45 90% 65%)',      // Van Gogh's golden yellow
      secondary: 'hsl(220 80% 40%)',   // Deep cobalt blue
      accent: 'hsl(35 100% 55%)',      // Burning orange
      background: 'hsl(230 40% 8%)',   // Midnight sky
      text: 'hsl(45 70% 85%)',         // Warm starlight
      glow: 'hsl(45 100% 70%)'         // Brilliant yellow glow
    },
    typography: {
      primary: 'serif',
      secondary: 'cursive',
      size: 'medium'
    },
    shapes: {
      rings: 'organic',
      segments: 'flowing'
    },
    animations: {
      speed: 'medium',
      style: 'organic'
    },
    icons: {
      weather: { sunny: '☀️', rainy: '🌀', cloudy: '✨' },
      mood: { calm: '🌙', creative: '🎨', energetic: '⭐' },
      time: '☀️'
    },
    background: {
      pattern: 'stars',
      intensity: 0.7
    },
    haiku: [
      'Starlight swirls like paint / Across the canvas of night / Time becomes a dream',
      'Yellow suns and blue / Dance eternal through the sky / Beauty burns like fire'
    ]
  },

  horizons: {
    name: 'Soft Horizons',
    description: 'Dreamy pastel minimalism',
    colors: {
      primary: 'hsl(330 50% 80%)',
      secondary: 'hsl(200 60% 75%)',
      accent: 'hsl(280 40% 85%)',
      background: 'hsl(320 20% 95%)',
      text: 'hsl(320 30% 30%)',
      glow: 'hsl(330 60% 70%)'
    },
    typography: {
      primary: 'sans-serif',
      secondary: 'serif',
      size: 'medium'
    },
    shapes: {
      rings: 'organic',
      segments: 'flowing'
    },
    animations: {
      speed: 'slow',
      style: 'gentle'
    },
    icons: {
      weather: { sunny: '☁️', rainy: '💧', cloudy: '🌈' },
      mood: { calm: '💫', creative: '✨', energetic: '🌟' },
      time: '☁️'
    },
    background: {
      pattern: 'pastel',
      intensity: 0.3
    },
    haiku: [
      'Soft clouds drift like thoughts / Through the pastel afternoon / Gentle time unfolds',
      'Colors blur to dreams / In the hazy summer light / Peace flows like water'
    ]
  }
};