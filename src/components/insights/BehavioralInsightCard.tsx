/**
 * (c) 2025 Cosmic Life Mandala – Behavioral Insight Card
 * Displays detected patterns and correlations from the intelligence engine
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Home, 
  Activity, 
  Brain, 
  Heart,
  MapPin,
  Calendar,
  Zap,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export type CorrelationInsight = {
  type: "sleep_mood" | "weather_energy" | "mobility_focus" | "planning_emotion" | "temporal_pattern";
  icon: string;
  text: string;
  confidence: number; // 0-1
  source: string[];
  timeScope: string;
};

interface BehavioralInsightCardProps {
  insights: CorrelationInsight[];
  onViewDetails?: () => void;
  onDismiss?: () => void;
  className?: string;
}

// Icon mapping for insight types
const getInsightIcon = (iconName: string) => {
  const iconMap = {
    moon: Moon,
    sun: Sun,
    home: Home,
    activity: Activity,
    brain: Brain,
    heart: Heart,
    location: MapPin,
    calendar: Calendar,
    energy: Zap,
    eye: Eye
  };
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Brain;
  return IconComponent;
};

// Confidence level styling
const getConfidenceStyle = (confidence: number) => {
  if (confidence >= 0.8) return "text-emerald-400 border-emerald-400/30";
  if (confidence >= 0.6) return "text-amber-400 border-amber-400/30";
  return "text-slate-400 border-slate-400/30";
};

export const BehavioralInsightCard: React.FC<BehavioralInsightCardProps> = ({
  insights,
  onViewDetails,
  onDismiss,
  className = ""
}) => {
  if (!insights.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      <Card className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Detected Patterns
              <span className="text-sm text-muted-foreground font-normal">
                (Last 7 Days)
              </span>
            </CardTitle>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {insights.slice(0, 7).map((insight, index) => {
            const IconComponent = getInsightIcon(insight.icon);
            const confidenceStyle = getConfidenceStyle(insight.confidence);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex items-start gap-3 p-3 rounded-lg bg-background/50 border ${confidenceStyle} hover:bg-background/70 transition-colors`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className={`h-4 w-4 ${confidenceStyle.split(' ')[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {insight.timeScope}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {insights.length > 7 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{insights.length - 7} more patterns detected
            </p>
          )}
          
          <div className="flex gap-2 pt-4">
            {onViewDetails && (
              <Button
                variant="outline"
                onClick={onViewDetails}
                className="flex-1 bg-background/50 hover:bg-background/70"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => console.log('Insights exported:', insights)}
              className="flex-1"
            >
              Export Patterns
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};