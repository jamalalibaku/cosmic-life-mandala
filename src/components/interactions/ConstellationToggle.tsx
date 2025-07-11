import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SparklesIcon } from 'lucide-react';

interface ConstellationToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  constellationCount?: number;
}

export const ConstellationToggle: React.FC<ConstellationToggleProps> = ({
  isEnabled,
  onToggle,
  constellationCount = 0
}) => {
  return (
    <motion.div
      className="constellation-toggle flex items-center gap-3 p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => onToggle(!isEnabled)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300
          ${isEnabled 
            ? 'bg-primary text-primary-foreground shadow-lg' 
            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isEnabled ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles size={16} />
        </motion.div>
        <span className="text-sm font-medium">
          {isEnabled ? 'Hide' : 'Show'} Constellations
        </span>
      </motion.button>
      
      {constellationCount > 0 && (
        <motion.div
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {constellationCount} pattern{constellationCount !== 1 ? 's' : ''} found
        </motion.div>
      )}
      
      {isEnabled && (
        <motion.div
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};