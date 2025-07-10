import { useState } from 'react';
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
import { FractalTimeZoomManager, TimeScale } from '@/components/fractal-time-zoom-manager';
import { RadialWeekView } from '@/components/radial-week-view';
import { RadialMonthView } from '@/components/radial-month-view';
import { RadialYearView } from '@/components/radial-year-view';
import { mockWeatherData } from '@/data/weatherData';
import { mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';
import { mockWeekData, mockMonthData, mockYearData } from '@/data/mock-temporal-data';
import { mockFriends } from '@/data/mock-friend-data';
import { mockInsightData } from '@/data/mock-insight-data';
import { calculateLayerInteraction } from '@/utils/mood-engine';
import { MoodInfluence } from '@/utils/mood-engine';

const Index = () => {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [reflectiveMode, setReflectiveMode] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showTideRings, setShowTideRings] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | undefined>();
  const [activeLayer, setActiveLayer] = useState<string | undefined>();
  const [currentMood, setCurrentMood] = useState<MoodInfluence | null>(null);

  // Calculate current life metrics for mood engine
  const currentMetrics = {
    sleepQuality: mockSleepData.reduce((sum, d) => sum + d.intensity, 0) / mockSleepData.length,
    planDensity: 0.6, // Mock value
    weatherCondition: (mockWeatherToday[0]?.condition === 'storm' ? 'stormy' : 
                      mockWeatherToday[0]?.condition || 'sunny') as 'sunny' | 'cloudy' | 'rainy' | 'stormy',
    mobilityLevel: mockMobilityData.reduce((sum, d) => sum + d.intensity, 0) / mockMobilityData.length
  };

  const renderTimelineContent = ({ scale, transitionProgress, zoomLevel, isTransitioning }: {
    scale: TimeScale;
    transitionProgress: number;
    zoomLevel: number;
    isTransitioning: boolean;
  }) => {
    const centerX = 350;
    const centerY = 350;
    
    return (
      <>
        {/* Always present: Cosmic sunburst aura layer */}
        <CosmicSunburstLayer
          centerX={centerX}
          centerY={centerY}
          innerRadius={60}
          maxRadius={320}
          theme="sunfire"
          poetryMode={reflectiveMode}
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
              label={!reflectiveMode ? "rest" : undefined}
              {...currentMetrics}
            />
            
            <DataBlobRing
              data={mockMoodData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={250}
              outerRadius={290}
              type="mood"
              label={!reflectiveMode ? currentMood?.description || "mood" : undefined}
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
              label={!reflectiveMode ? "movement" : undefined}
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
          <RadialMonthView
            monthData={mockMonthData}
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

        {/* Center time display - adapts to scale */}
        {!reflectiveMode && scale !== 'day' && (
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
              y={centerY - 15}
              textAnchor="middle"
              className="fill-yellow-200 text-sm font-light"
            >
              NOW
            </text>
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
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Starfield background */}
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
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-400 bg-clip-text">
          Cosmic Life Mandala
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Fractal Timeline Visualization
        </p>
        
        {/* Mode toggles */}
        <div className="mb-8 flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setReflectiveMode(!reflectiveMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              reflectiveMode
                ? 'bg-yellow-200/20 text-yellow-200 border border-yellow-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {reflectiveMode ? '⧖ poetry mode' : '◎ interface mode'}
          </button>
          
          <button
            onClick={() => setShowFriends(!showFriends)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showFriends
                ? 'bg-purple-200/20 text-purple-200 border border-purple-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {showFriends ? '🫂 friends visible' : '○ show friends'}
          </button>

          <button
            onClick={() => setShowInsights(!showInsights)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showInsights
                ? 'bg-blue-200/20 text-blue-200 border border-blue-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {showInsights ? '✨ insights active' : '◐ show insights'}
          </button>

          <button
            onClick={() => setShowPlayback(!showPlayback)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showPlayback
                ? 'bg-green-200/20 text-green-200 border border-green-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {showPlayback ? '▶ reflecting' : '⧖ reflect time'}
          </button>

          <button
            onClick={() => setShowTideRings(!showTideRings)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              showTideRings
                ? 'bg-cyan-200/20 text-cyan-200 border border-cyan-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {showTideRings ? '🌊 tides flowing' : '~ show connections'}
          </button>
        </div>
        
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

export default Index;