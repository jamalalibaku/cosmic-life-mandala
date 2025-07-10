/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import React, { useState } from 'react';

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
      {/* Orbital path */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="hsl(45 50% 40%)"
        strokeWidth="1"
        strokeDasharray="4 8"
        opacity="0.3"
      />

      {/* Friend marbles */}
      {friends.map((friend, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start at top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isHovered = hoveredFriend === friend.id;
        const connectionColor = connectionColors[friend.connection || 'regular'];

        return (
          <g key={friend.id} className="friend-marble">
            {/* Connection string */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={connectionColor}
              strokeWidth={isHovered ? "2" : "1"}
              opacity={isHovered ? 0.8 : 0.4}
              className="transition-all duration-300"
            />

            {/* Marble background */}
            <circle
              cx={x}
              cy={y}
              r={isHovered ? 16 : 12}
              fill="rgba(0, 0, 0, 0.7)"
              stroke={connectionColor}
              strokeWidth="2"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredFriend(friend.id)}
              onMouseLeave={() => setHoveredFriend(null)}
            />

            {/* Avatar or emoji */}
            {friend.avatarUrl ? (
              <image
                x={x - 8}
                y={y - 8}
                width="16"
                height="16"
                href={friend.avatarUrl}
                clipPath="circle()"
                className="cursor-pointer"
              />
            ) : (
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="cursor-pointer text-sm"
                fill="white"
              >
                {friend.emoji}
              </text>
            )}

            {/* Hover info */}
            {isHovered && (
              <g className="friend-info">
                <rect
                  x={x - 40}
                  y={y - 40}
                  width="80"
                  height="30"
                  rx="4"
                  fill="rgba(0, 0, 0, 0.9)"
                  stroke="hsl(45 100% 70%)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y - 30}
                  textAnchor="middle"
                  className="fill-yellow-200 text-xs font-medium"
                >
                  {friend.name}
                </text>
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  className="fill-yellow-100 text-xs"
                >
                  {friend.sharedMoments || 0} shared moments
                </text>
              </g>
            )}

            {/* Wobble animation for gravity effect */}
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${Math.sin(index) * 2},${Math.cos(index) * 2}; 0,0`}
              dur="3s"
              repeatCount="indefinite"
              begin={`${index * 0.5}s`}
            />
          </g>
        );
      })}
    </g>
  );
};