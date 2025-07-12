/**
 * (c) 2025 Cosmic Life Mandala – Radial UI Demo
 * Demonstrates circular modals and curved drawers in the mandala context
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Moon, Sun, Heart } from 'lucide-react';
import { CircularModal } from '../ui/CircularModal';
import { CurvedBottomDrawer } from '../ui/CurvedBottomDrawer';
import { BehavioralInsightCard } from '../insights/BehavioralInsightCard';
import { mockBehavioralInsights } from '../../data/mock-behavioral-insights';

interface RadialUIDemo {
  className?: string;
}

export const RadialUIDemo: React.FC<RadialUIDemo> = ({
  className = ''
}) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [triggerPosition, setTriggerPosition] = useState<{x: number, y: number} | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCircleClick = (e: React.MouseEvent, modalType: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTriggerPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setSelectedModal(modalType);
  };

  const closeModal = () => {
    setSelectedModal(null);
    setTriggerPosition(undefined);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Radial Demo Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-80">
          
          {/* Central Core */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCircleClick(e, 'insights')}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 hover:bg-primary/30 rounded-full border border-primary/40 cursor-pointer flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <Brain className="h-6 w-6 text-primary" />
          </motion.div>

          {/* Mood Circle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCircleClick(e, 'mood')}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-amber-500/20 hover:bg-amber-500/30 rounded-full border border-amber-500/40 cursor-pointer flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>

          {/* Sleep Circle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCircleClick(e, 'sleep')}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-full border border-indigo-500/40 cursor-pointer flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <Moon className="h-4 w-4 text-indigo-500" />
          </motion.div>

          {/* Essence Circle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleCircleClick(e, 'essence')}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 w-12 h-12 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full border border-emerald-500/40 cursor-pointer flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <Heart className="h-4 w-4 text-emerald-500" />
          </motion.div>

          {/* Drawer Trigger */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDrawerOpen(true)}
            className="absolute top-1/2 left-8 transform -translate-y-1/2 w-12 h-12 bg-purple-500/20 hover:bg-purple-500/30 rounded-full border border-purple-500/40 cursor-pointer flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
          </motion.div>
        </div>
      </div>

      {/* Circular Modals */}
      <CircularModal
        isOpen={selectedModal === 'insights'}
        onClose={closeModal}
        triggerPosition={triggerPosition}
        size="lg"
      >
        <div className="space-y-4">
          <Brain className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Behavioral Insights</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your patterns reveal deep connections between sleep, mood, and environment. 
            Each insight helps you understand your natural rhythms.
          </p>
          <div className="space-y-2 text-xs text-left max-w-xs">
            <div className="p-2 bg-background/50 rounded">
              🌙 Sleep quality directly influences next-day clarity
            </div>
            <div className="p-2 bg-background/50 rounded">
              ☀️ Morning sunlight boosts evening contentment
            </div>
          </div>
        </div>
      </CircularModal>

      <CircularModal
        isOpen={selectedModal === 'mood'}
        onClose={closeModal}
        triggerPosition={triggerPosition}
      >
        <div className="space-y-4">
          <Sun className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Mood Patterns</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your emotional landscape flows in beautiful cycles. Today shows creative energy 
            emerging in the morning hours.
          </p>
        </div>
      </CircularModal>

      <CircularModal
        isOpen={selectedModal === 'sleep'}
        onClose={closeModal}
        triggerPosition={triggerPosition}
      >
        <div className="space-y-4">
          <Moon className="h-12 w-12 text-indigo-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Sleep Wisdom</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your rest patterns reveal a natural 7.5-hour cycle. Deep sleep peaks 
            between 2-4 AM, aligning with your circadian flow.
          </p>
        </div>
      </CircularModal>

      <CircularModal
        isOpen={selectedModal === 'essence'}
        onClose={closeModal}
        triggerPosition={triggerPosition}
      >
        <div className="space-y-4">
          <Heart className="h-12 w-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Essence Flow</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your inner essence radiates strongest when creative work aligns with 
            natural energy peaks. The soul knows its rhythm.
          </p>
        </div>
      </CircularModal>

      {/* Curved Bottom Drawer */}
      <CurvedBottomDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Pattern Analysis"
        height={400}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Deep dive into your behavioral correlations and life patterns
          </p>
          <BehavioralInsightCard
            insights={mockBehavioralInsights.slice(0, 4)}
            onViewDetails={() => console.log('View detailed analysis')}
            className="bg-transparent border-none shadow-none"
          />
        </div>
      </CurvedBottomDrawer>
    </div>
  );
};