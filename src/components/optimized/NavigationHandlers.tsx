/**
 * Optimized Navigation Handlers - Extract keyboard and time navigation logic
 */

import { useCallback, useEffect } from 'react';
import { TimeScale } from '@/components/fractal-time-zoom-manager';
import { useAppState } from '@/contexts/AppStateContext';

export const useKeyboardHandlers = () => {
  const { state, dispatch } = useAppState();
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.poetryMode) {
        dispatch({ type: 'TOGGLE_POETRY_MODE' });
      }
      
      // Shift + D for persistent debug mode toggle
      if (event.shiftKey && event.key === 'D') {
        dispatch({ type: 'TOGGLE_PERSISTENT_DEBUG' });
        dispatch({ type: 'TOGGLE_LAYER_DEBUG' });
        event.preventDefault();
      }
      
      // Quick zoom shortcuts
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            dispatch({ type: 'SET_TIME_SCALE', payload: 'day' });
            break;
          case 'w':
            dispatch({ type: 'SET_TIME_SCALE', payload: 'week' });
            break;
          case 'm':
            dispatch({ type: 'SET_TIME_SCALE', payload: 'month' });
            break;
          case 'y':
            dispatch({ type: 'SET_TIME_SCALE', payload: 'year' });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.poetryMode, dispatch]);
};

export const useTimeNavigation = () => {
  const { state, dispatch } = useAppState();
  
  const handleTimeNavigate = useCallback((direction: 'past' | 'future') => {
    const newDate = new Date(state.currentDate);
    const multiplier = direction === 'future' ? 1 : -1;
    
    switch (state.timeScale) {
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
    
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  }, [state.currentDate, state.timeScale, dispatch]);
  
  return { handleTimeNavigate };
};