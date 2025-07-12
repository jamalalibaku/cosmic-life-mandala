import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SkyBandProps {
  centerX: number;
  centerY: number;
  radius: number;
  weatherData?: any;
  currentTime?: Date;
}

interface TimeColorPhase {
  hour: number;
  color: string;
  brightness: number;
}

const timeColorPhases: TimeColorPhase[] = [
  { hour: 0, color: 'hsl(220, 50%, 15%)', brightness: 0.2 }, // Deep night
  { hour: 4, color: 'hsl(220, 40%, 20%)', brightness: 0.3 }, // Pre-dawn
  { hour: 5, color: 'hsl(15, 70%, 45%)', brightness: 0.5 }, // Sunrise pink
  { hour: 6, color: 'hsl(35, 80%, 60%)', brightness: 0.7 }, // Dawn gold
  { hour: 8, color: 'hsl(50, 90%, 75%)', brightness: 0.9 }, // Morning light
  { hour: 12, color: 'hsl(55, 100%, 85%)', brightness: 1.0 }, // Noon
  { hour: 16, color: 'hsl(50, 90%, 75%)', brightness: 0.9 }, // Afternoon
  { hour: 18, color: 'hsl(25, 85%, 65%)', brightness: 0.7 }, // Sunset orange
  { hour: 20, color: 'hsl(280, 60%, 45%)', brightness: 0.5 }, // Twilight purple
  { hour: 22, color: 'hsl(240, 50%, 25%)', brightness: 0.3 }, // Evening blue
  { hour: 24, color: 'hsl(220, 50%, 15%)', brightness: 0.2 }, // Back to night
];

function interpolateColor(time: number): { color: string; brightness: number } {
  const hour = time;
  
  // Find the two phases to interpolate between
  let beforePhase = timeColorPhases[0];
  let afterPhase = timeColorPhases[1];
  
  for (let i = 0; i < timeColorPhases.length - 1; i++) {
    if (hour >= timeColorPhases[i].hour && hour < timeColorPhases[i + 1].hour) {
      beforePhase = timeColorPhases[i];
      afterPhase = timeColorPhases[i + 1];
      break;
    }
  }
  
  // Handle wrap-around (23:xx to 01:xx)
  if (hour >= timeColorPhases[timeColorPhases.length - 2].hour) {
    beforePhase = timeColorPhases[timeColorPhases.length - 2];
    afterPhase = timeColorPhases[timeColorPhases.length - 1];
  }
  
  const progress = (hour - beforePhase.hour) / (afterPhase.hour - beforePhase.hour);
  const brightness = beforePhase.brightness + (afterPhase.brightness - beforePhase.brightness) * progress;
  
  return {
    color: beforePhase.color,
    brightness
  };
}

function createArcPath(
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startAngleRad = (startAngle - 90) * (Math.PI / 180);
  const endAngleRad = (endAngle - 90) * (Math.PI / 180);
  
  const x1 = centerX + innerRadius * Math.cos(startAngleRad);
  const y1 = centerY + innerRadius * Math.sin(startAngleRad);
  const x2 = centerX + outerRadius * Math.cos(startAngleRad);
  const y2 = centerY + outerRadius * Math.sin(startAngleRad);
  
  const x3 = centerX + outerRadius * Math.cos(endAngleRad);
  const y3 = centerY + outerRadius * Math.sin(endAngleRad);
  const x4 = centerX + innerRadius * Math.cos(endAngleRad);
  const y4 = centerY + innerRadius * Math.sin(endAngleRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
    'Z'
  ].join(' ');
}

export const SkyBand: React.FC<SkyBandProps> = ({
  centerX,
  centerY,
  radius,
  weatherData,
  currentTime = new Date()
}) => {
  const innerRadius = radius * 0.8;
  const outerRadius = radius;
  
  // Create 1440 segments (one per minute)
  const segments = useMemo(() => {
    const segs = [];
    const minutesInDay = 1440;
    const degreesPerMinute = 360 / minutesInDay;
    
    for (let minute = 0; minute < minutesInDay; minute++) {
      const hour = minute / 60;
      const startAngle = minute * degreesPerMinute;
      const endAngle = (minute + 1) * degreesPerMinute;
      
      const { color, brightness } = interpolateColor(hour);
      
      segs.push({
        minute,
        hour,
        startAngle,
        endAngle,
        color,
        brightness,
        path: createArcPath(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle)
      });
    }
    
    return segs;
  }, [centerX, centerY, innerRadius, outerRadius]);
  
  // Current time highlight
  const currentMinute = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  // Weather effects
  const hasRain = weatherData?.conditions?.includes('rain') || false;
  const hasSnow = weatherData?.conditions?.includes('snow') || false;
  
  return (
    <g className="sky-band">
      {/* Base time-colored segments */}
      {segments.map((segment, index) => {
        const isCurrentTime = Math.abs(index - currentMinute) <= 2;
        
        return (
          <motion.path
            key={`sky-segment-${index}`}
            d={segment.path}
            fill={segment.color}
            fillOpacity={segment.brightness * 0.6}
            stroke={segment.color}
            strokeWidth={0.5}
            strokeOpacity={segment.brightness * 0.3}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isCurrentTime ? 1 : 0.8,
              filter: isCurrentTime ? 'brightness(1.2)' : 'brightness(1)'
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        );
      })}
      
      {/* Current time glow */}
      <motion.circle
        cx={centerX + (innerRadius + outerRadius) / 2 * Math.cos((currentMinute * 360 / 1440 - 90) * Math.PI / 180)}
        cy={centerY + (innerRadius + outerRadius) / 2 * Math.sin((currentMinute * 360 / 1440 - 90) * Math.PI / 180)}
        r="8"
        fill="hsl(var(--primary))"
        fillOpacity={0.8}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Rain effect */}
      {hasRain && (
        <g className="rain-effect">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.circle
              key={`rain-${i}`}
              cx={centerX + (innerRadius + outerRadius) / 2 * Math.cos((i * 18) * Math.PI / 180)}
              cy={centerY + (innerRadius + outerRadius) / 2 * Math.sin((i * 18) * Math.PI / 180)}
              r="2"
              fill="hsl(200, 80%, 70%)"
              fillOpacity={0.6}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </g>
      )}
      
      {/* Snow effect */}
      {hasSnow && (
        <g className="snow-effect">
          {Array.from({ length: 30 }, (_, i) => (
            <motion.circle
              key={`snow-${i}`}
              cx={centerX + (Math.random() - 0.5) * outerRadius * 2}
              cy={centerY + (Math.random() - 0.5) * outerRadius * 2}
              r="1.5"
              fill="hsl(0, 0%, 95%)"
              fillOpacity={0.8}
              animate={{
                y: [0, 20, 0],
                opacity: [0.8, 0.4, 0.8],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </g>
      )}
      
      {/* Atmospheric glow during golden hour */}
      {(currentTime.getHours() >= 5 && currentTime.getHours() <= 7) || 
       (currentTime.getHours() >= 17 && currentTime.getHours() <= 19) && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={outerRadius + 10}
          fill="none"
          stroke="hsl(45, 100%, 70%)"
          strokeWidth="2"
          strokeOpacity={0.3}
          animate={{
            strokeOpacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </g>
  );
};