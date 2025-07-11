/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Van Gogh Theme – Painterly, Swirling, Luminous
 */

export interface VanGoghTheme {
  // Van Gogh's expressive color palette
  colors: {
    sunflowerYellow: string;
    starryBlue: string;
    cypressGreen: string;
    wheatGold: string;
    nightSky: string;
    burningOrange: string;
  };
  
  // Brushwork styles for different emotions
  brushwork: {
    [emotion: string]: {
      strokeWidth: number;
      curvature: number;
      turbulence: number;
    };
  };
  
  // Breathing rhythms inspired by Van Gogh's intensity
  breathingRhythms: {
    [emotion: string]: number;
  };
  
  // Methods for dynamic color mixing
  getEmotionColor: (emotion: string, valence: number, energy: number) => string;
  getSleepColor: (phase: 'deep' | 'REM' | 'light') => string;
  getActivityColor: (activity: 'walk' | 'run' | 'bike') => string;
}

const vanGoghTheme: VanGoghTheme = {
  colors: {
    sunflowerYellow: 'hsl(45, 90%, 65%)',
    starryBlue: 'hsl(220, 80%, 40%)',
    cypressGreen: 'hsl(140, 30%, 25%)',
    wheatGold: 'hsl(35, 100%, 55%)',
    nightSky: 'hsl(230, 40%, 8%)',
    burningOrange: 'hsl(25, 100%, 50%)'
  },

  brushwork: {
    joy: { strokeWidth: 8, curvature: 0.8, turbulence: 0.6 },
    stress: { strokeWidth: 12, curvature: 1.2, turbulence: 1.0 },
    calm: { strokeWidth: 4, curvature: 0.3, turbulence: 0.2 },
    focus: { strokeWidth: 6, curvature: 0.5, turbulence: 0.4 },
    creative: { strokeWidth: 10, curvature: 1.0, turbulence: 0.8 },
    tired: { strokeWidth: 3, curvature: 0.2, turbulence: 0.1 }
  },

  breathingRhythms: {
    calm: 8,      // Slow, peaceful like wheat fields
    joy: 2,       // Quick, energetic like sunflowers dancing
    stress: 1,    // Rapid, intense like stormy skies
    tired: 12,    // Very slow, like evening settling
    focus: 4,     // Steady, like careful brushstrokes
    creative: 3   // Inspired, like painting in flow state
  },

  getEmotionColor: (emotion: string, valence: number, energy: number) => {
    const baseColors = {
      joy: 'hsl(45, 90%, 65%)',      // Sunflower yellow
      stress: 'hsl(25, 100%, 50%)',  // Burning orange
      calm: 'hsl(220, 80%, 40%)',    // Starry blue
      focus: 'hsl(35, 100%, 55%)',   // Wheat gold
      creative: 'hsl(280, 70%, 60%)', // Purple inspiration
      tired: 'hsl(140, 30%, 25%)'    // Cypress green
    };

    const baseColor = baseColors[emotion] || baseColors.calm;
    
    // Adjust saturation based on energy (Van Gogh's intensity)
    const saturation = Math.floor(60 + energy * 40);
    
    // Adjust lightness based on valence
    const lightness = Math.floor(45 + valence * 20);
    
    // Extract hue from base color and create dynamic variation
    const hueMatch = baseColor.match(/hsl\((\d+)/);
    const baseHue = hueMatch ? parseInt(hueMatch[1]) : 45;
    
    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  },

  getSleepColor: (phase: 'deep' | 'REM' | 'light') => {
    switch (phase) {
      case 'deep':
        return 'hsl(230, 60%, 20%)';  // Deep night blue
      case 'REM':
        return 'hsl(280, 70%, 40%)';  // Dream purple
      case 'light':
        return 'hsl(200, 40%, 60%)';  // Dawn blue
      default:
        return 'hsl(220, 80%, 40%)';
    }
  },

  getActivityColor: (activity: 'walk' | 'run' | 'bike') => {
    switch (activity) {
      case 'walk':
        return 'hsl(140, 50%, 50%)';  // Green path
      case 'run':
        return 'hsl(25, 100%, 50%)';  // Burning orange energy
      case 'bike':
        return 'hsl(220, 80%, 50%)';  // Blue speed
      default:
        return 'hsl(45, 90%, 65%)';
    }
  }
};

export default vanGoghTheme;