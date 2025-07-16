/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useMemo } from 'react';
import { TimeAxisProvider } from '@/contexts/TimeAxisContext';
import { AppStateProvider, useAppState } from '@/contexts/AppStateContext';
import { PreprocessedDataProvider, usePreprocessedData } from '@/contexts/PreprocessedDataContext';
import { TimelineRenderer } from '@/components/optimized/TimelineRenderer';
import { useKeyboardHandlers, useTimeNavigation } from '@/components/optimized/NavigationHandlers';
import { AtmosphericWeatherRing } from '@/components/atmospheric-weather-ring';

import { VanGoghMandalaView } from '@/components/mandala/VanGoghMandalaView';
import { VanGoghView } from '@/components/van-gogh/VanGoghView';
import { UserCore } from '@/components/user-core';
import { FriendOrbitRing } from '@/components/friend-orbit-ring';
import { RadialInsightsOverlay } from '@/components/radial-insights-overlay';
import { PlaybackReflector } from '@/components/playback-reflector';
import { EmotionalTideRings } from '@/components/emotional-tide-rings';
import { VisualSkinProvider, useVisualSkin } from '@/components/visual-skin-provider';
import { ThemeHaikuDisplay } from '@/components/theme-haiku-display';
import { PoetryOverlay } from '@/components/poetry-overlay';

import { AdaptivePerformanceProvider } from '@/components/performance/AdaptivePerformanceManager';
import { PerformanceModeProvider, usePerformanceMode } from '@/components/performance/PerformanceModeProvider';
import { PerformanceModeToggle } from '@/components/performance/PerformanceModeToggle';
import { MusicalNowIndicator } from '@/components/interactions/MusicalNowIndicator';
import { SideView } from '@/components/mandala/SideView';
import { useTimeDrift } from '@/hooks/use-time-drift';
import { FractalTimeZoomManager, TimeScale } from '@/components/fractal-time-zoom-manager';

import { RadialWeekView } from '@/components/radial-week-view';
import { RadialMonthView } from '@/components/radial-month-view';
import { RadialMonthConstellation } from '@/components/radial-month-constellation';
import { RadialYearView } from '@/components/radial-year-view';
import { RadialYearSeasons } from '@/components/radial-year-seasons';
import { InsightOrbitRing } from '@/components/insight-orbit-ring';
import { MoonPhaseMarker } from '@/components/moon-phase-marker';
import { LayerPopOutPanel } from '@/components/LayerPopOutPanel';
import { DataLayerLabels } from '@/components/data-layer-labels';
import { SunCoreMesh } from '@/components/enhanced/SunCoreMesh';
import { CelestialGlyph } from '@/components/enhanced/CelestialGlyph';

import { ZoomMenuButton } from '@/components/navigation/ZoomMenuButton';
import { ToolsMenuButton } from '@/components/navigation/ToolsMenuButton';
import { SkinsMenuButton } from '@/components/navigation/SkinsMenuButton';
import { TouchTool } from '@/components/interactions/TouchTool';
import { FixTool } from '@/components/interactions/FixTool';
import { ScaleTool } from '@/components/interactions/ScaleTool';
import { useLayerPopOut } from '@/hooks/useLayerPopOut';
import { MoodInfluence } from '@/utils/mood-engine';
import { SettingsPanel } from '@/components/settings-panel';
import { PhaseTransitionManager } from '@/components/PhaseTransitionManager';
import { usePhaseTheme } from '@/hooks/usePhaseTheme';
import { useEnhancedAwarenessRhythm } from '@/hooks/useEnhancedAwarenessRhythm';
import { AwarenessNotification } from '@/components/AwarenessNotification';
import { RitualCompanion } from '@/components/RitualCompanion';
import { RippleVisualization } from '@/components/RippleVisualization';
import { useConsciousnessTracker } from '@/hooks/useConsciousnessTracker';
import { WalletCurrencyPanel } from '@/components/enhanced/WalletCurrencyPanel';
import { EnhancedSettingsButton } from '@/components/enhanced/EnhancedSettingsButton';
import { MinimalistTimeSymbol } from '@/components/MinimalistTimeSymbol';
import { TimeScaleColumn } from '@/components/TimeScaleColumn';
import { HoverBasedInsights } from '@/components/HoverBasedInsights';
import { WalletDisplay } from '@/components/WalletDisplay';
import { SunburstGrooveField } from '@/components/enhanced/SunburstGrooveField';
import { LayerButtonMenu } from '@/components/LayerButtonMenu';


const AppWithPerformanceMode = () => {
  const { isPerformanceMode } = usePerformanceMode();
  
  return (
    <div className={`${isPerformanceMode ? 'performance-mode' : ''}`}>
      <IndexContent />
      
      <PerformanceModeToggle />
    </div>
  );
};

const IndexContent = () => {
  const { themeConfig, isTransitioning, currentTheme } = useVisualSkin();
  const { state, dispatch } = useAppState();
  const { userProfile, currentLifePhase, mockInteractions } = usePreprocessedData();
  
  // Initialize keyboard handlers and time navigation
  useKeyboardHandlers();
  const { handleTimeNavigate } = useTimeNavigation();
  
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

  // Time drift hook for breathing and rotation with poetry mode adjustments
  const timeDrift = useTimeDrift({
    enabled: false,
    speed: 0,
    breathingEnabled: false,
    breathingIntensity: 0
  });

  // Get pre-computed AI insights for current theme
  const { insightsByTheme } = usePreprocessedData();
  const aiInsights = useMemo(() => insightsByTheme[currentTheme] || insightsByTheme['neo_cosmic'], [currentTheme, insightsByTheme]);

  const renderTimelineContent = ({ scale, transitionProgress, zoomLevel, isTransitioning }: {
    scale: TimeScale;
    transitionProgress: number;
    zoomLevel: number;
    isTransitioning: boolean;
  }) => {
    return (
      <TimelineRenderer 
        scale={scale}
        transitionProgress={transitionProgress}
        zoomLevel={zoomLevel}
        isTransitioning={isTransitioning}
        currentTheme={currentTheme}
        onMoodChange={(mood) => dispatch({ type: 'SET_CURRENT_MOOD', payload: mood })}
      />
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
          reflectiveMode={state.reflectiveMode}
          poetryMode={state.poetryMode}
          showFriends={state.showFriends}
          showInsights={state.showInsights}
          showPlayback={state.showPlayback}
          showTideRings={state.showTideRings}
          showAIInsights={false}
          onReflectiveModeChange={() => dispatch({ type: 'TOGGLE_REFLECTIVE_MODE' })}
          onPoetryModeChange={() => dispatch({ type: 'TOGGLE_POETRY_MODE' })}
          onShowFriendsChange={() => dispatch({ type: 'TOGGLE_FRIENDS' })}
          onShowInsightsChange={() => dispatch({ type: 'TOGGLE_INSIGHTS' })}
          onShowPlaybackChange={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}
          onShowTideRingsChange={() => dispatch({ type: 'TOGGLE_TIDE_RINGS' })}
          onShowAIInsightsChange={() => {}}
        />
        
        {/* Theme Haiku Display */}
        <ThemeHaikuDisplay 
          onComplete={() => dispatch({ type: 'TOGGLE_POETRY_MODE' })}
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

  // Render cosmic theme (mandala theme disabled)
  if (currentTheme === 'mandala') {
    // Fallback to cosmic theme
    console.log('🌀 Mandala theme disabled, using cosmic fallback');
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
            className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full"
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
          currentScale={state.timeScale}
          onScaleChange={(scale) => dispatch({ type: 'SET_TIME_SCALE', payload: scale })}
        />
        
        {/* Unified Settings Panel */}
        <SettingsPanel
          reflectiveMode={state.reflectiveMode}
          poetryMode={state.poetryMode}
          showFriends={state.showFriends}
          showInsights={state.showInsights}
          showPlayback={state.showPlayback}
          showTideRings={state.showTideRings}
          showAIInsights={false}
          onReflectiveModeChange={() => dispatch({ type: 'TOGGLE_REFLECTIVE_MODE' })}
          onPoetryModeChange={() => dispatch({ type: 'TOGGLE_POETRY_MODE' })}
          onShowFriendsChange={() => dispatch({ type: 'TOGGLE_FRIENDS' })}
          onShowInsightsChange={() => dispatch({ type: 'TOGGLE_INSIGHTS' })}
          onShowPlaybackChange={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}
          onShowTideRingsChange={() => dispatch({ type: 'TOGGLE_TIDE_RINGS' })}
          onShowAIInsightsChange={() => {}}
        />
        
        {/* Hover-Based Insights System */}
        <HoverBasedInsights
          currentTimeSlices={[]}
          recentInteractions={mockInteractions}
          awarenessState={null}
          onDismiss={() => {}}
          onExplore={() => {
            dispatch({ type: 'TOGGLE_INSIGHT_PANEL' });
          }}
        >
          {/* Fractal Time Zoom Manager wrapped in hover detection */}
          <FractalTimeZoomManager
            currentScale={state.timeScale}
            onScaleChange={(scale) => dispatch({ type: 'SET_TIME_SCALE', payload: scale })}
            reflectivePlayback={state.reflectiveMode}
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
          isOpen={state.showRitualCompanion}
          onClose={() => dispatch({ type: 'TOGGLE_RITUAL_COMPANION' })}
          centerX={350}
          centerY={350}
        />
        

        {/* Bottom-Right Navigation Stack - All controls consolidated */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
          {/* Skins Menu */}
          <SkinsMenuButton />
          
          {/* Tools Menu */}
          <ToolsMenuButton
            activeTool={state.activeTool}
            onToolSelect={(tool) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool })}
          />
          
          {/* Zoom Menu */}
          <ZoomMenuButton
            currentScale={state.timeScale}
            onScaleChange={(scale) => dispatch({ type: 'SET_TIME_SCALE', payload: scale })}
            onTimeNavigate={handleTimeNavigate}
            currentDate={state.currentDate}
          />
          
          {/* Settings Button */}
          <EnhancedSettingsButton
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            isOpen={state.showSettings}
          />
        </div>

        {/* Active Tool Overlays */}
        <svg className="fixed inset-0 pointer-events-none z-45" width="100%" height="100%">
          <TouchTool
            isActive={state.activeTool === 'touch'}
            onMomentTouch={(moment) => {
              console.log('🫧 Moment touched:', moment);
            }}
            centerX={350}
            centerY={350}
          />

          <FixTool
            isActive={state.activeTool === 'fix'}
            onMomentFix={(moment) => {
              console.log('🧲 Moment fixed:', moment);
            }}
            centerX={350}
            centerY={350}
          />

          <ScaleTool
            isActive={state.activeTool === 'scale'}
            onScaleGesture={(gesture) => {
              console.log('🌀 Scale gesture:', gesture);
            }}
            centerX={350}
            centerY={350}
            currentScale={state.timeScale}
          />
        </svg>

        {/* Wallet Currency Panel */}
        <WalletCurrencyPanel
          isVisible={state.showWalletPanel}
          onClose={() => dispatch({ type: 'TOGGLE_WALLET_PANEL' })}
          position={state.walletPanelPosition}
          timeScale={state.timeScale}
        />

        {/* Layer Button Menu - Right Side Vertical Portal System */}
        <LayerButtonMenu
          onLayerClick={(layerType, position, layerData) => {
            openPopOut(layerType, position, layerData, `Last ${state.timeScale === 'day' ? '24 hours' : state.timeScale === 'week' ? '7 days' : state.timeScale === 'month' ? '30 days' : '365 days'}`);
            dispatch({ type: 'SET_ACTIVE_LAYER', payload: layerType });
            // Track consciousness interaction
            consciousnessTracker.trackInteraction(layerType, position.x, position.y);
            // Track wallet activity
            mockWalletTracker.trackActivity(
              layerType as 'mood' | 'mobility' | 'plans' | 'sleep', 
              3, 
              `Opened ${layerType} insight panel`
            );
          }}
          activeLayer={state.activeLayer}
          theme={currentTheme}
        />

        {/* Layer Pop-Out Insight Panel */}
        <LayerPopOutPanel
          isOpen={popOutState.isOpen}
          onClose={() => {
            closePopOut();
            dispatch({ type: 'SET_ACTIVE_LAYER', payload: undefined });
          }}
          layerType={popOutState.layerType}
          layerData={popOutState.layerData}
          position={popOutState.position}
          timeRange={popOutState.timeRange}
          currentTimeScale={state.timeScale}
          theme={currentTheme}
        />

        {/* Settings Panel */}
        {state.showSettings && (
          <SettingsPanel
            reflectiveMode={state.reflectiveMode}
            poetryMode={state.poetryMode}
            showFriends={state.showFriends}
            showInsights={state.showInsights}
            showPlayback={state.showPlayback}
            showTideRings={state.showTideRings}
            showAIInsights={false}
            onReflectiveModeChange={() => dispatch({ type: 'TOGGLE_REFLECTIVE_MODE' })}
            onPoetryModeChange={() => dispatch({ type: 'TOGGLE_POETRY_MODE' })}
            onShowFriendsChange={() => dispatch({ type: 'TOGGLE_FRIENDS' })}
            onShowInsightsChange={() => dispatch({ type: 'TOGGLE_INSIGHTS' })}
            onShowPlaybackChange={() => dispatch({ type: 'TOGGLE_PLAYBACK' })}
            onShowTideRingsChange={() => dispatch({ type: 'TOGGLE_TIDE_RINGS' })}
            onShowAIInsightsChange={() => {}}
          />
        )}
      </div>
    </div>
  );
};


// Main Index component with theme provider
const Index = () => {
  return (
    <AdaptivePerformanceProvider>
      <PerformanceModeProvider>
          <VisualSkinProvider defaultTheme="cosmic">
              <TimeAxisProvider>
                <PhaseTransitionManager 
                  userProfile={{ totalInteractions: 0, discoveredCorrelations: [], layerPreferences: {}, behaviorPatterns: { explorationStyle: 'gentle' }, lastActiveDate: new Date().toISOString() }}
                  recentInteractions={[
                    { layerType: 'mood', timestamp: new Date().toISOString(), dataValue: 0.7 },
                    { layerType: 'sleep', timestamp: new Date().toISOString(), dataValue: 0.8 }
                  ]}
                >
                  <AppWithPerformanceMode />
                </PhaseTransitionManager>
                <ThemeHaikuDisplay />
              </TimeAxisProvider>
          </VisualSkinProvider>
      </PerformanceModeProvider>
    </AdaptivePerformanceProvider>
  );
};

export default Index;