/**
 * Micro-Interactions Hook - Reveal hidden connections on hover
 */

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DataConnection {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number;
  type: 'temporal' | 'causal' | 'emotional' | 'spatial';
  description: string;
  discoveredAt?: Date;
}

interface HoverState {
  elementId: string | null;
  connections: DataConnection[];
  insights: string[];
  position: { x: number; y: number };
}

export const useMicroInteractions = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    elementId: null,
    connections: [],
    insights: [],
    position: { x: 0, y: 0 }
  });

  const [discoveredConnections, setDiscoveredConnections] = useState<DataConnection[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle element hover with connection discovery
  const handleElementHover = useCallback((
    elementId: string,
    elementData: any,
    position: { x: number; y: number },
    allData?: any[]
  ) => {
    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Immediate hover feedback
    setHoverState(prev => ({
      ...prev,
      elementId,
      position
    }));

    // Delayed connection discovery (300ms for natural feel)
    hoverTimeoutRef.current = setTimeout(() => {
      const connections = discoverConnections(elementId, elementData, allData || []);
      const insights = generateInsights(elementData, connections);

      setHoverState({
        elementId,
        connections,
        insights,
        position
      });

      // Mark newly discovered connections
      const newConnections = connections.filter(conn => 
        !discoveredConnections.some(existing => existing.id === conn.id)
      );
      
      if (newConnections.length > 0) {
        setDiscoveredConnections(prev => [...prev, ...newConnections]);
      }
    }, 300);
  }, [discoveredConnections]);

  // Handle hover exit
  const handleElementLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setHoverState({
      elementId: null,
      connections: [],
      insights: [],
      position: { x: 0, y: 0 }
    });
  }, []);

  // Generate connection lines for visualization
  const getConnectionLines = useCallback(() => {
    return hoverState.connections.map(connection => ({
      id: connection.id,
      path: generateConnectionPath(connection, hoverState.position),
      strength: connection.strength,
      type: connection.type,
      animated: true
    }));
  }, [hoverState.connections, hoverState.position]);

  // Get connection tooltips
  const getConnectionTooltips = useCallback(() => {
    return hoverState.connections.map(connection => ({
      id: connection.id,
      content: connection.description,
      position: calculateTooltipPosition(connection, hoverState.position),
      type: connection.type
    }));
  }, [hoverState.connections, hoverState.position]);

  return {
    hoverState,
    discoveredConnections: discoveredConnections.length,
    handleElementHover,
    handleElementLeave,
    getConnectionLines,
    getConnectionTooltips,
    isHovering: !!hoverState.elementId
  };
};

// Connection discovery logic
function discoverConnections(elementId: string, elementData: any, allData: any[]): DataConnection[] {
  const connections: DataConnection[] = [];

  // Temporal connections (same time period, different data types)
  const temporalConnections = findTemporalConnections(elementId, elementData, allData);
  connections.push(...temporalConnections);

  // Emotional connections (similar mood patterns)
  const emotionalConnections = findEmotionalConnections(elementId, elementData, allData);
  connections.push(...emotionalConnections);

  // Spatial connections (same location, different times)
  const spatialConnections = findSpatialConnections(elementId, elementData, allData);
  connections.push(...spatialConnections);

  // Causal connections (one event influencing another)
  const causalConnections = findCausalConnections(elementId, elementData, allData);
  connections.push(...causalConnections);

  return connections.filter(conn => conn.strength > 0.3); // Only strong connections
}

function findTemporalConnections(elementId: string, elementData: any, allData: any[]): DataConnection[] {
  if (!elementData.date) return [];

  const elementTime = new Date(elementData.date).getTime();
  const timeWindow = 24 * 60 * 60 * 1000; // 24 hours

  return allData
    .filter(item => {
      if (!item.date || item.id === elementId) return false;
      const itemTime = new Date(item.date).getTime();
      return Math.abs(itemTime - elementTime) < timeWindow;
    })
    .map(item => ({
      id: `temporal-${elementId}-${item.id}`,
      sourceId: elementId,
      targetId: item.id,
      strength: calculateTemporalStrength(elementData, item),
      type: 'temporal' as const,
      description: `Occurred around the same time as ${getItemDescription(item)}`
    }));
}

function findEmotionalConnections(elementId: string, elementData: any, allData: any[]): DataConnection[] {
  if (!elementData.mood) return [];

  return allData
    .filter(item => item.mood && item.id !== elementId)
    .map(item => {
      const strength = calculateMoodSimilarity(elementData.mood, item.mood);
      return {
        id: `emotional-${elementId}-${item.id}`,
        sourceId: elementId,
        targetId: item.id,
        strength,
        type: 'emotional' as const,
        description: `Similar emotional state: ${describeMoodSimilarity(elementData.mood, item.mood)}`
      };
    })
    .filter(conn => conn.strength > 0.6);
}

function findSpatialConnections(elementId: string, elementData: any, allData: any[]): DataConnection[] {
  if (!elementData.location) return [];

  return allData
    .filter(item => item.location && item.id !== elementId)
    .map(item => {
      const strength = calculateSpatialProximity(elementData.location, item.location);
      return {
        id: `spatial-${elementId}-${item.id}`,
        sourceId: elementId,
        targetId: item.id,
        strength,
        type: 'spatial' as const,
        description: `Same location: ${elementData.location.name || 'Unknown location'}`
      };
    })
    .filter(conn => conn.strength > 0.8);
}

function findCausalConnections(elementId: string, elementData: any, allData: any[]): DataConnection[] {
  // Look for patterns that might indicate causation
  // This is simplified - in reality would use more sophisticated analysis
  const connections: DataConnection[] = [];

  if (elementData.mood && elementData.mood.valence < 0.3) {
    // Look for potential causes of negative mood
    const recentEvents = allData.filter(item => {
      if (!item.date) return false;
      const timeDiff = new Date(elementData.date).getTime() - new Date(item.date).getTime();
      return timeDiff > 0 && timeDiff < 7 * 24 * 60 * 60 * 1000; // Within past week
    });

    recentEvents.forEach(event => {
      if (event.type === 'stress' || event.workload > 0.7) {
        connections.push({
          id: `causal-${event.id}-${elementId}`,
          sourceId: event.id,
          targetId: elementId,
          strength: 0.7,
          type: 'causal',
          description: `High workload may have contributed to mood change`
        });
      }
    });
  }

  return connections;
}

// Helper functions
function calculateTemporalStrength(item1: any, item2: any): number {
  const time1 = new Date(item1.date).getTime();
  const time2 = new Date(item2.date).getTime();
  const timeDiff = Math.abs(time1 - time2);
  const maxDiff = 24 * 60 * 60 * 1000; // 24 hours
  return Math.max(0, 1 - timeDiff / maxDiff);
}

function calculateMoodSimilarity(mood1: any, mood2: any): number {
  const valenceDiff = Math.abs(mood1.valence - mood2.valence);
  const energyDiff = Math.abs(mood1.energy - mood2.energy);
  return Math.max(0, 1 - (valenceDiff + energyDiff) / 2);
}

function calculateSpatialProximity(loc1: any, loc2: any): number {
  if (loc1.name === loc2.name) return 1;
  // Could implement more sophisticated location comparison
  return 0;
}

function generateInsights(elementData: any, connections: DataConnection[]): string[] {
  const insights: string[] = [];

  if (connections.length > 3) {
    insights.push("This moment is highly connected to other life events");
  }

  const strongConnections = connections.filter(c => c.strength > 0.8);
  if (strongConnections.length > 0) {
    insights.push(`${strongConnections.length} strong pattern${strongConnections.length > 1 ? 's' : ''} detected`);
  }

  const emotionalConnections = connections.filter(c => c.type === 'emotional');
  if (emotionalConnections.length > 1) {
    insights.push("Similar emotional patterns found in your history");
  }

  return insights;
}

function getItemDescription(item: any): string {
  if (item.mood) return `emotional state: ${item.mood.emotion}`;
  if (item.activity) return `activity: ${item.activity}`;
  if (item.location) return `location: ${item.location.name}`;
  return 'life event';
}

function describeMoodSimilarity(mood1: any, mood2: any): string {
  if (mood1.emotion === mood2.emotion) return mood1.emotion;
  return `similar energy levels`;
}

function generateConnectionPath(connection: DataConnection, startPos: { x: number; y: number }): string {
  // Generate SVG path for connection line
  // This would be implemented based on actual element positions
  return `M ${startPos.x} ${startPos.y} Q ${startPos.x + 50} ${startPos.y - 30} ${startPos.x + 100} ${startPos.y}`;
}

function calculateTooltipPosition(connection: DataConnection, hoverPos: { x: number; y: number }): { x: number; y: number } {
  return {
    x: hoverPos.x + 120,
    y: hoverPos.y - 10
  };
}