/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

interface EmotionalCreatureProps {
  startAngle: number;
  arcLength: number;
  intensity: number;
  valence: number;
  arousal: number;
  emotion: string;
}

export const EmotionalCreature = ({ startAngle, arcLength, intensity, valence, arousal, emotion }: EmotionalCreatureProps) => {
  const radius = 140;
  const path = `M 0 0 L ${radius} 0 A ${radius} ${radius} 0 0 1 ${radius * Math.cos(arcLength)} ${radius * Math.sin(arcLength)} Z`;
  const hue = valence > 0 ? 45 + valence * 15 : 0;
  const color = `hsl(${hue}, ${60 + intensity * 30}%, ${50 + valence * 20}%)`;
  return (
    <g transform={`rotate(${startAngle})`}>
      <path d={path} fill={color} opacity={0.7} />
    </g>
  );
};