/**
 * (c) 2025 Cosmic Life Mandala – Curved Bottom Drawer
 * A drawer that curves along the radial timeline's base
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface CurvedBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: number;
  className?: string;
}

export const CurvedBottomDrawer: React.FC<CurvedBottomDrawerProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 300,
  className = ''
}) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          />

          {/* Curved Drawer */}
          <motion.div
            initial={{ y: height + 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: height + 50, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 1
            }}
            className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
            style={{ height }}
          >
            {/* Curved Container */}
            <div
              className="relative w-full h-full bg-background/95 backdrop-blur-md border-t border-border/50 shadow-2xl overflow-hidden"
              style={{
                borderRadius: '50px 50px 0 0',
                background: `radial-gradient(ellipse at top, 
                  hsl(var(--background)/0.98) 0%, 
                  hsl(var(--background)/0.95) 50%, 
                  hsl(var(--background)/0.90) 100%)`,
                boxShadow: `
                  0 -10px 40px -5px hsl(var(--primary)/0.1),
                  inset 0 1px 0 hsl(var(--border)/0.2),
                  0 -1px 0 hsl(var(--border)/0.3)
                `
              }}
            >
              {/* Cosmic Arc Effect */}
              <div
                className="absolute inset-x-4 top-2 h-16 rounded-full opacity-30"
                style={{
                  background: `conic-gradient(from 90deg at center top, 
                    transparent 0%, 
                    hsl(var(--primary)/0.1) 45%, 
                    hsl(var(--primary)/0.2) 50%, 
                    hsl(var(--primary)/0.1) 55%, 
                    transparent 100%)`
                }}
              />

              {/* Handle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-3 left-1/2 transform -translate-x-1/2 cursor-pointer"
              >
                <div className="w-10 h-1 bg-border/60 rounded-full" />
                <ChevronDown className="h-4 w-4 text-muted-foreground mt-1 mx-auto" />
              </motion.div>

              {/* Title */}
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-12 left-0 right-0 text-center"
                >
                  <h3 className="text-lg font-medium text-foreground">{title}</h3>
                </motion.div>
              )}

              {/* Content Area */}
              <div className={`absolute inset-x-4 overflow-y-auto ${title ? 'top-20' : 'top-12'} bottom-4`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="pb-4"
                >
                  {children}
                </motion.div>
              </div>

              {/* Ambient Glow */}
              <motion.div
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 to-transparent rounded-t-[50px]"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};