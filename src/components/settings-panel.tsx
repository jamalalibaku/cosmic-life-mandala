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
  
  // Toggle functions
  onReflectiveModeChange: (value: boolean) => void;
  onPoetryModeChange: (value: boolean) => void;
  onShowFriendsChange: (value: boolean) => void;
  onShowInsightsChange: (value: boolean) => void;
  onShowPlaybackChange: (value: boolean) => void;
  onShowTideRingsChange: (value: boolean) => void;
}

export const SettingsPanel = ({
  reflectiveMode,
  poetryMode,
  showFriends,
  showInsights,
  showPlayback,
  showTideRings,
  onReflectiveModeChange,
  onPoetryModeChange,
  onShowFriendsChange,
  onShowInsightsChange,
  onShowPlaybackChange,
  onShowTideRingsChange,
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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-full ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        backgroundColor: active ? `${themeConfig.colors.accent}33` : `${themeConfig.colors.text}1A`,
        color: active ? themeConfig.colors.accent : themeConfig.colors.text,
        border: `1px solid ${active ? themeConfig.colors.accent : themeConfig.colors.text}40`
      }}
    >
      <Icon className="w-4 h-4" />
      <span>{active ? activeLabel : inactiveLabel}</span>
    </button>
  );

  return (
    <>
      {/* Settings Trigger Button */}
      <button
        onClick={togglePanel}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full transition-all duration-300 ${
          poetryMode ? 'opacity-20 hover:opacity-60' : 'opacity-90 hover:opacity-100'
        }`}
        style={{
          backgroundColor: `${themeConfig.colors.primary}20`,
          color: themeConfig.colors.primary,
          border: `1px solid ${themeConfig.colors.primary}40`
        }}
      >
        <Settings className="w-5 h-5" />
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
                className="p-1 rounded-lg hover:bg-opacity-20 transition-colors"
                style={{ color: themeConfig.colors.text }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-medium" style={{ color: themeConfig.colors.text }}>
                  <Palette className="w-4 h-4" />
                  Visual Theme
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(themeConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key as Theme)}
                      className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: currentTheme === key ? `${config.colors.accent}20` : 'transparent',
                        borderColor: currentTheme === key ? config.colors.accent : `${config.colors.text}40`,
                        color: config.colors.text
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border-2"
                        style={{ backgroundColor: config.colors.primary, borderColor: config.colors.accent }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium">{config.name}</div>
                        <div className="text-xs opacity-70">{config.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

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