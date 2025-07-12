/**
 * Throttled Theme Hook
 * Prevents excessive theme checks and console logging
 */

import { useState, useEffect, useRef } from 'react';

export const useThrottledTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('cosmic');
  const lastThemeCheck = useRef(0);
  const lastLogTime = useRef(0);
  
  // Throttle theme checks to once per second
  const checkTheme = () => {
    const now = Date.now();
    if (now - lastThemeCheck.current < 1000) {
      return currentTheme;
    }
    
    lastThemeCheck.current = now;
    
    // Theme detection logic here
    // For now, default to cosmic
    const detectedTheme = 'cosmic';
    
    if (detectedTheme !== currentTheme) {
      setCurrentTheme(detectedTheme);
    }
    
    // Throttled logging - only every 30 seconds
    if (now - lastLogTime.current > 30000) {
      console.log('🎨 Theme check:', { 
        currentTheme: detectedTheme, 
        timestamp: new Date().toLocaleTimeString()
      });
      lastLogTime.current = now;
    }
    
    return detectedTheme;
  };
  
  useEffect(() => {
    const interval = setInterval(checkTheme, 2000); // Check every 2 seconds instead of constantly
    return () => clearInterval(interval);
  }, [currentTheme]);
  
  return currentTheme;
};