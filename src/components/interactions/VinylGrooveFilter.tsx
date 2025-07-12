/**
 * Vinyl Groove Filter - "The Living Texture of Time"
 * 
 * Adria's Vision:
 * The rings themselves aren't static; they are alive. They should subtly
 * vibrate and warp, as if carved with the grooves of our life's music.
 * This creates an organic, hand-drawn feeling.
 */

import React from 'react';

interface VinylGrooveFilterProps {
  filterId: string;
  intensity?: number; // 0-1, controls the strength of the groove effect
  speed?: number; // 0-1, controls animation speed
  activeRipples?: Array<{ x: number; y: number; intensity: number }>; // For wave interference
}

export const VinylGrooveFilter: React.FC<VinylGrooveFilterProps> = ({
  filterId,
  intensity = 0.3,
  speed = 0.5,
  activeRipples = []
}) => {
  // Calculate turbulence frequency based on active ripples
  const calculateTurbulenceFrequency = () => {
    const baseFrequency = 0.01 + (intensity * 0.02);
    const rippleInfluence = activeRipples.reduce((acc, ripple) => 
      acc + (ripple.intensity * 0.005), 0
    );
    return Math.min(baseFrequency + rippleInfluence, 0.08);
  };

  // Calculate displacement scale based on intensity and ripples
  const calculateDisplacementScale = () => {
    const baseScale = intensity * 3;
    const rippleInfluence = activeRipples.reduce((acc, ripple) => 
      acc + (ripple.intensity * 0.5), 0
    );
    return Math.min(baseScale + rippleInfluence, 8);
  };

  const turbulenceFreq = calculateTurbulenceFrequency();
  const displacementScale = calculateDisplacementScale();

  return (
    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
      {/* Primary groove turbulence - creates the "vinyl texture" */}
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency={`${turbulenceFreq} ${turbulenceFreq * 2.5}`}
        numOctaves="4" 
        result="groove-turbulence"
        seed="2"
      >
        {/* Animated groove breathing */}
        <animate
          attributeName="baseFrequency"
          values={`${turbulenceFreq * 0.7} ${turbulenceFreq * 1.8};${turbulenceFreq * 1.4} ${turbulenceFreq * 2.7};${turbulenceFreq * 0.7} ${turbulenceFreq * 1.8}`}
          dur={`${7 / (speed + 0.1)}s`}
          repeatCount="indefinite"
        />
      </feTurbulence>

      {/* Secondary fine texture - adds micro-variations */}
      <feTurbulence 
        type="turbulence" 
        baseFrequency={`${turbulenceFreq * 5} ${turbulenceFreq * 7.5}`}
        numOctaves="3" 
        result="fine-texture"
        seed="5"
      >
        <animate
          attributeName="baseFrequency"
          values={`${turbulenceFreq * 3.5} ${turbulenceFreq * 6};${turbulenceFreq * 6.5} ${turbulenceFreq * 8.5};${turbulenceFreq * 3.5} ${turbulenceFreq * 6}`}
          dur={`${10 / (speed + 0.1)}s`}
          repeatCount="indefinite"
        />
      </feTurbulence>

      {/* Tertiary ultra-fine details */}
      <feTurbulence 
        type="fractalNoise" 
        baseFrequency={`${turbulenceFreq * 8} ${turbulenceFreq * 12}`}
        numOctaves="2" 
        result="ultra-fine"
        seed="8"
      />

      {/* Combine all three turbulences for ultra-complex texture */}
      <feComposite
        in="groove-turbulence"
        in2="fine-texture"
        operator="multiply"
        result="combined-base"
      />
      <feComposite
        in="combined-base"
        in2="ultra-fine"
        operator="screen"
        result="combined-texture"
      />

      {/* Enhanced displacement with dual layers */}
      <feComponentTransfer in="combined-texture" result="displacement-map">
        <feFuncA type="discrete" tableValues="0.4 0.7 0.3 0.8 0.2 0.9 0.1 0.95"/>
      </feComponentTransfer>

      {/* Primary displacement */}
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="displacement-map" 
        scale={displacementScale * 1.25}
        xChannelSelector="R"
        yChannelSelector="G"
        result="grooved-shape"
      />

      {/* Secondary micro-displacement for detail */}
      <feDisplacementMap 
        in="grooved-shape" 
        in2="ultra-fine" 
        scale={displacementScale * 0.4}
        result="ultra-grooved"
      />

      {/* Enhanced multi-layer glow system */}
      <feGaussianBlur in="ultra-grooved" stdDeviation="0.8" result="subtle-glow"/>
      <feGaussianBlur in="ultra-grooved" stdDeviation="0.3" result="sharp-detail"/>
      <feGaussianBlur in="ultra-grooved" stdDeviation="1.5" result="atmosphere"/>
      
      {/* Complex merge for final effect */}
      <feMerge>
        <feMergeNode in="atmosphere"/>
        <feMergeNode in="subtle-glow"/>
        <feMergeNode in="sharp-detail"/>
        <feMergeNode in="ultra-grooved"/>
      </feMerge>

      {/* Optional: Wave interference effect when ripples are active */}
      {activeRipples.length > 0 && (
        <>
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency={`${turbulenceFreq * 2} ${turbulenceFreq * 2}`}
            numOctaves="1" 
            result="wave-interference"
            seed="10"
          >
            <animate
              attributeName="baseFrequency"
              values={`${turbulenceFreq} ${turbulenceFreq};${turbulenceFreq * 3} ${turbulenceFreq * 3};${turbulenceFreq} ${turbulenceFreq}`}
              dur="2s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="wave-interference" 
            scale={displacementScale * 0.5}
            result="interference-effect"
          />
        </>
      )}
    </filter>
  );
};

// Enhanced version with multiple groove patterns
interface EnhancedVinylGrooveFilterProps extends VinylGrooveFilterProps {
  ringType?: 'mood' | 'weather' | 'sleep' | 'mobility' | 'plans';
}

export const EnhancedVinylGrooveFilter: React.FC<EnhancedVinylGrooveFilterProps> = ({
  filterId,
  intensity = 0.3,
  speed = 0.5,
  activeRipples = [],
  ringType = 'mood'
}) => {
  // Ring-specific groove characteristics
  const getGrooveCharacteristics = (type: string) => {
    const characteristics = {
      mood: {
        baseFreq: 0.015,
        octaves: 4,
        seed: 2,
        pattern: 'organic'
      },
      weather: {
        baseFreq: 0.008,
        octaves: 3,
        seed: 7,
        pattern: 'flowing'
      },
      sleep: {
        baseFreq: 0.005,
        octaves: 2,
        seed: 12,
        pattern: 'gentle'
      },
      mobility: {
        baseFreq: 0.025,
        octaves: 5,
        seed: 18,
        pattern: 'dynamic'
      },
      plans: {
        baseFreq: 0.012,
        octaves: 3,
        seed: 25,
        pattern: 'structured'
      }
    };
    
    return characteristics[type] || characteristics.mood;
  };

  const chars = getGrooveCharacteristics(ringType);
  const baseFreq = chars.baseFreq * (1 + intensity);

  return (
    <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
      {/* Type-specific turbulence pattern */}
      <feTurbulence 
        type={chars.pattern === 'structured' ? 'turbulence' : 'fractalNoise'} 
        baseFrequency={`${baseFreq} ${baseFreq * 1.5}`}
        numOctaves={chars.octaves} 
        result="primary-groove"
        seed={chars.seed}
      >
        <animate
          attributeName="baseFrequency"
          values={`${baseFreq * 0.7} ${baseFreq * 1.05};${baseFreq * 1.3} ${baseFreq * 1.95};${baseFreq * 0.7} ${baseFreq * 1.05}`}
          dur={`${10 / (speed + 0.1)}s`}
          repeatCount="indefinite"
        />
      </feTurbulence>

      {/* Add ripple interference if active */}
      {activeRipples.length > 0 && (
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency={`${baseFreq * 3} ${baseFreq * 3}`}
          numOctaves="2" 
          result="ripple-interference"
          seed={chars.seed + 10}
        >
          <animate
            attributeName="baseFrequency"
            values={`${baseFreq * 2} ${baseFreq * 2};${baseFreq * 4} ${baseFreq * 4};${baseFreq * 2} ${baseFreq * 2}`}
            dur="1.5s"
            repeatCount="indefinite"
          />
        </feTurbulence>
      )}

      {/* Displacement mapping */}
      <feDisplacementMap 
        in="SourceGraphic" 
        in2="primary-groove" 
        scale={intensity * 2 + (activeRipples.length * 0.5)}
        result="grooved-element"
      />

      {/* Enhance with subtle blur for organic feel */}
      <feGaussianBlur in="grooved-element" stdDeviation="0.3" result="softened"/>
      
      <feMerge>
        <feMergeNode in="softened"/>
        <feMergeNode in="grooved-element"/>
      </feMerge>
    </filter>
  );
};