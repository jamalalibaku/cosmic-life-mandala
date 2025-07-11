/**
 * (c) 2025 Cosmic Life Mandala – Wallet Display Component
 * Beautiful visualization of accumulated life energy and activity currency
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletSystem } from '../hooks/useWalletSystem';

interface WalletDisplayProps {
  isVisible: boolean;
  onActivityTrack: (type: any, value?: number, description?: string) => void;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ 
  isVisible, 
  onActivityTrack 
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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="absolute top-4 right-4 z-30 w-80 bg-black/40 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl"
          >
            💼
          </motion.div>
          <div>
            <h3 className="text-yellow-200 font-semibold">Energetic Wallet</h3>
            <p className="text-white/60 text-sm">Total Wealth: {totalWealth.toFixed(0)}</p>
          </div>
        </div>

        {/* Status Message */}
        <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <p className="text-yellow-200/90 text-sm italic">{statusMessage}</p>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(currencyDisplay).map(([key, display]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 rounded-lg p-2 border border-white/10"
            >
              <div className="text-white/90 text-sm font-medium">{display}</div>
              <div className="text-white/60 text-xs capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="space-y-2">
          <h4 className="text-white/80 text-sm font-medium">Recent Activities</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-xs text-white/70 bg-white/5 rounded px-2 py-1"
              >
                <span className="text-yellow-400">+{activity.value}</span>
                <span>{activity.description}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Growth Visualization */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalWealth / 1000) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full"
              />
            </div>
            <span className="text-xs text-white/60">
              {Math.min((totalWealth / 1000) * 100, 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">Path to Consciousness Mastery</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};