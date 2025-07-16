/**
 * Optimized App State Context - Reduces 19+ useState hooks to managed state
 */

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { TimeScale } from '@/components/fractal-time-zoom-manager';
import { MoodInfluence } from '@/utils/mood-engine';

interface AppState {
  timeScale: TimeScale;
  currentDate: Date;
  reflectiveMode: boolean;
  showFriends: boolean;
  showInsights: boolean;
  showPlayback: boolean;
  showTideRings: boolean;
  hoveredLayer?: string;
  activeLayer?: string;
  currentMood: MoodInfluence | null;
  poetryMode: boolean;
  selectedCity: string;
  showDebugMode: boolean;
  showLayerDebug: boolean;
  persistentDebugMode: boolean;
  showSettings: boolean;
  showInsightPanel: boolean;
  showRitualCompanion: boolean;
  activeTool: 'touch' | 'fix' | 'scale' | null;
  showWalletPanel: boolean;
  walletPanelPosition: { x: number; y: number };
}

type AppAction = 
  | { type: 'SET_TIME_SCALE'; payload: TimeScale }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'TOGGLE_REFLECTIVE_MODE' }
  | { type: 'TOGGLE_FRIENDS' }
  | { type: 'TOGGLE_INSIGHTS' }
  | { type: 'TOGGLE_PLAYBACK' }
  | { type: 'TOGGLE_TIDE_RINGS' }
  | { type: 'SET_HOVERED_LAYER'; payload?: string }
  | { type: 'SET_ACTIVE_LAYER'; payload?: string }
  | { type: 'SET_CURRENT_MOOD'; payload: MoodInfluence | null }
  | { type: 'TOGGLE_POETRY_MODE' }
  | { type: 'SET_SELECTED_CITY'; payload: string }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'TOGGLE_LAYER_DEBUG' }
  | { type: 'TOGGLE_PERSISTENT_DEBUG' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_INSIGHT_PANEL' }
  | { type: 'TOGGLE_RITUAL_COMPANION' }
  | { type: 'SET_ACTIVE_TOOL'; payload: 'touch' | 'fix' | 'scale' | null }
  | { type: 'TOGGLE_WALLET_PANEL' }
  | { type: 'SET_WALLET_PANEL_POSITION'; payload: { x: number; y: number } };

const initialState: AppState = {
  timeScale: 'day',
  currentDate: new Date(),
  reflectiveMode: false,
  showFriends: false,
  showInsights: false,
  showPlayback: false,
  showTideRings: false,
  currentMood: null,
  poetryMode: false,
  selectedCity: 'berlin',
  showDebugMode: false,
  showLayerDebug: false,
  persistentDebugMode: false,
  showSettings: false,
  showInsightPanel: false,
  showRitualCompanion: false,
  activeTool: null,
  showWalletPanel: false,
  walletPanelPosition: { x: 0, y: 0 }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TIME_SCALE':
      return { ...state, timeScale: action.payload };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'TOGGLE_REFLECTIVE_MODE':
      return { ...state, reflectiveMode: !state.reflectiveMode };
    case 'TOGGLE_FRIENDS':
      return { ...state, showFriends: !state.showFriends };
    case 'TOGGLE_INSIGHTS':
      return { ...state, showInsights: !state.showInsights };
    case 'TOGGLE_PLAYBACK':
      return { ...state, showPlayback: !state.showPlayback };
    case 'TOGGLE_TIDE_RINGS':
      return { ...state, showTideRings: !state.showTideRings };
    case 'SET_HOVERED_LAYER':
      return { ...state, hoveredLayer: action.payload };
    case 'SET_ACTIVE_LAYER':
      return { ...state, activeLayer: action.payload };
    case 'SET_CURRENT_MOOD':
      return { ...state, currentMood: action.payload };
    case 'TOGGLE_POETRY_MODE':
      return { ...state, poetryMode: !state.poetryMode };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'TOGGLE_DEBUG_MODE':
      return { ...state, showDebugMode: !state.showDebugMode };
    case 'TOGGLE_LAYER_DEBUG':
      return { ...state, showLayerDebug: !state.showLayerDebug };
    case 'TOGGLE_PERSISTENT_DEBUG':
      return { ...state, persistentDebugMode: !state.persistentDebugMode };
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };
    case 'TOGGLE_INSIGHT_PANEL':
      return { ...state, showInsightPanel: !state.showInsightPanel };
    case 'TOGGLE_RITUAL_COMPANION':
      return { ...state, showRitualCompanion: !state.showRitualCompanion };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'TOGGLE_WALLET_PANEL':
      return { ...state, showWalletPanel: !state.showWalletPanel };
    case 'SET_WALLET_PANEL_POSITION':
      return { ...state, walletPanelPosition: action.payload };
    default:
      return state;
  }
};

interface AppStateContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  
  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};