/**
 * Sound Design Hook - Subtle audio cues for meaningful moments
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface SoundEvent {
  id: string;
  type: 'insight' | 'transition' | 'connection' | 'milestone' | 'ambient';
  intensity: number; // 0-1
  timing: 'immediate' | 'delayed' | 'fade-in';
  spatial?: { x: number; y: number }; // For 3D positioning
}

interface AudioState {
  context: AudioContext | null;
  gainNode: GainNode | null;
  isEnabled: boolean;
  volume: number;
}

export const useSoundDesign = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    context: null,
    gainNode: null,
    isEnabled: true,
    volume: 0.3
  });

  const soundCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const playingSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.value = audioState.volume;

        setAudioState(prev => ({
          ...prev,
          context,
          gainNode
        }));
      } catch (error) {
        console.warn('Audio context initialization failed:', error);
      }
    };

    initAudio();
  }, []);

  // Generate and play sound for events
  const playSound = useCallback(async (event: SoundEvent) => {
    if (!audioState.isEnabled || !audioState.context || !audioState.gainNode) return;

    try {
      // Simple tone generation for now - could be enhanced with actual sound files
      const oscillator = audioState.context.createOscillator();
      const gainNode = audioState.context.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioState.gainNode);

      // Configure based on event type
      let frequency = 440;
      let duration = 0.3;
      
      switch (event.type) {
        case 'insight':
          frequency = 880 + event.intensity * 440;
          duration = 0.8;
          break;
        case 'transition':
          frequency = 220 + event.intensity * 220;
          duration = 1.2;
          break;
        case 'connection':
          frequency = 660 + event.intensity * 220;
          duration = 0.4;
          break;
        case 'milestone':
          frequency = 440;
          duration = 2.0;
          break;
      }

      oscillator.frequency.setValueAtTime(frequency, audioState.context.currentTime);
      gainNode.gain.setValueAtTime(0, audioState.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(event.intensity * audioState.volume, audioState.context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioState.context.currentTime + duration);

      const startTime = event.timing === 'delayed' ? audioState.context.currentTime + 0.3 : audioState.context.currentTime;
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, [audioState]);

  // Control functions
  const setVolume = useCallback((volume: number) => {
    setAudioState(prev => ({ ...prev, volume }));
    if (audioState.gainNode) {
      audioState.gainNode.gain.value = volume;
    }
  }, [audioState.gainNode]);

  const toggleEnabled = useCallback(() => {
    setAudioState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  // Convenience functions for common events
  const playInsightSound = useCallback((intensity = 0.7) => {
    playSound({
      id: `insight-${Date.now()}`,
      type: 'insight',
      intensity,
      timing: 'fade-in'
    });
  }, [playSound]);

  const playTransitionSound = useCallback((intensity = 0.8) => {
    playSound({
      id: `transition-${Date.now()}`,
      type: 'transition',
      intensity,
      timing: 'immediate'
    });
  }, [playSound]);

  const playConnectionSound = useCallback((position?: { x: number; y: number }, intensity = 0.5) => {
    playSound({
      id: `connection-${Date.now()}`,
      type: 'connection',
      intensity,
      timing: 'immediate',
      spatial: position
    });
  }, [playSound]);

  const playMilestoneSound = useCallback((intensity = 1.0) => {
    playSound({
      id: `milestone-${Date.now()}`,
      type: 'milestone',
      intensity,
      timing: 'delayed'
    });
  }, [playSound]);

  return {
    audioState,
    playSound,
    playInsightSound,
    playTransitionSound,
    playConnectionSound,
    playMilestoneSound,
    setVolume,
    toggleEnabled,
    isEnabled: audioState.isEnabled,
    volume: audioState.volume
  };
};