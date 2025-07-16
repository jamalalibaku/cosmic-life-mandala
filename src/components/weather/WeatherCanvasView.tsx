/**
 * Weather Canvas View - A horizontal 24-hour weather landscape
 * Renders as a data-driven atmospheric scene
 */

import React from 'react';
import { motion } from 'framer-motion';

type HourlyWeather = {
  time: string; // "06:00"
  temp: number;
  cloudCover: number; // 0–1
  windSpeed: number;
  precipitation: number; // mm
  isDaylight: boolean;
};

interface WeatherCanvasViewProps {
  weatherData?: HourlyWeather[];
  className?: string;
}

// Mock 24-hour weather data for testing
const mockWeatherData: HourlyWeather[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  temp: 15 + Math.sin((i - 6) * Math.PI / 12) * 8 + Math.random() * 3,
  cloudCover: Math.max(0, Math.min(1, 0.3 + Math.sin(i * Math.PI / 8) * 0.4)),
  windSpeed: 5 + Math.random() * 10,
  precipitation: i >= 14 && i <= 18 ? Math.random() * 2 : 0,
  isDaylight: i >= 6 && i <= 20,
}));

export const WeatherCanvasView: React.FC<WeatherCanvasViewProps> = ({
  weatherData = mockWeatherData,
  className = ""
}) => {
  const generateSunMoonPath = () => {
    const points = weatherData.map((_, i) => {
      const x = (i / 23) * 100;
      let y = 70;
      
      if (i >= 6 && i <= 20) {
        // Daylight hours - sun arc
        const sunProgress = (i - 6) / 14;
        y = 70 - Math.sin(sunProgress * Math.PI) * 40;
      } else {
        // Night hours - moon arc (lower)
        y = 85;
      }
      
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  };

  const generateTemperaturePath = () => {
    const points = weatherData.map((data, i) => {
      const x = (i / 23) * 100;
      const normalizedTemp = Math.max(0, Math.min(1, (data.temp - 5) / 25));
      const y = 90 - (normalizedTemp * 20);
      
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  };

  return (
    <div className={`relative w-full h-80 overflow-hidden rounded-lg ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/30">
      </div>

      {/* Main SVG Canvas */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBB040" stopOpacity="1" />
            <stop offset="70%" stopColor="#FB8040" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FB8040" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB8040" />
            <stop offset="50%" stopColor="#FBB040" />
            <stop offset="100%" stopColor="#FB8040" />
          </linearGradient>

          <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBB040" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FB8040" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Horizon glow */}
        <rect 
          x="0" 
          y="75" 
          width="100" 
          height="25" 
          fill="url(#horizonGlow)" 
        />

        {/* Rolling hills/landscape silhouette */}
        <path
          d="M 0 85 Q 25 80 50 82 Q 75 84 100 81 L 100 100 L 0 100 Z"
          fill="rgba(0, 0, 0, 0.4)"
        />

        {/* Cloud layers */}
        {weatherData.map((data, i) => {
          if (data.cloudCover > 0.3) {
            return (
              <motion.ellipse
                key={`cloud-${i}`}
                cx={(i / 23) * 100}
                cy={60 - data.cloudCover * 20}
                rx={5 + data.cloudCover * 3}
                ry={2 + data.cloudCover * 2}
                fill="rgba(255, 255, 255, 0.1)"
                initial={{ opacity: 0 }}
                animate={{ opacity: data.cloudCover * 0.6 }}
                transition={{ delay: i * 0.1 }}
              />
            );
          }
          return null;
        })}

        {/* Sun/Moon orb */}
        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="url(#sunGlow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        />

        {/* Temperature curve */}
        <motion.path
          d={generateTemperaturePath()}
          stroke="url(#tempGradient)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Rain effects */}
        {weatherData.map((data, i) => {
          if (data.precipitation > 0) {
            return Array.from({ length: Math.floor(data.precipitation * 3) }).map((_, j) => (
              <motion.line
                key={`rain-${i}-${j}`}
                x1={(i / 23) * 100 + Math.random() * 2}
                y1="20"
                x2={(i / 23) * 100 + Math.random() * 2}
                y2="80"
                stroke="rgba(173, 216, 230, 0.6)"
                strokeWidth="0.1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ));
          }
          return null;
        })}
      </svg>

      {/* Time markers */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-amber-200/80 text-sm font-medium">
        <span>0h</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24h</span>
      </div>

      {/* Title */}
      <motion.div 
        className="absolute top-6 left-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-light text-amber-100" style={{ 
          textShadow: '0 0 20px rgba(251, 176, 64, 0.8)' 
        }}>
          Weather
        </h2>
      </motion.div>
    </div>
  );
};