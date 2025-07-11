/**
 * Interactive Data Point Components
 * Smart, hoverable elements for each layer type
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

interface InteractiveDataPointProps {
  x: number;
  y: number;
  color: string;
  size: number;
  data: any;
  layerType: "mood" | "places" | "mobility" | "plans" | "weather" | "moon";
  onHover: (tooltipData: any) => void;
  onLeave: () => void;
}

export const InteractiveDataPoint: React.FC<InteractiveDataPointProps> = ({
  x,
  y,
  color,
  size,
  data,
  layerType,
  onHover,
  onLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTooltipData = () => {
    switch (layerType) {
      case "mood":
        return {
          title: data.emotion?.toUpperCase() || "MOOD",
          value: `${Math.round((data.valence || 0) * 100)}% positive`,
          emoji: data.emotion === "joy" ? "😊" : data.emotion === "calm" ? "😌" : "🎯",
          description: `Energy: ${data.energy ? Math.round(data.energy * 100) : 0}%`,
          x,
          y,
        };
      
      case "places":
        return {
          title: data.location?.toUpperCase() || "LOCATION",
          value: `${data.duration || 0}h spent`,
          emoji: data.location === "home" ? "🏠" : data.location === "work" ? "🏢" : "📍",
          x,
          y,
        };
      
      case "mobility":
        return {
          title: data.activity?.toUpperCase() || "ACTIVITY",
          value: `${data.distance || 0}m distance`,
          emoji: data.activity === "walk" ? "🚶" : data.activity === "run" ? "🏃" : "🚴",
          description: `Intensity: ${data.intensity ? Math.round(data.intensity * 100) : 0}%`,
          x,
          y,
        };
      
      case "plans":
        return {
          title: data.event?.toUpperCase() || "EVENT",
          value: `Priority: ${data.priority ? Math.round(data.priority * 100) : 0}%`,
          emoji: data.event === "meeting" ? "🤝" : data.event === "workout" ? "💪" : "📅",
          x,
          y,
        };
      
      case "weather":
        return {
          title: "WEATHER",
          value: `${data.temp || 0}°C`,
          emoji: "🌤️",
          description: `Clouds: ${data.clouds ? Math.round(data.clouds * 100) : 0}%`,
          x,
          y,
        };
      
      case "moon":
        return {
          title: "MOON PHASE",
          value: data.phase?.toUpperCase() || "UNKNOWN",
          emoji: "🌙",
          description: `Luminosity: ${data.luminosity ? Math.round(data.luminosity * 100) : 0}%`,
          x,
          y,
        };
      
      default:
        return null;
    }
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsHovered(true);
    const tooltipData = getTooltipData();
    if (tooltipData) {
      // Use screen coordinates for tooltip positioning
      const rect = (event.target as SVGElement).getBoundingClientRect();
      onHover({
        ...tooltipData,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave();
  };

  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      style={{
        filter: isHovered 
          ? `drop-shadow(0 0 12px ${color}80)` 
          : `drop-shadow(0 0 6px ${color}50)`,
        cursor: "pointer",
      }}
      animate={{
        scale: isHovered ? 1.2 : 1,
        opacity: isHovered ? 1 : 0.85,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.2,
      }}
      whileTap={{
        scale: 0.95,
      }}
    />
  );
};