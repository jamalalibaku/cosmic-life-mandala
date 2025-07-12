/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Car, Heart, Cloud, Zap } from 'lucide-react';

interface InsightShieldData {
  title: string;
  value: string;
  timestamp: string;
  layerType: string;
  intensity?: number;
  x: number;
  y: number;
  dataPoint: any;
}

interface HoverInsightShieldProps {
  data: InsightShieldData | null;
  isVisible: boolean;
  onClose?: () => void;
}

export const HoverInsightShield: React.FC<HoverInsightShieldProps> = ({ 
  data, 
  isVisible,
  onClose 
}) => {
  const [shieldPosition, setShieldPosition] = useState({ x: 0, y: 0 });
  const [lineLength, setLineLength] = useState(0);
  
  useEffect(() => {
    if (data && isVisible) {
      // Calculate optimal shield position
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Determine shield placement based on data point position
      let shieldX = data.x;
      let shieldY = data.y;
      
      // Position shield outside the radial system
      const distanceFromCenter = Math.sqrt((data.x - centerX) ** 2 + (data.y - centerY) ** 2);
      const angle = Math.atan2(data.y - centerY, data.x - centerX);
      
      // Place shield further out from center
      const shieldDistance = distanceFromCenter + 120;
      shieldX = centerX + Math.cos(angle) * shieldDistance;
      shieldY = centerY + Math.sin(angle) * shieldDistance;
      
      // Keep shield on screen
      shieldX = Math.max(150, Math.min(window.innerWidth - 200, shieldX));
      shieldY = Math.max(80, Math.min(window.innerHeight - 100, shieldY));
      
      setShieldPosition({ x: shieldX, y: shieldY });
      
      // Calculate line length
      const lineLen = Math.sqrt((shieldX - data.x) ** 2 + (shieldY - data.y) ** 2);
      setLineLength(lineLen);
    }
  }, [data, isVisible]);

  const getLayerIcon = (layerType: string) => {
    switch (layerType.toLowerCase()) {
      case 'sleep': return Moon;
      case 'mood': return Heart;
      case 'mobility': return Car;
      case 'weather': return Cloud;
      case 'plans': return Activity;
      default: return Zap;
    }
  };

  const getLayerColor = (layerType: string) => {
    switch (layerType.toLowerCase()) {
      case 'sleep': return 'hsl(240, 60%, 70%)';
      case 'mood': return 'hsl(340, 70%, 65%)';
      case 'mobility': return 'hsl(120, 60%, 60%)';
      case 'weather': return 'hsl(200, 70%, 65%)';
      case 'plans': return 'hsl(30, 70%, 65%)';
      default: return 'hsl(45, 70%, 70%)';
    }
  };

  if (!data || !isVisible) return null;

  const LayerIcon = getLayerIcon(data.layerType);
  const layerColor = getLayerColor(data.layerType);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Diagnostic scan line */}
          <motion.div
            className="absolute"
            style={{
              left: data.x,
              top: data.y,
              width: lineLength,
              height: 2,
              background: `linear-gradient(90deg, ${layerColor}, transparent)`,
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(shieldPosition.y - data.y, shieldPosition.x - data.x)}rad)`,
              filter: 'drop-shadow(0 0 4px currentColor)'
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Animated dash pattern on line */}
          <motion.div
            className="absolute"
            style={{
              left: data.x,
              top: data.y - 1,
              width: lineLength,
              height: 4,
              background: `repeating-linear-gradient(90deg, transparent 0px, transparent 8px, ${layerColor} 8px, ${layerColor} 12px)`,
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(shieldPosition.y - data.y, shieldPosition.x - data.x)}rad)`,
              opacity: 0.6
            }}
            animate={{
              backgroundPosition: ['0px 0px', '20px 0px']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Ripple ring at data point */}
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              left: data.x - 15,
              top: data.y - 15,
              width: 30,
              height: 30,
              borderColor: layerColor,
              background: `radial-gradient(circle, ${layerColor}20, transparent)`
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.5, 1.8], 
              opacity: [0, 0.8, 0] 
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut" 
            }}
          />

          {/* Insight Shield Panel */}
          <motion.div
            className="absolute pointer-events-auto"
            style={{
              left: shieldPosition.x - 100,
              top: shieldPosition.y - 60
            }}
            initial={{ 
              scale: 0.8, 
              opacity: 0,
              rotateX: -10,
              y: 20
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotateX: 0,
              y: 0
            }}
            exit={{ 
              scale: 0.9, 
              opacity: 0,
              y: -10
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut",
              delay: 0.2
            }}
          >
            {/* Shield panel background */}
            <div 
              className="relative w-48 rounded-lg border backdrop-blur-md shadow-2xl"
              style={{
                background: `linear-gradient(135deg, 
                  hsla(240, 20%, 8%, 0.95) 0%, 
                  hsla(240, 15%, 12%, 0.90) 50%,
                  hsla(240, 10%, 6%, 0.95) 100%)`,
                borderColor: layerColor,
                boxShadow: `0 0 20px ${layerColor}40, inset 0 1px 0 hsla(0, 0%, 100%, 0.1)`
              }}
            >
              {/* Holographic glow edge */}
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, transparent 0%, ${layerColor}20 50%, transparent 100%)`,
                  filter: 'blur(1px)'
                }}
              />

              {/* Content */}
              <div className="relative p-4 space-y-3">
                {/* Header with icon */}
                <div className="flex items-center space-x-2">
                  <div 
                    className="p-1.5 rounded-md"
                    style={{ 
                      background: `${layerColor}20`,
                      border: `1px solid ${layerColor}40`
                    }}
                  >
                    <LayerIcon 
                      size={14} 
                      style={{ color: layerColor }}
                    />
                  </div>
                  <span 
                    className="text-sm font-medium tracking-wide"
                    style={{ color: layerColor }}
                  >
                    {data.title}
                  </span>
                </div>

                {/* Value display */}
                <div className="space-y-1">
                  <div 
                    className="text-lg font-mono font-bold leading-none"
                    style={{ color: 'hsl(0, 0%, 95%)' }}
                  >
                    {data.value}
                  </div>
                  
                  {/* Intensity bar if available */}
                  {data.intensity !== undefined && (
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: layerColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${data.intensity * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div 
                  className="text-xs font-mono opacity-70 tracking-wider"
                  style={{ color: 'hsl(0, 0%, 80%)' }}
                >
                  {data.timestamp}
                </div>

                {/* Scan line animation */}
                <motion.div
                  className="absolute inset-x-0 h-px opacity-60"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${layerColor}, transparent)`,
                    top: '50%'
                  }}
                  animate={{
                    x: [-200, 200]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Corner accent marks */}
              {[
                { top: 2, left: 2, rotateAngle: 0 },
                { top: 2, right: 2, rotateAngle: 90 },
                { bottom: 2, right: 2, rotateAngle: 180 },
                { bottom: 2, left: 2, rotateAngle: 270 }
              ].map((corner, index) => (
                <div
                  key={index}
                  className="absolute w-3 h-3"
                  style={{
                    top: corner.top,
                    left: corner.left,
                    right: corner.right,
                    bottom: corner.bottom,
                    borderTop: `1px solid ${layerColor}`,
                    borderLeft: `1px solid ${layerColor}`,
                    transform: `rotate(${corner.rotateAngle}deg)`
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
