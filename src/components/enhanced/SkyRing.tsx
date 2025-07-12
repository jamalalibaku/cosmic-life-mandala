/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOrganicOrbitMotion } from '@/hooks/useOrganicOrbitMotion';

interface SkyRingProps {
  radius: number;
  center: { x: number; y: number };
  className?: string;
}

export const SkyRing: React.FC<SkyRingProps> = ({ radius, center, className }) => {
  const currentHour = new Date().getHours();
  const minutes = new Date().getMinutes();
  const timeOfDay = currentHour + minutes / 60;

  // Organic motion for the sky ring - gentle, celestial breathing
  const skyMotion = useOrganicOrbitMotion({
    layerType: 'sky',
    baseRadius: radius,
    dataPoints: [],
    moodVolatility: 0.3,
    isNightTime: currentHour < 6 || currentHour > 20
  });

  // Calculate sky colors based on time of day
  const getSkyGradient = useMemo(() => {
    let primaryColor: string;
    let secondaryColor: string;
    let tertiaryColor: string;
    
    if (timeOfDay >= 5 && timeOfDay < 7) {
      // Dawn: rose gold to soft orange
      primaryColor = 'hsl(25, 70%, 65%)';
      secondaryColor = 'hsl(15, 60%, 55%)';
      tertiaryColor = 'hsl(35, 80%, 75%)';
    } else if (timeOfDay >= 7 && timeOfDay < 11) {
      // Morning: golden to light blue
      primaryColor = 'hsl(45, 60%, 70%)';
      secondaryColor = 'hsl(200, 40%, 80%)';
      tertiaryColor = 'hsl(210, 50%, 85%)';
    } else if (timeOfDay >= 11 && timeOfDay < 16) {
      // Midday: bright blue
      primaryColor = 'hsl(210, 70%, 75%)';
      secondaryColor = 'hsl(220, 60%, 80%)';
      tertiaryColor = 'hsl(200, 80%, 85%)';
    } else if (timeOfDay >= 16 && timeOfDay < 19) {
      // Afternoon: warm blue to gold
      primaryColor = 'hsl(200, 60%, 70%)';
      secondaryColor = 'hsl(35, 70%, 65%)';
      tertiaryColor = 'hsl(25, 60%, 60%)';
    } else if (timeOfDay >= 19 && timeOfDay < 21) {
      // Sunset: orange to deep purple
      primaryColor = 'hsl(15, 80%, 60%)';
      secondaryColor = 'hsl(280, 50%, 45%)';
      tertiaryColor = 'hsl(300, 60%, 55%)';
    } else {
      // Night: deep indigo to black
      primaryColor = 'hsl(240, 30%, 20%)';
      secondaryColor = 'hsl(250, 40%, 15%)';
      tertiaryColor = 'hsl(260, 20%, 10%)';
    }

    return { primaryColor, secondaryColor, tertiaryColor };
  }, [timeOfDay]);

  // Generate flowing sky path with organic deformation
  const skyPath = skyMotion.generateOrbitPath(center.x, center.y);
  
  // Create a wider, flowing ring by generating inner and outer boundaries
  const innerRadius = radius * 0.95;
  const outerRadius = radius * 1.1;
  
  const innerPath = useMemo(() => {
    const points = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const deformedRadius = skyMotion.getRadiusAtAngle(angle) * 0.95;
      const x = center.x + Math.cos(angle) * deformedRadius;
      const y = center.y + Math.sin(angle) * deformedRadius;
      points.push({ x, y });
    }
    return points;
  }, [skyMotion, center, innerRadius]);

  const outerPath = useMemo(() => {
    const points = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const deformedRadius = skyMotion.getRadiusAtAngle(angle) * 1.1;
      const x = center.x + Math.cos(angle) * deformedRadius;
      const y = center.y + Math.sin(angle) * deformedRadius;
      points.push({ x, y });
    }
    return points;
  }, [skyMotion, center, outerRadius]);

  // Create flowing path between inner and outer boundaries
  const createFlowingRingPath = () => {
    if (innerPath.length === 0 || outerPath.length === 0) return '';
    
    let pathData = `M ${outerPath[0].x} ${outerPath[0].y}`;
    
    // Outer arc
    for (let i = 1; i < outerPath.length; i++) {
      const current = outerPath[i];
      const next = outerPath[(i + 1) % outerPath.length];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      pathData += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }
    
    // Connect to inner arc (reverse order)
    pathData += ` L ${innerPath[innerPath.length - 1].x} ${innerPath[innerPath.length - 1].y}`;
    
    // Inner arc (reverse)
    for (let i = innerPath.length - 2; i >= 0; i--) {
      const current = innerPath[i];
      const next = innerPath[i === 0 ? innerPath.length - 1 : i - 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      pathData += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }
    
    pathData += ' Z';
    return pathData;
  };

  const ringPath = createFlowingRingPath();

  // Generate scattered stars for night time
  const generateStars = useMemo(() => {
    if (timeOfDay >= 6 && timeOfDay <= 20) return [];
    
    const stars = [];
    const starCount = Math.floor(Math.random() * 8) + 4;
    
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const starRadius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = center.x + Math.cos(angle) * starRadius;
      const y = center.y + Math.sin(angle) * starRadius;
      const size = Math.random() * 1.5 + 0.5;
      
      stars.push({ x, y, size, opacity: Math.random() * 0.6 + 0.4 });
    }
    
    return stars;
  }, [timeOfDay, innerRadius, outerRadius, center]);

  return (
    <motion.g 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <defs>
        {/* Sky gradient definitions */}
        <radialGradient id="skyGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={getSkyGradient.tertiaryColor} stopOpacity={0.3} />
          <stop offset="50%" stopColor={getSkyGradient.primaryColor} stopOpacity={0.6} />
          <stop offset="100%" stopColor={getSkyGradient.secondaryColor} stopOpacity={0.8} />
        </radialGradient>
        
        {/* Flowing shimmer gradient */}
        <linearGradient id="skyShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={getSkyGradient.primaryColor} stopOpacity={0.2} />
          <stop offset="50%" stopColor={getSkyGradient.tertiaryColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={getSkyGradient.secondaryColor} stopOpacity={0.2} />
        </linearGradient>

        {/* Glow filter for celestial effects */}
        <filter id="skyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main sky ring */}
      <motion.path
        d={ringPath}
        fill="url(#skyGradient)"
        stroke="none"
        opacity={0.4}
        filter="url(#skyGlow)"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Flowing shimmer overlay */}
      <motion.path
        d={ringPath}
        fill="url(#skyShimmer)"
        stroke="none"
        opacity={0.2}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transformOrigin: `${center.x}px ${center.y}px`
        }}
      />

      {/* Celestial border outline */}
      <motion.path
        d={skyPath}
        fill="none"
        stroke={getSkyGradient.primaryColor}
        strokeWidth={0.5}
        strokeOpacity={0.6}
        strokeDasharray="4,8"
        animate={{
          strokeDashoffset: [0, 12, 0],
          strokeOpacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Stars for night time */}
      {generateStars.map((star, index) => (
        <motion.circle
          key={`star-${index}`}
          cx={star.x}
          cy={star.y}
          r={star.size}
          fill="hsl(45, 70%, 85%)"
          opacity={star.opacity}
          filter="url(#skyGlow)"
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Atmospheric wisps - flowing cloud-like elements */}
      {[...Array(3)].map((_, index) => {
        const wispAngle = (index / 3) * Math.PI * 2 + Math.random();
        const wispRadius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const wispX = center.x + Math.cos(wispAngle) * wispRadius;
        const wispY = center.y + Math.sin(wispAngle) * wispRadius;
        
        return (
          <motion.ellipse
            key={`wisp-${index}`}
            cx={wispX}
            cy={wispY}
            rx={8 + Math.random() * 4}
            ry={3 + Math.random() * 2}
            fill={getSkyGradient.tertiaryColor}
            opacity={0.1}
            animate={{
              cx: [wispX, wispX + (Math.random() - 0.5) * 20, wispX],
              cy: [wispY, wispY + (Math.random() - 0.5) * 10, wispY],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 2
            }}
            style={{
              transformOrigin: `${wispX}px ${wispY}px`
            }}
          />
        );
      })}
    </motion.g>
  );
};