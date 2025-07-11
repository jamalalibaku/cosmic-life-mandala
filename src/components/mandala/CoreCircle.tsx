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
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Smoother core gradient with more transition steps */}
        <radialGradient id="coreGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style={{stopColor: 'hsl(var(--core-primary))', stopOpacity: 0.8}} />
          <stop offset="40%" style={{stopColor: 'hsl(var(--core-secondary))', stopOpacity: 0.6}} />
          <stop offset="70%" style={{stopColor: 'hsl(var(--background-subtle))', stopOpacity: 0.4}} />
          <stop offset="90%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.2}} />
          <stop offset="100%" style={{stopColor: 'transparent', stopOpacity: 0}} />
        </radialGradient>
        
        {/* Outer transition gradient for seamless blend */}
        <radialGradient id="transitionGradient" cx="50%" cy="50%" r="100%">
          <stop offset="0%" style={{stopColor: 'transparent', stopOpacity: 0}} />
          <stop offset="60%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.05}} />
          <stop offset="80%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.1}} />
          <stop offset="100%" style={{stopColor: 'hsl(var(--background))', stopOpacity: 0.15}} />
        </radialGradient>
      </defs>
      
      {/* Outer transition zone for smooth background blend */}
      <circle 
        cx={0} cy={0} r={85} 
        fill="url(#transitionGradient)" 
        opacity={0.7}
      />
      
      {/* Core breathing center with enhanced gradient */}
      <circle 
        cx={0} cy={0} r={45} 
        fill="url(#coreGradient)" 
        filter="url(#coreGlow)"
        opacity={0.85}
      />
      
      {/* Subtle middle ring for transition */}
      <circle 
        cx={0} cy={0} r={35} 
        stroke="hsl(var(--core-glow))" 
        strokeWidth={0.5} 
        fill="none" 
        opacity={0.3}
      />
      
      {/* Inner pulse ring */}
      <circle 
        cx={0} cy={0} r={25} 
        stroke="hsl(var(--core-glow))" 
        strokeWidth={1} 
        fill="none" 
        opacity={0.5}
      />
      
      {/* NOW text with enhanced glow */}
      <text 
        x={0} y={5} 
        textAnchor="middle" 
        fill="hsl(var(--core-primary))" 
        fontSize={12}
        fontWeight="bold"
        filter="url(#coreGlow)"
        opacity={0.9}
      >
        NOW
      </text>
    </g>
  );
};