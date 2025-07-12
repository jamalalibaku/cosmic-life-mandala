/**
 * (c) 2025 Cosmic Life Mandala – Enhanced Wallet Currency Panel
 * Playful, interactive panel showing behavioral data as cosmic currency
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletSystem } from '@/hooks/useWalletSystem';
import { X } from 'lucide-react';

interface WalletCurrencyPanelProps {
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  timeScale?: 'day' | 'week' | 'month' | 'year' | 'side';
}

export const WalletCurrencyPanel: React.FC<WalletCurrencyPanelProps> = ({
  isVisible,
  onClose,
  position,
  timeScale = 'day'
}) => {
  const {
    currency,
    recentActivities,
    isActive,
    calculateWealthScore,
    getCurrencyDisplay,
    getStatusMessage
  } = useWalletSystem();

  const currencyDisplay = getCurrencyDisplay();
  const totalWealth = calculateWealthScore();
  const statusMessage = getStatusMessage();

  // Scale multipliers for different time views
  const scaleMultipliers = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
    side: 1
  };

  const scaledWealth = totalWealth * scaleMultipliers[timeScale];

  // Enhanced token types with metaphorical descriptions
  const tokenTypes = [
    {
      key: 'emotionalCoins',
      icon: '💚',
      name: 'Emotional Coins',
      description: 'Shared Moments',
      value: currency.emotionalCoins,
      cosmic: 'Heart frequencies'
    },
    {
      key: 'movementMiles',
      icon: '🚶',
      name: 'Motion Miles',
      description: 'Your Mobility Path',
      value: currency.movementMiles,
      cosmic: 'Body wisdom trails'
    },
    {
      key: 'productivityCredits',
      icon: '💡',
      name: 'Focus Points',
      description: 'Intentional Time',
      value: currency.productivityCredits,
      cosmic: 'Awareness crystallized'
    },
    {
      key: 'restTokens',
      icon: '🌙',
      name: 'Sleep Credits',
      description: 'Rest Balance',
      value: currency.restTokens,
      cosmic: 'Dream realm deposits'
    },
    {
      key: 'wisdomPoints',
      icon: '🧠',
      name: 'Wisdom Points',
      description: 'Insight Discoveries',
      value: currency.wisdomPoints,
      cosmic: 'Consciousness expansion'
    },
    {
      key: 'clarityStars',
      icon: '⭐',
      name: 'Clarity Stars',
      description: 'Pattern Recognition',
      value: currency.clarityStars,
      cosmic: 'Universal alignment'
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: position.x - 200, y: position.y - 300 }}
        animate={{ opacity: 1, scale: 1, x: position.x - 200, y: position.y - 300 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed z-50 w-96 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 shadow-2xl"
        style={{ left: 0, top: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-3xl"
            >
              💼
            </motion.div>
            <div>
              <h3 className="text-yellow-200 font-semibold text-lg">Energetic Wallet</h3>
              <p className="text-white/60 text-sm">
                {timeScale.charAt(0).toUpperCase() + timeScale.slice(1)} View • Total: {scaledWealth.toFixed(0)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20"
        >
          <p className="text-yellow-200/90 text-sm italic text-center">{statusMessage}</p>
        </motion.div>

        {/* Currency Grid with Cosmic Visualization */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {tokenTypes.map((token, index) => (
            <motion.div
              key={token.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{token.icon}</span>
                <div className="flex-1">
                  <div className="text-white/90 text-sm font-medium">
                    {Math.round(token.value * scaleMultipliers[timeScale])}
                  </div>
                  <div className="text-white/60 text-xs">{token.description}</div>
                </div>
              </div>
              <div className="text-white/40 text-xs italic">{token.cosmic}</div>
              
              {/* Glowing dots constellation */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: Math.min(Math.floor(token.value / 10), 8) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-yellow-400/60 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities Stream */}
        <div className="space-y-3">
          <h4 className="text-white/80 text-sm font-medium flex items-center gap-2">
            <span>Recent Energy Flow</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-yellow-400/40 border-t-yellow-400 rounded-full"
            />
          </h4>
          
          <div className="max-h-32 overflow-y-auto space-y-2">
            {recentActivities.slice(0, 4).map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-xs text-white/70 bg-white/5 rounded-lg px-3 py-2"
              >
                <span className="text-yellow-400 font-medium">+{activity.value}</span>
                <span className="flex-1">{activity.description}</span>
                <span className="text-white/40">
                  {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Consciousness Progress */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white/60 text-xs">Consciousness Mastery</span>
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((scaledWealth / 2000) * 100, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-100 h-full rounded-full shadow-lg"
              />
            </div>
            <span className="text-xs text-white/60">
              {Math.min((scaledWealth / 2000) * 100, 100).toFixed(0)}%
            </span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-white/50 text-center italic"
          >
            "The universe reflects what you choose to notice"
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};