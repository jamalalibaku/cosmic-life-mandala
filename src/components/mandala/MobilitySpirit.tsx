/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

interface MobilitySpiritProps {
  activity: 'walk' | 'run' | 'bike';
  intensity: number; // 0–1
  distance: number;
  angle: number;
}

export const MobilitySpirit = ({ activity, intensity, distance, angle }: MobilitySpiritProps) => {
  const length = 40 + distance * 0.5;
  const color = {
    walk: 'hsl(120, 50%, 45%)',
    run: 'hsl(0, 65%, 50%)',
    bike: 'hsl(200, 60%, 55%)'
  }[activity];
  return (
    <line
      x1={0} y1={0}
      x2={length * Math.cos(angle)}
      y2={length * Math.sin(angle)}
      stroke={color}
      strokeWidth={1 + intensity * 2}
      opacity={0.7}
    />
  );
};