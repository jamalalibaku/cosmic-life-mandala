/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

export const CoreCircle = () => {
  return (
    <g>
      <defs>
        <filter id="coreGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{stopColor: 'hsl(280, 70%, 60%)', stopOpacity: 1}} />
          <stop offset="70%" style={{stopColor: 'hsl(240, 60%, 40%)', stopOpacity: 0.8}} />
          <stop offset="100%" style={{stopColor: 'hsl(200, 50%, 20%)', stopOpacity: 0.6}} />
        </radialGradient>
      </defs>
      
      {/* Core breathing center with gradient */}
      <circle 
        cx={0} cy={0} r={35} 
        fill="url(#coreGradient)" 
        filter="url(#coreGlow)"
        opacity={0.9}
      />
      
      {/* Inner pulse ring */}
      <circle 
        cx={0} cy={0} r={25} 
        stroke="hsl(280, 80%, 70%)" 
        strokeWidth={1} 
        fill="none" 
        opacity={0.6}
      />
      
      {/* NOW text with glow */}
      <text 
        x={0} y={5} 
        textAnchor="middle" 
        fill="hsl(280, 90%, 85%)" 
        fontSize={12}
        fontWeight="bold"
        filter="url(#coreGlow)"
      >
        NOW
      </text>
    </g>
  );
};