/**
 * Interactive Data Point Components
 * Smart, hoverable elements for each layer type
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
  layerType: "mood" | "places" | "mobility" | "plans" | "weather" | "moon";
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
      // Use screen coordinates for tooltip positioning
      const rect = (event.target as SVGElement).getBoundingClientRect();
      onHover({
        ...tooltipData,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });
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
      onClick={handleClick}
      whileHover={{
        scale: 1.2,
      }}
      whileTap={{
        scale: 0.9,
      }}
    />
  );
};