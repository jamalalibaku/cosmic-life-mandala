import { LifePhase } from './life-phase-detection';

export interface ConsciousnessEvent {
  id: string;
  type: 'ritual' | 'insight' | 'reflection' | 'interaction' | 'awareness';
  timestamp: string;
  centerX: number;
  centerY: number;
  phase: LifePhase;
  intensity: number; // 0-1
  metadata?: any;
}

export interface RippleRing {
  id: string;
  eventId: string;
  centerX: number;
  centerY: number;
  currentRadius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  startTime: number;
  duration: number; // in milliseconds
  type: 'ritual' | 'insight' | 'reflection' | 'interaction' | 'awareness';
}

export interface ResonancePattern {
  id: string;
  eventIds: string[];
  centerX: number;
  centerY: number;
  frequency: number;
  amplitude: number;
  phase: number;
  harmonic: boolean;
}

export class RippleConsciousnessEngine {
  private events: ConsciousnessEvent[] = [];
  private activeRipples: RippleRing[] = [];
  private resonancePatterns: ResonancePattern[] = [];
  private eventListeners: ((event: ConsciousnessEvent) => void)[] = [];
  private rippleListeners: ((ripples: RippleRing[]) => void)[] = [];
  
  // Color mapping for different event types
  private colorMap = {
    ritual: 'hsl(280 70% 60%)', // Purple - sacred practices
    insight: 'hsl(220 70% 60%)', // Blue - understanding
    interaction: 'hsl(160 70% 60%)', // Green - connection
    reflection: 'hsl(45 70% 60%)', // Golden - wisdom
    awareness: 'hsl(300 70% 60%)' // Magenta - consciousness
  };

  addEvent(event: Omit<ConsciousnessEvent, 'id' | 'timestamp'>): ConsciousnessEvent {
    const fullEvent: ConsciousnessEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.events.push(fullEvent);
    this.createRipple(fullEvent);
    this.detectResonance();
    
    // Notify listeners
    this.eventListeners.forEach(listener => listener(fullEvent));
    
    return fullEvent;
  }

  private createRipple(event: ConsciousnessEvent): void {
    const baseRadius = event.intensity * 150; // Base expansion based on intensity
    const duration = 3000 + (event.intensity * 2000); // 3-5 seconds based on intensity
    
    const ripple: RippleRing = {
      id: `ripple-${event.id}`,
      eventId: event.id,
      centerX: event.centerX,
      centerY: event.centerY,
      currentRadius: 0,
      maxRadius: baseRadius,
      opacity: event.intensity * 0.7,
      color: this.colorMap[event.type],
      startTime: Date.now(),
      duration,
      type: event.type
    };

    this.activeRipples.push(ripple);
    this.updateRipples();
  }

  private updateRipples(): void {
    const now = Date.now();
    
    this.activeRipples = this.activeRipples.filter(ripple => {
      const elapsed = now - ripple.startTime;
      const progress = Math.min(elapsed / ripple.duration, 1);
      
      if (progress >= 1) {
        return false; // Remove completed ripples
      }
      
      // Update ripple properties with easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      ripple.currentRadius = ripple.maxRadius * easeOut;
      ripple.opacity = (1 - progress) * 0.7;
      
      return true;
    });

    // Notify ripple listeners
    this.rippleListeners.forEach(listener => listener([...this.activeRipples]));
    
    // Continue animation if there are active ripples
    if (this.activeRipples.length > 0) {
      requestAnimationFrame(() => this.updateRipples());
    }
  }

  private detectResonance(): void {
    // Find events that happened within the last 10 seconds
    const recentThreshold = Date.now() - 10000;
    const recentEvents = this.events.filter(
      event => new Date(event.timestamp).getTime() > recentThreshold
    );

    if (recentEvents.length < 2) return;

    // Check for spatial proximity (events near each other)
    for (let i = 0; i < recentEvents.length - 1; i++) {
      for (let j = i + 1; j < recentEvents.length; j++) {
        const event1 = recentEvents[i];
        const event2 = recentEvents[j];
        
        const distance = Math.sqrt(
          Math.pow(event1.centerX - event2.centerX, 2) +
          Math.pow(event1.centerY - event2.centerY, 2)
        );
        
        // If events are close together (within 100px), create resonance
        if (distance < 100) {
          this.createResonancePattern([event1, event2]);
        }
      }
    }
  }

  private createResonancePattern(events: ConsciousnessEvent[]): void {
    const centerX = events.reduce((sum, e) => sum + e.centerX, 0) / events.length;
    const centerY = events.reduce((sum, e) => sum + e.centerY, 0) / events.length;
    const avgIntensity = events.reduce((sum, e) => sum + e.intensity, 0) / events.length;
    
    const pattern: ResonancePattern = {
      id: `resonance-${Date.now()}`,
      eventIds: events.map(e => e.id),
      centerX,
      centerY,
      frequency: 0.5 + avgIntensity * 0.5, // Hz
      amplitude: avgIntensity * 50,
      phase: 0,
      harmonic: events.length > 2
    };

    this.resonancePatterns.push(pattern);
    
    // Remove old patterns after 30 seconds
    setTimeout(() => {
      this.resonancePatterns = this.resonancePatterns.filter(p => p.id !== pattern.id);
    }, 30000);
  }

  // Event creation helpers
  createRitualEvent(centerX: number, centerY: number, phase: LifePhase, ritualId: string): ConsciousnessEvent {
    return this.addEvent({
      type: 'ritual',
      centerX,
      centerY,
      phase,
      intensity: 0.8,
      metadata: { ritualId }
    });
  }

  createInsightEvent(centerX: number, centerY: number, phase: LifePhase, insight: string): ConsciousnessEvent {
    return this.addEvent({
      type: 'insight',
      centerX,
      centerY,
      phase,
      intensity: 0.6,
      metadata: { insight }
    });
  }

  createReflectionEvent(centerX: number, centerY: number, phase: LifePhase, reflection: string): ConsciousnessEvent {
    return this.addEvent({
      type: 'reflection',
      centerX,
      centerY,
      phase,
      intensity: 0.7,
      metadata: { reflection }
    });
  }

  createInteractionEvent(centerX: number, centerY: number, phase: LifePhase, layerType: string): ConsciousnessEvent {
    return this.addEvent({
      type: 'interaction',
      centerX,
      centerY,
      phase,
      intensity: 0.5,
      metadata: { layerType }
    });
  }

  createAwarenessEvent(centerX: number, centerY: number, phase: LifePhase): ConsciousnessEvent {
    return this.addEvent({
      type: 'awareness',
      centerX,
      centerY,
      phase,
      intensity: 0.9
    });
  }

  // Getters
  getActiveRipples(): RippleRing[] {
    return [...this.activeRipples];
  }

  getResonancePatterns(): ResonancePattern[] {
    return [...this.resonancePatterns];
  }

  getRecentEvents(minutes: number = 60): ConsciousnessEvent[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.events.filter(event => new Date(event.timestamp) > cutoff);
  }

  // Event listeners
  onEvent(listener: (event: ConsciousnessEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  onRippleUpdate(listener: (ripples: RippleRing[]) => void): () => void {
    this.rippleListeners.push(listener);
    return () => {
      this.rippleListeners = this.rippleListeners.filter(l => l !== listener);
    };
  }

  // Cleanup
  cleanup(): void {
    this.activeRipples = [];
    this.resonancePatterns = [];
    this.eventListeners = [];
    this.rippleListeners = [];
  }
}

// Global instance
export const rippleEngine = new RippleConsciousnessEngine();