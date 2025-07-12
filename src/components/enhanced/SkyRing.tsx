/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { enhancedWeatherData } from '../../data/enhanced-weather-data';
import { createHarmonicField, calculateHarmonicInfluence, createDataWaveSources } from '../../utils/cosmic-wave-harmonics';

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
  harmonicDisplacement: number;
  temperatureGlow: number;
  dominantWaveType: string;
}

export const SkyRing: React.FC<SkyRingProps> = ({ radius, center, className }) => {
  const [harmonicTime, setHarmonicTime] = useState(Date.now());
  const currentHour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const timeOfDay = currentHour + minutes / 60;
  
  // Sun position based on time
  const sunAngle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2; // Start at top (noon)

  // Reduced ray count for smoother performance and less chaos
  const rayCount = 720; // One ray per 2 minutes for smoother performance
  
  // Weather data for current day (mock for now)
  const currentWeather = enhancedWeatherData[0]; // Use first entry as current
  const windDirection = Math.PI * 0.25; // 45 degrees (northeast)
  const solarFlareIntensity = 0.3 + Math.sin(harmonicTime * 0.00005) * 0.4; // Much slower solar variation
  
  // Calculate sunlight hours (sunrise to sunset effect)
  const isDaytime = currentHour >= 6 && currentHour <= 20;
  const sunlightFactor = isDaytime ? 
    Math.sin((currentHour - 6) / 14 * Math.PI) : 0.1; // Peak at noon, dimmer at dawn/dusk
  
  // Create harmonic field for smooth wave motion
  const harmonicField = useMemo(() => {
    return createHarmonicField(
      solarFlareIntensity,
      currentWeather.windIntensity,
      windDirection,
      harmonicTime
    );
  }, [solarFlareIntensity, currentWeather.windIntensity, windDirection, harmonicTime]);

  // Generate ray array with harmonic-driven properties
  const rays = useMemo(() => {
    const rays: Ray[] = [];
    
    // Add data-driven wave sources (mock mobility and mood spikes)
    const dataWaveSources = createDataWaveSources(
      [0.2, 0.6, 0.9], // Mock mobility spikes at different times of day
      [0.1, 0.4, 0.8], // Mock mood transitions
      []
    );
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      
      // Calculate sun influence - rays near sun position shine brighter
      const sunDistance = Math.abs(angle - sunAngle);
      const normalizedSunDistance = Math.min(sunDistance, Math.PI * 2 - sunDistance);
      const sunInfluence = Math.max(0, 1 - (normalizedSunDistance / (Math.PI * 0.3))); // Influence within 54 degrees
      
      // Get harmonic influence at this angle
      const harmonicInfluence = calculateHarmonicInfluence(angle, harmonicField, harmonicTime);
      
      // Temperature-based length and glow
      const temperatureRatio = (currentWeather.temperatureHigh - 10) / 30; // Normalize 10-40°C to 0-1
      const temperatureGlow = Math.max(0.2, temperatureRatio);
      
      // Base length influenced by temperature and sunlight (more stable, less random)
      const baseLength = 15; // Fixed base instead of random
      const temperatureLength = temperatureRatio * 20;
      const sunEnhancement = sunInfluence * 30 * sunlightFactor;
      const rainReduction = currentWeather.precipitationOpacity * 15; // Rain makes rays shorter
      const harmonicLength = harmonicInfluence.intensity * 12; // Harmonic influence on length
      const length = Math.max(8, baseLength + temperatureLength + sunEnhancement + harmonicLength - rainReduction);
      
      // Curvature influenced by harmonics instead of random factors
      const curvature = Math.max(0, Math.min(1, harmonicInfluence.curvature + sunInfluence * 0.3));
      
      // Brightness enhanced by harmonic intensity
      const baseBrightness = 0.2 + sunInfluence * 0.6;
      const temperatureBrightness = temperatureGlow * 0.3;
      const sunlightBoost = sunlightFactor * 0.4;
      const harmonicBoost = harmonicInfluence.intensity * 0.3;
      const rainDimming = currentWeather.precipitationOpacity * 0.3;
      const brightness = Math.max(0.1, baseBrightness + temperatureBrightness + sunlightBoost + harmonicBoost - rainDimming);
      
      rays.push({
        angle,
        length,
        curvature,
        brightness,
        sunInfluence,
        harmonicDisplacement: harmonicInfluence.displacement,
        temperatureGlow,
        dominantWaveType: harmonicInfluence.dominantType
      });
    }
    
    return rays;
  }, [rayCount, sunAngle, currentWeather, sunlightFactor, harmonicField, harmonicTime]);

  // Much slower harmonic time progression
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setHarmonicTime(Date.now());
      animationId = requestAnimationFrame(animate);
    };
    
    // Update much less frequently for smoother, less chaotic motion
    const interval = setInterval(() => {
      animationId = requestAnimationFrame(animate);
    }, 100); // Update every 100ms instead of every frame
    
    return () => {
      clearInterval(interval);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Generate harmonic ray path with smooth cosmic motion
  const generateRayPath = (ray: Ray, index: number): string => {
    const { angle, length, curvature, sunInfluence, harmonicDisplacement, temperatureGlow } = ray;
    
    // Much gentler breathing animation
    const globalPhase = (harmonicTime * 0.00003) % (Math.PI * 2); // Ultra-slow global rhythm
    const breathingScale = 1 + 0.05 * Math.sin(globalPhase + index * 0.01); // Gentle breathing
    const sunPulse = 1 + sunInfluence * 0.15 * Math.sin(globalPhase * 1.2); // Subtle sun pulse
    
    // Solar flare effects are much more controlled
    const solarFlareVibration = solarFlareIntensity > 0.6 ? 
      1 + 0.08 * Math.sin(globalPhase * 4 + index * 0.05) : 1; // Gentle solar activity
    
    const dynamicLength = length * breathingScale * sunPulse * solarFlareVibration;
    
    // Start point at ring edge
    const startX = center.x + Math.cos(angle) * radius;
    const startY = center.y + Math.sin(angle) * radius;
    
    if (curvature < 0.2) {
      // Straight ray with harmonic displacement
      const harmonicOffset = harmonicDisplacement * 0.4; // Reduced for subtlety
      const endX = center.x + Math.cos(angle) * (radius + dynamicLength) + Math.cos(angle + Math.PI/2) * harmonicOffset;
      const endY = center.y + Math.sin(angle) * (radius + dynamicLength) + Math.sin(angle + Math.PI/2) * harmonicOffset;
      
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // Curved ray with harmonic field influence
      const midLength = dynamicLength * 0.6;
      const endLength = dynamicLength;
      
      // Smooth harmonic displacement instead of chaotic waves
      const harmonicCurve = harmonicDisplacement * 0.5; // Much gentler than before
      const temperatureShimmer = temperatureGlow * 3 * Math.sin(globalPhase * 2 + angle * 4); // Reduced intensity
      
      const totalDisplacement = harmonicCurve + temperatureShimmer;
      
      const midX = center.x + Math.cos(angle) * (radius + midLength) + Math.cos(angle + Math.PI/2) * totalDisplacement;
      const midY = center.y + Math.sin(angle) * (radius + midLength) + Math.sin(angle + Math.PI/2) * totalDisplacement;
      
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
      transition={{ duration: 3 }}
    >
      <defs>
        {/* Deep sky blue background gradient */}
        <radialGradient id="skyBackground" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="hsl(210, 70%, 25%)" stopOpacity={0.1} />
          <stop offset="100%" stopColor="hsl(220, 80%, 15%)" stopOpacity={0.3} />
        </radialGradient>
        
        {/* Golden ray gradient */}
        <linearGradient id="goldenRayGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(45, 95%, 75%)" stopOpacity={0.2} />
          <stop offset="40%" stopColor="hsl(50, 100%, 85%)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="hsl(60, 100%, 95%)" stopOpacity={0.1} />
        </linearGradient>
        
        {/* Enhanced sun glow with golden tones */}
        <filter id="goldenSunGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.4 0.3 0 0 0  0.2 1.3 0 0 0  0 0 1.1 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Intense golden solar flare filter */}
        <filter id="goldenSolarFlare" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.6 0.4 0 0 0  0.3 1.5 0 0 0  0 0 1.2 0 0  0 0 0 1 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Radial glow for aurora effect */}
        <filter id="auroraGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feColorMatrix type="matrix" values="1.2 0.2 0 0 0  0.1 1.1 0 0 0  0 0 1.3 0 0  0 0 0 0.8 0"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Deep sky blue background circle */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r={radius + 50}
        fill="url(#skyBackground)"
        opacity={0.4}
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Render all golden rays with weather and solar activity */}
      {rays.map((ray, index) => {
        const path = generateRayPath(ray, index);
        const isSunInfluenced = ray.sunInfluence > 0.3;
        const isHighlySunInfluenced = ray.sunInfluence > 0.7;
        const isHarmonicInfluenced = Math.abs(ray.harmonicDisplacement) > 10;
        const isSolarFlareActive = solarFlareIntensity > 0.6;
        
        // Enhanced golden color palette with weather influence
        const baseHue = 45 + ray.sunInfluence * 15 + ray.temperatureGlow * 10; // 45-70 range
        const saturation = 75 + ray.sunInfluence * 20 + ray.temperatureGlow * 15; // Rich golden saturation
        const lightness = 80 + ray.sunInfluence * 20 + sunlightFactor * 15; // Brighter during day and near sun
        const color = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
        
        // Dynamic stroke width based on multiple factors
        const baseWidth = 0.4;
        const sunWidth = isSunInfluenced ? 0.8 : 0;
        const temperatureWidth = ray.temperatureGlow * 0.4;
        const flareWidth = isSolarFlareActive && isHighlySunInfluenced ? 0.6 : 0;
        const strokeWidth = baseWidth + sunWidth + temperatureWidth + flareWidth;
        
        // Filter selection based on intensity
        let filter = "url(#goldenSunGlow)";
        if (isSolarFlareActive && isHighlySunInfluenced) {
          filter = "url(#goldenSolarFlare)";
        } else if (ray.temperatureGlow > 0.7) {
          filter = "url(#auroraGlow)";
        }
        
        return (
          <motion.path
            key={`ray-${index}`}
            d={path}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={ray.brightness}
            fill="none"
            strokeLinecap="round"
            filter={filter}
            animate={{
              strokeOpacity: [
                ray.brightness * 0.5, 
                ray.brightness * (1 + ray.sunInfluence * 0.6 + ray.temperatureGlow * 0.3), 
                ray.brightness * 0.5
              ],
              strokeWidth: [
                strokeWidth * 0.8, 
                strokeWidth * (1 + (isSolarFlareActive ? 0.5 : 0.2)), 
                strokeWidth * 0.8
              ]
            }}
            transition={{
              duration: isSolarFlareActive ? 3 + index * 0.01 : 6 + index * 0.02, // Much slower, staggered timing
              repeat: Infinity,
              ease: "easeInOut", // Always smooth easing
              delay: index * 0.005 // More staggered delays for wave-like effect
            }}
          />
        );
      })}

      {/* Enhanced solar corona effects with golden aurora */}
      {rays
        .filter(ray => ray.sunInfluence > 0.8 || (solarFlareIntensity > 0.6 && ray.sunInfluence > 0.5))
        .map((ray, index) => {
          const coronaRadius = radius + ray.length * 1.2;
          const coronaX = center.x + Math.cos(ray.angle) * coronaRadius;
          const coronaY = center.y + Math.sin(ray.angle) * coronaRadius;
          
          const isFlareCorona = solarFlareIntensity > 0.6 && ray.sunInfluence > 0.5;
          const coronaSize = isFlareCorona ? 3.5 : 2.5;
          const coronaHue = 50 + ray.temperatureGlow * 15;
          
          return (
            <motion.circle
              key={`corona-${index}`}
              cx={coronaX}
              cy={coronaY}
              r={coronaSize}
              fill={`hsl(${coronaHue}, 100%, 92%)`}
              opacity={0.5}
              filter="url(#goldenSolarFlare)"
              animate={{
                r: isFlareCorona ? [3, 6, 3] : [2, 4.5, 2],
                opacity: [0.3, 0.8, 0.3],
                scale: isFlareCorona ? [0.6, 1.8, 0.6] : [0.8, 1.4, 0.8]
              }}
              transition={{
                duration: isFlareCorona ? 1.5 : 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * (isFlareCorona ? 0.05 : 0.1)
              }}
            />
          );
        })}

      {/* Enhanced sun position marker with solar activity */}
      <motion.circle
        cx={center.x + Math.cos(sunAngle) * (radius * 0.9)}
        cy={center.y + Math.sin(sunAngle) * (radius * 0.9)}
        r={4}
        fill={`hsl(50, 100%, ${85 + sunlightFactor * 15}%)`}
        opacity={0.7 + sunlightFactor * 0.3}
        filter="url(#goldenSolarFlare)"
        animate={{
          r: solarFlareIntensity > 0.6 ? [3, 7, 3] : [3, 5, 3],
          opacity: [0.6, 1, 0.6],
          scale: solarFlareIntensity > 0.6 ? [0.8, 1.6, 0.8] : [0.9, 1.2, 0.9]
        }}
        transition={{
          duration: solarFlareIntensity > 0.6 ? 2 : 5,
          repeat: Infinity,
          ease: solarFlareIntensity > 0.6 ? "easeInOut" : "linear"
        }}
      />
      
      {/* Wind direction indicator - subtle flowing lines */}
      {currentWeather.windIntensity > 0.3 && (
        <motion.path
          d={`M ${center.x + Math.cos(windDirection) * (radius * 0.7)} ${center.y + Math.sin(windDirection) * (radius * 0.7)} 
              L ${center.x + Math.cos(windDirection) * (radius * 0.9)} ${center.y + Math.sin(windDirection) * (radius * 0.9)}`}
          stroke="hsl(200, 60%, 80%)"
          strokeWidth={2 * currentWeather.windIntensity}
          strokeOpacity={0.4}
          strokeLinecap="round"
          filter="url(#goldenSunGlow)"
          animate={{
            strokeOpacity: [0.2, 0.6, 0.2],
            strokeWidth: [1.5 * currentWeather.windIntensity, 3 * currentWeather.windIntensity, 1.5 * currentWeather.windIntensity]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.g>
  );
};