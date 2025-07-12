/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SkyRingProps {
  radius: number;
  center: { x: number; y: number };
  className?: string;
}

interface Ray {
  angle: number;
  length: number;
  curvature: number;
  brightness: number;
  sunInfluence: number;
}

export const SkyRing: React.FC<SkyRingProps> = ({ radius, center, className }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const currentHour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const timeOfDay = currentHour + minutes / 60;
  
  // Sun position based on time
  const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2; // Start at top (noon)

  // Generate 1440 rays (one per minute of day) for ultra-dense field
  const rayCount = 1440;
  
  // Generate ray array with enhanced frequency and bending
  const rays = useMemo(() => {
    const rays: Ray[] = [];
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      
      // Calculate sun influence - rays near sun position shine brighter
      const sunDistance = Math.abs(angle - sunAngle);
      const normalizedSunDistance = Math.min(sunDistance, Math.PI * 2 - sunDistance);
      const sunInfluence = Math.max(0, 1 - (normalizedSunDistance / (Math.PI * 0.3))); // Influence within 54 degrees
      
      // Base length with variation
      const baseLength = 15 + Math.random() * 20;
      const sunEnhancement = sunInfluence * 25; // Extra length when near sun
      const length = baseLength + sunEnhancement;
      
      // Curvature increases with sun influence and neighboring rays
      const curvature = sunInfluence * 0.8 + Math.random() * 0.3;
      
      // Brightness enhanced by sun influence
      const brightness = 0.3 + sunInfluence * 0.7 + Math.random() * 0.2;
      
      rays.push({
        angle,
        length,
        curvature,
        brightness,
        sunInfluence
      });
    }
    
    return rays;
  }, [rayCount, sunAngle]);

  // Animation loop for organic movement
  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phase = (elapsed * 0.0003) % (Math.PI * 2); // Slow, organic cycle
      setAnimationPhase(phase);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Generate dynamic ray path with enhanced curvature
  const generateRayPath = (ray: Ray, index: number): string => {
    const { angle, length, curvature, sunInfluence } = ray;
    
    // Add breathing animation and sun pulsing
    const breathingScale = 1 + 0.15 * Math.sin(animationPhase + index * 0.003);
    const sunPulse = 1 + sunInfluence * 0.3 * Math.sin(animationPhase * 3);
    const dynamicLength = length * breathingScale * sunPulse;
    
    // Start point at ring edge
    const startX = center.x + Math.cos(angle) * radius;
    const startY = center.y + Math.sin(angle) * radius;
    
    if (curvature < 0.2) {
      // Straight ray
      const endX = center.x + Math.cos(angle) * (radius + dynamicLength);
      const endY = center.y + Math.sin(angle) * (radius + dynamicLength);
      
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // Curved ray with enhanced bending
      const midLength = dynamicLength * 0.7;
      const endLength = dynamicLength;
      
      // Enhanced wave-like curvature influenced by sun and neighbors
      const waveOffset = curvature * 20 * Math.sin(animationPhase * 2 + angle * 12);
      const sunWave = sunInfluence * 10 * Math.sin(animationPhase * 4 + angle * 6);
      
      const midX = center.x + Math.cos(angle) * (radius + midLength) + Math.cos(angle + Math.PI/2) * (waveOffset + sunWave);
      const midY = center.y + Math.sin(angle) * (radius + midLength) + Math.sin(angle + Math.PI/2) * (waveOffset + sunWave);
      
      const endX = center.x + Math.cos(angle) * (radius + endLength);
      const endY = center.y + Math.sin(angle) * (radius + endLength);
      
      return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
    }
  };

  return (
    <motion.g 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <defs>
        {/* Enhanced gradient for ray glow */}
        <linearGradient id="rayGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45, 90%, 85%)" stopOpacity={0.3} />
          <stop offset="50%" stopColor="hsl(50, 95%, 95%)" stopOpacity={0.9} />
          <stop offset="100%" stopColor="hsl(55, 100%, 100%)" stopOpacity={0.2} />
        </linearGradient>
        
        {/* Sun-influenced glow filter */}
        <filter id="sunGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.3 0 0 0 0  0 1.2 0 0 0  0 0 1.1 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Intense solar flare filter */}
        <filter id="solarFlare" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.5 0 0 0 0  0 1.4 0 0 0  0 0 1.2 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Render all rays with enhanced frequency and bending */}
      {rays.map((ray, index) => {
        const path = generateRayPath(ray, index);
        const isSunInfluenced = ray.sunInfluence > 0.3;
        const isHighlySunInfluenced = ray.sunInfluence > 0.7;
        
        // Color shifts from white to golden based on sun influence
        const hue = 45 + ray.sunInfluence * 15; // 45-60 range
        const saturation = 70 + ray.sunInfluence * 25; // More saturated near sun
        const lightness = 85 + ray.sunInfluence * 15; // Brighter near sun
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        return (
          <motion.path
            key={`ray-${index}`}
            d={path}
            stroke={color}
            strokeWidth={isSunInfluenced ? 1.2 : 0.6}
            strokeOpacity={ray.brightness}
            fill="none"
            strokeLinecap="round"
            filter={isHighlySunInfluenced ? "url(#solarFlare)" : "url(#sunGlow)"}
            animate={{
              strokeOpacity: [
                ray.brightness * 0.6, 
                ray.brightness * (1 + ray.sunInfluence * 0.5), 
                ray.brightness * 0.6
              ],
              strokeWidth: isSunInfluenced ? [1.2, 1.8, 1.2] : [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.002
            }}
          />
        );
      })}

      {/* Solar corona effects for highly sun-influenced rays */}
      {rays
        .filter(ray => ray.sunInfluence > 0.8)
        .map((ray, index) => {
          const coronaRadius = radius + ray.length * 1.3;
          const coronaX = center.x + Math.cos(ray.angle) * coronaRadius;
          const coronaY = center.y + Math.sin(ray.angle) * coronaRadius;
          
          return (
            <motion.circle
              key={`corona-${index}`}
              cx={coronaX}
              cy={coronaY}
              r={2.5}
              fill="hsl(55, 100%, 95%)"
              opacity={0.4}
              filter="url(#solarFlare)"
              animate={{
                r: [2, 4.5, 2],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.4, 0.8]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1
              }}
            />
          );
        })}

      {/* Sun position marker - subtle indicator */}
      <motion.circle
        cx={center.x + Math.cos(sunAngle) * (radius * 0.9)}
        cy={center.y + Math.sin(sunAngle) * (radius * 0.9)}
        r={3}
        fill="hsl(50, 100%, 90%)"
        opacity={0.6}
        filter="url(#solarFlare)"
        animate={{
          r: [2.5, 4, 2.5],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.g>
  );
};