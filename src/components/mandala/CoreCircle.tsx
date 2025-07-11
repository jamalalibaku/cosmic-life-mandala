/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

export const CoreCircle = () => {
  return (
    <g>
      <circle cx={0} cy={0} r={40} fill="hsl(200, 70%, 25%)" className="animate-pulse" />
      <text x={0} y={5} textAnchor="middle" fill="cyan" fontSize={10}>NOW</text>
    </g>
  );
};