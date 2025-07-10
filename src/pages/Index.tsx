/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect } from 'react';
import WeatherSunburst from '@/components/weather-sunburst';
import { WeatherSunburstRing } from '@/components/weather-sunburst-ring';
import { CosmicSunburstLayer } from '@/components/cosmic-sunburst-layer';
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
import { mockWeatherData } from '@/data/weatherData';
import { mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';
import { mockWeekData, mockMonthData, mockYearData } from '@/data/mock-temporal-data';
import { mockFriends } from '@/data/mock-friend-data';
import { mockInsightData } from '@/data/mock-insight-data';
import { calculateLayerInteraction } from '@/utils/mood-engine';
import { MoodInfluence } from '@/utils/mood-engine';
import { Theme, themeConfigs } from '@/utils/theme-configs';
import { generateInsights } from '@/utils/insight-engine';
import { SettingsPanel } from '@/components/settings-panel';

const IndexContent = () => {
  const { themeConfig, isTransitioning, currentTheme } = useVisualSkin();
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
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

  // Handle keyboard escape to exit poetry mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && poetryMode) {
        setPoetryMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [poetryMode]);

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
            {/* Data blob rings (life data layers) with emotional reactivity */}
            <DataBlobRing
              data={mockSleepData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={200}
              outerRadius={240}
              type="sleep"
              label={!reflectiveMode && !poetryMode ? "rest" : undefined}
              {...currentMetrics}
            />
            
            <DataBlobRing
              data={mockMoodData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={250}
              outerRadius={290}
              type="mood"
              label={!reflectiveMode && !poetryMode ? currentMood?.description || "mood" : undefined}
              {...currentMetrics}
              onMoodChange={setCurrentMood}
            />
            
            <DataBlobRing
              data={mockMobilityData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={300}
              outerRadius={340}
              type="mobility"
              label={!reflectiveMode && !poetryMode ? "movement" : undefined}
              {...currentMetrics}
            />
            
            {/* Original weather sunburst (inner core) */}
            <WeatherSunburst
              weatherData={mockWeatherData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={80}
              outerRadius={140}
            />
            
            {/* Weather ring (middle layer) */}
            <WeatherSunburstRing
              weatherData={mockWeatherToday}
              centerX={centerX}
              centerY={centerY}
              innerRadius={150}
              outerRadius={190}
              theme="cosmic"
              showIcons={true}
              showSkyGradient={true}
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
            onClick={() => setShowInsights(!showInsights)}
          />
        )}

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

        {/* Insight Overlay Engine */}
        <InsightOverlayEngine
          insights={mockInsightData}
          currentView={scale}
          centerX={centerX}
          centerY={centerY}
          maxRadius={360}
          activeLayer={activeLayer}
          hoveredElement={hoveredLayer}
          isVisible={showInsights || hoveredLayer !== undefined}
          onInsightClick={(insight) => {
            console.log('Insight clicked:', insight);
            setActiveLayer(insight.sourceLayer);
          }}
        />

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

        {/* AI Insight Orbit Ring */}
        <InsightOrbitRing
          insights={aiInsights}
          centerX={centerX}
          centerY={centerY}
          baseRadius={scale === 'day' ? 380 : scale === 'week' ? 340 : scale === 'month' ? 360 : 380}
          isVisible={showAIInsights && !poetryMode}
          currentTimeScale={scale}
          theme={currentTheme}
          onInsightClick={(insight) => {
            console.log('AI Insight clicked:', insight);
          }}
        />

        {/* Moon Phase Marker - outer ring */}
        <MoonPhaseMarker
          centerX={centerX}
          centerY={centerY}
          radius={420}
          theme={currentTheme}
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

        {/* Center time display for non-day scales */}
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
      </div>
    </div>
  );
};


// Main Index component with theme provider
const Index = () => {
  return (
    <VisualSkinProvider defaultTheme="default">
      <IndexContent />
      <ThemeHaikuDisplay />
    </VisualSkinProvider>
  );
};

export default Index;