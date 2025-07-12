/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Friend {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string;
  sharedMoments?: number;
  connection?: 'close' | 'regular' | 'distant';
}

interface FriendOrbitRingProps {
  friends: Friend[];
  centerX: number;
  centerY: number;
  radius: number;
  theme: string;
  visible?: boolean;
}

const connectionColors = {
  close: 'hsl(320 100% 70%)',
  regular: 'hsl(200 100% 70%)',
  distant: 'hsl(240 30% 60%)'
};

export const FriendOrbitRing: React.FC<FriendOrbitRingProps> = ({
  friends,
  centerX,
  centerY,
  radius,
  theme,
  visible = true
}) => {
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);

  if (!visible || friends.length === 0) return null;

  const angleStep = (2 * Math.PI) / friends.length;

  return (
    <g className="friend-orbit-ring" style={{ opacity: visible ? 1 : 0 }}>
      <defs>
        <filter id="friend-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Subtle orbital path */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(45 50% 40%)"
        strokeWidth="1"
        strokeDasharray="6 12"
        opacity="0.2"
      />

      {/* Friend floating bodies - no connection lines, 3D hovering */}
      {friends.map((friend, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start at top
        const baseX = centerX + radius * Math.cos(angle);
        const baseY = centerY + radius * Math.sin(angle);
        const isHovered = hoveredFriend === friend.id;
        const connectionColor = connectionColors[friend.connection || 'regular'];
        
        // Create unique random offsets for each friend
        const noiseOffset = Math.sin(index * 13.7) * 3;
        const verticalFloat = Math.cos(index * 7.3) * 2;

        return (
          <motion.g
            key={friend.id}
            className="friend-marble"
            animate={{
              x: [0, noiseOffset, -noiseOffset * 0.5, 0],
              y: [0, verticalFloat, -verticalFloat * 0.7, 0],
              rotateZ: [0, 3, -3, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3
            }}
          >
            {/* Soft glow aura */}
            <circle
              cx={baseX}
              cy={baseY}
              r={isHovered ? 24 : 18}
              fill={connectionColor}
              opacity={isHovered ? 0.2 : 0.1}
              filter="url(#friend-glow)"
            />

            {/* Marble background with 3D effect */}
            <circle
              cx={baseX}
              cy={baseY}
              r={isHovered ? 16 : 12}
              fill="rgba(0, 0, 0, 0.8)"
              stroke={connectionColor}
              strokeWidth="2"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredFriend(friend.id)}
              onMouseLeave={() => setHoveredFriend(null)}
              filter="drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
            />

            {/* Inner light reflection */}
            <circle
              cx={baseX - 2}
              cy={baseY - 2}
              r={isHovered ? 6 : 4}
              fill="rgba(255, 255, 255, 0.3)"
              opacity={0.6}
            />

            {/* Avatar or emoji */}
            {friend.avatarUrl ? (
              <image
                x={baseX - 8}
                y={baseY - 8}
                width="16"
                height="16"
                href={friend.avatarUrl}
                clipPath="circle()"
                className="cursor-pointer"
              />
            ) : (
              <text
                x={baseX}
                y={baseY + 4}
                textAnchor="middle"
                className="cursor-pointer text-sm"
                fill="white"
                filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
              >
                {friend.emoji}
              </text>
            )}

            {/* Hover info */}
            {isHovered && (
              <g className="friend-info">
                <rect
                  x={baseX - 40}
                  y={baseY - 45}
                  width="80"
                  height="30"
                  rx="6"
                  fill="rgba(0, 0, 0, 0.9)"
                  stroke={connectionColor}
                  strokeWidth="1"
                  filter="drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
                />
                <text
                  x={baseX}
                  y={baseY - 35}
                  textAnchor="middle"
                  className="fill-yellow-200 text-xs font-medium"
                >
                  {friend.name}
                </text>
                <text
                  x={baseX}
                  y={baseY - 23}
                  textAnchor="middle"
                  className="fill-yellow-100 text-xs"
                >
                  {friend.sharedMoments || 0} shared moments
                </text>
              </g>
            )}
          </motion.g>
        );
      })}
    </g>
  );
};