/**
 * Expanded Data Card
 * Rich, contextual overlay for detailed data exploration
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Activity, Heart, Calendar, Cloud } from "lucide-react";

interface ExpandedCardData {
  id: string;
  layerType: "mood" | "places" | "mobility" | "plans" | "weather" | "moon";
  title: string;
  subtitle?: string;
  emoji: string;
  data: any;
  timestamp?: string;
  position: { x: number; y: number };
}

interface ExpandedCardProps {
  data: ExpandedCardData | null;
  isVisible: boolean;
  onClose: () => void;
}

export const ExpandedCard: React.FC<ExpandedCardProps> = ({
  data,
  isVisible,
  onClose,
}) => {
  if (!data) return null;

  const getIcon = () => {
    switch (data.layerType) {
      case "mood": return <Heart className="w-4 h-4" />;
      case "places": return <MapPin className="w-4 h-4" />;
      case "mobility": return <Activity className="w-4 h-4" />;
      case "plans": return <Calendar className="w-4 h-4" />;
      case "weather": return <Cloud className="w-4 h-4" />;
      case "moon": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDetailContent = () => {
    switch (data.layerType) {
      case "mood":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Valence</span>
              <span className="text-white">{Math.round((data.data.valence || 0) * 100)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Energy</span>
              <span className="text-white">{Math.round((data.data.energy || 0) * 100)}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "Feeling {data.data.emotion} with high emotional resonance"
              </p>
            </div>
          </div>
        );
      
      case "places":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Duration</span>
              <span className="text-white">{data.data.duration}h</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "Spent quality time at {data.data.location}"
              </p>
            </div>
          </div>
        );
      
      case "mobility":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Distance</span>
              <span className="text-white">{(data.data.distance / 1000).toFixed(1)}km</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Intensity</span>
              <span className="text-white">{Math.round((data.data.intensity || 0) * 100)}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "Active {data.data.activity} session with good momentum"
              </p>
            </div>
          </div>
        );
      
      case "plans":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Priority</span>
              <span className="text-white">{Math.round((data.data.priority || 0) * 100)}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "Important {data.data.event} scheduled"
              </p>
            </div>
          </div>
        );
      
      case "weather":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Temperature</span>
              <span className="text-white">{data.data.temp}°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Cloud Cover</span>
              <span className="text-white">{Math.round((data.data.clouds || 0) * 100)}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "Perfect conditions for outdoor activities"
              </p>
            </div>
          </div>
        );
      
      case "moon":
        return (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Phase</span>
              <span className="text-white capitalize">{data.data.phase}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Luminosity</span>
              <span className="text-white">{Math.round((data.data.luminosity || 0) * 100)}%</span>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-white/80 text-sm italic">
                "The {data.data.phase} moon influences natural rhythms"
              </p>
            </div>
          </div>
        );
      
      default:
        return <div className="text-white/70">No additional details available</div>;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Card */}
          <motion.div
            className="fixed z-50 bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-xl shadow-2xl min-w-80 max-w-sm"
            style={{
              left: Math.min(data.position.x, window.innerWidth - 350),
              top: Math.min(data.position.y, window.innerHeight - 300),
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 20,
              rotateX: -15
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 20,
              rotateX: -15
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{data.emoji}</span>
                <div>
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {getIcon()}
                    {data.title}
                  </h3>
                  {data.subtitle && (
                    <p className="text-white/70 text-sm">{data.subtitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {data.timestamp && (
                <div className="flex items-center gap-2 text-white/60 text-xs mb-4">
                  <Clock className="w-3 h-3" />
                  {data.timestamp}
                </div>
              )}
              
              {getDetailContent()}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white/5 rounded-b-xl">
              <p className="text-white/50 text-xs text-center">
                Tap outside to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};