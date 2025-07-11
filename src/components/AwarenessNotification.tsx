import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AwarenessNotificationProps {
  message: string | null;
  isVisible: boolean;
  onDismiss: () => void;
  onExplore?: () => void;
}

export const AwarenessNotification: React.FC<AwarenessNotificationProps> = ({
  message,
  isVisible,
  onDismiss,
  onExplore
}) => {
  if (!message || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-background/95 backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg p-4">
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