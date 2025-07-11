/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from 'react';
import { Theme } from '@/utils/theme-configs';
import { TimeScale } from '@/components/fractal-time-zoom-manager';

interface PoetryLine {
  text: string;
  theme: Theme;
  timeScale: TimeScale;
  position: 'center' | 'orbit' | 'drift';
}

const poetryLines: PoetryLine[] = [
  // Cosmic theme
  { text: "A thought moved through you / before the rain touched the earth / it's still with you now", theme: 'cosmic', timeScale: 'day', position: 'center' },
  { text: "The night wrapped your walk / in silence and sodium light / heartbeat syncs with sky", theme: 'cosmic', timeScale: 'day', position: 'drift' },
  { text: "Seven dawns gather / like breadcrumbs on your mind's path / this week holds stories", theme: 'cosmic', timeScale: 'week', position: 'orbit' },
  { text: "Moon cycles through you / thirty days of small decisions / shape who you become", theme: 'cosmic', timeScale: 'month', position: 'center' },
  { text: "Seasons turn within / four quarters of breath and change / you are the constant", theme: 'cosmic', timeScale: 'year', position: 'drift' },

  // Interface theme
  { text: "Data streams like rain / through circuits of consciousness / we are the machine", theme: 'interface', timeScale: 'day', position: 'center' },
  { text: "Seven cycles run / in the neural network's dance / patterns become truth", theme: 'interface', timeScale: 'week', position: 'orbit' },

  // Mandala theme
  { text: "Emotions flow like rivers / Through the mandala of time / Each breath a new world", theme: 'mandala', timeScale: 'day', position: 'center' },
  { text: "Seven sacred circles / Each day a prayer in motion / Being becomes form", theme: 'mandala', timeScale: 'week', position: 'orbit' },

  // Van Gogh theme
  { text: "Starlight swirls like paint / Across the canvas of night / Time becomes a dream", theme: 'vangogh', timeScale: 'day', position: 'center' },
  { text: "Seven burning suns / Dance eternal through the sky / Beauty burns like fire", theme: 'vangogh', timeScale: 'week', position: 'drift' },

  // Horizons theme
  { text: "Soft clouds drift like thoughts / through the pastel afternoon / gentle time unfolds", theme: 'horizons', timeScale: 'day', position: 'center' },
  { text: "Seven dreamy days / float like cotton candy skies / sweetness holds the hours", theme: 'horizons', timeScale: 'week', position: 'drift' }
];

interface PoetryOverlayProps {
  isVisible: boolean;
  theme: Theme;
  timeScale: TimeScale;
  centerX: number;
  centerY: number;
  maxRadius: number;
  onExit?: () => void;
}

export const PoetryOverlay: React.FC<PoetryOverlayProps> = ({
  isVisible,
  theme,
  timeScale,
  centerX,
  centerY,
  maxRadius,
  onExit
}) => {
  const [currentPoetry, setCurrentPoetry] = useState<PoetryLine | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [driftOffset, setDriftOffset] = useState({ x: 0, y: 0 });

  // Get relevant poetry lines for current theme and time scale
  const getRelevantPoetry = () => {
    return poetryLines.filter(line => 
      line.theme === theme && line.timeScale === timeScale
    );
  };

  // Cycle through poetry lines
  useEffect(() => {
    if (!isVisible) {
      setCurrentPoetry(null);
      setFadeIn(false);
      return;
    }

    const relevantLines = getRelevantPoetry();
    if (relevantLines.length === 0) {
      // Fallback to cosmic theme lines
      const cosmicLines = poetryLines.filter(line => 
        line.theme === 'cosmic' && line.timeScale === timeScale
      );
      if (cosmicLines.length > 0) {
        setCurrentPoetry(cosmicLines[Math.floor(Math.random() * cosmicLines.length)]);
      }
    } else {
      setCurrentPoetry(relevantLines[Math.floor(Math.random() * relevantLines.length)]);
    }

    setFadeIn(true);

    const interval = setInterval(() => {
      setFadeIn(false);
      
      setTimeout(() => {
        const lines = getRelevantPoetry();
        if (lines.length > 0) {
          setCurrentPoetry(lines[Math.floor(Math.random() * lines.length)]);
          setFadeIn(true);
        }
      }, 1000);
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, [isVisible, theme, timeScale]);

  // Subtle drift animation
  useEffect(() => {
    if (!isVisible) return;

    const driftInterval = setInterval(() => {
      setDriftOffset({
        x: Math.sin(Date.now() * 0.0001) * 20,
        y: Math.cos(Date.now() * 0.0001) * 15
      });
    }, 100);

    return () => clearInterval(driftInterval);
  }, [isVisible]);

  if (!isVisible || !currentPoetry) return null;

  const getPosition = () => {
    const baseX = centerX + driftOffset.x;
    const baseY = centerY + driftOffset.y;

    switch (currentPoetry.position) {
      case 'center':
        return { x: baseX, y: baseY + 40 };
      case 'orbit':
        const angle = (Date.now() * 0.0002) % (2 * Math.PI);
        return {
          x: baseX + Math.cos(angle) * (maxRadius * 0.7),
          y: baseY + Math.sin(angle) * (maxRadius * 0.7)
        };
      case 'drift':
        return {
          x: baseX + Math.sin(Date.now() * 0.0003) * (maxRadius * 0.5),
          y: baseY + Math.cos(Date.now() * 0.0003) * (maxRadius * 0.3)
        };
      default:
        return { x: baseX, y: baseY };
    }
  };

  const position = getPosition();
  const lines = currentPoetry.text.split(' / ');

  return (
    <g 
      className={`poetry-overlay ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 cursor-pointer`}
      onClick={onExit}
    >
      {/* Subtle background for readability */}
      <rect
        x={position.x - 150}
        y={position.y - (lines.length * 12)}
        width="300"
        height={lines.length * 24 + 20}
        fill="rgba(0, 0, 0, 0.2)"
        rx="8"
        className="backdrop-blur-sm"
      />
      
      {/* Poetry lines */}
      {lines.map((line, index) => (
        <text
          key={index}
          x={position.x}
          y={position.y + (index * 24) - (lines.length * 8)}
          textAnchor="middle"
          className="fill-white/90 text-lg font-light tracking-wide"
          style={{
            fontFamily: 'serif',
            fontSize: '18px',
            letterSpacing: '0.05em'
          }}
        >
          {line}
        </text>
      ))}
      
      {/* Subtle instruction */}
      <text
        x={position.x}
        y={position.y + (lines.length * 24) + 15}
        textAnchor="middle"
        className="fill-white/40 text-xs"
        style={{ fontSize: '12px' }}
      >
        tap to return
      </text>
    </g>
  );
};