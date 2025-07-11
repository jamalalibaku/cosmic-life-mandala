/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

interface SleepRippleProps {
  depth: number;  // 0 (deep) to 1 (light)
  phase: 'deep' | 'REM' | 'light';
  duration: number; // in minutes
}

export const SleepRipple = ({ depth, phase, duration }: SleepRippleProps) => {
  const r = 50 - depth * 30;
  const color = {
    deep: 'hsl(240, 60%, 15%)',
    REM: 'hsl(280, 50%, 25%)',
    light: 'hsl(220, 55%, 35%)'
  }[phase];
  return (
    <circle cx={0} cy={0} r={r} stroke={color} strokeWidth={2} fill="none" opacity={0.5} />
  );
};