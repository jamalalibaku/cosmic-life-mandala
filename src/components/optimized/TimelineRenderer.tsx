/**
 * Optimized Timeline Renderer - Split from massive IndexContent
 */

import React, { memo } from 'react';
import { TimeScale } from '@/components/fractal-time-zoom-manager';
import { SkyArcGradient } from '@/components/sky-arc-gradient';
import { SunAuraRing } from '@/components/sun-aura-ring';
import { CosmicSunburstLayer } from '@/components/cosmic-sunburst-layer';
import { RadialFractalView } from '@/components/radial-fractal-view';
import WeatherSunburst from '@/components/weather-sunburst';
import { DataBlobRing } from '@/components/enhanced/DataBlobRing';
import { EnhancedVinylGrooveFilter } from '@/components/interactions/VinylGrooveFilter';
import { PlansLayerRing } from '@/components/plans-layer-ring';
import { EnhancedWeatherRing } from '@/components/enhanced/EnhancedWeatherRing';
import { usePreprocessedData } from '@/contexts/PreprocessedDataContext';
import { useAppState } from '@/contexts/AppStateContext';

interface TimelineRendererProps {
  scale: TimeScale;
  transitionProgress: number;
  zoomLevel: number;
  isTransitioning: boolean;
  currentTheme: string;
  onMoodChange: (mood: any) => void;
}

const TimelineRenderer = memo(({ 
  scale, 
  transitionProgress, 
  zoomLevel, 
  isTransitioning, 
  currentTheme, 
  onMoodChange 
}: TimelineRendererProps) => {
  const { state } = useAppState();
  const { weatherForDay, sleepQuality, mobilityLevel, weatherCondition, mockData } = usePreprocessedData();
  
  const centerX = 350;
  const centerY = 350;
  
  // Render Side View disabled
  if (scale === 'side') {
    return null;
  }
  
  const cityLocation = {
    berlin: { lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin' },
    baku: { lat: 40.4093, lng: 49.8671, timezone: 'Asia/Baku' },
    tokyo: { lat: 35.6762, lng: 139.6503, timezone: 'Asia/Tokyo' },
    new_york: { lat: 40.7128, lng: -74.0060, timezone: 'America/New_York' },
    london: { lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' }
  }[state.selectedCity];
  
  const timeOfDay = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 15) return 'noon';
    if (hour >= 15 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 20) return 'sunset';
    if (hour >= 20 && hour < 22) return 'dusk';
    return 'night';
  })();
  
  return (
    <g>
      {/* Sky Arc Gradient - Day/Night cycle */}
      {scale === 'day' && (
        <SkyArcGradient
          centerX={centerX}
          centerY={centerY}
          innerRadius={50}
          outerRadius={400}
          theme={currentTheme}
          showSunMoon={true}
          cityLocation={cityLocation}
        />
      )}
      
      {/* Sun Aura Ring - Breathing center */}
      <SunAuraRing
        centerX={centerX}
        centerY={centerY}
        radius={55}
        theme={currentTheme}
        isPlaybackActive={state.showPlayback}
        activeLayerRadius={scale === 'day' ? 340 : 320}
        timeOfDay={timeOfDay}
      />
      
      {/* Cosmic sunburst aura layer */}
      <CosmicSunburstLayer
        centerX={centerX}
        centerY={centerY}
        innerRadius={60}
        maxRadius={320}
        theme="sunfire"
        poetryMode={state.reflectiveMode}
      />
      
      {/* Fractal View - unified geometry */}
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
        <DayTimelineContent 
          centerX={centerX}
          centerY={centerY}
          currentTheme={currentTheme}
          weatherForDay={weatherForDay}
          mockData={mockData}
          sleepQuality={sleepQuality}
          mobilityLevel={mobilityLevel}
          weatherCondition={weatherCondition}
          onMoodChange={onMoodChange}
          reflectiveMode={state.reflectiveMode}
          poetryMode={state.poetryMode}
          showLayerDebug={state.showLayerDebug}
        />
      )}
    </g>
  );
});

const DayTimelineContent = memo(({ 
  centerX, 
  centerY, 
  currentTheme, 
  weatherForDay, 
  mockData,
  sleepQuality,
  mobilityLevel,
  weatherCondition,
  onMoodChange,
  reflectiveMode,
  poetryMode,
  showLayerDebug
}: any) => (
  <>
    {/* Core weather visualization */}
    <WeatherSunburst
      weatherData={weatherForDay}
      centerX={centerX}
      centerY={centerY}
      innerRadius={80}
      outerRadius={140}
    />
    
    {/* Sleep layer */}
    <g>
      <defs>
        <EnhancedVinylGrooveFilter
          filterId="sleep-groove-filter"
          intensity={0.4}
          speed={0.3}
          ringType="sleep"
        />
      </defs>
      <g filter="url(#sleep-groove-filter)">
        <DataBlobRing
          data={mockData.sleep}
          centerX={centerX}
          centerY={centerY}
          innerRadius={150}
          outerRadius={180}
          type="sleep"
          label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "SLEEP DATA" : undefined}
          sleepQuality={sleepQuality}
          mobilityLevel={mobilityLevel}
          weatherCondition={weatherCondition}
        />
      </g>
    </g>

    {/* Mood layer */}
    <g>
      <defs>
        <EnhancedVinylGrooveFilter
          filterId="mood-groove-filter"
          intensity={0.6}
          speed={0.5}
          ringType="mood"
        />
      </defs>
      <g filter="url(#mood-groove-filter)">
        <DataBlobRing
          data={mockData.mood}
          centerX={centerX}
          centerY={centerY}
          innerRadius={190}
          outerRadius={220}
          type="mood"
          label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "MOOD DATA" : undefined}
          sleepQuality={sleepQuality}
          mobilityLevel={mobilityLevel}
          weatherCondition={weatherCondition}
          onMoodChange={onMoodChange}
        />
      </g>
    </g>

    {/* Mobility layer */}
    <g>
      <defs>
        <EnhancedVinylGrooveFilter
          filterId="mobility-groove-filter"
          intensity={0.8}
          speed={0.7}
          ringType="mobility"
        />
      </defs>
      <g filter="url(#mobility-groove-filter)">
        <DataBlobRing
          data={mockData.mobility}
          centerX={centerX}
          centerY={centerY}
          innerRadius={230}
          outerRadius={260}
          type="mobility"
          label={(!reflectiveMode && !poetryMode && !showLayerDebug) ? undefined : showLayerDebug ? "MOBILITY DATA" : undefined}
          sleepQuality={sleepQuality}
          mobilityLevel={mobilityLevel}
          weatherCondition={weatherCondition}
        />
      </g>
    </g>

    {/* Plans layer */}
    <PlansLayerRing
      plansData={mockData.plans}
      centerX={centerX}
      centerY={centerY}
      radius={285}
      theme={currentTheme}
      onPlanClick={() => {}}
    />

    {/* Weather ring - outermost */}
    <EnhancedWeatherRing
      centerX={centerX}
      centerY={centerY}
      innerRadius={310}
      outerRadius={340}
      theme={currentTheme as any}
    />
  </>
));

TimelineRenderer.displayName = 'TimelineRenderer';
DayTimelineContent.displayName = 'DayTimelineContent';

export { TimelineRenderer };