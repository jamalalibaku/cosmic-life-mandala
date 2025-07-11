// theme/van-gogh/van-gogh.ts

const swirl = (val: number) => `rotate(${val}deg)`;

export const vanGoghTheme = {
  id: "van-gogh",
  name: "Van Gogh Mode",
  description: "Swirling emotional brushstrokes through time.",
  
  layout: {
    radiusInner: 80,
    radiusOuter: 300
  },

  visualEffects: {
    starfield: true,
    blurGlow: true,
    rotateOverTime: true,
    brushStroke: true
  },

  getMoodColor: (valence: number, energy: number) => {
    const hue = 210 + valence * 20;  // blue to violet
    const saturation = 60 + energy * 30;
    const lightness = 45 + valence * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  },

  getStrokeMotion: (intensity: number) => ({
    scale: [1, 1 + intensity * 0.05, 1],
    rotate: [0, intensity * 8, -intensity * 6, 0],
    transition: { 
      duration: 6 - intensity * 3, 
      repeat: Infinity, 
      ease: [0.4, 0, 0.6, 1] as const
    }
  })
};

export default vanGoghTheme;