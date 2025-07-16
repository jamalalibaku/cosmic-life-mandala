/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState } from 'react';
import { Settings, X, Palette, MapPin, Users, Sparkles, Play, Waves, Flower2 } from 'lucide-react';
import { useVisualSkin } from './visual-skin-provider';
import { Theme, themeConfigs } from '@/utils/theme-configs';
import { LocationControl } from './location-control';

interface SettingsPanelProps {
  // Current states
  reflectiveMode: boolean;
  poetryMode: boolean;
  showFriends: boolean;
  showInsights: boolean;
  showPlayback: boolean;
  showTideRings: boolean;
  showAIInsights: boolean;
  
  // Toggle functions
  onReflectiveModeChange: (value: boolean) => void;
  onPoetryModeChange: (value: boolean) => void;
  onShowFriendsChange: (value: boolean) => void;
  onShowInsightsChange: (value: boolean) => void;
  onShowPlaybackChange: (value: boolean) => void;
  onShowTideRingsChange: (value: boolean) => void;
  onShowAIInsightsChange: (value: boolean) => void;
}

export const SettingsPanel = ({
  reflectiveMode,
  poetryMode,
  showFriends,
  showInsights,
  showPlayback,
  showTideRings,
  showAIInsights,
  onReflectiveModeChange,
  onPoetryModeChange,
  onShowFriendsChange,
  onShowInsightsChange,
  onShowPlaybackChange,
  onShowTideRingsChange,
  onShowAIInsightsChange,
}: SettingsPanelProps) => {
  const { themeConfig, currentTheme, setTheme } = useVisualSkin();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('berlin');

  const togglePanel = () => setIsOpen(!isOpen);

  const ToggleButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    activeLabel, 
    inactiveLabel, 
    disabled = false 
  }: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    activeLabel: string;
    inactiveLabel: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full min-h-12 cursor-pointer select-none touch-target ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 active:scale-98'
      }`}
      style={{
        backgroundColor: active ? `${themeConfig.colors.accent}40` : `${themeConfig.colors.text}15`,
        color: active ? themeConfig.colors.accent : themeConfig.colors.text,
        border: `2px solid ${active ? themeConfig.colors.accent : themeConfig.colors.text}30`,
        boxShadow: active ? `0 4px 12px ${themeConfig.colors.accent}25` : 'none'
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-left">{active ? activeLabel : inactiveLabel}</span>
    </button>
  );

  return (
    <>
      {/* Settings Trigger Button */}
      <button
        onClick={togglePanel}
        className={`fixed top-4 right-4 z-50 p-4 rounded-full transition-all duration-200 cursor-pointer select-none touch-target min-h-12 min-w-12 ${
          poetryMode ? 'opacity-30 hover:opacity-80' : 'opacity-90 hover:opacity-100 hover:scale-110 active:scale-95'
        }`}
        style={{
          backgroundColor: `${themeConfig.colors.primary}30`,
          color: themeConfig.colors.primary,
          border: `2px solid ${themeConfig.colors.primary}60`,
          boxShadow: `0 4px 12px ${themeConfig.colors.primary}20`
        }}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div 
            className="relative w-80 h-full overflow-y-auto shadow-2xl border-l"
            style={{
              backgroundColor: themeConfig.colors.background,
              borderColor: themeConfig.colors.accent
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: themeConfig.colors.accent }}>
              <h2 className="text-lg font-semibold" style={{ color: themeConfig.colors.text }}>
                Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 cursor-pointer select-none touch-target min-h-10 min-w-10 hover:scale-110 active:scale-95"
                style={{ color: themeConfig.colors.text, backgroundColor: `${themeConfig.colors.text}10` }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-6">

              {/* Location Control */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  <MapPin className="w-4 h-4" />
                  Location & Time
                </h3>
                <LocationControl
                  selectedCity={selectedCity}
                  onCityChange={setSelectedCity}
                  theme={themeConfig}
                />
              </div>

              {/* Mode Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Display Modes
                </h3>
                <div className="space-y-2">
                  <ToggleButton
                    active={poetryMode}
                    onClick={() => onPoetryModeChange(!poetryMode)}
                    icon={Flower2}
                    activeLabel="🌸 poetry flows"
                    inactiveLabel="🧘‍♀️ poetry mode"
                  />
                  <ToggleButton
                    active={reflectiveMode}
                    onClick={() => onReflectiveModeChange(!reflectiveMode)}
                    icon={Settings}
                    activeLabel="⧖ minimal mode"
                    inactiveLabel="◎ interface mode"
                    disabled={poetryMode}
                  />
                </div>
              </div>

              {/* Layer Controls */}
              {!poetryMode && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                    Data Layers
                  </h3>
                  <div className="space-y-2">
                    <ToggleButton
                      active={showFriends}
                      onClick={() => onShowFriendsChange(!showFriends)}
                      icon={Users}
                      activeLabel="🫂 friends visible"
                      inactiveLabel="○ show friends"
                    />
                     <ToggleButton
                       active={showInsights}
                       onClick={() => onShowInsightsChange(!showInsights)}
                       icon={Sparkles}
                       activeLabel="✨ insights active"
                       inactiveLabel="◐ show insights"
                     />
                    <ToggleButton
                      active={showPlayback}
                      onClick={() => onShowPlaybackChange(!showPlayback)}
                      icon={Play}
                      activeLabel="▶ reflecting"
                      inactiveLabel="⧖ reflect time"
                    />
                    <ToggleButton
                      active={showTideRings}
                      onClick={() => onShowTideRingsChange(!showTideRings)}
                      icon={Waves}
                      activeLabel="🌊 tides flowing"
                      inactiveLabel="~ show connections"
                    />
                  </div>
                </div>
              )}

              {/* Accessibility Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  Accessibility
                </h3>
                <div className="p-3 rounded-lg border" style={{ borderColor: `${themeConfig.colors.text}40` }}>
                  <p className="text-xs opacity-70" style={{ color: themeConfig.colors.text }}>
                    All data rings use shapes, patterns, and opacity to ensure visibility across different color perception abilities.
                  </p>
                </div>
              </div>

              {/* AI Assistant Placeholder */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  AI Assistant
                </h3>
                <div 
                  className="p-4 rounded-lg border-2 border-dashed text-center"
                  style={{ borderColor: `${themeConfig.colors.accent}60` }}
                >
                  <p className="text-sm opacity-70" style={{ color: themeConfig.colors.text }}>
                    AI-generated insights and personalized suggestions coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};