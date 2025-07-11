/**
 * CameraView.tsx – Radial Layer Architecture View
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RadialLayerSystem } from "@/components/mandala/RadialLayerSystem";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { SettingsPanel } from "@/components/settings-panel";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CameraViewProps {
  zoomLevel?: "year" | "month" | "week" | "day" | "hour";
}

const createLayerData = () => [
  {
    name: "Moon",
    data: [{ phase: "waxing", luminosity: 0.7 }],
    color: "hsl(240, 30%, 70%)",
    radius: 250
  },
  {
    name: "Weather",
    data: [{ temp: 22, clouds: 0.3, wind: 0.5 }],
    color: "hsl(200, 60%, 60%)",
    radius: 210
  },
  {
    name: "Plans",
    data: [
      { event: "meeting", priority: 0.8 },
      { event: "workout", priority: 0.6 }
    ],
    color: "hsl(280, 50%, 65%)",
    radius: 170
  },
  {
    name: "Mobility",
    data: [
      { activity: "walk", intensity: 0.4, distance: 30 },
      { activity: "run", intensity: 0.8, distance: 70 },
      { activity: "bike", intensity: 0.6, distance: 120 }
    ],
    color: "hsl(120, 60%, 55%)",
    radius: 130
  },
  {
    name: "Places",
    data: [
      { location: "home", duration: 8 },
      { location: "work", duration: 9 }
    ],
    color: "hsl(30, 70%, 60%)",
    radius: 90
  },
  {
    name: "Mood",
    data: [
      { emotion: "joy", valence: 0.8, energy: 0.6 },
      { emotion: "calm", valence: 0.3, energy: 0.3 },
      { emotion: "focus", valence: 0.1, energy: 0.5 }
    ],
    color: "hsl(340, 80%, 65%)",
    radius: 60
  }
];

export const CameraView: React.FC<CameraViewProps> = ({ 
  zoomLevel: initialZoomLevel = "month" 
}) => {
  const [currentZoomLevel, setCurrentZoomLevel] = useState(initialZoomLevel);
  const [reflectiveMode, setReflectiveMode] = useState(false);
  const [poetryMode, setPoetryMode] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showTideRings, setShowTideRings] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  
  const layerData = createLayerData();

  // Zoom scaling behavior for camera-like experience
  const zoomLevelScaleMap = {
    year: 0.4,
    month: 0.7,
    week: 1.0,
    day: 1.3,
    hour: 1.6
  };

  // Zoom level progression
  const zoomLevels: Array<"year" | "month" | "week" | "day" | "hour"> = 
    ["year", "month", "week", "day", "hour"];

  const currentZoomIndex = zoomLevels.indexOf(currentZoomLevel);
  const currentScale = zoomLevelScaleMap[currentZoomLevel];
  const zoomPercentage = Math.round(currentScale * 100);

  // Zoom controls
  const zoomIn = () => {
    const nextIndex = Math.min(currentZoomIndex + 1, zoomLevels.length - 1);
    setCurrentZoomLevel(zoomLevels[nextIndex]);
  };

  const zoomOut = () => {
    const nextIndex = Math.max(currentZoomIndex - 1, 0);
    setCurrentZoomLevel(zoomLevels[nextIndex]);
  };

  const resetZoom = () => {
    setCurrentZoomLevel("month");
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '=' || event.key === '+') {
        zoomIn();
        event.preventDefault();
      } else if (event.key === '-') {
        zoomOut();
        event.preventDefault();
      } else if (event.key === '0') {
        resetZoom();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentZoomIndex]);

  // Mouse wheel zoom
  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-background relative">
      {/* View Switcher Navigation */}
      <ViewSwitcher 
        onTimeScaleChange={(scale) => setCurrentZoomLevel(scale)}
        className="fixed top-4 left-4 z-50"
      />

      {/* Zoom Controls */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm font-medium text-center mb-2">
          {currentZoomLevel.toUpperCase()} - {zoomPercentage}%
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={currentZoomIndex >= zoomLevels.length - 1}
            className="p-2"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            className="p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={currentZoomIndex <= 0}
            className="p-2"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center">
          Use +/- keys or scroll
        </div>
      </div>

      {/* Camera Viewport */}
      <motion.svg
        viewBox="-300 -300 600 600"
        width="80%"
        height="80%"
        className="max-w-4xl max-h-screen cursor-crosshair"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        onWheel={handleWheel}
      >
        {/* Camera lens zoom scaling */}
        <motion.g
          animate={{ 
            scale: currentScale,
            rotate: 0 
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 120,
            damping: 20
          }}
        >
          <RadialLayerSystem
            layers={layerData}
            currentZoom={currentZoomLevel}
            centerRadius={40}
            layerSpacing={50}
          />
        </motion.g>
      </motion.svg>

      {/* Settings Panel */}
      <SettingsPanel
        reflectiveMode={reflectiveMode}
        poetryMode={poetryMode}
        showFriends={showFriends}
        showInsights={showInsights}
        showPlayback={showPlayback}
        showTideRings={showTideRings}
        showAIInsights={showAIInsights}
        onReflectiveModeChange={setReflectiveMode}
        onPoetryModeChange={setPoetryMode}
        onShowFriendsChange={setShowFriends}
        onShowInsightsChange={setShowInsights}
        onShowPlaybackChange={setShowPlayback}
        onShowTideRingsChange={setShowTideRings}
        onShowAIInsightsChange={setShowAIInsights}
      />
    </div>
  );
};