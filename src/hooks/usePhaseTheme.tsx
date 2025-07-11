import { useEffect, useState } from 'react';
import { LifePhase, LifePhaseThemeMap } from '@/utils/life-phase-detection';

export interface PhaseThemeModifiers {
  accentColor: string;
  glowIntensity: number;
  pulseSpeed: number;
  driftDirection: number;
}

export function usePhaseTheme(currentPhase: LifePhase | null): PhaseThemeModifiers {
  const [themeModifiers, setThemeModifiers] = useState<PhaseThemeModifiers>({
    accentColor: 'hsl(var(--primary))',
    glowIntensity: 0.3,
    pulseSpeed: 1,
    driftDirection: 0
  });

  useEffect(() => {
    if (!currentPhase) return;

    const theme = LifePhaseThemeMap[currentPhase];
    
    // Phase-specific animation and color modifiers
    const modifiers: Record<LifePhase, PhaseThemeModifiers> = {
      awakening: {
        accentColor: theme.color,
        glowIntensity: 0.6,
        pulseSpeed: 1.5,
        driftDirection: 0.2
      },
      building: {
        accentColor: theme.color,
        glowIntensity: 0.8,
        pulseSpeed: 1.2,
        driftDirection: 0.1
      },
      flowing: {
        accentColor: theme.color,
        glowIntensity: 0.4,
        pulseSpeed: 0.8,
        driftDirection: 0.5
      },
      deepening: {
        accentColor: theme.color,
        glowIntensity: 0.2,
        pulseSpeed: 0.6,
        driftDirection: 0.05
      },
      integrating: {
        accentColor: theme.color,
        glowIntensity: 0.5,
        pulseSpeed: 1.0,
        driftDirection: 0.3
      },
      releasing: {
        accentColor: theme.color,
        glowIntensity: 0.3,
        pulseSpeed: 0.7,
        driftDirection: -0.2
      },
      renewing: {
        accentColor: theme.color,
        glowIntensity: 0.7,
        pulseSpeed: 1.3,
        driftDirection: 0.4
      }
    };

    setThemeModifiers(modifiers[currentPhase]);

    // Apply CSS custom properties for theme synchronization
    const root = document.documentElement;
    root.style.setProperty('--phase-accent', theme.color);
    root.style.setProperty('--phase-glow-intensity', modifiers[currentPhase].glowIntensity.toString());

  }, [currentPhase]);

  return themeModifiers;
}

export function applyPhaseThemeToElement(element: HTMLElement, phase: LifePhase | null, intensity: number = 0.1) {
  if (!phase || !element) return;

  const theme = LifePhaseThemeMap[phase];
  const color = theme.color;
  
  // Extract HSL values and apply with reduced opacity
  const hslMatch = color.match(/hsl\(([^)]+)\)/);
  if (hslMatch) {
    const hslValues = hslMatch[1];
    element.style.boxShadow = `0 0 20px hsla(${hslValues}, ${intensity})`;
    element.style.borderColor = `hsla(${hslValues}, ${intensity * 2})`;
  }
}