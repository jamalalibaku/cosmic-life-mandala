import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AwarenessNotificationProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
  onExplore?: () => void;
  isHoverBased?: boolean;
  x?: number;
  y?: number;
}

export const AwarenessNotification: React.FC<AwarenessNotificationProps> = ({
  message,
  isVisible,
  onDismiss,
  onExplore,
  isHoverBased = false,
  x = 0,
  y = 0
}) => {
  if (!message || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ 
          opacity: 0, 
          y: isHoverBased ? 10 : -20, 
          scale: 0.95 
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1 
        }}
        exit={{ 
          opacity: 0, 
          y: isHoverBased ? 10 : -20, 
          scale: 0.95 
        }}
        transition={{ 
          type: "spring",
          bounce: 0.2,
          duration: 0.4
        }}
        className={`
          z-50 max-w-sm pointer-events-auto
          ${isHoverBased 
            ? 'fixed' 
            : 'fixed top-4 right-4'
          }
        `}
        style={isHoverBased ? {
          left: Math.max(16, Math.min(x - 200, window.innerWidth - 240)),
          top: Math.max(16, y - 80)
        } : {}}
      >
        <div className={`
          backdrop-blur-sm border rounded-lg shadow-lg p-4 
          ${isHoverBased 
            ? 'bg-background/98 border-primary/30 shadow-xl' 
            : 'bg-background/95 border-primary/20'
          }
        `}>
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-primary mt-0.5"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-foreground">
                {message}
              </p>
              
              {onExplore && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={onExplore}
                    className="text-xs"
                  >
                    Explore
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDismiss}
                    className="text-xs"
                  >
                    Later
                  </Button>
                </div>
              )}
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="p-1 h-auto"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};