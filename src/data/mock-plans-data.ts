/**
 * (c) 2025 Cosmic Life Mandala – Plans Layer Data
 * Mock productivity and planning data for the timeline
 */

export interface PlansDataPoint {
  timestamp: string;
  type: 'task' | 'goal' | 'project' | 'meeting' | 'deadline';
  title: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  intensity: number; // 0-1
  duration?: number; // hours
  layerType: 'plans';
}

export const mockPlansData: PlansDataPoint[] = [
  {
    timestamp: "2025-07-01T09:00:00+02:00",
    type: "task",
    title: "Review quarterly goals",
    status: "completed",
    priority: "high",
    category: "planning",
    intensity: 0.8,
    duration: 2,
    layerType: "plans"
  },
  {
    timestamp: "2025-07-01T14:00:00+02:00",
    type: "meeting",
    title: "Team alignment session",
    status: "completed",
    priority: "medium",
    category: "collaboration",
    intensity: 0.6,
    duration: 1.5,
    layerType: "plans"
  },
  {
    timestamp: "2025-07-02T10:30:00+02:00",
    type: "project",
    title: "Creative writing session",
    status: "active",
    priority: "high",
    category: "creative",
    intensity: 0.9,
    duration: 3,
    layerType: "plans"
  },
  {
    timestamp: "2025-07-02T16:00:00+02:00",
    type: "task",
    title: "Research new technologies",
    status: "planned",
    priority: "medium",
    category: "learning",
    intensity: 0.7,
    duration: 2,
    layerType: "plans"
  },
  {
    timestamp: "2025-07-03T08:00:00+02:00",
    type: "goal",
    title: "Complete morning meditation",
    status: "completed",
    priority: "low",
    category: "wellness",
    intensity: 0.4,
    duration: 0.5,
    layerType: "plans"
  },
  {
    timestamp: "2025-07-03T11:00:00+02:00",
    type: "deadline",
    title: "Submit project proposal",
    status: "active",
    priority: "urgent",
    category: "work",
    intensity: 1.0,
    duration: 4,
    layerType: "plans"
  }
];