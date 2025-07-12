/**
 * (c) 2025 Cosmic Life Mandala – Environmental Sensory Layer
 * A living, breathing connection to nature that responds to touch
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvironmentalLayerProps {
  radius: number;
  center: { x: number; y: number };
  environmentalData: EnvironmentalData[];
  isVisible: boolean;
}

interface EnvironmentalData {
  timestamp: string;
  sunlightMinutes: number;
  natureMoments: number;
  windStrength: number;
  temperature: number;
  connection: number; // 0-1 scale of felt connection to nature
}

interface Wave {
  id: string;
  angle: number;
  amplitude: number;
  frequency: number;
  phase: number;
  decay: number;
}

interface Ripple {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  createdAt: number;
}

interface Sparkle {
  id: string;
  x: number;
  y: number;
  intensity: number;
  createdAt: number;
  drift: { x: number; y: number };
}

export const EnvironmentalLayer: React.FC<EnvironmentalLayerProps> = ({
  radius,
  center,
  environmentalData,
  isVisible
}) => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [animationPhase, setAnimationPhase] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize waves based on environmental data
  useEffect(() => {
    if (!environmentalData.length) return;

    const currentData = environmentalData[environmentalData.length - 1];
    const waveCount = 12;
    const newWaves: Wave[] = [];

    for (let i = 0; i < waveCount; i++) {
      const angle = (i / waveCount) * Math.PI * 2;
      
      newWaves.push({
        id: `wave-${i}`,
        angle,
        amplitude: 15 + currentData.connection * 25 + Math.random() * 10,
        frequency: 0.02 + currentData.windStrength * 0.01,
        phase: Math.random() * Math.PI * 2,
        decay: 0.98 + currentData.connection * 0.01
      });
    }

    setWaves(newWaves);
  }, [environmentalData]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phase = (elapsed * 0.001) % (Math.PI * 2);
      setAnimationPhase(phase);

      // Update ripples
      setRipples(prev => prev
        .map(ripple => ({
          ...ripple,
          radius: ripple.radius + 2,
          intensity: ripple.intensity * 0.98
        }))
        .filter(ripple => ripple.intensity > 0.01 && ripple.radius < radius * 2)
      );

      // Update sparkles
      setSparkles(prev => prev
        .map(sparkle => ({
          ...sparkle,
          x: sparkle.x + sparkle.drift.x,
          y: sparkle.y + sparkle.drift.y,
          intensity: sparkle.intensity * 0.97
        }))
        .filter(sparkle => sparkle.intensity > 0.05)
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isVisible, radius]);

  // Touch/mouse interaction handler
  const handleInteraction = useCallback((event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Create ripple at touch point
    const newRipple: Ripple = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x,
      y,
      radius: 5,
      intensity: 1,
      createdAt: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Create sparkles around the touch point
    const sparkleCount = 8 + Math.random() * 12;
    const newSparkles: Sparkle[] = [];

    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 10 + Math.random() * 30;
      
      newSparkles.push({
        id: `sparkle-${Date.now()}-${i}`,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        intensity: 0.8 + Math.random() * 0.2,
        createdAt: Date.now(),
        drift: {
          x: Math.cos(angle) * (0.5 + Math.random() * 1.5),
          y: Math.sin(angle) * (0.5 + Math.random() * 1.5) - 0.5 // slight upward drift
        }
      });
    }

    setSparkles(prev => [...prev, ...newSparkles]);
  }, []);

  // Generate wave path
  const generateWavePath = (wave: Wave): string => {
    const points: string[] = [];
    const segmentCount = 120;
    
    for (let i = 0; i <= segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2;
      const waveOffset = wave.amplitude * Math.sin(
        angle * 8 + wave.phase + animationPhase * wave.frequency * 50
      ) * wave.decay;
      
      const waveRadius = radius + waveOffset;
      const x = center.x + Math.cos(angle) * waveRadius;
      const y = center.y + Math.sin(angle) * waveRadius;
      
      points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }
    
    return points.join(' ') + ' Z';
  };

  if (!isVisible) return null;

  const currentData = environmentalData[environmentalData.length - 1];
  if (!currentData) return null;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <defs>
        {/* Nature gradient */}
        <radialGradient id="natureGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="hsl(140, 60%, 80%)" stopOpacity={0.1} />
          <stop offset="50%" stopColor="hsl(160, 50%, 70%)" stopOpacity={0.3} />
          <stop offset="100%" stopColor="hsl(180, 40%, 60%)" stopOpacity={0.2} />
        </radialGradient>

        {/* Wave glow filter */}
        <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="0.8 1.2 0.9 0 0  0.6 1.1 0.8 0 0  0.7 0.9 1.1 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Sparkle glow */}
        <filter id="sparkleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.2 1.4 0.8 0 0  0.8 1.3 0.9 0 0  0.6 1.1 1.2 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Interactive touch area */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius + 40}
        fill="transparent"
        style={{ cursor: 'pointer' }}
      />

      {/* Base nature field */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius - 10}
        fill="url(#natureGradient)"
        opacity={0.4 + currentData.connection * 0.3}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Flowing waves */}
      {waves.map((wave, index) => {
        const wavePath = generateWavePath(wave);
        const connectionIntensity = currentData.connection;
        
        return (
          <motion.path
            key={wave.id}
            d={wavePath}
            stroke={`hsl(${150 + index * 5}, ${60 + connectionIntensity * 30}%, ${70 + connectionIntensity * 20}%)`}
            strokeWidth={1 + connectionIntensity * 2}
            strokeOpacity={0.3 + connectionIntensity * 0.4}
            fill="none"
            filter="url(#waveGlow)"
            animate={{
              strokeOpacity: [
                0.2 + connectionIntensity * 0.3,
                0.6 + connectionIntensity * 0.4,
                0.2 + connectionIntensity * 0.3
              ]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3
            }}
          />
        );
      })}

      {/* Interactive overlay with touch handling */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'all' }}
        onMouseMove={handleInteraction}
        onTouchMove={handleInteraction}
        onClick={handleInteraction}
      >
        {/* Ripples */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.circle
              key={ripple.id}
              cx={ripple.x}
              cy={ripple.y}
              r={ripple.radius}
              stroke="hsl(160, 70%, 80%)"
              strokeWidth={2 * ripple.intensity}
              strokeOpacity={ripple.intensity * 0.6}
              fill="none"
              filter="url(#waveGlow)"
              initial={{ r: 5, opacity: 1 }}
              animate={{ 
                r: ripple.radius,
                opacity: ripple.intensity
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map(sparkle => (
            <motion.circle
              key={sparkle.id}
              cx={sparkle.x}
              cy={sparkle.y}
              r={2 + sparkle.intensity * 3}
              fill={`hsl(${180 + Math.random() * 40}, 80%, 85%)`}
              opacity={sparkle.intensity}
              filter="url(#sparkleGlow)"
              initial={{ 
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: sparkle.intensity,
                r: [1, 4, 2]
              }}
              exit={{ 
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </AnimatePresence>
      </svg>

      {/* Sunlight indicators based on data */}
      {currentData.sunlightMinutes > 30 && (
        <motion.g>
          {Array.from({ length: Math.min(8, Math.floor(currentData.sunlightMinutes / 30)) }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const sunRadius = radius - 25;
            
            return (
              <motion.circle
                key={`sun-${i}`}
                cx={center.x + Math.cos(angle) * sunRadius}
                cy={center.y + Math.sin(angle) * sunRadius}
                r={3}
                fill="hsl(45, 90%, 80%)"
                opacity={0.6}
                filter="url(#sparkleGlow)"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  r: [2, 4, 2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.g>
      )}
    </motion.g>
  );
};