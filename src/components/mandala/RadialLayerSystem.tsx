/**
 * Radial Layer Architecture System
 * Hierarchical, concentric timeline structure for life dimensions
 * Enhanced with elegant interactions and tooltips
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OptimizedMotion, OptimizedSVGMotion, OptimizedPresence } from "@/components/ui/OptimizedMotion";
import { RadialTooltip } from "@/components/interactions/RadialTooltip";
import { InteractiveDataPoint } from "@/components/interactions/InteractiveDataPoint";
import { ExpandedCard } from "@/components/interactions/ExpandedCard";
import { EmojiBurst } from "@/components/interactions/EmojiBurst";
import { ClickableLayer } from "@/components/interactions/ClickableLayer";
import { ClickableSlice } from "@/components/interactions/ClickableSlice";
import { InfoPanelSystem, PanelData } from "@/components/interactions/InfoPanelSystem";
import { useUnifiedMotion } from "@/hooks/useUnifiedMotion";
import { HoverInsightShield } from "@/components/interactions/HoverInsightShield";
import { InsightTooltip } from "@/components/interactions/InsightTooltip";
import { useTimeAxis } from "@/contexts/TimeAxisContext";
import { ThemeOverlayManager } from "@/components/themes/ThemeOverlaySystem";
import { WindWhirlField } from "@/components/enhanced/WindWhirlField";
import { ThemeHaikuDisplay } from "@/components/themes/ThemeHaikuDisplay";
import { LayerDataAnimator } from "@/components/layers/LayerDataAnimator";
import { ThemeSunburst } from "@/components/themes/ThemeSunburst";
import { SupernovaBurst } from "@/components/SupernovaBurst";
import { analyzeMoodForSupernovas, SupernovaTrigger } from "@/utils/supernova-engine";
import { DebugSupernova } from "@/components/DebugSupernova";
import { useUltimateAnimationFlow } from "@/hooks/useUltimateAnimationFlow";
import { EnhancedPlansLayer } from "@/components/enhanced/EnhancedPlansLayer";
import { WaterFlowVisuals } from "@/components/enhanced/WaterFlowVisuals";
import { useVisualSkin } from "@/components/visual-skin-provider";
import { getThemeGeometry } from "@/utils/day4-dynamics";
import { SkyConnectedWeatherRing } from "@/components/enhanced/SkyConnectedWeatherRing";
import { KandinskyDataMarbles } from "@/components/enhanced/KandinskyDataMarbles";
import { RippleTrails } from "@/components/enhanced/RippleTrails";
import { CosmicBackgroundPulse } from "@/components/cosmic/CosmicBackgroundPulse";
import { CosmicRadialTicks } from "@/components/cosmic/CosmicRadialTicks";
import { MysticalSoulCore } from "@/components/enhanced/MysticalSoulCore";
import { NorthPoleMoon } from "@/components/enhanced/NorthPoleMoon";
import { SkyRing } from "@/components/enhanced/SkyRing";
import { AirLayer } from "@/components/atmosphere/AirLayer";
import { SunburstGrooveField } from "@/components/enhanced/SunburstGrooveField";
import { WindHairField } from "@/components/enhanced/WindHairField";
import { useZoomCompensation } from "@/hooks/useZoomCompensation";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";
import { findRecurringSlices, getConstellationColors } from "@/utils/constellation-engine";
import { ConstellationArcs } from "@/components/interactions/ConstellationArcs";
import { useOrganicOrbitMotion } from "@/hooks/useOrganicOrbitMotion";
import { FibrousRingLayer } from "@/components/layers/FibrousRingLayer";
import { AtmosphericAuroraLayer, useAuroraEvents } from "@/components/layers/AtmosphericAuroraLayer";

interface LayerData {
  name: string;
  data: any[];
  color: string;
  radius: number;
  zoomLevel?: "year" | "month" | "week" | "day" | "hour";
  layerType?: "mood" | "places" | "mobility" | "plans" | "weather" | "moon" | "sleep";
  isWeek?: boolean;
}

interface RadialLayerSystemProps {
  layers: LayerData[];
  currentZoom?: "year" | "month" | "week" | "day" | "hour";
  centerRadius?: number;
  layerSpacing?: number;
  showConstellations?: boolean;
}

const RingLabel: React.FC<{ name: string; radius: number; color: string }> = ({ 
  name, 
  radius, 
  color 
}) => {
  return (
    <motion.text
      x={0}
      y={-radius - 18}
      textAnchor="middle"
      fill={color}
      fontSize={10}
      fontWeight="300"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="0.05em"
      opacity={0.85}
      initial={{ opacity: 0, y: -radius - 25 }}
      animate={{ opacity: 0.85, y: -radius - 18 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {name.toUpperCase()}
    </motion.text>
  );
};

const Layer: React.FC<{ 
  name: string; 
  data: any[]; 
  radius: number; 
  color: string;
  zoomLevel: string;
  layerIndex: number;
  totalLayers: number;
  layerType?: "mood" | "places" | "mobility" | "plans" | "weather" | "moon" | "sleep";
  onTooltipShow: (tooltipData: any) => void;
  onTooltipHide: () => void;
  onDataPointClick: (expandedData: any, burstData: any) => void;
  layer: any; // Pass the full layer object to access isWeek property
}> = ({ name, data, radius, color, zoomLevel, layerIndex, totalLayers, layerType, onTooltipShow, onTooltipHide, onDataPointClick, layer }) => {
  
  // Get mood volatility from layer data for motion calculation
  const moodVolatility = layerType === 'mood' ? 
    (data.reduce((sum: number, point: any) => sum + (point.intensity || 0.5), 0) / data.length) : 0.5;
  
  const isNightTime = new Date().getHours() > 20 || new Date().getHours() < 6;
  
  const organicMotion = useOrganicOrbitMotion({
    layerType: layerType || 'mood',
    baseRadius: radius,
    dataPoints: data,
    moodVolatility,
    isNightTime
  });
  const getDetailLevel = () => {
    switch (zoomLevel) {
      case "year": return "outline";
      case "month": return "trends";
      case "week": return "segments";
      case "day": return "detail";
      case "hour": return "micro";
      default: return "outline";
    }
  };

  const detailLevel = getDetailLevel();

  return (
    <OptimizedSVGMotion
      priority="high"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.1 * (totalLayers - layerIndex), ease: "easeOut" }}
    >
      {/* Ring shadow */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        stroke="none"
        fill="none"
        style={{
          filter: `drop-shadow(0 0 ${radius * 0.02}px ${color}40)`
        }}
      />
      
      {/* Organic deformed layer outline with inner transparency */}
      <motion.path
        d={organicMotion.generateOrbitPath(0, 0)}
        fill="none"
        stroke={color}
        strokeWidth={layerType === "weather" || layerType === "mobility" ? 0.6 : (detailLevel === "outline" ? 0.8 : 1.2)}
        opacity={layerType === "weather" || layerType === "sleep" || layerType === "mood" ? 0.4 : 0.65}
        style={{
          filter: `drop-shadow(0 0 3px ${color}30)`,
          strokeLinecap: "round",
          transform: `rotate(${organicMotion.rotationOffset}deg)`,
          transformOrigin: "center",
          mixBlendMode: layerType === "weather" || layerType === "mobility" ? "multiply" : "normal"
        }}
        animate={{ 
          strokeDasharray: detailLevel === "outline" ? "3,6" : (layerType === "weather" ? "2,4" : "none"),
          opacity: layerType === "weather" || layerType === "sleep" || layerType === "mood" ? 
            [0.3, 0.5, 0.3] : [0.65, 0.8, 0.65]
        }}
        transition={{
          strokeDasharray: { duration: 0 },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Interactive data visualization based on zoom level */}
      {detailLevel !== "outline" && data.map((item, index) => {
        const angle = (index / data.length) * 2 * Math.PI;
        const deformedRadius = organicMotion.getRadiusAtAngle(angle);
        const x = Math.cos(angle + organicMotion.rotationOffset * Math.PI / 180) * deformedRadius;
        const y = Math.sin(angle + organicMotion.rotationOffset * Math.PI / 180) * deformedRadius;

        return (
          <motion.g key={index}>
            {detailLevel === "trends" && (
              <InteractiveDataPoint
                x={x}
                y={y}
                color={color}
                size={2.5}
                data={item}
                layerType={layerType || "mood"}
                onHover={onTooltipShow}
                onLeave={onTooltipHide}
                onClick={onDataPointClick}
                date={item.date}
                isWeek={layer.isWeek}
              />
            )}
            
            {detailLevel === "segments" && (
              <motion.path
                d={`M ${x * 0.95} ${y * 0.95} L ${x * 1.05} ${y * 1.05}`}
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.85}
                style={{
                  filter: `drop-shadow(0 0 2px ${color}40)`,
                  cursor: "pointer"
                }}
                animate={{ 
                  pathLength: [0, 1],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{ 
                  pathLength: { duration: 1.5, delay: index * 0.1 },
                  opacity: { duration: 2, repeat: Infinity, delay: index * 0.2 }
                }}
                whileHover={{
                  strokeWidth: 2,
                  opacity: 1,
                }}
                onMouseEnter={(event) => {
                  const rect = (event.target as SVGElement).getBoundingClientRect();
                  onTooltipShow({
                    title: layerType?.toUpperCase() || "DATA",
                    value: `Segment ${index + 1}`,
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                  });
                }}
                onMouseLeave={onTooltipHide}
              />
            )}

            {(detailLevel === "detail" || detailLevel === "micro") && (
              <InteractiveDataPoint
                x={x}
                y={y}
                color={color}
                size={detailLevel === "micro" ? 4 : 3}
                data={item}
                layerType={layerType || "mood"}
                onHover={onTooltipShow}
                onLeave={onTooltipHide}
                onClick={onDataPointClick}
                date={item.date}
                isWeek={layer.isWeek}
              />
            )}
          </motion.g>
        );
      })}

      {/* Enhanced ring label with magical glow */}
      <motion.text
        x={0}
        y={-radius - 18}
        textAnchor="middle"
        fill={color}
        fontSize={10}
        fontWeight="300"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.15em"
        opacity={0.9}
        style={{
          filter: `drop-shadow(0 0 6px ${color}60)`,
          textShadow: `0 0 8px ${color}40`
        }}
        initial={{ opacity: 0, y: -radius - 25 }}
        animate={{ opacity: [0.7, 0.9, 0.7], y: -radius - 18 }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 0.8, ease: "easeOut" }
        }}
      >
        ✦ {name.toUpperCase()} ✦
      </motion.text>
    </OptimizedSVGMotion>
  );
};

const GlowingCore: React.FC<{ radius: number; motionTransform: any }> = ({ radius, motionTransform }) => {
  return (
    <motion.g
      animate={motionTransform}
      transition={{ 
        type: "spring",
        stiffness: 50,
        damping: 15
      }}
    >
      <defs>
        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 70%, 75%)" stopOpacity={1} />
          <stop offset="40%" stopColor="hsl(35, 60%, 65%)" stopOpacity={0.9} />
          <stop offset="80%" stopColor="hsl(25, 50%, 50%)" stopOpacity={0.6} />
          <stop offset="100%" stopColor="hsl(15, 40%, 35%)" stopOpacity={0.2} />
        </radialGradient>
        <radialGradient id="coreInnerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(45, 90%, 85%)" stopOpacity={0.8} />
          <stop offset="100%" stopColor="hsl(45, 90%, 85%)" stopOpacity={0} />
        </radialGradient>
      </defs>
      
      {/* Outer glow ring with heartbeat */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius * 1.3}
        fill="url(#coreInnerGlow)"
        opacity={0.3}
        animate={{ 
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Core self - enhanced breathing center */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        fill="url(#coreGradient)"
        filter="url(#coreGlow)"
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.95, 1, 0.95]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner pulse ring with synchronized heartbeat */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius * 0.75}
        stroke="hsl(45, 80%, 85%)"
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
        style={{
          filter: "drop-shadow(0 0 4px hsl(45, 80%, 85%))"
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
          strokeWidth: [0.8, 1.5, 0.8]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Center label with living breath */}
      <motion.text
        x={0}
        y={4}
        textAnchor="middle"
        fill="hsl(45, 70%, 90%)"
        fontSize={8}
        fontWeight="300"
        fontFamily="Inter, system-ui, sans-serif"
        letterSpacing="0.1em"
        opacity={0.9}
        animate={{
          opacity: [0.9, 1, 0.9],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        NOW
      </motion.text>
    </motion.g>
  );
};

export const RadialLayerSystem: React.FC<RadialLayerSystemProps> = ({
  layers,
  currentZoom = "month",
  centerRadius = 40,
  layerSpacing = 50,
  showConstellations = false
}) => {
  // IMMEDIATE DEBUG: Log component mount and basic props
  console.log('🚀 RadialLayerSystem component mounted!', {
    layersReceived: layers?.length || 0,
    currentZoom,
    timestamp: new Date().toLocaleTimeString()
  });

  // Time axis integration (needs to be before interaction tracking)
  const { timeSlices, nowAngle, getTimeSliceData } = useTimeAxis();

  // Interaction tracking for AI intelligence
  const {
    trackInteraction,
    getRecentInteractions,
    currentInsight,
    isAnalyzing
  } = useInteractionTracking(timeSlices, {
    enableRealTimeAnalysis: true,
    maxHistorySize: 100
  });

  // Visual skin and theme integration
  const { currentTheme, themeConfig } = useVisualSkin();

  // Zoom compensation for consistent scale across views
  const { getZoomTransform, isTransitioning: zoomTransitioning } = useZoomCompensation({
    currentView: currentZoom as any
  });

  // Unified motion system for living physics with theme integration
  const { getMotionTransform, addImpulse, timeAccumulator } = useUnifiedMotion({
    heartbeatInterval: 6000, // 6-second heartbeat
    heartbeatIntensity: 0.12, // Gentle pulse
    windStrength: 0.3, // Subtle ambient drift
    friction: 0.985, // Natural movement decay
    theme: currentTheme,
    enableDay4Dynamics: true
  });


  // Enhanced tooltip and insight system
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [insightTooltipData, setInsightTooltipData] = useState<any>(null);
  const [insightTooltipVisible, setInsightTooltipVisible] = useState(false);
  const [expandedCardData, setExpandedCardData] = useState<any>(null);
  const [expandedCardVisible, setExpandedCardVisible] = useState(false);
  const [emojiBurstData, setEmojiBurstData] = useState<any>(null);
  const [emojiBurstActive, setEmojiBurstActive] = useState(false);
  
  // Info panel system for clickable elements
  const [infoPanelData, setInfoPanelData] = useState<PanelData | null>(null);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  
  // Supernova burst states
  const [activeSupernovas, setActiveSupernovas] = useState<SupernovaTrigger[]>([]);
  const [supernovaCounter, setSupernovaCounter] = useState(0);
  
  // Constellation states
  const [constellations, setConstellations] = useState<any[]>([]);
  
  // Aurora events for meaningful moments
  const { 
    events: auroraEvents, 
    triggerPhaseTransition, 
    triggerInsightDiscovery, 
    triggerMilestone,
    triggerCorrelation 
  } = useAuroraEvents();
  
  // Analyze mood data for emotional peaks and trigger meaningful aurora events
  useEffect(() => {
    console.log('🔍 RadialLayerSystem checking for mood data...', { 
      totalLayers: layers.length,
      layerTypes: layers.map(l => l.layerType || 'unknown')
    });
    
    const moodLayer = layers.find(layer => layer.layerType === 'mood');
    console.log('🧠 Mood layer found:', moodLayer ? `${moodLayer.data.length} mood points` : 'none');
    
    if (moodLayer && moodLayer.data.length > 0) {
      const triggers = analyzeMoodForSupernovas(moodLayer.data, moodLayer.radius);
      console.log('🌟 Supernova analysis complete:', {
        moodDataCount: moodLayer.data.length,
        triggers: triggers.length,
        triggersDetails: triggers
      });
      
      // Stagger supernova triggers to avoid overwhelming the system
      triggers.forEach((trigger, index) => {
        setTimeout(() => {
          if (trigger.shouldTrigger) {
            setActiveSupernovas(prev => [...prev, { ...trigger, id: supernovaCounter + index }]);
            
            // Trigger aurora for high intensity emotional moments
            if (trigger.intensity > 0.7) {
              setTimeout(() => {
                triggerInsightDiscovery();
                console.log('🌌 Aurora triggered for emotional insight');
              }, 1000);
            }
          }
        }, index * 1500); // 1.5 second stagger between bursts
      });
      
      setSupernovaCounter(prev => prev + triggers.length);
    }
  }, [layers, supernovaCounter, triggerInsightDiscovery]);

  // Generate constellations and trigger correlation auroras when patterns are found
  useEffect(() => {
    if (showConstellations && layers.length > 0) {
      const allSlices = layers.flatMap(layer => 
        (layer.data || []).map((item, index) => ({
          ...item,
          id: `${layer.name}-${index}`,
          timestamp: item.timestamp || item.date || new Date().toISOString(),
          layerName: layer.name,
          angle: (index / layer.data.length) * 360
        }))
      );
      
      const matches = findRecurringSlices(allSlices, {
        matchThreshold: 0.7,
        compareAcross: 'months'
      });
      
      // Trigger aurora when significant correlations are discovered
      if (matches.length > constellations.length && matches.length > 2) {
        setTimeout(() => {
          triggerCorrelation();
          console.log('🌌 Aurora triggered for constellation correlation discovery');
        }, 800);
      }
      
      setConstellations(matches);
    } else {
      setConstellations([]);
    }
  }, [showConstellations, layers, constellations.length, triggerCorrelation]);

  const handleTooltipShow = (data: any) => {
    setTooltipData(data);
    setTooltipVisible(true);
  };

  const handleTooltipHide = () => {
    setTooltipVisible(false);
    setTimeout(() => setTooltipData(null), 200);
  };

  // Enhanced insight tooltip handlers
  const handleInsightTooltipShow = (data: any) => {
    // Generate contextual insights for the data point
    const insights = generateDataPointInsights(data);
    setInsightTooltipData({
      ...data,
      insights,
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100% confidence
      timestamp: new Date().toLocaleTimeString(),
      layerType: data.layerType || 'unknown'
    });
    setInsightTooltipVisible(true);
  };

  const handleInsightTooltipHide = () => {
    setInsightTooltipVisible(false);
    setTimeout(() => setInsightTooltipData(null), 200);
  };

  // Generate contextual insights based on data type and patterns
  const generateDataPointInsights = (data: any) => {
    const insights: string[] = [];
    
    if (data.layerType === 'mood' && data.intensity) {
      if (data.intensity > 0.7) {
        insights.push("High emotional intensity detected");
        insights.push("Consider breathing exercises");
      } else if (data.intensity < 0.3) {
        insights.push("Low energy pattern observed");
        insights.push("Movement might boost mood");
      }
    }
    
    if (data.layerType === 'sleep' && data.value) {
      const hours = parseFloat(data.value);
      if (hours < 6) {
        insights.push("Sleep debt accumulating");
        insights.push("Affects mood & cognition");
      } else if (hours > 9) {
        insights.push("Extended sleep detected");
        insights.push("Check sleep quality metrics");
      }
    }
    
    if (data.layerType === 'mobility' && data.intensity) {
      if (data.intensity > 0.6) {
        insights.push("Active movement day");
        insights.push("Positive mood correlation");
      } else {
        insights.push("Low activity period");
        insights.push("Consider gentle movement");
      }
    }

    if (data.layerType === 'weather' && data.value) {
      const condition = data.value.toLowerCase();
      if (condition.includes('rain') || condition.includes('storm')) {
        insights.push("Weather affects mood patterns");
        insights.push("Indoor activities recommended");
      } else if (condition.includes('sunny') || condition.includes('clear')) {
        insights.push("Natural light available");
        insights.push("Optimize outdoor time");
      }
    }
    
    return insights.length > 0 ? insights : ["Patterns emerging...", "Long-term correlation building"];
  };

  const handleDataPointClick = (expandedData: any, burstData: any) => {
    // Track interaction for AI analysis
    trackInteraction(
      expandedData.layerType || 'unknown',
      expandedData,
      burstData?.position,
      `data-point-click-${currentZoom}`
    );

    // Hide tooltip first
    setTooltipVisible(false);
    
    // Add motion impulse on interaction
    const impulseStrength = 3; // Increased for more dramatic response
    addImpulse(
      (Math.random() - 0.5) * impulseStrength,
      (Math.random() - 0.5) * impulseStrength
    );
    
    // Show expanded card
    setExpandedCardData(expandedData);
    setExpandedCardVisible(true);
    
    // Trigger emoji burst
    setEmojiBurstData(burstData);
    setEmojiBurstActive(true);
    
    // Trigger milestone aurora for significant data discoveries
    if (expandedData.intensity > 0.8 || expandedData.value > 0.9) {
      setTimeout(() => {
        triggerMilestone();
        console.log('🌌 Aurora triggered for milestone data point discovery');
      }, 1200);
    }
  };

  const handleExpandedCardClose = () => {
    setExpandedCardVisible(false);
    setTimeout(() => setExpandedCardData(null), 300);
  };

  const handleEmojiBurstComplete = () => {
    setEmojiBurstActive(false);
    setTimeout(() => setEmojiBurstData(null), 100);
  };

  // Handle clickable layer interactions
  const handleLayerClick = (layerData: any) => {
    // Track layer interaction
    trackInteraction(
      layerData.layerType || 'layer',
      layerData,
      undefined,
      `layer-click-${currentZoom}`
    );

    setInfoPanelData({
      type: 'layer',
      title: layerData.name,
      subtitle: `${layerData.layerType} layer`,
      content: layerData
    });
    setInfoPanelVisible(true);
  };

  const handleSliceClick = (sliceData: any) => {
    // Track slice interaction
    trackInteraction(
      sliceData.sliceType || 'slice',
      sliceData,
      { x: sliceData.x || 0, y: sliceData.y || 0 },
      `slice-click-${currentZoom}`
    );

    setInfoPanelData({
      type: 'slice',
      title: `Time Slice`,
      subtitle: `${sliceData.sliceType} period`,
      content: sliceData
    });
    setInfoPanelVisible(true);
  };

  const handleSliceFocusZoom = (sliceData: any) => {
    // Trigger a focused zoom animation
    addImpulse(
      Math.cos(sliceData.angle) * 2,
      Math.sin(sliceData.angle) * 2
    );
  };

  const handleInfoPanelClose = () => {
    setInfoPanelVisible(false);
    setTimeout(() => setInfoPanelData(null), 200);
  };

  const handleSupernovaComplete = (completedSupernova: SupernovaTrigger) => {
    setActiveSupernovas(prev => 
      prev.filter(supernova => supernova !== completedSupernova)
    );
    
    // Add motion impulse from completed supernova
    if (completedSupernova.position) {
      const impulseStrength = completedSupernova.intensity * 4;
      addImpulse(
        (completedSupernova.position.x / 100) * impulseStrength,
        (completedSupernova.position.y / 100) * impulseStrength
      );
    }
  };
  
  // Generate Kandinsky data marbles from all layers
  const generateDataMarbles = () => {
    const marbles: any[] = [];
    layers.forEach((layer, layerIndex) => {
      layer.data.forEach((item, itemIndex) => {
        const angle = (itemIndex / layer.data.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * layer.radius;
        const y = Math.sin(angle) * layer.radius;
        
        marbles.push({
          id: `${layer.name}-${itemIndex}`,
          x,
          y,
          type: layer.layerType || 'mood',
          value: item.value || Math.random(),
          energy: item.energy || Math.random(),
          timestamp: item.date || new Date()
        });
      });
    });
    return marbles;
  };

  const dataMarbles = generateDataMarbles();

  return (
    <>
      <motion.div
        style={getZoomTransform()}
        className="w-full h-full"
      >
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ transformOrigin: "center" }}
        >
          {/* Air Layer - Atmospheric presence, outermost */}
          <AirLayer 
            center={{ x: 0, y: 0 }} 
            outerRadius={Math.max(...layers.map(l => l.radius)) + 100}
            timeOfDay={new Date()}
            visible={true}
          />
          
          {/* Wind-Responsive Hair Ring - Flag-like organic motion */}
          <WindHairField
            radius={Math.max(...layers.map(l => l.radius)) + 80}
            center={{ x: 0, y: 0 }}
            dataLayers={layers}
            windSpeed={0.6}
            windDirection={Math.PI / 4}
            emotionalIntensity={0.7}
            className="wind-hair-field"
          />

          {/* Sky Ring - Celestial canvas surrounding everything */}
          <SkyRing
            radius={(Math.max(...layers.map(l => l.radius)) + 60) * 0.8}
            center={{ x: 0, y: 0 }}
            className="celestial-sky-ring"
            crazinessLevel={42} // Perfect harmony level
          />

          {/* Sky Connected Weather Ring with revolutionary time-based effects */}
          {layers.find(l => l.layerType === 'weather') && (
            <SkyConnectedWeatherRing
              radius={layers.find(l => l.layerType === 'weather')?.radius || 150}
              center={{ x: 0, y: 0 }}
              weatherData={layers.find(l => l.layerType === 'weather')?.data || []}
              className="weather-enhancement"
            />
          )}
          
          {/* Wind Whirl Field - Outer layer beyond weather */}
          <WindWhirlField
            centerX={0}
            centerY={0}
            radius={(layers.find(l => l.layerType === 'weather')?.radius || 150) + 30}
          />

          {/* North Pole Moon - relocated from center */}
          {layers.find(l => l.layerType === 'moon') && (
            <NorthPoleMoon
              center={{ x: 0, y: 0 }}
              radius={Math.max(...layers.map(l => l.radius))}
              moonPhase={layers.find(l => l.layerType === 'moon')?.data?.[0]?.phase || 0.3}
              className="north-pole-moon"
              showTooltip={true}
            />
          )}

          {/* Fibrous Ring Layers - Transform data into organic, thread-like textures */}
          {layers.slice().reverse().map((layer, index) => (
            <React.Fragment key={`fibrous-${layer.name}`}>
              {/* Traditional layer structure */}
              <ClickableLayer
                radius={layer.radius}
                color={layer.color}
                name={layer.name}
                layerType={layer.layerType}
                onClick={handleLayerClick}
              >
                <Layer
                  name={layer.name}
                  data={layer.data}
                  radius={layer.radius}
                  color={layer.color}
                  zoomLevel={currentZoom}
                  layerIndex={index}
                  totalLayers={layers.length}
                  layerType={layer.layerType}
                  onTooltipShow={handleTooltipShow}
                  onTooltipHide={handleTooltipHide}
                  onDataPointClick={handleDataPointClick}
                  layer={layer}
                />
              </ClickableLayer>
              
              {/* Fibrous texture overlay for organic, painterly feel */}
              {layer.data.length > 0 && (
                <FibrousRingLayer
                  radius={layer.radius}
                  center={{ x: 0, y: 0 }}
                  data={layer.data}
                  layerType={layer.layerType as any}
                  baseColor={layer.color}
                  thickness={8 + (layers.length - index) * 2}
                  threadDensity={layer.layerType === 'sleep' ? 8 : 12}
                  className={`fibrous-${layer.layerType || 'default'}`}
                />
              )}
            </React.Fragment>
          ))}

          {/* Enhanced Plans Layer - Day 4 completion */}
          {layers.find(l => l.layerType === 'plans') && (
            <EnhancedPlansLayer
              plansData={layers.find(l => l.layerType === 'plans')?.data || []}
              centerX={0}
              centerY={0}
              radius={layers.find(l => l.layerType === 'plans')?.radius || 180}
              theme={currentTheme}
              onPlanClick={(plan: any) => console.log('Plan clicked:', plan)}
              showDetails={false}
            />
          )}
          
          {/* Water Flow Visuals - Day 4 completion */}
          <WaterFlowVisuals
            centerX={0}
            centerY={0}
            radius={Math.max(...layers.map(l => l.radius)) * 0.6}
            flow="tidal"
            intensity={0.3}
            color="hsl(200 60% 50%)"
            theme={currentTheme}
          />

          {/* Atmospheric Aurora Layer - Appears only during meaningful moments */}
          <AtmosphericAuroraLayer
            center={{ x: 0, y: 0 }}
            radius={Math.max(...layers.map(l => l.radius)) + 40}
            events={auroraEvents}
            className="aurora-celebrations"
          />

          {/* Constellation Arcs */}
          {/* {showConstellations && constellations.length > 0 && (
            <ConstellationArcs
              constellations={constellations}
              layers={layers}
              centerRadius={centerRadius}
              layerSpacing={layerSpacing}
            />
          )} */}

          {/* Cosmic background elements (z-depth 0) */}
          <CosmicBackgroundPulse
            center={{ x: 0, y: 0 }}
            layers={[
              { radius: 100, offset: 0 },
              { radius: 160, offset: 1.2 },
              { radius: 220, offset: 2.1 },
              { radius: 280, offset: 0.7 }
            ]}
            className="cosmic-background"
          />
          
          <CosmicRadialTicks
            center={{ x: 0, y: 0 }}
            radius={layers[0]?.radius || 200}
            tickCount={24}
            className="cosmic-ticks"
          />

          {/* Kandinsky-style data marbles overlay */}
          <KandinskyDataMarbles
            marbles={dataMarbles}
            className="data-marbles-overlay"
          />

          {/* Ripple Trails for Mandala theme */}
          <RippleTrails
            center={{ x: 0, y: 0 }}
            className="mandala-ripples"
          />

          {/* Mystical Soul Core - replaces static center */}
          <MysticalSoulCore 
            radius={centerRadius} 
            center={{ x: 0, y: 0 }}
            moodData={layers.find(l => l.layerType === 'mood')?.data?.[0]}
            sleepData={layers.find(l => l.name.toLowerCase().includes('sleep'))?.data?.[0]}
          />
          
          
          {/* Layer Data Animator - Only data-driven visuals */}
          <LayerDataAnimator
            centerX={0}
            centerY={0}
            isActive={false}
          />
          
          {/* Theme Haiku - Background only, minimal */}
          <ThemeHaikuDisplay
            theme="mandalaExpressive"
            centerX={0}
            centerY={0}
            maxRadius={layers[0]?.radius || 200}
            isVisible={false}
          />
        </motion.g>
      </motion.div>

      {/* Theme Sunburst - Dynamic theme-specific effects */}
      <ThemeSunburst 
        theme={currentTheme}
        centerX={0}
        centerY={0}
        timeAccumulator={timeAccumulator}
      />

      {/* Enhanced Insight Tooltip System */}
      <InsightTooltip
        data={insightTooltipData}
        isVisible={insightTooltipVisible}
        onClose={handleInsightTooltipHide}
      />

      {/* Enhanced Hover Insight Shield System - for detailed analysis */}
      <HoverInsightShield
        data={tooltipData}
        isVisible={tooltipVisible}
        onClose={handleTooltipHide}
      />

      {/* Legacy tooltip for fallback compatibility */}
      <RadialTooltip 
        data={tooltipData} 
        isVisible={false} // Disabled in favor of insight systems
      />

      {/* Expanded card system */}
      <ExpandedCard
        data={expandedCardData}
        isVisible={expandedCardVisible}
        onClose={handleExpandedCardClose}
      />

      {/* Info Panel System for clicked elements */}
      <InfoPanelSystem
        panelData={infoPanelData}
        isVisible={infoPanelVisible}
        onClose={handleInfoPanelClose}
      />

      {/* Emoji burst effects */}
      {emojiBurstData && (
        <EmojiBurst
          emojis={emojiBurstData.emojis}
          isActive={emojiBurstActive}
          centerX={emojiBurstData.position.x}
          centerY={emojiBurstData.position.y}
          onComplete={handleEmojiBurstComplete}
        />
      )}

      {/* Supernova burst effects */}
      {activeSupernovas.map((supernova, index) => (
        <SupernovaBurst
          key={`supernova-${index}`}
          isActive={true}
          centerX={supernova.position?.x || 0}
          centerY={supernova.position?.y || 0}
          intensity={supernova.intensity}
          emotionColor={supernova.color}
          onComplete={() => handleSupernovaComplete(supernova)}
        />
      ))}

      {/* Debug supernova for testing - remove after fixing */}
      <DebugSupernova />
    </>
  );
};