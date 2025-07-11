/**
 * (c) 2025 Cosmic Life Mandala – Wallet Gamification System
 * Tracks user activity and transforms it into energetic currency
 */

import { useState, useEffect, useCallback } from 'react';

export interface WalletCurrency {
  emotionalCoins: number;
  movementMiles: number;
  productivityCredits: number;
  restTokens: number;
  wisdomPoints: number;
  clarityStars: number;
}

export interface WalletActivity {
  type: 'mood' | 'mobility' | 'plans' | 'sleep' | 'insight' | 'correlation';
  timestamp: Date;
  value: number;
  description: string;
}

const CURRENCY_MULTIPLIERS = {
  mood: { emotionalCoins: 2 },
  mobility: { movementMiles: 1 },
  plans: { productivityCredits: 3 },
  sleep: { restTokens: 1.5 },
  insight: { wisdomPoints: 5 },
  correlation: { clarityStars: 10 }
};

export const useWalletSystem = () => {
  const [currency, setCurrency] = useState<WalletCurrency>({
    emotionalCoins: 0,
    movementMiles: 0,
    productivityCredits: 0,
    restTokens: 0,
    wisdomPoints: 0,
    clarityStars: 0
  });

  const [recentActivities, setRecentActivities] = useState<WalletActivity[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Track layer interactions and award currency
  const trackActivity = useCallback((
    type: WalletActivity['type'], 
    value: number = 1, 
    description?: string
  ) => {
    const activity: WalletActivity = {
      type,
      timestamp: new Date(),
      value,
      description: description || `${type} interaction`
    };

    setRecentActivities(prev => [activity, ...prev.slice(0, 9)]); // Keep last 10

    // Award currency based on activity type
    const multiplier = CURRENCY_MULTIPLIERS[type];
    setCurrency(prev => {
      const newCurrency = { ...prev };
      Object.entries(multiplier).forEach(([currencyType, mult]) => {
        if (currencyType in newCurrency) {
          newCurrency[currencyType as keyof WalletCurrency] += value * mult;
        }
      });
      return newCurrency;
    });

    // Show brief animation
    setIsActive(true);
    setTimeout(() => setIsActive(false), 1500);
  }, []);

  // Calculate total wealth score
  const calculateWealthScore = useCallback(() => {
    return Object.values(currency).reduce((total, value) => total + value, 0);
  }, [currency]);

  // Get currency display strings
  const getCurrencyDisplay = useCallback(() => {
    return {
      emotionalCoins: `💚 ${Math.round(currency.emotionalCoins)}`,
      movementMiles: `🏃 ${Math.round(currency.movementMiles)}`,
      productivityCredits: `⚡ ${Math.round(currency.productivityCredits)}`,
      restTokens: `😴 ${Math.round(currency.restTokens)}`,
      wisdomPoints: `🧠 ${Math.round(currency.wisdomPoints)}`,
      clarityStars: `⭐ ${Math.round(currency.clarityStars)}`
    };
  }, [currency]);

  // Get wallet status message
  const getStatusMessage = useCallback(() => {
    const total = calculateWealthScore();
    
    if (total < 50) return "Beginning to gather life energy...";
    if (total < 150) return "Your awareness practice is taking root";
    if (total < 300) return "Rich patterns are emerging in your data";
    if (total < 500) return "You're becoming a consciousness explorer";
    if (total < 750) return "Deep self-awareness flows through you";
    return "You are a master of your own patterns";
  }, [calculateWealthScore]);

  return {
    currency,
    recentActivities,
    isActive,
    trackActivity,
    calculateWealthScore,
    getCurrencyDisplay,
    getStatusMessage
  };
};