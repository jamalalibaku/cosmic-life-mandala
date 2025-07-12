/**
 * Interactive Data Point Components
 * Enhanced with depth, gloss, and magical visual effects
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useDateNavigation } from "@/contexts/DateNavigationContext";

interface InteractiveDataPointProps {
  x: number;
  y: number;
  color: string;
  size: number;
  data: any;
  layerType: "mood" | "places" | "mobility" | "plans" | "weather" | "moon" | "sleep";
  onHover: (tooltipData: any) => void;
  onLeave: () => void;
  onClick: (expandedData: any, burstData: any) => void;
  date?: Date; // Real calendar date for this data point
  isWeek?: boolean; // Whether this represents a week that can be drilled down
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
  onClick,
  date,
  isWeek = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { navigateToWeek, navigateToDay, zoomLevel } = useDateNavigation();

  const getDataPointColor = () => {
    // Enhanced color processing for better visual depth
    const hsl = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hsl) {
      const [, h, s, l] = hsl;
      return `hsl(${h}, ${Math.min(100, parseInt(s) + 10)}, ${Math.min(90, parseInt(l) + 5)})`;
    }
    return color;
  };

  const getEmojiBurst = () => {
    switch (layerType) {
      case "mood":
        if (data.emotion === "joy") return ["🎉", "😊", "☀️", "✨", "🌟"];
        if (data.emotion === "calm") return ["😌", "🌙", "💙", "🕊️", "🌸"];
        if (data.emotion === "focus") return ["🎯", "⚡", "🔥", "💪", "🧠"];
        return ["💫", "🌈", "✨"];
      
      case "places":
        if (data.location === "home") return ["🏠", "❤️", "🛋️", "☕", "🌿"];
        if (data.location === "work") return ["💼", "🏢", "📊", "💡", "⚡"];
        if (data.location === "cafe") return ["☕", "📚", "🍰", "☀️", "🌱"];
        return ["📍", "🗺️", "✨"];
      
      case "mobility":
        if (data.activity === "walk") return ["🚶", "🌿", "🌞", "🍃", "💚"];
        if (data.activity === "run") return ["🏃", "💨", "🔥", "💪", "⚡"];
        if (data.activity === "bike") return ["🚴", "🌬️", "🗺️", "🌟", "🚀"];
        return ["🏃", "💨", "✨"];
      
      case "plans":
        if (data.event === "meeting") return ["🤝", "💼", "📝", "🎯", "💡"];
        if (data.event === "workout") return ["💪", "🔥", "🏋️", "⚡", "💦"];
        if (data.event === "dinner") return ["🍽️", "👥", "🥂", "🌟", "❤️"];
        return ["📅", "⭐", "✨"];
      
      case "weather":
        return ["🌤️", "☀️", "🌈", "💨", "🌿"];
      
      case "moon":
        return ["🌙", "✨", "🌟", "💫", "🌌"];
      
      case "sleep":
        if (data.quality === "deep") return ["😴", "🌙", "💤", "🛌", "💙"];
        if (data.quality === "light") return ["😌", "🌸", "☁️", "✨", "💫"];
        if (data.quality === "rem") return ["🌈", "💭", "🎭", "🌟", "✨"];
        return ["💤", "🌙", "😴"];
      
      default:
        return ["✨", "💫", "🌟"];
    }
  };

  const getExpandedData = () => {
    const formattedDate = date ? format(date, "EEEE, MMMM d, yyyy") : new Date().toLocaleTimeString();
    
    return {
      id: `${layerType}-${Date.now()}`,
      layerType,
      title: isWeek ? `WEEK VIEW` : layerType.toUpperCase(),
      subtitle: isWeek ? (date ? format(date, "MMM d") + " - Week" : "Week View") : getSubtitle(),
      emoji: getMainEmoji(),
      data,
      timestamp: formattedDate,
      position: { x, y },
      isWeek,
      date,
    };
  };

  const getSubtitle = () => {
    switch (layerType) {
      case "mood": return data.emotion?.charAt(0).toUpperCase() + data.emotion?.slice(1);
      case "places": return data.location?.charAt(0).toUpperCase() + data.location?.slice(1);
      case "mobility": return data.activity?.charAt(0).toUpperCase() + data.activity?.slice(1);
      case "plans": return data.event?.charAt(0).toUpperCase() + data.event?.slice(1);
      case "weather": return "Current Conditions";
      case "moon": return data.phase?.charAt(0).toUpperCase() + data.phase?.slice(1);
      case "sleep": return data.quality?.charAt(0).toUpperCase() + data.quality?.slice(1) || "Sleep Session";
      default: return "";
    }
  };

  const getMainEmoji = () => {
    switch (layerType) {
      case "mood":
        if (data.emotion === "joy") return "😊";
        if (data.emotion === "calm") return "😌";
        if (data.emotion === "focus") return "🎯";
        return "💫";
      case "places":
        if (data.location === "home") return "🏠";
        if (data.location === "work") return "🏢";
        if (data.location === "cafe") return "☕";
        return "📍";
      case "mobility":
        if (data.activity === "walk") return "🚶";
        if (data.activity === "run") return "🏃";
        if (data.activity === "bike") return "🚴";
        return "🏃";
      case "plans":
        if (data.event === "meeting") return "🤝";
        if (data.event === "workout") return "💪";
        if (data.event === "dinner") return "🍽️";
        return "📅";
      case "weather": return "🌤️";
      case "moon": return "🌙";
      case "sleep":
        if (data.quality === "deep") return "😴";
        if (data.quality === "light") return "😌";
        if (data.quality === "rem") return "💭";
        return "💤";
      default: return "✨";
    }
  };

  const getTooltipData = () => {
    const baseTooltip = {
      x,
      y,
    };

    // Add date information if available
    const dateInfo = date ? format(date, "MMM d, yyyy") : "";
    const weekInfo = isWeek ? " (Click to view week)" : "";
    const dayInfo = !isWeek && zoomLevel === "week" ? " (Click to view day)" : "";

    switch (layerType) {
      case "mood":
        return {
          ...baseTooltip,
          title: `MOOD${weekInfo || dayInfo}`,
          value: data.emotion ? `${data.emotion.toUpperCase()} · ${Math.round((data.valence || 0) * 100)}%` : "No mood data",
          emoji: data.emotion === "joy" ? "😊" : data.emotion === "calm" ? "😌" : "🎯",
          description: dateInfo + (data.energy ? ` · Energy: ${Math.round(data.energy * 100)}%` : ""),
        };
      case "places":
        return {
          ...baseTooltip,
          title: `PLACES${weekInfo || dayInfo}`,
          value: data.location ? `${data.location.toUpperCase()} · ${data.duration || 0}h` : "No location data",
          emoji: data.location === "home" ? "🏠" : data.location === "work" ? "🏢" : "📍",
          description: dateInfo,
        };
      
      case "mobility":
        return {
          ...baseTooltip,
          title: `MOBILITY${weekInfo || dayInfo}`,
          value: data.activity ? `${data.activity.toUpperCase()} · ${(data.distance || 0)}m` : "No activity data",
          emoji: data.activity === "walk" ? "🚶" : data.activity === "run" ? "🏃" : "🚴",
          description: dateInfo + (data.intensity ? ` · Intensity: ${Math.round(data.intensity * 100)}%` : ""),
        };
      
      case "plans":
        return {
          ...baseTooltip,
          title: `PLANS${weekInfo || dayInfo}`,
          value: data.event ? `${data.event.toUpperCase()}` : "No plans",
          emoji: data.event === "meeting" ? "🤝" : data.event === "workout" ? "💪" : "📅",
          description: dateInfo + (data.priority ? ` · Priority: ${Math.round(data.priority * 100)}%` : ""),
        };
      
      case "weather":
        return {
          ...baseTooltip,
          title: `WEATHER${weekInfo || dayInfo}`,
          value: `${data.temp || 0}°C`,
          emoji: "🌤️",
          description: dateInfo + (data.clouds ? ` · Clouds: ${Math.round(data.clouds * 100)}%` : ""),
        };
      
      case "moon":
        return {
          ...baseTooltip,
          title: `MOON${weekInfo || dayInfo}`,
          value: data.phase?.toUpperCase() || "UNKNOWN",
          emoji: "🌙",
          description: dateInfo + (data.luminosity ? ` · ${Math.round(data.luminosity * 100)}% visible` : ""),
        };
      
      case "sleep":
        return {
          ...baseTooltip,
          title: `SLEEP${weekInfo || dayInfo}`,
          value: data.quality ? `${data.quality.toUpperCase()} · ${data.durationHours ? `${Math.round(data.durationHours * 60)}min` : '0min'}` : "No sleep data",
          emoji: data.quality === "deep" ? "😴" : data.quality === "light" ? "😌" : data.quality === "rem" ? "💭" : "💤",
          description: dateInfo + (data.intensity ? ` · Quality: ${Math.round(data.intensity * 100)}%` : ""),
        };
      
      default:
        return {
          ...baseTooltip,
          title: "DATA",
          value: dateInfo || "No data",
          emoji: "✨",
        };
    }
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    setIsHovered(true);
    const tooltipData = getTooltipData();
    if (tooltipData) {
      // Use screen coordinates for tooltip positioning and enhanced data for insight shield
      const rect = (event.target as SVGElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const centerY = rect.top + rect.height / 2 + window.scrollY;
      
      // Enhanced tooltip data for insight shield
      const enhancedTooltipData = {
        title: tooltipData.title.replace(' (Click to view week)', '').replace(' (Click to view day)', ''),
        value: tooltipData.value,
        timestamp: date ? format(date, "MMM d, yyyy 'at' HH:mm") : new Date().toLocaleString(),
        layerType,
        intensity: typeof data.intensity === 'number' ? data.intensity : 
                  typeof data.energy === 'number' ? data.energy :
                  typeof data.valence === 'number' ? data.valence : 0.5,
        x: centerX,
        y: centerY,
        dataPoint: data
      };
      
      onHover(enhancedTooltipData);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // If this is a week and we're in month view, drill down to week
    if (isWeek && zoomLevel === "month" && date) {
      navigateToWeek(date);
      return;
    }
    
    // If this is a day and we're in week view, drill down to day
    if (!isWeek && zoomLevel === "week" && date) {
      navigateToDay(date);
      return;
    }
    
    // Otherwise, show expanded card
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const screenX = rect.left + window.scrollX + rect.width / 2;
    const screenY = rect.top + window.scrollY + rect.height / 2;
    
    const expandedData = getExpandedData();
    expandedData.position = { x: screenX, y: screenY };
    
    const burstData = {
      emojis: getEmojiBurst(),
      position: { x: screenX, y: screenY },
    };
    
    onClick(expandedData, burstData);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave();
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Gradient definitions for gloss effect */}
      <defs>
        <radialGradient id={`dataPointGradient-${layerType}`} cx="30%" cy="30%">
          <stop offset="0%" stopColor={`${getDataPointColor()}FF`} />
          <stop offset="60%" stopColor={getDataPointColor()} />
          <stop offset="100%" stopColor={`${getDataPointColor()}CC`} />
        </radialGradient>
      </defs>

      {/* Depth shadow */}
      <motion.circle
        cx={x + 1}
        cy={y + 2}
        r={size}
        fill="rgba(0,0,0,0.15)"
        opacity={0.6}
        animate={{ 
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.3 : 0.6
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Main data point with gloss effect */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={`url(#dataPointGradient-${layerType})`}
        stroke={`${getDataPointColor()}CC`}
        strokeWidth={0.8}
        opacity={0.9}
        style={{
          filter: `drop-shadow(0 0 6px ${getDataPointColor()}60)`,
          cursor: "pointer"
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 1 : 0.9,
          r: isHovered ? size * 1.2 : size
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{
          scale: 1.6,
          opacity: 1,
          strokeWidth: 1.2
        }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      
      {/* Highlight reflection */}
      <motion.circle
        cx={x - size * 0.3}
        cy={y - size * 0.3}
        r={size * 0.4}
        fill="rgba(255,255,255,0.6)"
        opacity={0.7}
        animate={{ 
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.9 : 0.7
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.g>
  );
};
