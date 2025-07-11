/**
 * [Lap 12 – Layer Pop-Out Insight Panel]
 * Hook for managing layer pop-out panel state and positioning
 */

import { useState, useCallback } from 'react';

interface PopOutState {
  isOpen: boolean;
  layerType: string;
  position: { x: number; y: number };
  layerData: any;
  timeRange: string;
}

export const useLayerPopOut = () => {
  const [popOutState, setPopOutState] = useState<PopOutState>({
    isOpen: false,
    layerType: '',
    position: { x: 0, y: 0 },
    layerData: null,
    timeRange: ''
  });

  const openPopOut = useCallback((
    layerType: string,
    position: { x: number; y: number },
    layerData: any,
    timeRange: string = 'Last 7 days'
  ) => {
    setPopOutState({
      isOpen: true,
      layerType,
      position,
      layerData,
      timeRange
    });
  }, []);

  const closePopOut = useCallback(() => {
    setPopOutState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const togglePopOut = useCallback((
    layerType: string,
    position: { x: number; y: number },
    layerData: any,
    timeRange: string = 'Last 7 days'
  ) => {
    if (popOutState.isOpen && popOutState.layerType === layerType) {
      closePopOut();
    } else {
      openPopOut(layerType, position, layerData, timeRange);
    }
  }, [popOutState.isOpen, popOutState.layerType, openPopOut, closePopOut]);

  return {
    popOutState,
    openPopOut,
    closePopOut,
    togglePopOut
  };
};