/**
 * (c) 2025 Cosmic Life Mandala – Interactive Weather Segment
 * Clickable weather elements that open circular modals
 */

import React, { useState } from 'react';
import { CircularModal } from '../ui/CircularModal';
import { WeatherCanvasView } from './WeatherCanvasView';
import { Cloud, Sun, CloudRain, Zap, CloudSnow, Moon } from 'lucide-react';
import { WeatherCondition } from '../weather-sunburst-ring';

interface InteractiveWeatherSegmentProps {
  hour: number;
  condition: WeatherCondition;
  temperature?: number;
  x: number;
  y: number;
  radius: number;
  colors: { primary: string; secondary: string; glow: string };
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  storm: Zap,
  snowy: CloudSnow,
  'clear-night': Moon
};

const weatherDescriptions = {
  sunny: "Bright and clear skies",
  cloudy: "Overcast with clouds",
  rainy: "Light to moderate rain",
  storm: "Thunderstorms with wind",
  snowy: "Snow and cold temperatures", 
  'clear-night': "Clear night sky"
};

export const InteractiveWeatherSegment: React.FC<InteractiveWeatherSegmentProps> = ({
  hour,
  condition,
  temperature,
  x,
  y,
  radius,
  colors
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number}>();

  const handleWeatherClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setModalOpen(true);
  };

  const WeatherIcon = weatherIcons[condition];
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <>
      {/* Clickable Weather Circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={colors.primary}
        stroke={colors.glow}
        strokeWidth="1"
        opacity={0.8}
        onClick={handleWeatherClick}
        className="cursor-pointer hover:opacity-100 transition-opacity duration-200"
        style={{
          filter: `drop-shadow(0 0 4px ${colors.glow})`
        }}
      />

      {/* Weather Canvas Modal */}
      <CircularModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        triggerPosition={clickPosition}
        size="lg"
      >
        <WeatherCanvasView className="h-full" />
      </CircularModal>
    </>
  );
};