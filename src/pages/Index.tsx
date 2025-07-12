/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState, useEffect } from 'react';
import { TimeAxisProvider } from '@/contexts/TimeAxisContext';
import WeatherSunburst from '@/components/weather-sunburst';
import { EnhancedWeatherRing } from '@/components/enhanced/EnhancedWeatherRing';
import { AtmosphericWeatherRing } from '@/components/atmospheric-weather-ring';
import { CosmicSunburstLayer } from '@/components/cosmic-sunburst-layer';
import { MandalaView } from '@/components/mandala/MandalaView';
import { VanGoghMandalaView } from '@/components/mandala/VanGoghMandalaView';
import { VanGoghView } from '@/components/van-gogh/VanGoghView';
import { DataBlobRing } from '@/components/data-blob-ring';
import { UserCore } from '@/components/user-core';
import { FriendOrbitRing } from '@/components/friend-orbit-ring';
import { RadialInsightsOverlay } from '@/components/radial-insights-overlay';
import { InsightOverlayEngine } from '@/components/insight-overlay-engine';
import { PlaybackReflector } from '@/components/playback-reflector';
import { EmotionalTideRings } from '@/components/emotional-tide-rings';
import { VisualSkinProvider, useVisualSkin } from '@/components/visual-skin-provider';
import { ThemeHaikuDisplay } from '@/components/theme-haiku-display';
import { PoetryOverlay } from '@/components/poetry-overlay';
import { SunAuraRing } from '@/components/sun-aura-ring';
import { SmoothFlowProvider } from '@/components/performance/SmoothFlowProvider';
import { SkyArcGradient } from '@/components/sky-arc-gradient';
import { NowRecorder } from '@/components/enhanced/NowRecorder';
import { SideView } from '@/components/mandala/SideView';
import { RotatableSideView } from '@/components/mandala/RotatableSideView';
import { useTimeDrift } from '@/hooks/use-time-drift';
import { FractalTimeZoomManager, TimeScale } from '@/components/fractal-time-zoom-manager';
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer';
import { RadialWeekView } from '@/components/radial-week-view';
import { RadialMonthView } from '@/components/radial-month-view';
import { RadialMonthConstellation } from '@/components/radial-month-constellation';
import { RadialYearView } from '@/components/radial-year-view';
import { RadialYearSeasons } from '@/components/radial-year-seasons';
import { RadialFractalView } from '@/components/radial-fractal-view';
import { InsightOrbitRing } from '@/components/insight-orbit-ring';
import { MoonPhaseMarker } from '@/components/moon-phase-marker';
import { LayerPopOutPanel } from '@/components/LayerPopOutPanel';
import { DataLayerLabels } from '@/components/data-layer-labels';
import { ReactiveDataBlobRing } from '@/components/enhanced/ReactiveDataBlobRing';
import { SunCoreMesh } from '@/components/enhanced/SunCoreMesh';
import { CelestialGlyph } from '@/components/enhanced/CelestialGlyph';
import { InvisibleDiscoBall } from '@/components/enhanced/InvisibleDiscoBall';
import { MidnightFirework } from '@/components/enhanced/MidnightFirework';
import { ZoomMenuButton } from '@/components/navigation/ZoomMenuButton';
import { ToolsMenuButton } from '@/components/navigation/ToolsMenuButton';
import { SkinsMenuButton } from '@/components/navigation/SkinsMenuButton';
import { TouchTool } from '@/components/interactions/TouchTool';
import { FixTool } from '@/components/interactions/FixTool';
import { ScaleTool } from '@/components/interactions/ScaleTool';
import { useLayerPopOut } from '@/hooks/useLayerPopOut';
import { mockWeatherData, mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';
import { mockPlansData } from '@/data/mock-plans-data';
import { mockWeekData, mockMonthData, mockYearData } from '@/data/mock-temporal-data';
import { mockFriends } from '@/data/mock-friend-data';
import { mockInsightData } from '@/data/mock-insight-data';
import { calculateLayerInteraction } from '@/utils/mood-engine';
import { MoodInfluence } from '@/utils/mood-engine';
import { Theme, themeConfigs } from '@/utils/theme-configs';
import { generateInsights } from '@/utils/insight-engine';
import { SettingsPanel } from '@/components/settings-panel';
import { PhaseTransitionManager } from '@/components/PhaseTransitionManager';
import { detectLifePhase } from '@/utils/life-phase-detection';
import { usePhaseTheme } from '@/hooks/usePhaseTheme';
import { useEnhancedAwarenessRhythm } from '@/hooks/useEnhancedAwarenessRhythm';
import { AwarenessNotification } from '@/components/AwarenessNotification';
import { RitualCompanion } from '@/components/RitualCompanion';
import { RippleVisualization } from '@/components/RippleVisualization';
import { useConsciousnessTracker } from '@/hooks/useConsciousnessTracker';
import { getUserInsightProfile } from '@/utils/insight-memory';
import { PlansLayerRing } from '@/components/plans-layer-ring';
import { WalletCurrencyPanel } from '@/components/enhanced/WalletCurrencyPanel';
import { EnhancedSettingsButton } from '@/components/enhanced/EnhancedSettingsButton';
import { MinimalistTimeSymbol } from '@/components/MinimalistTimeSymbol';
import { TimeScaleColumn } from '@/components/TimeScaleColumn';
import { HoverBasedInsights } from '@/components/HoverBasedInsights';
import { useReactiveTilt } from '@/hooks/use-reactive-tilt';
import { WalletDisplay } from '@/components/WalletDisplay';
import { SkyRing } from '@/components/enhanced/SkyRing';
import { SunburstGrooveField } from '@/components/enhanced/SunburstGrooveField';
import { LayerButtonMenu } from '@/components/LayerButtonMenu';

const IndexContent = () => {
  const { themeConfig, isTransitioning, currentTheme } = useVisualSkin();
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reflectiveMode, setReflectiveMode] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showTideRings, setShowTideRings] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | undefined>();
  const [activeLayer, setActiveLayer] = useState<string | undefined>();
  const [currentMood, setCurrentMood] = useState<MoodInfluence | null>(null);
  const [poetryMode, setPoetryMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('berlin');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [showDebugMode, setShowDebugMode] = useState(false);
  const [showLayerDebug, setShowLayerDebug] = useState(false);
  const [persistentDebugMode, setPersistentDebugMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInsightPanel, setShowInsightPanel] = useState(false);
  const [showRitualCompanion, setShowRitualCompanion] = useState(false);
  const [activeTool, setActiveTool] = useState<'touch' | 'fix' | 'scale' | null>(null);
  const [showWalletPanel, setShowWalletPanel] = useState(false);
  const [walletPanelPosition, setWalletPanelPosition] = useState({ x: 0, y: 0 });

  // Life phase detection and awareness rhythm
  const userProfile = getUserInsightProfile();
  const mockInteractions = [
    { layerType: 'mood', timestamp: new Date().toISOString(), dataValue: 0.7 },
    { layerType: 'sleep', timestamp: new Date().toISOString(), dataValue: 0.8 },
    { layerType: 'mobility', timestamp: new Date().toISOString(), dataValue: 0.6 }
  ];
  const currentLifePhase = detectLifePhase(userProfile, mockInteractions);
  const phaseTheme = usePhaseTheme(currentLifePhase.currentPhase);
  
  // Enhanced awareness rhythm system with wallet integration
  const { rhythmState, emotionalState, triggerAwarenessEvent } = useEnhancedAwarenessRhythm(
    [], // TODO: Add mood data source
    mockInteractions
  );

  // Mock wallet system instance for activity tracking
  const mockWalletTracker = {
    trackActivity: (type: 'mood' | 'mobility' | 'plans' | 'sleep' | 'insight' | 'correlation', value: number = 1, description?: string) => {
      console.log(`💼 Wallet activity tracked: ${type} (+${value}) - ${description}`);
    }
  };

  // Consciousness tracking system
  const consciousnessTracker = useConsciousnessTracker({
    currentPhase: currentLifePhase.currentPhase,
    centerX: 350,
    centerY: 350,
    enabled: true
  });

  // Layer pop-out panel system
  const { popOutState, openPopOut, closePopOut, togglePopOut } = useLayerPopOut();

  // Ultra-gentle reactive tilt effects - organic wind & gravity simulation
  const mainTilt = useReactiveTilt({ layerType: 'core', sensitivity: 0.4, baseAmplitude: 0.6 });
  const weatherTilt = useReactiveTilt({ layerType: 'weather', sensitivity: 0.5, baseAmplitude: 0.8 });
  const plansTilt = useReactiveTilt({ layerType: 'plans', sensitivity: 0.3, baseAmplitude: 0.5 });
  const mobilityTilt = useReactiveTilt({ layerType: 'mobility', sensitivity: 0.6, baseAmplitude: 0.7 });
  const moodTilt = useReactiveTilt({ layerType: 'mood', sensitivity: 0.5, baseAmplitude: 1.0 });
  const sleepTilt = useReactiveTilt({ layerType: 'sleep', sensitivity: 0.2, baseAmplitude: 0.4 });
  const uiTilt = useReactiveTilt({ layerType: 'ui', sensitivity: 0.3, baseAmplitude: 0.3 });

  // Handle keyboard shortcuts for zoom and settings
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && poetryMode) {
        setPoetryMode(false);
      }
      // Shift + D for persistent debug mode toggle
      if (event.shiftKey && event.key === 'D') {
        setPersistentDebugMode(!persistentDebugMode);
        setShowLayerDebug(!persistentDebugMode);
        event.preventDefault();
      }
      // Quick zoom shortcuts
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            setTimeScale('day');
            break;
          case 'w':
            setTimeScale('week');
            break;
          case 'm':
            setTimeScale('month');
            break;
          case 'y':
            setTimeScale('year');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [poetryMode, persistentDebugMode]);

  // Time navigation handler
  const handleTimeNavigate = (direction: 'past' | 'future') => {
    const newDate = new Date(currentDate);
    const multiplier = direction === 'future' ? 1 : -1;
    
    switch (timeScale) {
      case 'day':
        newDate.setDate(newDate.getDate() + (1 * multiplier));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (7 * multiplier));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (1 * multiplier));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (1 * multiplier));
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Time drift hook for breathing and rotation with poetry mode adjustments
  const timeDrift = useTimeDrift({
    enabled: true,
    speed: poetryMode ? 0.7 : 1, // Slower in poetry mode
    breathingEnabled: true,
    breathingIntensity: poetryMode ? 0.025 : 0.015 // More breathing in poetry mode
  });

  // Calculate current life metrics for mood engine
  const currentMetrics = {
    sleepQuality: mockSleepData.reduce((sum, d) => sum + d.intensity, 0) / mockSleepData.length,
    planDensity: 0.6, // Mock value
    weatherCondition: (mockWeatherToday[0]?.condition === 'storm' ? 'stormy' : 
                      mockWeatherToday[0]?.condition || 'sunny') as 'sunny' | 'cloudy' | 'rainy' | 'stormy',
    mobilityLevel: mockMobilityData.reduce((sum, d) => sum + d.intensity, 0) / mockMobilityData.length
  };

  // Generate AI insights
  const aiInsights = generateInsights({
    mood: mockMoodData,
    sleep: mockSleepData,
    mobility: mockMobilityData,
    weather: mockWeatherToday.map(w => ({
      hour: w.hour,
      temperature: w.temperature,
      condition: w.condition,
      intensity: w.temperature / 30 // Convert temperature to intensity (0-1 scale)
    })),
    timeScale,
    theme: currentTheme
  });

  const renderTimelineContent = ({ scale, transitionProgress, zoomLevel, isTransitioning }: {
    scale: TimeScale;
    transitionProgress: number;
    zoomLevel: number;
    isTransitioning: boolean;
  }) => {
    const centerX = 350;
    const centerY = 350;
    
    // Render Side View for 'side' scale
    if (scale === 'side') {
      return (
        <foreignObject x="0" y="0" width="700" height="700">
          <RotatableSideView
            currentDate={currentDate}
            theme={currentTheme}
            centerX={centerX}
            centerY={centerY}
            radius={250}
          />
        </foreignObject>
      );
    }
    
    return (
      <g transform={mainTilt.getSVGTiltTransform(centerX, centerY, timeDrift.getDriftTransform(centerX, centerY))}>
        {/* Sky Arc Gradient - Day/Night cycle - render once */}
        {scale === 'day' && (
          <SkyArcGradient
            centerX={centerX}
            centerY={centerY}
            innerRadius={50}
            outerRadius={400}
            theme={currentTheme}
            showSunMoon={true}
            cityLocation={
              selectedCity === 'berlin' ? { lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' } :
              selectedCity === 'baku' ? { lat: 40.4093, lng: 49.8671, timezone: 'Asia/Baku' } :
              selectedCity === 'tokyo' ? { lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' } :
              selectedCity === 'new_york' ? { lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' } :
              selectedCity === 'london' ? { lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' } :
              undefined
            }
          />
        )}
        
        {/* Sun Aura Ring - Breathing center anchored to outermost layer */}
        <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
          <SunAuraRing
            centerX={centerX}
            centerY={centerY}
            radius={timeDrift.applyBreathing(55)}
            theme={currentTheme}
            isPlaybackActive={showPlayback}
            activeLayerRadius={scale === 'day' ? 340 : 320}
            timeOfDay={(() => {
              const hour = new Date().getHours();
              if (hour >= 5 && hour < 7) return 'dawn';
              if (hour >= 7 && hour < 11) return 'morning';
              if (hour >= 11 && hour < 15) return 'noon';
              if (hour >= 15 && hour < 18) return 'afternoon';
              if (hour >= 18 && hour < 20) return 'sunset';
              if (hour >= 20 && hour < 22) return 'dusk';
              return 'night';
            })()}
          />
        </g>
        
        {/* Always present: Cosmic sunburst aura layer */}
        <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
          <CosmicSunburstLayer
            centerX={centerX}
            centerY={centerY}
            innerRadius={60}
            maxRadius={320}
            theme="sunfire"
            poetryMode={reflectiveMode}
          />
        </g>
        
        {/* Fractal View - unified geometry for all scales */}
        <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
          <RadialFractalView
            scale={scale}
            centerX={centerX}
            centerY={centerY}
            radius={scale === 'day' ? 260 : scale === 'week' ? 280 : scale === 'month' ? 300 : 320}
            theme={currentTheme}
            targetDate={new Date()}
            transitionProgress={transitionProgress}
            isTransitioning={isTransitioning}
          />
        </g>
        
        {/* Scale-specific content */}
        {scale === 'day' && (
          <>
            {/* Core weather visualization (center) */}
            <WeatherSunburst
              weatherData={{
                date: "2025-07-11",
                sunrise: "05:12",
                sunset: "21:08",
                temperature: mockWeatherData.slice(0, 8).map((w, i) => ({
                  time: `${i * 3}:00`,
                  value: w.temperature
                })),
                cloudiness: mockWeatherData.slice(0, 4).map((w, i) => ({
                  time: `${i * 6}:00`,
                  value: w.condition === 'cloudy' ? 80 : w.condition === 'partly_cloudy' ? 50 : 20
                })),
                sunIntensity: mockWeatherData.slice(0, 6).map((w, i) => ({
                  time: `${i * 4}:00`,
                  value: w.condition === 'sunny' ? 800 : w.condition === 'partly_cloudy' ? 400 : 100
                })),
                windSpeed: mockWeatherData.slice(0, 4).map((w, i) => ({
                  time: `${i * 6}:00`,
                  value: w.windSpeed
                }))
              }}
              centerX={centerX}
              centerY={centerY}
              innerRadius={80}
              outerRadius={140}
            />
            
            {/* INVERTED LAYER HIERARCHY: Weather (innermost) → Plans → Mobility → Mood → Sleep → Self → Wallet (outermost) */}
            
            {/* 1. Weather - Innermost cosmic influence (150-180px) */}
            <g transform={weatherTilt.getSVGTiltTransform(centerX, centerY)}>
              <EnhancedWeatherRing
                centerX={centerX}
                centerY={centerY}
                innerRadius={150}
                outerRadius={180}
                theme={currentTheme as any}
                className="enhanced-weather-layer"
              />
            </g>

            {/* 2. Plans - Intentional structure layer (190-220px) */}
            <g transform={plansTilt.getSVGTiltTransform(centerX, centerY)}>
              <PlansLayerRing
                plansData={mockPlansData}
                centerX={centerX}
                centerY={centerY}
                radius={205}
                theme={currentTheme}
                onPlanClick={(plan) => {
                  console.log('Plan clicked:', plan);
                }}
              />
            </g>

            {/* 3. Mobility - Movement and activity layer (230-260px) */}
            <g transform={mobilityTilt.getSVGTiltTransform(centerX, centerY)}>
        <ReactiveDataBlobRing
                data={mockMobilityData as any}
                centerX={centerX}
                centerY={centerY}
                innerRadius={230}
                outerRadius={260}
                type="mobility"
              />
            </g>

            {/* 4. Mood - Emotional expression layer (270-300px) */}
            <g transform={moodTilt.getSVGTiltTransform(centerX, centerY)}>
              <DataBlobRing
                data={mockMoodData}
                centerX={centerX}
                centerY={centerY}
                innerRadius={270}
                outerRadius={300}
                type="mood"
                label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "MOOD DATA" : undefined}
                {...currentMetrics}
                onMoodChange={setCurrentMood}
              />
            </g>

            {/* 5. Sleep - Rest and recovery layer (310-340px) */}
            <g transform={sleepTilt.getSVGTiltTransform(centerX, centerY)}>
              <DataBlobRing
                data={mockSleepData}
                centerX={centerX}
                centerY={centerY}
                innerRadius={310}
                outerRadius={340}
                type="sleep"
                label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "SLEEP DATA" : undefined}
                {...currentMetrics}
              />
            </g>

            {/* 6. Self - Core identity layer (around UserCore radius 350px) */}
            {/* UserCore is rendered separately at lines 501-518 */}

            {/* 7. Wallet - Outermost material layer */}
            <WalletDisplay
              isVisible={true}
              onActivityTrack={(type: any, value?: number, description?: string) => {
                console.log('Activity tracked:', type, value, description);
              }}
            />

            {/* Sunburst Groove Field - Violet pulsing groove close to core */}
            <SunburstGrooveField
              radius={112}
              center={{ x: centerX, y: centerY }}
              dataLayers={[
                { name: 'weather', data: mockWeatherData, radius: 180 },
                { name: 'mood', data: mockMoodData, radius: 300 },
                { name: 'sleep', data: mockSleepData, radius: 340 }
              ]}
              className="sunburst-energy-field groove-close-to-core"
            />

            {/* Sky Ring - White sunburst rays around groove */}
            <SkyRing
              radius={280}
              center={{ x: centerX, y: centerY }}
              className="sky-gradient-layer cosmic-rays"
              crazinessLevel={42} // Perfect harmony level
            />
          </>
        )}
        
        {scale === 'week' && (
          <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
            <RadialWeekView
              weekData={mockWeekData}
              centerX={centerX}
              centerY={centerY}
              radius={280}
              theme="cosmic"
              onDayClick={(day) => {
                console.log('Day clicked:', day);
                setTimeScale('day');
              }}
            />
          </g>
        )}
        
        {scale === 'month' && (
          <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
            <RadialMonthView
              monthData={mockMonthData}
              centerX={centerX}
              centerY={centerY}
              radius={300}
              theme="cosmic"
            />
            
            <RadialMonthConstellation
              monthData={mockMonthData}
              centerX={centerX}
              centerY={centerY}
              radius={320}
              theme="cosmic"
            />
          </g>
        )}
        
        {scale === 'year' && (
          <g transform={mainTilt.getSVGTiltTransform(centerX, centerY)}>
            <RadialYearView
              yearData={mockYearData}
              centerX={centerX}
              centerY={centerY}
              radius={320}
              theme="cosmic"
              onMonthClick={(month) => {
                console.log('Month clicked:', month);
                setTimeScale('month');
              }}
            />
            
            <RadialYearSeasons
              yearData={mockYearData.map((month, index) => ({
                month: month.month,
                name: month.name,
                season: month.season,
                isCurrentMonth: month.isCurrentMonth,
                dominantMood: 'calm',
                averageSleep: month.dataSummary.avgSleep,
                peakMobilityDay: Math.round(month.dataSummary.avgActivity * 30),
                weatherSummary: month.dataSummary.dominantWeather,
                totalActiveDays: Math.round(month.dataSummary.avgActivity * 31)
              }))}
              centerX={centerX}
              centerY={centerY}
              radius={340}
              theme="cosmic"
            />
          </g>
        )}
        
         {/* Sun Core Mesh - Data-reactive light field */}
        <SunCoreMesh
          centerX={centerX}
          centerY={centerY}
          radius={reflectiveMode ? 60 : 80}
          verticalData={[...mockWeatherData.map(w => w.temperature / 30), ...mockPlansData.map(p => p.intensity)]}
          horizontalData={[...mockMobilityData.map(m => m.intensity), ...mockMoodData.map(m => m.intensity)]}
          intensity={0.7 + (currentMood?.intensity || 0) * 0.3}
          isActive={!reflectiveMode}
        />

        {/* User Core - Central identity with mood integration */}
        {scale === 'day' && (
          <UserCore
            name="You"
             mood={currentMood?.moodType === 'tense' ? 'excited' : 
                   currentMood?.moodType === 'restless' ? 'excited' :
                   currentMood?.moodType === 'drained' ? 'low' :
                   currentMood?.moodType === 'joyful' ? 'excited' :
                   currentMood?.moodType || "creative"}
            theme="cosmic"
            centerX={centerX}
            centerY={centerY}
            radius={reflectiveMode ? 30 : 40}
            onClick={() => {
              setShowRitualCompanion(true);
              consciousnessTracker.trackInteraction('user-core', centerX, centerY);
            }}
          />
        )}
         
        {/* Invisible Disco Ball - subtle sparkle field */}
        <InvisibleDiscoBall
          centerX={centerX}
          centerY={centerY}
          radius={250}
          intensity={0.6 + (currentMood?.intensity || 0) * 0.4}
          sparkleCount={20}
          isActive={!reflectiveMode}
        />
        
        <MidnightFirework
          centerX={centerX}
          centerY={centerY}
        />

        {/* Ripple Consciousness Visualization */}
        <RippleVisualization
          centerX={centerX}
          centerY={centerY}
        />

        {/* Celestial Glyphs for high-intensity data points */}
        {mockMoodData.slice(0, 6).map((moodPoint, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const glyphRadius = 250 * 0.7;
          const glyphX = centerX + Math.cos(angle) * glyphRadius;
          const glyphY = centerY + Math.sin(angle) * glyphRadius;
          
          return (
            <CelestialGlyph
              key={`mood-glyph-${i}`}
              x={glyphX}
              y={glyphY}
              size={4 + moodPoint.intensity * 6}
              intensity={moodPoint.intensity}
              type="data"
              isActive={!reflectiveMode}
              data={moodPoint}
            />
          );
        })}

        {/* Friend Orbit Ring - Social connections */}
        {scale === 'day' && (
          <FriendOrbitRing
            friends={mockFriends}
            centerX={centerX}
            centerY={centerY}
            radius={360 * 0.875}
            theme="cosmic"
            visible={showFriends}
          />
        )}

        {/* Emotional Tide Rings - Cross-layer interactions */}
        {scale === 'day' && showTideRings && (
          <EmotionalTideRings
            centerX={centerX}
            centerY={centerY}
            connections={[
              {
                sourceLayer: 'sleep',
                targetLayer: 'mood',
                sourceAngle: 45,
                targetAngle: 135,
                sourceRadius: 220,
                targetRadius: 270,
                strength: calculateLayerInteraction('sleep', 'mood', currentMetrics.sleepQuality, 0.7)
              },
              {
                sourceLayer: 'mobility',
                targetLayer: 'mood',
                sourceAngle: 225,
                targetAngle: 180,
                sourceRadius: 320,
                targetRadius: 270,
                strength: calculateLayerInteraction('mobility', 'mood', currentMetrics.mobilityLevel, 0.7)
              },
              {
                sourceLayer: 'weather',
                targetLayer: 'mood',
                sourceAngle: 315,
                targetAngle: 270,
                sourceRadius: 170,
                targetRadius: 270,
                strength: 0.4
              }
            ]}
            isActive={true}
          />
        )}

        {/* Legacy Insight System - Will be replaced by new InsightOverlayEngine in LayerDataAnimator */}
        {showInsights && (
          <text
            x={centerX}
            y={centerY - 200}
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontSize="12"
          >
            Interactive insights active - click on data points
          </text>
        )}

        {/* Legacy Insights Overlay */}
        <RadialInsightsOverlay
          insights={[]}
          centerX={centerX}
          centerY={centerY}
          maxRadius={340}
          visible={showInsights && scale === 'day'}
          onClose={() => setShowInsights(false)}
        />

        {/* Playback Reflector */}
        {showPlayback && (
          <PlaybackReflector
            timespan={scale}
            centerX={centerX}
            centerY={centerY}
            radius={380}
            onTimeUpdate={(time) => {
              // Could drive animation of other components
              console.log('Playback time:', time);
            }}
            onSegmentActivate={(segment) => {
              console.log('Segment activated:', segment);
            }}
          />
        )}

        {/* Moon Phase Marker - outermost celestial shell */}
        {scale === 'day' && !poetryMode && (
          <MoonPhaseMarker
            centerX={centerX}
            centerY={centerY}
            radius={350}
            theme={currentTheme}
          />
        )}

        {/* Data Layer Labels - beautiful Fibonacci spiral arrangement */}
        <DataLayerLabels
          centerX={centerX}
          centerY={centerY}
          activeControls={{
            weather: true,
            plans: false,
            mobility: true,
            sleep: true,
            emotional: true,
          }}
          theme={currentTheme}
          onToggle={(layerKey) => {
            // Track the interaction for consciousness system
            consciousnessTracker.trackInteraction(layerKey, 0, 0);
            
            // Track wallet activity for any layer interaction
            mockWalletTracker.trackActivity(
              layerKey as 'mood' | 'mobility' | 'plans' | 'sleep', 
              2, 
              `Toggled ${layerKey} layer`
            );
          }}
        />


        {/* AI Insight Orbit Ring with debug capabilities */}
        <InsightOrbitRing
          insights={aiInsights}
          centerX={centerX}
          centerY={centerY}
          baseRadius={scale === 'day' ? 360 : scale === 'week' ? 340 : scale === 'month' ? 360 : 380}
          isVisible={showAIInsights && !poetryMode}
          currentTimeScale={scale}
          theme={currentTheme}
          showDebug={showDebugMode}
          onInsightClick={(insight) => {
            if (showDebugMode) {
              console.log('🐛 Debug - AI Insight clicked:', insight);
            }
          }}
        />


        {/* NOW RECORDER - 24 divided recorder lines with resonance ripples */}
        <NowRecorder
          centerX={centerX}
          centerY={centerY}
          radius={scale === 'day' ? 430 : 
                  scale === 'week' ? 380 : 
                  scale === 'month' ? 400 : 420}
          timeScale={scale}
          theme={currentTheme}
          dataLayers={[
            { name: 'weather', data: mockWeatherData, radius: 180, layerType: 'weather' },
            { name: 'plans', data: mockPlansData, radius: 205, layerType: 'plans' },
            { name: 'mobility', data: mockMobilityData, radius: 245, layerType: 'mobility' },
            { name: 'mood', data: mockMoodData, radius: 285, layerType: 'mood' },
            { name: 'sleep', data: mockSleepData, radius: 325, layerType: 'sleep' }
          ]}
        />

        {/* Poetry Overlay - floating poetic lines in poetry mode */}
        <PoetryOverlay
          isVisible={poetryMode}
          theme={currentTheme}
          timeScale={scale}
          centerX={centerX}
          centerY={centerY}
          maxRadius={360}
          onExit={() => setPoetryMode(false)}
        />

        {/* Debug Toggle (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
              onClick={() => setShowDebugMode(!showDebugMode)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                showDebugMode 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showDebugMode ? '🐛 DEBUG' : '○ Debug'}
            </button>
            <button
              onClick={() => setShowLayerDebug(!showLayerDebug)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                showLayerDebug 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showLayerDebug ? '📊 LAYERS' : '○ Layers'}
            </button>
          </div>
        )}

        {/* Layer Debug Info Overlay */}
        {showLayerDebug && (
          <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white p-4 rounded text-xs font-mono">
            <div className="mb-2 font-bold">🔍 Layer Debug Info</div>
            <div>Scale: {scale}</div>
            <div>Theme: {currentTheme}</div>
            <div>Active Layers: 4</div>
            <div>Insights: {aiInsights.length}</div>
            <div className="mt-2 text-yellow-300">
              Yellow elements indicate orphaned visuals
            </div>
          </div>
        )}

        {/* Central time display for non-day scales */}
        {!reflectiveMode && !poetryMode && scale !== 'day' && (
          <g className="central-time">
            <circle
              cx={centerX}
              cy={centerY}
              r={scale === 'year' ? 30 : scale === 'month' ? 40 : 50}
              fill="rgba(0, 0, 0, 0.3)"
              stroke="hsl(45 100% 70%)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              className="fill-yellow-100 text-2xl font-bold"
            >
              {scale === 'week' && 'WEEK'}
              {scale === 'month' && new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              {scale === 'year' && new Date().getFullYear()}
            </text>
            <text
              x={centerX}
              y={centerY + 20}
              textAnchor="middle"
              className="fill-yellow-200 text-xs font-light"
            >
              {scale} timeline
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render Van Gogh Mandala View for Van Gogh theme  
  if (currentTheme === 'vangogh') {
    return (
      <div className="relative w-full h-screen overflow-hidden" style={{
        fontFamily: themeConfig.typography.primary,
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text
      }}>
        <VanGoghView />
        
        {/* Settings panel still available */}
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
        
        {/* Theme Haiku Display */}
        <ThemeHaikuDisplay 
          onComplete={() => setPoetryMode(false)}
        />
      </div>
    );
  }

  // Throttled theme check - only log every 5 seconds
  const logThemeCheck = React.useRef(0);
  const now = Date.now();
  if (now - logThemeCheck.current > 5000) {
    console.log('🎨 Current theme check:', { 
      currentTheme, 
      isMandalaExpressive: currentTheme === 'mandala',
      timestamp: new Date().toLocaleTimeString()
    });
    logThemeCheck.current = now;
  }

  // Render Mandala View for mandala theme
  if (currentTheme === 'mandala') {
    console.log('🌀 Rendering MandalaView...');
    return (
      <div className="relative w-full h-screen overflow-hidden" style={{
        fontFamily: themeConfig.typography.primary,
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.text
      }}>
        <MandalaView />
        
        {/* Settings panel still available */}
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
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-700"
      style={{
        background: themeConfig.colors.background,
        filter: isTransitioning ? 'blur(1px)' : 'none'
      }}
    >
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-yellow-200/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center w-full">
        {/* MinimalistTimeSymbol removed - replaced by dynamic WindWhirlField around mandala */}

        {/* Time Scale Column on the left */}
        <TimeScaleColumn
          currentScale={timeScale}
          onScaleChange={setTimeScale}
        />
        
        {/* Unified Settings Panel */}
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
        
        {/* Hover-Based Insights System */}
        <HoverBasedInsights
          currentTimeSlices={[]}
          recentInteractions={mockInteractions}
          awarenessState={null}
          onDismiss={() => {}}
          onExplore={() => {
            setShowInsightPanel(true);
          }}
        >
          {/* Fractal Time Zoom Manager wrapped in hover detection */}
          <FractalTimeZoomManager
            currentScale={timeScale}
            onScaleChange={setTimeScale}
            reflectivePlayback={reflectiveMode}
            className="w-full h-[700px] relative"
          >
            {(zoomProps) => (
              <div className="flex justify-center">
                <svg width="700" height="700" className="drop-shadow-2xl">
                  {renderTimelineContent(zoomProps)}
                </svg>
              </div>
            )}
          </FractalTimeZoomManager>
        </HoverBasedInsights>

        {/* Ritual Companion Dialog */}
        <RitualCompanion
          currentPhase={currentLifePhase.currentPhase}
          isOpen={showRitualCompanion}
          onClose={() => setShowRitualCompanion(false)}
          centerX={350}
          centerY={350}
        />
        

        {/* Bottom-Right Navigation Stack - All controls consolidated */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
          {/* Skins Menu */}
          <SkinsMenuButton />
          
          {/* Tools Menu */}
          <ToolsMenuButton
            activeTool={activeTool}
            onToolSelect={setActiveTool}
          />
          
          {/* Zoom Menu */}
          <ZoomMenuButton
            currentScale={timeScale}
            onScaleChange={setTimeScale}
            onTimeNavigate={handleTimeNavigate}
            currentDate={currentDate}
          />
          
          {/* Settings Button */}
          <EnhancedSettingsButton
            onClick={() => setShowSettings(!showSettings)}
            isOpen={showSettings}
          />
        </div>

        {/* Active Tool Overlays */}
        <svg className="fixed inset-0 pointer-events-none z-45" width="100%" height="100%">
          <TouchTool
            isActive={activeTool === 'touch'}
            onMomentTouch={(moment) => {
              console.log('🫧 Moment touched:', moment);
            }}
            centerX={350}
            centerY={350}
          />

          <FixTool
            isActive={activeTool === 'fix'}
            onMomentFix={(moment) => {
              console.log('🧲 Moment fixed:', moment);
            }}
            centerX={350}
            centerY={350}
          />

          <ScaleTool
            isActive={activeTool === 'scale'}
            onScaleGesture={(gesture) => {
              console.log('🌀 Scale gesture:', gesture);
            }}
            centerX={350}
            centerY={350}
            currentScale={timeScale}
          />
        </svg>

        {/* Wallet Currency Panel */}
        <WalletCurrencyPanel
          isVisible={showWalletPanel}
          onClose={() => setShowWalletPanel(false)}
          position={walletPanelPosition}
          timeScale={timeScale}
        />

        {/* Layer Button Menu - Right Side Vertical Portal System */}
        <LayerButtonMenu
          onLayerClick={(layerType, position, layerData) => {
            openPopOut(layerType, position, layerData, `Last ${timeScale === 'day' ? '24 hours' : timeScale === 'week' ? '7 days' : timeScale === 'month' ? '30 days' : '365 days'}`);
            setActiveLayer(layerType);
            // Track consciousness interaction
            consciousnessTracker.trackInteraction(layerType, position.x, position.y);
            // Track wallet activity
            mockWalletTracker.trackActivity(
              layerType as 'mood' | 'mobility' | 'plans' | 'sleep', 
              3, 
              `Opened ${layerType} insight panel`
            );
          }}
          activeLayer={activeLayer}
          theme={currentTheme}
        />

        {/* Layer Pop-Out Insight Panel */}
        <LayerPopOutPanel
          isOpen={popOutState.isOpen}
          onClose={() => {
            closePopOut();
            setActiveLayer(undefined);
          }}
          layerType={popOutState.layerType}
          layerData={popOutState.layerData}
          position={popOutState.position}
          timeRange={popOutState.timeRange}
          currentTimeScale={timeScale}
          theme={currentTheme}
        />

        {/* Settings Panel */}
        {showSettings && (
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
        )}
      </div>
    </div>
  );
};


// Main Index component with theme provider
const Index = () => {
  return (
    <SmoothFlowProvider showPerformanceMonitor={process.env.NODE_ENV === 'development'}>
      <PerformanceOptimizer>
        <VisualSkinProvider defaultTheme="cosmic">
          <TimeAxisProvider>
            <PhaseTransitionManager 
              userProfile={{ totalInteractions: 0, discoveredCorrelations: [], layerPreferences: {}, behaviorPatterns: { explorationStyle: 'gentle' }, lastActiveDate: new Date().toISOString() }}
              recentInteractions={[
                { layerType: 'mood', timestamp: new Date().toISOString(), dataValue: 0.7 },
                { layerType: 'sleep', timestamp: new Date().toISOString(), dataValue: 0.8 }
              ]}
            >
              <IndexContent />
            </PhaseTransitionManager>
            <ThemeHaikuDisplay />
          </TimeAxisProvider>
        </VisualSkinProvider>
      </PerformanceOptimizer>
    </SmoothFlowProvider>
  );
};

export default Index;