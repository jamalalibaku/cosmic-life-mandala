/**
 * [Lap 12 – Layer Pop-Out Insight Panel]
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Calendar, Footprints, Heart, Moon, User } from 'lucide-react';

import { useTimeAxis } from '@/contexts/TimeAxisContext';
import { TimeScale } from '@/components/fractal-time-zoom-manager';

interface LayerPopOutPanelProps {
  isOpen: boolean;
  onClose: () => void;
  layerType: string;
  layerData: any;
  position: { x: number; y: number };
  timeRange: string;
  currentTimeScale?: TimeScale;
  theme: string;
}

const getLayerIcon = (layerType: string) => {
  const icons = {
    weather: Sun,
    plans: Calendar,
    mobility: Footprints,
    mood: Heart,
    sleep: Moon,
    wallet: User
  };
  return icons[layerType] || Heart;
};

const getLayerColor = (layerType: string, theme: string) => {
  const colors = {
    weather: 'hsl(45, 70%, 70%)',
    plans: 'hsl(200, 60%, 70%)',
    mobility: 'hsl(120, 50%, 70%)',
    mood: 'hsl(320, 60%, 70%)',
    sleep: 'hsl(260, 50%, 70%)',
    wallet: 'hsl(45, 80%, 75%)'
  };
  return colors[layerType] || colors.mood;
};

const generateLayerInsight = (layerType: string, data: any) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      summary: "No data recorded",
      insight: "Start tracking to see patterns emerge",
      avgValue: null,
      trend: "neutral"
    };
  }

  const values = data.map(item => item.value || item.intensity || 0);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  // Simple trend calculation
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  const trend = secondAvg > firstAvg + 0.1 ? "up" : secondAvg < firstAvg - 0.1 ? "down" : "stable";

  const insights = {
    weather: {
      summary: `Average conditions: ${avgValue.toFixed(1)}`,
      insight: trend === "up" ? "Brighter days ahead" : trend === "down" ? "Weathering the storms" : "Steady atmospheric rhythms",
      avgValue,
      trend
    },
    plans: {
      summary: `${data.length} planned activities`,
      insight: trend === "up" ? "Building momentum in planning" : "Finding your natural pace",
      avgValue,
      trend
    },
    mobility: {
      summary: `Average activity: ${avgValue.toFixed(1)}`,
      insight: trend === "up" ? "Your body is responding to movement" : trend === "down" ? "Rest is part of the cycle" : "Steady in your rhythm",
      avgValue,
      trend
    },
    mood: {
      summary: `Emotional average: ${avgValue.toFixed(1)}`,
      insight: trend === "up" ? "Your inner light is brightening" : trend === "down" ? "Honoring the depths" : "Finding your emotional center",
      avgValue,
      trend
    },
    sleep: {
      summary: `Average rest: ${avgValue.toFixed(1)}h`,
      insight: trend === "up" ? "Rest is deepening" : "Your body knows what it needs",
      avgValue,
      trend
    },
    wallet: {
      summary: "Energetic currency",
      insight: "Every interaction builds your consciousness wealth",
      avgValue,
      trend
    }
  };

  return insights[layerType] || insights.mood;
};

// Scale-specific insight generators
const generateDayInsight = (layerType: string, data: any) => {
  if (!Array.isArray(data) || data.length === 0) return "No hourly data available today";
  
  switch (layerType) {
    case 'weather':
      const temps = data.map(d => d.temperature || 0).filter(t => t > 0);
      const conditions = data.map(d => d.condition).filter(Boolean);
      return `Temperature range: ${Math.min(...temps)}°-${Math.max(...temps)}°C. Conditions: ${conditions.slice(0, 3).join(', ')}`;
    case 'sleep':
      const totalHours = data.reduce((sum, d) => sum + (d.durationHours || 0), 0);
      return `${totalHours.toFixed(1)} hours of rest across ${data.length} sleep sessions`;
    case 'mobility':
      const steps = data.reduce((sum, d) => sum + (d.steps || 0), 0);
      return `${steps.toLocaleString()} steps taken with ${data.length} activity periods`;
    default:
      return `${data.length} data points tracked throughout the day`;
  }
};

const generateWeekInsight = (layerType: string, data: any) => {
  if (!Array.isArray(data) || data.length === 0) return "Insufficient weekly data";
  
  const weeklyAvg = data.reduce((sum, d) => sum + (d.value || d.intensity || 0), 0) / data.length;
  
  switch (layerType) {
    case 'weather':
      return `Weekly average: ${weeklyAvg.toFixed(1)}°C. Your body's rhythm follows atmospheric patterns`;
    case 'sleep':
      return `Average nightly rest: ${weeklyAvg.toFixed(1)} hours. Your sleep cycle shows natural weekly rhythms`;
    case 'mobility':
      return `Weekly activity average: ${weeklyAvg.toFixed(1)}. Movement patterns reveal your body's weekly wisdom`;
    case 'mood':
      return `Emotional flow: ${(weeklyAvg * 100).toFixed(0)}% baseline. Your heart's weekly journey unfolds`;
    default:
      return `7-day pattern shows ${weeklyAvg.toFixed(1)} average with natural weekly cycles`;
  }
};

const generateMonthInsight = (layerType: string, data: any) => {
  if (!Array.isArray(data) || data.length === 0) return "Monthly patterns emerging";
  
  const monthlyTrend = data.length >= 4 ? "establishing patterns" : "beginning to emerge";
  
  switch (layerType) {
    case 'weather':
      return `Monthly atmospheric dance influences your entire being. Seasonal shifts create deeper body wisdom`;
    case 'sleep':
      return `30-day sleep evolution shows your body's natural lunar rhythms and recovery cycles`;
    case 'mobility':
      return `Monthly movement reveals seasonal body intelligence and activity flow patterns`;
    case 'mood':
      return `Emotional tides flow in monthly cycles, showing the deeper currents of your inner life`;
    default:
      return `Monthly patterns ${monthlyTrend} - your life's natural 30-day rhythms becoming visible`;
  }
};

const generateYearInsight = (layerType: string, data: any) => {
  if (!Array.isArray(data) || data.length === 0) return "Yearly wisdom unfolding";
  
  switch (layerType) {
    case 'weather':
      return `Seasonal attunement across 365 days - your body dances with Earth's yearly breath`;
    case 'sleep':
      return `Annual rest evolution - from winter's deep hibernation to summer's lighter rhythms`;
    case 'mobility':
      return `Yearly movement spiral - seasonal activity patterns reflecting nature's yearly cycles`;
    case 'mood':
      return `365-day emotional journey - the full spectrum of your heart's yearly evolution`;
    default:
      return `Annual life spiral completing - the sacred geometry of your yearly becoming`;
  }
};

const getDefaultInsight = (layerType: string, data: any) => {
  if (!Array.isArray(data) || data.length === 0) return "No data patterns detected yet";
  return `${data.length} ${layerType} entries revealing the hidden patterns of your daily rhythm`;
};

const MiniSparkline: React.FC<{ data: any[]; color: string; width: number; height: number }> = ({ 
  data, color, width, height 
}) => {
  if (!data || data.length === 0) return null;

  const values = data.map(item => item.value || item.intensity || 0);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="mini-sparkline">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.8}
      />
      {/* Data points */}
      {values.map((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
};

export const LayerPopOutPanel: React.FC<LayerPopOutPanelProps> = ({
  isOpen,
  onClose,
  layerType,
  layerData,
  position,
  timeRange,
  currentTimeScale = 'day',
  theme
}) => {
  const { zoomLevel } = useTimeAxis();
  const IconComponent = getLayerIcon(layerType);
  const layerColor = getLayerColor(layerType, theme);
  const insight = generateLayerInsight(layerType, layerData);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed z-50 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl"
            style={{
              left: Math.min(position.x + 20, window.innerWidth - 320),
              top: Math.max(position.y - 100, 20),
              width: '300px',
              borderColor: layerColor
            }}
            initial={{ 
              opacity: 0,
              scale: 0.9,
              x: -20
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.9,
              x: -20
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconComponent 
                  size={18} 
                  style={{ color: layerColor }}
                />
                <h3 
                  className="font-medium text-lg capitalize"
                  style={{ color: layerColor }}
                >
                  {layerType}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Time Range */}
            <div className="text-white/60 text-sm mb-3">
              {timeRange}
            </div>

            {/* Mini Graph */}
            {layerData && layerData.length > 0 && (
              <div className="mb-3 p-2 bg-white/5 rounded-lg">
                <MiniSparkline 
                  data={layerData}
                  color={layerColor}
                  width={260}
                  height={40}
                />
              </div>
            )}

            {/* Data Summary */}
            <div className="text-white/90 text-sm mb-2">
              {insight.summary}
            </div>

            {/* Insight */}
            <div 
              className="text-sm italic mb-3 p-2 rounded-lg bg-white/5"
              style={{ color: layerColor, opacity: 0.9 }}
            >
              "{insight.insight}"
            </div>

            {/* Trend Indicator */}
            {insight.trend !== "neutral" && (
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className={`w-2 h-2 rounded-full ${
                  insight.trend === "up" ? "bg-green-400" : 
                  insight.trend === "down" ? "bg-yellow-400" : 
                  "bg-gray-400"
                }`} />
                <span>
                  {insight.trend === "up" ? "Trending upward" : 
                   insight.trend === "down" ? "Trending downward" : 
                   "Steady pattern"}
                </span>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <button 
                className="text-sm text-white/70 hover:text-white/90 transition-colors"
                onClick={() => {
                  // Future integration with Memory Lane or deeper exploration
                  console.log(`Exploring ${layerType} in depth...`);
                }}
              >
                Explore in Memory Lane →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};