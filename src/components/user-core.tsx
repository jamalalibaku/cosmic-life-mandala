/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserCoreProps {
  name: string;
  avatarUrl?: string;
  theme: string;
  mood?: 'calm' | 'excited' | 'low' | 'creative';
  centerX: number;
  centerY: number;
  radius: number;
  onClick?: () => void;
}

const moodGlyphs = {
  calm: '◯',
  excited: '⚡',
  low: '~',
  creative: '✦'
};

const moodColors = {
  calm: 'hsl(200 100% 70%)',
  excited: 'hsl(45 100% 70%)',
  low: 'hsl(240 30% 60%)',
  creative: 'hsl(280 100% 70%)'
};

export const UserCore: React.FC<UserCoreProps> = ({
  name,
  avatarUrl,
  theme,
  mood = 'calm',
  centerX,
  centerY,
  radius,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };

  const pulseRadius = isHovered ? radius + 10 : radius;
  const moodColor = moodColors[mood];

  return (
    <g className="user-core cursor-pointer" onClick={handleClick}>
      {/* Outer pulse ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={pulseRadius}
        fill="none"
        stroke={moodColor}
        strokeWidth="2"
        opacity={isHovered ? 0.6 : 0.3}
        className="transition-all duration-500"
      />
      
      {/* Main core circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="url(#userCoreGradient)"
        stroke={moodColor}
        strokeWidth="2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="transition-all duration-300"
      />

      {/* Avatar or user icon */}
      {avatarUrl ? (
        <image
          x={centerX - radius * 0.6}
          y={centerY - radius * 0.6}
          width={radius * 1.2}
          height={radius * 1.2}
          href={avatarUrl}
          clipPath="circle()"
        />
      ) : (
        <User
          x={centerX - 12}
          y={centerY - 12}
          size={24}
          className="fill-yellow-200"
        />
      )}

      {/* Mood glyph orbiter */}
      <text
        x={centerX + radius * 0.8}
        y={centerY - radius * 0.8}
        textAnchor="middle"
        className="fill-yellow-200 text-lg animate-pulse"
        style={{ 
          transform: `rotate(${Date.now() * 0.001 % 360}deg)`,
          transformOrigin: `${centerX}px ${centerY}px`
        }}
      >
        {moodGlyphs[mood]}
      </text>

      {/* Expanded state */}
      {isExpanded && (
        <g className="expanded-info">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 1.8}
            fill="rgba(0, 0, 0, 0.7)"
            stroke="hsl(45 100% 70%)"
            strokeWidth="1"
            opacity="0.8"
          />
          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            className="fill-yellow-200 text-sm font-medium"
          >
            {name}
          </text>
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            className="fill-yellow-100 text-xs"
          >
            feeling {mood}
          </text>
          <text
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            className="fill-yellow-100 text-xs"
          >
            click to explore
          </text>
        </g>
      )}

      {/* Gradient definition */}
      <defs>
        <radialGradient id="userCoreGradient">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.3)" />
        </radialGradient>
      </defs>
    </g>
  );
};