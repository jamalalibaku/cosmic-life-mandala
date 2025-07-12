/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 * Phase 28 – Live Visual Composition with Breathing, Sleep Animation, and Time Rotation
 */

import React from "react";
import { motion } from "framer-motion";
import { RadialLayerSystem } from "@/components/mandala/RadialLayerSystem";
import { EnvironmentalLayer } from "@/components/layers/EnvironmentalLayer";
import { DateNavigationProvider, useDateNavigation } from "@/contexts/DateNavigationContext";
import { useTimeAxis } from "@/contexts/TimeAxisContext";
import { generateRealDateData, getWeekData, getDayData, type DateBasedData } from "@/utils/real-date-data";
import { mockEnvironmentalData } from "@/data/mock-environmental-data";
import { format, startOfWeek, eachWeekOfInterval, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import mandalaExpressiveTheme from "@/themes/mandala-expressive";
import { usePerformanceOptimizer } from "@/hooks/usePerformanceOptimizer";
import { CosmicFaderTrack } from "@/components/navigation/CosmicFaderTrack";
import { RadioooLayerTabs } from "@/components/navigation/RadioooLayerTabs";
import { AIInsightOrbiter } from "@/components/insights/AIInsightOrbiter";
import { AtmosphericAuroraLayer, useAuroraEvents } from "@/components/layers/AtmosphericAuroraLayer";
import { useEmotionalIntelligence } from "@/hooks/useEmotionalIntelligence";
import { useMemoryPatterns } from "@/hooks/useMemoryPatterns";
import { useSeasonalAwareness } from "@/hooks/useSeasonalAwareness";
import { useMicroInteractions } from "@/hooks/useMicroInteractions";
import { useSoundDesign } from "@/hooks/useSoundDesign";

// Real date-based layer data generator
const createDateBasedLayerData = (
  dateData: DateBasedData[], 
  zoomLevel: "year" | "month" | "week" | "day" | "hour",
  currentDate: Date
) => {
  // Get data based on zoom level
  let relevantData: DateBasedData[] = [];
  let isWeekView = false;
  
  switch (zoomLevel) {
    case "month":
      // Show weeks in the current month
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
      
      // Create week-aggregated data
      relevantData = weeks.map(weekStart => {
        const weekData = getWeekData(dateData, weekStart);
        const weekMood = weekData.reduce((acc, day) => {
          if (day.mood) {
            acc.valence += day.mood.valence;
            acc.energy += day.mood.energy;
            acc.count++;
          }
          return acc;
        }, { valence: 0, energy: 0, count: 0 });
        
        return {
          date: weekStart,
          dayOfWeek: weekStart.getDay(),
          weekNumber: 0,
          mood: weekMood.count > 0 ? {
            emotion: weekMood.valence / weekMood.count > 0.6 ? "joy" : "calm",
            valence: weekMood.valence / weekMood.count,
            energy: weekMood.energy / weekMood.count,
          } : undefined,
          // Aggregate other data types...
          places: weekData.flatMap(d => d.places || []).slice(0, 3),
          mobility: weekData.flatMap(d => d.mobility || []).slice(0, 2),
          plans: weekData.flatMap(d => d.plans || []).slice(0, 3),
          weather: weekData[0]?.weather, // Use first day's weather as representative
          moon: weekData[0]?.moon,
        } as DateBasedData;
      });
      isWeekView = true;
      break;
      
    case "week":
      // Show individual days in the current week
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      relevantData = days.map(day => {
        const dayData = getDayData(dateData, day);
        return dayData || {
          date: day,
          dayOfWeek: day.getDay(),
          weekNumber: 0,
        } as DateBasedData;
      });
      break;
      
    case "day":
      // Show detailed view of single day
      const dayData = getDayData(dateData, currentDate);
      relevantData = dayData ? [dayData] : [];
      break;
      
    default:
      // Month view as fallback
      relevantData = dateData.slice(-30);
      break;
  }

  // Convert to layer format
  return [
    {
      name: "Moon",
      data: relevantData.filter(d => d.moon).map(d => ({ ...d.moon, date: d.date })),
      color: "hsl(240, 25%, 65%)",
      radius: 260,
      layerType: "moon" as const,
      isWeek: isWeekView
    },
    {
      name: "Plans",
      data: relevantData.flatMap(d => (d.plans || []).map(p => ({ ...p, date: d.date }))),
      color: "hsl(260, 25%, 70%)",
      radius: 220,
      layerType: "plans" as const,
      isWeek: isWeekView
    },
    {
      name: "Weather", 
      data: relevantData.filter(d => d.weather).map(d => ({ ...d.weather, date: d.date })),
      color: "hsl(200, 30%, 60%)",
      radius: 180,
      layerType: "weather" as const,
      isWeek: isWeekView
    },
    {
      name: "Mobility",
      data: relevantData.flatMap(d => (d.mobility || []).map(m => ({ ...m, date: d.date }))),
      color: "hsl(140, 25%, 65%)",
      radius: 140,
      layerType: "mobility" as const,
      isWeek: isWeekView
    },
    {
      name: "Places",
      data: relevantData.flatMap(d => (d.places || []).map(p => ({ ...p, date: d.date }))),
      color: "hsl(30, 30%, 70%)",
      radius: 100,
      layerType: "places" as const,
      isWeek: isWeekView
    },
    {
      name: "Mood",
      data: relevantData.filter(d => d.mood).map(d => ({ ...d.mood, date: d.date })),
      color: "hsl(340, 30%, 70%)",
      radius: 70,
      layerType: "mood" as const,
      isWeek: isWeekView
    }
  ];
};

const getCurrentTimeAngle = (): number => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  return -(totalMinutes / 1440) * 360; // rotate counter-clockwise to keep NOW at top
};

const MandalaViewContent = () => {
  const { currentDate, zoomLevel, getDisplayTitle } = useDateNavigation();
  const { timeSlices, nowAngle } = useTimeAxis();
  const rotationAngle = getCurrentTimeAngle();
  const [showEnvironmental, setShowEnvironmental] = React.useState(true);
  const { events, triggerInsightDiscovery, triggerMilestone, triggerCorrelation } = useAuroraEvents();
  
  // Enhanced intelligence systems
  const dateData = React.useMemo(() => generateRealDateData(), []);
  const { emotionalState, getBreathingParams, getMoodColors, getIntensityModifiers } = useEmotionalIntelligence(
    dateData.filter(d => d.mood).map(d => ({ ...d.mood!, timestamp: d.date.getTime() }))
  );
  const { detectedPatterns, getMemoryEchoes } = useMemoryPatterns(dateData);
  const { currentPalette, getCSSVariables, getSeasonalAnimations, getWeatherEffects } = useSeasonalAwareness(
    dateData[0]?.weather ? { 
      temperature: 20, 
      condition: dateData[0].weather.conditions, 
      humidity: 60, 
      season: 'spring' 
    } : undefined
  );
  const { 
    hoverState, 
    handleElementHover, 
    handleElementLeave, 
    getConnectionLines 
  } = useMicroInteractions();
  const { 
    playInsightSound, 
    playTransitionSound, 
    playConnectionSound, 
    playMilestoneSound 
  } = useSoundDesign();
  
  // Performance optimization for smooth animations
  const { scheduleAnimation, createSmoothEasing, getPerformanceMetrics } = usePerformanceOptimizer({
    batchSize: 4,
    staggerDelay: 80,
    throttleMs: 16,
    maxConcurrent: 10
  });
  
  const layerData = React.useMemo(() => 
    createDateBasedLayerData(dateData, zoomLevel, currentDate), 
    [dateData, zoomLevel, currentDate]
  );

  // Enhanced breathing parameters based on emotional state
  const breathingParams = getBreathingParams();
  const moodColors = getMoodColors();
  const intensityModifiers = getIntensityModifiers();
  const seasonalAnimations = getSeasonalAnimations();
  const weatherEffects = getWeatherEffects();
  const memoryEchoes = getMemoryEchoes(currentDate);

  // Sound triggers for meaningful moments
  React.useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1];
      switch (latestEvent.type) {
        case 'insight-discovery':
          playInsightSound(latestEvent.intensity);
          break;
        case 'phase-transition':
          playTransitionSound(latestEvent.intensity);
          break;
        case 'milestone-reached':
          playMilestoneSound(latestEvent.intensity);
          break;
        case 'correlation-found':
          playConnectionSound(undefined, latestEvent.intensity);
          break;
      }
    }
  }, [events, playInsightSound, playTransitionSound, playMilestoneSound, playConnectionSound]);

  console.log('⏰ MandalaView rendering with:', {
    zoomLevel,
    layerCount: layerData.length,
    timeSliceCount: timeSlices.length,
    nowAngle,
    emotionalState: emotionalState.currentMood.emotion,
    detectedPatterns: detectedPatterns.length,
    memoryEchoes: memoryEchoes.length,
    timestamp: new Date().toLocaleTimeString()
  });

  return (
    <div 
      className="w-full h-full min-h-screen flex flex-col relative overflow-hidden"
      style={getCSSVariables() as React.CSSProperties}
    >
      {/* Cosmic Fader Navigation */}
      <CosmicFaderTrack />
      
      {/* Radiooooo Layer Tabs */}
      <RadioooLayerTabs 
        onLayerToggle={(layerId, active) => {
          console.log(`Layer ${layerId} toggled to:`, active);
          if (active) playConnectionSound();
        }}
        onLayerSelect={(layerId) => {
          console.log(`Layer ${layerId} selected`);
          playInsightSound(0.3);
        }}
      />

      {/* Date Navigation Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
        <h2 className="text-white font-light text-lg tracking-wide text-center">
          {getDisplayTitle()}
        </h2>
      </div>

      {/* Enhanced Environmental Toggle with mood colors */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <motion.button
          onClick={() => {
            setShowEnvironmental(!showEnvironmental);
            playConnectionSound();
          }}
          className={`px-4 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300`}
          style={{
            backgroundColor: showEnvironmental ? moodColors.accent + '20' : 'rgba(0,0,0,0.4)',
            borderColor: showEnvironmental ? moodColors.accent + '40' : 'rgba(255,255,255,0.2)',
            color: showEnvironmental ? moodColors.accent : 'rgba(255,255,255,0.6)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🌿 Nature Connection
        </motion.button>
      </div>

      {/* Dynamic seasonal background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-radial from-background-subtle via-background to-background-vignette transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${currentPalette.atmosphere}30, ${currentPalette.background})`
          }}
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        {/* Expanded Canvas Container */}
        <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center">
          <motion.svg
            viewBox="-320 -320 640 640"
            width="100%"
            height="100%"
            className="relative z-10"
            style={{
              filter: "drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))",
              maxWidth: "min(95vw, 95vh)",
              maxHeight: "min(95vw, 95vh)"
            }}
            initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ 
              duration: 2.5, 
              ease: [0.175, 0.885, 0.32, 1.275], // Dramatic back-ease
              delay: 0.2
            }}
          >
            {/* Atmospheric Aurora Layer - Sacred sky celebrations */}
            <AtmosphericAuroraLayer 
              center={{ x: 0, y: 0 }}
              radius={150}
              events={events}
            />
            
            {/* Environmental Layer (beneath other layers) */}
            <EnvironmentalLayer 
              radius={320}
              center={{ x: 0, y: 0 }}
              environmentalData={mockEnvironmentalData}
              isVisible={showEnvironmental}
            />
            
            {/* Enhanced radial system with emotional breathing */}
            <motion.g
              animate={{ 
                rotate: rotationAngle,
                scale: [1, 1 + intensityModifiers.pulseStrength * 0.05, 1]
              }}
              transition={{ 
                rotate: {
                  type: "spring", 
                  stiffness: 20 * seasonalAnimations.flowSpeed,
                  damping: 30 * seasonalAnimations.gentleness,
                  mass: 1.5,
                  duration: 6 / seasonalAnimations.flowSpeed
                },
                scale: {
                  duration: breathingParams.duration,
                  repeat: Infinity,
                  ease: breathingParams.erratic ? "easeInOut" : "linear"
                }
              }}
              onHoverStart={(event) => {
                const rect = (event.target as SVGElement).getBoundingClientRect();
                handleElementHover('mandala-core', emotionalState, { x: rect.left, y: rect.top });
              }}
              onHoverEnd={handleElementLeave}
            >
              {/* Enhanced Radial Layer System with emotional intelligence */}
              <RadialLayerSystem 
                layers={layerData}
                currentZoom={zoomLevel}
                centerRadius={45}
                layerSpacing={60}
                showConstellations={false}
              />
            </motion.g>

            {/* Connection visualization for micro-interactions */}
            {hoverState.elementId && (
              <g>
                {getConnectionLines().map(line => (
                  <motion.path
                    key={line.id}
                    d={line.path}
                    stroke={moodColors.accent}
                    strokeWidth={line.strength * 2}
                    fill="none"
                    opacity={0.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </g>
            )}

            {/* AI Insight Satellite Orbiter - Enhanced with seasonal colors */}
            <AIInsightOrbiter 
              centerX={0}
              centerY={0}
              soulCoreRadius={45}
              quotes={[]}
            />

            {/* Curved Environmental Layer Label */}
            {showEnvironmental && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <defs>
                  <path
                    id="environmentalCurve"
                    d={`M ${-280 * Math.cos(Math.PI/6)} ${-280 * Math.sin(Math.PI/6)} 
                        A 280 280 0 0 1 ${280 * Math.cos(Math.PI/6)} ${-280 * Math.sin(Math.PI/6)}`}
                  />
                </defs>
                <text
                  fontSize="12"
                  fill="hsl(160, 60%, 70%)"
                  opacity={0.8}
                  fontWeight="300"
                  letterSpacing="3px"
                >
                  <textPath href="#environmentalCurve" startOffset="50%">
                    NATURE · CONNECTION · SENSORY · EXPERIENCE
                  </textPath>
                </text>
              </motion.g>
            )}
          </motion.svg>
          
          {/* Circular Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle at center, 
                  transparent 45%, 
                  hsla(var(--background) / 0.1) 60%, 
                  hsla(var(--background) / 0.3) 75%, 
                  hsla(var(--background) / 0.6) 85%, 
                  hsla(var(--background) / 0.9) 95%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MandalaView = () => {
  return (
    <DateNavigationProvider>
      <MandalaViewContent />
    </DateNavigationProvider>
  );
};