import React from 'react';
import { motion } from 'framer-motion';

export interface ThemeOverlay {
  id: string;
  name: string;
  renderOverlay: (props: ThemeOverlayProps) => React.ReactNode;
  haiku?: string;
  audioUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface ThemeOverlayProps {
  centerX: number;
  centerY: number;
  maxRadius: number;
  isActive: boolean;
  layerData?: any[];
  motionState?: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
}

// Core Mandala Render (structure only, no styling)
export interface CoreMandalaProps {
  layers: any[];
  centerX: number;
  centerY: number;
  maxRadius: number;
  children?: React.ReactNode;
}

export const CoreMandalaRender: React.FC<CoreMandalaProps> = ({ 
  layers, 
  centerX, 
  centerY, 
  maxRadius, 
  children 
}) => {
  return (
    <g>
      {/* Core structural elements - no colors/styling */}
      <circle
        cx={centerX}
        cy={centerY}
        r={25}
        fill="var(--theme-core-fill)"
        stroke="var(--theme-core-stroke)"
        strokeWidth="2"
      />
      
      {/* Layer rings */}
      {layers.map((layer, index) => (
        <g key={layer.name}>
          <circle
            cx={centerX}
            cy={centerY}
            r={layer.radius}
            fill="none"
            stroke="var(--theme-layer-stroke)"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Data points */}
          {layer.data?.map((dataPoint: any, i: number) => {
            const angle = (i / layer.data.length) * 360;
            const radian = (angle * Math.PI) / 180;
            const x = centerX + layer.radius * Math.cos(radian);
            const y = centerY + layer.radius * Math.sin(radian);
            
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="var(--theme-data-point-fill)"
                stroke="var(--theme-data-point-stroke)"
                strokeWidth="1"
              />
            );
          })}
        </g>
      ))}
      
      {children}
    </g>
  );
};

// Theme Overlay Definitions
export const floralOverlay: ThemeOverlay = {
  id: 'floral',
  name: 'Floral',
  colors: {
    primary: 'hsl(300, 40%, 60%)',
    secondary: 'hsl(280, 30%, 70%)',
    accent: 'hsl(320, 50%, 80%)',
    background: 'hsl(280, 20%, 15%)'
  },
  haiku: "Petals drift through time\nMemories bloom in spirals\nLife's garden unfolds",
  renderOverlay: ({ centerX, centerY, maxRadius, motionState }) => (
    <g>
      {/* Floral petals around core */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const x = centerX + 40 * Math.cos(angle);
        const y = centerY + 40 * Math.sin(angle);
        
        return (
          <motion.g
            key={i}
            animate={{
              scale: 1 + (motionState?.scale || 0) * 0.2,
              rotate: (motionState?.rotation || 0) + i * 45
            }}
          >
            <ellipse
              cx={x}
              cy={y}
              rx="8"
              ry="16"
              fill="hsl(300, 60%, 80%)"
              opacity="0.6"
              transform={`rotate(${i * 45} ${x} ${y})`}
            />
          </motion.g>
        );
      })}
      
      {/* Organic flowing lines */}
      <path
        d={`M ${centerX-maxRadius} ${centerY} Q ${centerX} ${centerY-50} ${centerX+maxRadius} ${centerY}`}
        stroke="hsl(280, 40%, 60%)"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </g>
  )
};

export const noirOverlay: ThemeOverlay = {
  id: 'noir',
  name: 'Noir',
  colors: {
    primary: 'hsl(0, 0%, 90%)',
    secondary: 'hsl(0, 0%, 60%)',
    accent: 'hsl(45, 100%, 60%)',
    background: 'hsl(0, 0%, 5%)'
  },
  haiku: "Shadows tell stories\nMemories in black and white\nTime's silent witness",
  renderOverlay: ({ centerX, centerY, maxRadius }) => (
    <g>
      {/* Film noir lighting effects */}
      <defs>
        <radialGradient id="noirGlow">
          <stop offset="0%" stopColor="hsl(45, 100%, 60%)" stopOpacity="0.8" />
          <stop offset="70%" stopColor="hsl(0, 0%, 20%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(0, 0%, 0%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.8}
        fill="url(#noirGlow)"
      />
      
      {/* Venetian blind effect */}
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x={centerX - maxRadius}
          y={centerY - maxRadius + i * 40}
          width={maxRadius * 2}
          height="20"
          fill="hsl(0, 0%, 0%)"
          opacity="0.3"
        />
      ))}
    </g>
  )
};

export const techHudOverlay: ThemeOverlay = {
  id: 'techHud',
  name: 'Tech HUD',
  colors: {
    primary: 'hsl(180, 100%, 60%)',
    secondary: 'hsl(120, 100%, 50%)',
    accent: 'hsl(60, 100%, 50%)',
    background: 'hsl(220, 30%, 5%)'
  },
  haiku: "Data streams flowing\nDigital life patterns\nFuture's pulse beats strong",
  renderOverlay: ({ centerX, centerY, maxRadius, layerData }) => (
    <g>
      {/* HUD grid lines */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(180, 100%, 40%)" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      
      <rect
        x={centerX - maxRadius}
        y={centerY - maxRadius}
        width={maxRadius * 2}
        height={maxRadius * 2}
        fill="url(#grid)"
      />
      
      {/* Corner brackets */}
      {[
        [-1, -1], [1, -1], [1, 1], [-1, 1]
      ].map(([xDir, yDir], i) => (
        <g key={i}>
          <path
            d={`M ${centerX + xDir * maxRadius * 0.8} ${centerY + yDir * maxRadius * 0.8} 
                L ${centerX + xDir * maxRadius * 0.9} ${centerY + yDir * maxRadius * 0.8}
                L ${centerX + xDir * maxRadius * 0.9} ${centerY + yDir * maxRadius * 0.9}`}
            stroke="hsl(180, 100%, 60%)"
            strokeWidth="2"
            fill="none"
          />
        </g>
      ))}
      
      {/* Data readouts */}
      <text
        x={centerX + maxRadius * 0.7}
        y={centerY - maxRadius * 0.8}
        fill="hsl(120, 100%, 50%)"
        fontSize="12"
        fontFamily="monospace"
      >
        {layerData ? `DATA: ${layerData.length} LAYERS` : 'SCANNING...'}
      </text>
    </g>
  )
};

// Theme Registry
export const themeOverlays: Record<string, ThemeOverlay> = {
  floral: floralOverlay,
  noir: noirOverlay,
  techHud: techHudOverlay
};

// Theme Overlay Manager Component
export interface ThemeOverlayManagerProps {
  currentTheme: string;
  coreRenderProps: CoreMandalaProps;
  overlayProps: ThemeOverlayProps;
}

export const ThemeOverlayManager: React.FC<ThemeOverlayManagerProps> = ({
  currentTheme,
  coreRenderProps,
  overlayProps
}) => {
  const activeOverlay = themeOverlays[currentTheme];
  
  // Apply theme CSS variables
  React.useEffect(() => {
    if (activeOverlay) {
      const root = document.documentElement;
      root.style.setProperty('--theme-core-fill', activeOverlay.colors.primary);
      root.style.setProperty('--theme-core-stroke', activeOverlay.colors.accent);
      root.style.setProperty('--theme-layer-stroke', activeOverlay.colors.secondary);
      root.style.setProperty('--theme-data-point-fill', activeOverlay.colors.accent);
      root.style.setProperty('--theme-data-point-stroke', activeOverlay.colors.primary);
    }
  }, [activeOverlay]);
  
  return (
    <g>
      {/* Core structure (always rendered) */}
      <CoreMandalaRender {...coreRenderProps} />
      
      {/* Theme-specific overlay */}
      {activeOverlay && activeOverlay.renderOverlay(overlayProps)}
    </g>
  );
};