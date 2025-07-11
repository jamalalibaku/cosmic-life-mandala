/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect } from 'react';
import { TimeAxisProvider } from '@/contexts/TimeAxisContext';
import WeatherSunburst from '@/components/weather-sunburst';
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
import { SkyArcGradient } from '@/components/sky-arc-gradient';
import { NowIndicator } from '@/components/now-indicator';
import { useTimeDrift } from '@/hooks/use-time-drift';
import { FractalTimeZoomManager, TimeScale } from '@/components/fractal-time-zoom-manager';
import { RadialWeekView } from '@/components/radial-week-view';
import { RadialMonthView } from '@/components/radial-month-view';
import { RadialMonthConstellation } from '@/components/radial-month-constellation';
import { RadialYearView } from '@/components/radial-year-view';
import { RadialYearSeasons } from '@/components/radial-year-seasons';
import { RadialFractalView } from '@/components/radial-fractal-view';
import { InsightOrbitRing } from '@/components/insight-orbit-ring';
import { MoonPhaseMarker } from '@/components/moon-phase-marker';
import { DataLayerLabels } from '@/components/data-layer-labels';
import { LayerPopOutPanel } from '@/components/LayerPopOutPanel';
import { ManualZoomControls } from '@/components/ManualZoomControls';
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
import { BehavioralTools } from '@/components/interactions/BehavioralTools';

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
  const [activeBehavioralTool, setActiveBehavioralTool] = useState<'touch' | 'fix' | 'scale' | null>(null);

  // Life phase detection and awareness rhythm
  const userProfile = getUserInsightProfile();
  const mockInteractions = [
    { layerType: 'mood', timestamp: new Date().toISOString(), dataValue: 0.7 },
    { layerType: 'sleep', timestamp: new Date().toISOString(), dataValue: 0.8 },
    { layerType: 'mobility', timestamp: new Date().toISOString(), dataValue: 0.6 }
  ];
  const currentLifePhase = detectLifePhase(userProfile, mockInteractions);
  const phaseTheme = usePhaseTheme(currentLifePhase.currentPhase);
  
  // Enhanced awareness rhythm system
  const { awarenessState, clearAwarenessMessage, onDataClick } = useEnhancedAwarenessRhythm({
    userProfile,
    recentInteractions: mockInteractions,
    explorationStyle: (['gentle', 'analytical', 'intuitive', 'playful'].includes(userProfile.behaviorPatterns?.explorationStyle) 
      ? userProfile.behaviorPatterns?.explorationStyle 
      : 'gentle') as 'gentle' | 'analytical' | 'intuitive' | 'playful',
    onPhaseTransition: (transition) => {
      console.log('🌀 Phase transition detected:', transition);
    },
    onInsightOpportunity: () => {
      // Glow the Intelligence button or show notification
    },
    ambientInsightFrequency: 25 // Show ambient insights every 25 minutes
  });

  // Consciousness tracking system
  const consciousnessTracker = useConsciousnessTracker({
    currentPhase: currentLifePhase.currentPhase,
    centerX: 350,
    centerY: 350,
    enabled: true
  });

  // Layer pop-out panel system
  const { popOutState, openPopOut, closePopOut, togglePopOut } = useLayerPopOut();

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
    
    
    return (
      <g transform={timeDrift.getDriftTransform(centerX, centerY)}>
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
        
        {/* Always present: Cosmic sunburst aura layer */}
        <CosmicSunburstLayer
          centerX={centerX}
          centerY={centerY}
          innerRadius={60}
          maxRadius={320}
          theme="sunfire"
          poetryMode={reflectiveMode}
        />
        
        {/* Fractal View - unified geometry for all scales */}
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
            
            {/* Data rings in proper hierarchy (inner → outer) */}
            {/* 5. Sleep - Innermost data ring */}
            <DataBlobRing
              data={mockSleepData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={150}
              outerRadius={180}
              type="sleep"
              label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "SLEEP DATA" : undefined}
              {...currentMetrics}
            />
            
            {/* 4. Mood */}
            <DataBlobRing
              data={mockMoodData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={190}
              outerRadius={220}
              type="mood"
              label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "MOOD DATA" : undefined}
              {...currentMetrics}
              onMoodChange={setCurrentMood}
            />
            
            {/* 3. Mobility */}
            <DataBlobRing
              data={mockMobilityData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={230}
              outerRadius={260}
              type="mobility"
              label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "MOBILITY DATA" : undefined}
              {...currentMetrics}
            />
            
            {/* 2. Plans - Data-driven ring when active */}
            {mockPlansData.length > 0 && (
              <circle
                cx={centerX}
                cy={centerY}
                r={285}
                fill="none"
                stroke={currentTheme === 'horizons' ? 'hsl(280 30% 70%)' : 'hsl(240 20% 60%)'}
                strokeWidth="0.5"
                strokeDasharray="4,12"
                opacity="0.2"
              />
            )}
            
            {/* 1. Weather - Atmospheric Outermost Ring */}
            <AtmosphericWeatherRing
              weatherData={mockWeatherToday}
              centerX={centerX}
              centerY={centerY}
              innerRadius={295}
              outerRadius={325}
              theme={currentTheme as any}
              showDebug={false}
              className="atmospheric-weather-layer"
            />
          </>
        )}
        
        {scale === 'week' && (
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
        )}
        
        {scale === 'month' && (
          <RadialMonthConstellation
            monthData={mockMonthData.map(day => ({
              ...day,
              moodColor: currentMood?.primaryColor || 'hsl(280 70% 60%)',
              weatherIcon: day.weatherBand === 'sunny' ? '☀️' : 
                          day.weatherBand === 'rainy' ? '🌧️' : '☁️',
              activityLevel: day.sleepMoodPulse,
              emotionalPattern: currentMood?.moodType || 'calm'
            }))}
            centerX={centerX}
            centerY={centerY}
            radius={300}
            theme="cosmic"
            onDayClick={(day) => {
              console.log('Day clicked:', day);
              setTimeScale('day');
            }}
          />
        )}
        
        {scale === 'year' && (
          <RadialYearSeasons
            yearData={mockYearData.map(month => ({
              ...month,
              dominantMood: currentMood?.moodType === 'joyful' ? 'energetic' :
                           currentMood?.moodType === 'drained' ? 'restful' :
                           currentMood?.moodType === 'tense' ? 'chaotic' :
                           currentMood?.moodType === 'creative' ? 'creative' : 'calm',
              averageSleep: month.dataSummary.avgSleep,
              peakMobilityDay: Math.round(month.dataSummary.avgActivity * 30),
              weatherSummary: month.dataSummary.dominantWeather,
              totalActiveDays: Math.round(month.dataSummary.avgActivity * 31)
            }))}
            centerX={centerX}
            centerY={centerY}
            radius={320}
            theme="seasonal"
            onMonthClick={(month) => {
              console.log('Month clicked:', month);
              setTimeScale('month');
            }}
          />
        )}
        
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

        {/* Ripple Consciousness Visualization */}
        <RippleVisualization
          centerX={centerX}
          centerY={centerY}
        />

        {/* Friend Orbit Ring - Social connections */}
        {scale === 'day' && (
          <FriendOrbitRing
            friends={mockFriends}
            centerX={centerX}
            centerY={centerY}
            radius={360}
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

        {/* Data Layer Labels - positioned vertically on the right with proper hierarchy */}
        {scale === 'day' && !poetryMode && (
          <DataLayerLabels
            centerX={centerX}
            centerY={centerY}
            labels={[
              { 
                id: 'weather-label', 
                text: 'Weather', 
                layer: 'weather' as const, 
                radius: 310, 
                isActive: true, 
                theme: currentTheme 
              },
              { 
                id: 'plans-label', 
                text: 'Plans', 
                layer: 'plans' as const, 
                radius: 285, 
                isActive: false, 
                theme: currentTheme 
              },
              { 
                id: 'mobility-label', 
                text: 'Mobility', 
                layer: 'mobility' as const, 
                radius: 245, 
                isActive: true, 
                theme: currentTheme 
              },
              { 
                id: 'mood-label', 
                text: 'Mood', 
                layer: 'mood' as const, 
                radius: 205, 
                isActive: true, 
                theme: currentTheme 
              },
               { 
                id: 'sleep-label', 
                text: 'Sleep', 
                layer: 'sleep' as const, 
                radius: 165, 
                isActive: true, 
                theme: currentTheme 
              },
              { 
                id: 'wallet-label', 
                text: 'Wallet', 
                layer: 'wallet' as const, 
                radius: 40, 
                isActive: true, 
                theme: currentTheme 
              }
            ]}
            theme={currentTheme}
            showDebug={showLayerDebug}
            onLabelClick={(layerType, position, layerData) => {
              // Trigger data click insight
              onDataClick(layerType);
              // Track the interaction for consciousness system
              consciousnessTracker.trackInteraction(layerType, position.x, position.y);
              // Open the insight panel
              togglePopOut(layerType, position, layerData, `Last 7 days`);
            }}
            layerDataMap={{
              weather: mockWeatherData,
              plans: mockPlansData,
              mobility: mockMobilityData,
              mood: mockMoodData,
              sleep: mockSleepData,
              wallet: [] // Wallet currency tracking
            }}
          />
        )}

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


        {/* NOW Indicator - appears at appropriate position for each scale */}
        <NowIndicator
          centerX={centerX}
          centerY={centerY}
          radius={scale === 'day' ? 350 : 
                  scale === 'week' ? 300 : 
                  scale === 'month' ? 320 : 340}
          timeScale={scale}
          theme={currentTheme}
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

  console.log('🎨 Current theme check:', { 
    currentTheme, 
    isMandalaExpressive: currentTheme === 'mandala',
    timestamp: new Date().toLocaleTimeString()
  });

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
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center w-full">
        <h1 
          className={`text-6xl font-bold mb-4 text-transparent bg-clip-text transition-all duration-500 ${poetryMode ? 'opacity-30 text-sm' : 'opacity-100'}`}
          style={{
            backgroundImage: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.accent})`,
            fontFamily: themeConfig.typography.primary
          }}
        >
          {poetryMode ? 'silence, symbols, and stillness' : 'Cosmic Life Mandala'}
        </h1>
        <p 
          className={`text-xl mb-8 transition-all duration-500 ${poetryMode ? 'opacity-0' : 'opacity-100'}`}
          style={{ color: themeConfig.colors.text }}
        >
          {themeConfig.description}
        </p>
        
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
        
        {/* Awareness Notification System */}
        <AwarenessNotification
          message={awarenessState.awarenessMessage}
          isVisible={!!awarenessState.awarenessMessage}
          onDismiss={clearAwarenessMessage}
          onExplore={() => {
            setShowInsightPanel(true);
            clearAwarenessMessage();
          }}
        />

        {/* Ritual Companion Dialog */}
        <RitualCompanion
          currentPhase={currentLifePhase.currentPhase}
          isOpen={showRitualCompanion}
          onClose={() => setShowRitualCompanion(false)}
          centerX={350}
          centerY={350}
        />
        
        {/* Fractal Time Zoom Manager */}
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

        {/* Enhanced Manual Zoom Controls - Replaces zoom dial */}
        <ManualZoomControls
          currentScale={timeScale}
          onScaleChange={setTimeScale}
          onTimeNavigate={handleTimeNavigate}
          currentDate={currentDate}
          position="top"
        />

        {/* Behavioral Tools - Adria's Emotional Interaction Design */}
        <BehavioralTools
          centerX={350}
          centerY={350}
          currentScale={timeScale}
          isVisible={true}
          onToolActivate={setActiveBehavioralTool}
        />

        {/* Layer Pop-Out Insight Panel */}
        <LayerPopOutPanel
          isOpen={popOutState.isOpen}
          onClose={closePopOut}
          layerType={popOutState.layerType}
          layerData={popOutState.layerData}
          position={popOutState.position}
          timeRange={popOutState.timeRange}
          currentTimeScale={timeScale}
          theme={currentTheme}
        />
      </div>
    </div>
  );
};


// Main Index component with theme provider
const Index = () => {
  return (
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
  );
};

export default Index;