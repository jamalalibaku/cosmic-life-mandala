/**
 * AI Speech Bubble Management Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface AISpeechBubbleState {
  isVisible: boolean;
  triggerPosition: { x: number; y: number };
}

interface UseAISpeechBubbleOptions {
  intervalMs?: number;
  hoverDelayMs?: number;
  enabled?: boolean;
}

export const useAISpeechBubble = (options: UseAISpeechBubbleOptions = {}) => {
  const {
    intervalMs = 25000, // Show every 25 seconds
    hoverDelayMs = 1000, // Show after 1 second of hover
    enabled = true
  } = options;

  const [bubbleState, setBubbleState] = useState<AISpeechBubbleState>({
    isVisible: false,
    triggerPosition: { x: 0, y: 0 }
  });

  const intervalTimer = useRef<NodeJS.Timeout>();
  const hoverTimer = useRef<NodeJS.Timeout>();

  // Auto-show bubble on interval
  useEffect(() => {
    if (!enabled) return;

    intervalTimer.current = setInterval(() => {
      // Only show if not already visible
      if (!bubbleState.isVisible) {
        showBubble();
      }
    }, intervalMs);

    return () => {
      if (intervalTimer.current) {
        clearInterval(intervalTimer.current);
      }
    };
  }, [enabled, intervalMs, bubbleState.isVisible]);

  // Show bubble at current trigger position
  const showBubble = useCallback((position?: { x: number; y: number }) => {
    const finalPosition = position || { x: window.innerWidth - 80, y: 20 }; // Default to AI button area
    
    setBubbleState({
      isVisible: true,
      triggerPosition: finalPosition
    });
  }, []);

  // Hide bubble
  const hideBubble = useCallback(() => {
    setBubbleState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Handle hover start
  const handleHoverStart = useCallback((element: HTMLElement) => {
    if (!enabled || bubbleState.isVisible) return;

    const rect = element.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    hoverTimer.current = setTimeout(() => {
      showBubble(position);
    }, hoverDelayMs);
  }, [enabled, bubbleState.isVisible, hoverDelayMs, showBubble]);

  // Handle hover end
  const handleHoverEnd = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }
  }, []);

  // Handle manual trigger (click)
  const handleManualTrigger = useCallback((element: HTMLElement) => {
    if (!enabled) return;

    const rect = element.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // If already visible, hide it; otherwise show it
    if (bubbleState.isVisible) {
      hideBubble();
    } else {
      showBubble(position);
    }
  }, [enabled, bubbleState.isVisible, showBubble, hideBubble]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalTimer.current) clearInterval(intervalTimer.current);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  return {
    ...bubbleState,
    showBubble,
    hideBubble,
    handleHoverStart,
    handleHoverEnd,
    handleManualTrigger
  };
};