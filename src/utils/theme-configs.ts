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
  | 'horizons'    // Soft Horizons (was pastelParadise)
  | 'founder';    // Founder Mode - Signature Harmonic Skin

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

// Zoom scale compensation per view - Fixed mapping
export const zoomCompensation = {
  day: 150,    // Full zoom-in on center
  week: 125,   // Close zoom  
  month: 110,  // Moderate zoom in
  year: 100    // Full radial display
};

export const themeConfigs: Record<Theme, ThemeConfig> = {
  cosmic: {
    name: 'Cosmic Default',
    description: 'Data-driven cosmic beauty with soft motion',
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
      intensity: 0.02 // Minimal cosmic stillness
    },
    haiku: [
      'Time flows like starlight / Through the cosmic mandala / Now is all we need',
      'Golden moments turn / In the wheel of endless days / Beauty lives in breath'
    ]
  },

  interface: {
    name: 'Digital Interface',
    description: 'Minimalist HUD with crisp neon aesthetics',
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
      intensity: 0.05 // Reduced for cleaner HUD look
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
      intensity: 0.3 // Increased for more layer visibility
    },
    haiku: [
      'Emotions flow like rivers / Through the mandala of time / Each breath a new world',
      'Sleep ripples outward / While spirit trails dance in light / Being becomes form'
    ]
  },

  vangogh: {
    name: 'Van Gogh: Starry Night',
    description: 'Slow painterly motion with multi-directional swirls',
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
      speed: 'slow', // Dramatically slowed down
      style: 'organic'
    },
    icons: {
      weather: { sunny: '☀️', rainy: '🌀', cloudy: '✨' },
      mood: { calm: '🌙', creative: '🎨', energetic: '⭐' },
      time: '☀️'
    },
    background: {
      pattern: 'stars',
      intensity: 0.2 // Reduced to minimize background distraction
    },
    haiku: [
      'Starlight swirls like paint / Across the canvas of night / Time becomes a dream',
      'Yellow suns and blue / Dance eternal through the sky / Beauty burns like fire'
    ]
  },

  horizons: {
    name: 'Soft Horizons',
    description: 'Light background with dark data elements for clarity',
    colors: {
      primary: 'hsl(320 70% 15%)',      // Deeper dark for strong contrast
      secondary: 'hsl(200 80% 20%)',    // Deeper dark blue
      accent: 'hsl(280 60% 25%)',       // Deeper dark purple
      background: 'hsl(320 20% 98%)',   // Clean canvas white
      text: 'hsl(320 40% 10%)',         // Rich dark text
      glow: 'hsl(330 70% 30%)'          // Darker rich glow
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
      intensity: 0.1 // Minimal background pattern
    },
    haiku: [
      'Soft clouds drift like thoughts / Through the pastel afternoon / Gentle time unfolds',
      'Colors blur to dreams / In the hazy summer light / Peace flows like water'
    ]
  },

  founder: {
    name: 'Founder Mode',
    description: 'Signature harmonic skin combining global art, refined motion, and poetic data visualization',
    colors: {
      primary: 'hsl(15 70% 45%)',        // Persian terracotta
      secondary: 'hsl(200 60% 35%)',     // Japanese indigo
      accent: 'hsl(45 85% 50%)',         // Mughal gold
      background: 'hsl(230 25% 12%)',    // Deep cosmic canvas
      text: 'hsl(45 40% 85%)',           // Warm parchment
      glow: 'hsl(15 80% 60%)'            // Soft ember glow
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
      weather: { sunny: '🌅', rainy: '🌊', cloudy: '⛅' },
      mood: { calm: '🕯️', creative: '🎭', energetic: '🔥' },
      time: '⏳'
    },
    background: {
      pattern: 'stars',
      intensity: 0.03 // Minimal, deep void with subtle texture
    },
    haiku: [
      'Ancient wisdom flows / Through patterns of digital time / Sacred rhythms guide',
      'Earth tones whisper soft / Stories of human journeys / In the mandala'
    ]
  }
};