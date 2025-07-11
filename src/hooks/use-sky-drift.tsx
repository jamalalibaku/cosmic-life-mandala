/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState, useEffect } from 'react';

interface SkyDriftProps {
  driftSpeed?: number; // Speed multiplier (default: 1)
  enabled?: boolean;
}

export const useSkyDrift = ({ driftSpeed = 1, enabled = true }: SkyDriftProps = {}) => {
  const [drift, setDrift] = useState({
    cloudOffset: 0,
    windAngle: 0,
    atmosphericPulse: 0
  });

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setDrift(prev => ({
        cloudOffset: (prev.cloudOffset + 0.1 * driftSpeed) % 360,
        windAngle: (prev.windAngle + 0.2 * driftSpeed) % 360,
        atmosphericPulse: Math.sin(Date.now() / 10000) * 0.5 + 0.5
      }));
    }, 100); // 10fps for smooth drift

    return () => clearInterval(interval);
  }, [driftSpeed, enabled]);

  return drift;
};