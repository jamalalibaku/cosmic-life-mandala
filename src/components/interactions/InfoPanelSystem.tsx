/**
 * Info Panel System
 * Contextual information panels for clicked elements
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Target, Sparkles } from 'lucide-react';

export interface PanelData {
  type: 'layer' | 'slice' | 'theme' | 'insight';
  title: string;
  subtitle?: string;
  content: any;
  position?: { x: number; y: number };
}

export interface InfoPanelSystemProps {
  panelData: PanelData | null;
  isVisible: boolean;
  onClose: () => void;
}

export const InfoPanelSystem: React.FC<InfoPanelSystemProps> = ({
  panelData,
  isVisible,
  onClose
}) => {
  if (!panelData) return null;

  const getIcon = () => {
    switch (panelData.type) {
      case 'layer': return <Target className="w-5 h-5" />;
      case 'slice': return <Clock className="w-5 h-5" />;
      case 'theme': return <Sparkles className="w-5 h-5" />;
      case 'insight': return <Calendar className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const renderContent = () => {
    switch (panelData.type) {
      case 'layer':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: panelData.content.color }}
              />
              Radius: {panelData.content.radius}px
            </div>
            <div className="text-sm">
              <p>This layer represents your {panelData.content.layerType} data.</p>
              <p className="mt-2 text-muted-foreground">
                Click individual data points to explore specific moments.
              </p>
            </div>
          </div>
        );
      
      case 'slice':
        return (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Time: {panelData.content.sliceType}
            </div>
            <div className="text-sm">
              <p>This slice contains data from a specific time period.</p>
              <p className="mt-2 text-muted-foreground">
                Double-click to focus zoom into this moment.
              </p>
            </div>
          </div>
        );
      
      case 'theme':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <p>{panelData.content.description}</p>
              {panelData.content.haiku && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg italic text-sm">
                  {panelData.content.haiku}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'insight':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <p>{panelData.content.insight}</p>
              {panelData.content.suggestion && (
                <div className="mt-3 p-3 bg-primary/10 rounded-lg text-sm">
                  <strong>Suggestion:</strong> {panelData.content.suggestion}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Panel */}
          <motion.div
            className="relative bg-background border rounded-lg shadow-lg max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getIcon()}
                <div>
                  <h3 className="font-semibold">{panelData.title}</h3>
                  {panelData.subtitle && (
                    <p className="text-sm text-muted-foreground">{panelData.subtitle}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};