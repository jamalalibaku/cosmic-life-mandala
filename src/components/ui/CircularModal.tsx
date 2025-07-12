/**
 * (c) 2025 Cosmic Life Mandala – Circular Modal Component
 * A radial popup that blooms from interaction points
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface CircularModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerPosition?: { x: number; y: number };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { width: 280, height: 280 },
  md: { width: 400, height: 400 },
  lg: { width: 520, height: 520 }
};

export const CircularModal: React.FC<CircularModalProps> = ({
  isOpen,
  onClose,
  children,
  triggerPosition,
  size = 'md',
  className = ''
}) => {
  const modalSize = sizeConfig[size];

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Calculate initial position based on trigger
  const getInitialPosition = () => {
    if (triggerPosition) {
      return {
        x: triggerPosition.x - modalSize.width / 2,
        y: triggerPosition.y - modalSize.height / 2
      };
    }
    return {
      x: window.innerWidth / 2 - modalSize.width / 2,
      y: window.innerHeight / 2 - modalSize.height / 2
    };
  };

  const initialPos = getInitialPosition();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Circular Modal */}
          <motion.div
            initial={{
              scale: 0.1,
              opacity: 0,
              rotate: -10,
              x: triggerPosition?.x || window.innerWidth / 2,
              y: triggerPosition?.y || window.innerHeight / 2,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 0,
              x: initialPos.x,
              y: initialPos.y,
            }}
            exit={{
              scale: 0.1,
              opacity: 0,
              rotate: 10,
              x: triggerPosition?.x || window.innerWidth / 2,
              y: triggerPosition?.y || window.innerHeight / 2,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              duration: 0.4
            }}
            className={`fixed z-50 ${className}`}
            style={{
              width: modalSize.width,
              height: modalSize.height,
            }}
          >
            {/* Modal Container */}
            <div
              className="relative w-full h-full rounded-full bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl overflow-hidden"
              style={{
                background: `radial-gradient(circle at center, 
                  hsl(var(--background)/0.98) 0%, 
                  hsl(var(--background)/0.92) 70%, 
                  hsl(var(--border)/0.3) 100%)`,
                boxShadow: `
                  0 0 0 1px hsl(var(--border)/0.3),
                  0 20px 60px -10px hsl(var(--primary)/0.2),
                  inset 0 1px 0 hsl(var(--border)/0.2)
                `
              }}
            >
              {/* Cosmic Ring Effect */}
              <div
                className="absolute inset-4 rounded-full border border-primary/20"
                style={{
                  background: `conic-gradient(from 0deg, 
                    transparent 0%, 
                    hsl(var(--primary)/0.1) 25%, 
                    transparent 50%, 
                    hsl(var(--primary)/0.1) 75%, 
                    transparent 100%)`
                }}
              />

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Content Area */}
              <div className="absolute inset-8 flex flex-col items-center justify-center text-center overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  {children}
                </motion.div>
              </div>

              {/* Subtle Pulse Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full border border-primary/20"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};