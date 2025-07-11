/**
 * (c) 2025 Cosmic Life Mandala – Interactive Scale Tool
 * Emotional Architect: Adria · Technical Implementation: Love
 * 
 * Scale Tool: Dynamic zoom along arcs - deeper sweeps create more focus
 * Less about control, more about attunement to temporal rhythms
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Focus, Waves } from 'lucide-react';

interface ScaleGesture {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  depth: number;
  arc: number;
  attunement: number;
}

interface ScaleToolProps {
  isActive: boolean;
  onScaleGesture: (gesture: ScaleGesture) => void;
  centerX: number;
  centerY: number;
  currentScale: 'day' | 'week' | 'month' | 'year';
}

export const ScaleTool: React.FC<ScaleToolProps> = ({
  isActive,
  onScaleGesture,
  centerX,
  centerY,
  currentScale
}) => {
  const [isGesturing, setIsGesturing] = useState(false);
  const [gesture, setGesture] = useState<ScaleGesture | null>(null);
  const [focusRipples, setFocusRipples] = useState<Array<{ x: number; y: number; timestamp: number }>>([]);
  const gestureRef = useRef<ScaleGesture | null>(null);

  const handleGestureStart = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!isActive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newGesture: ScaleGesture = {
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      depth: 0,
      arc: 0,
      attunement: 0
    };

    setGesture(newGesture);
    gestureRef.current = newGesture;
    setIsGesturing(true);
  }, [isActive]);

  const handleGestureMove = useCallback((event: MouseEvent) => {
    if (!isGesturing || !gestureRef.current) return;

    const rect = (event.target as Element)?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate gesture depth (distance from start)
    const depth = Math.sqrt(
      Math.pow(x - gestureRef.current.startX, 2) + 
      Math.pow(y - gestureRef.current.startY, 2)
    );

    // Calculate arc (angular movement around center)
    const startAngle = Math.atan2(
      gestureRef.current.startY - centerY, 
      gestureRef.current.startX - centerX
    );
    const currentAngle = Math.atan2(y - centerY, x - centerX);
    const arc = Math.abs(currentAngle - startAngle) * (180 / Math.PI);

    // Calculate attunement (how aligned the gesture is with temporal flow)
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const attunement = Math.max(0, Math.min(1, 1 - Math.abs(distanceFromCenter - 200) / 200));

    const updatedGesture: ScaleGesture = {
      ...gestureRef.current,
      currentX: x,
      currentY: y,
      depth,
      arc,
      attunement
    };

    gestureRef.current = updatedGesture;
    setGesture(updatedGesture);

    // Create focus ripples for high attunement
    if (attunement > 0.7) {
      setFocusRipples(prev => [...prev.slice(-3), { x, y, timestamp: Date.now() }]);
    }

    onScaleGesture(updatedGesture);
  }, [isGesturing, centerX, centerY, onScaleGesture]);

  const handleGestureEnd = useCallback(() => {
    setIsGesturing(false);
    setGesture(null);
    gestureRef.current = null;
  }, []);

  // Mouse event listeners
  React.useEffect(() => {
    if (isGesturing) {
      document.addEventListener('mousemove', handleGestureMove);
      document.addEventListener('mouseup', handleGestureEnd);
      return () => {
        document.removeEventListener('mousemove', handleGestureMove);
        document.removeEventListener('mouseup', handleGestureEnd);
      };
    }
  }, [isGesturing, handleGestureMove, handleGestureEnd]);

  const getAttunementMessage = (attunement: number) => {
    if (attunement > 0.8) return "Deep temporal resonance";
    if (attunement > 0.6) return "Finding the rhythm";
    if (attunement > 0.4) return "Gentle attunement";
    return "Exploring the edges";
  };

  const getScaleDescription = (depth: number, arc: number) => {
    if (depth > 100 && arc > 45) return "Spiraling deeper into time";
    if (depth > 80) return "Descending into detail";
    if (arc > 60) return "Following temporal curves";
    if (depth > 40) return "Reaching toward focus";
    return "Beginning to attune";
  };

  return (
    <g className="scale-tool">
      {/* Invisible interaction layer */}
      {isActive && (
        <rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="transparent"
          onMouseDown={handleGestureStart}
          className="cursor-grab active:cursor-grabbing"
          style={{ pointerEvents: 'all' }}
        />
      )}

      {/* Focus ripples */}
      {focusRipples.map((ripple, index) => (
        <motion.circle
          key={`ripple-${ripple.timestamp}-${index}`}
          cx={ripple.x}
          cy={ripple.y}
          r={0}
          fill="none"
          stroke="hsl(180 60% 70%)"
          strokeWidth="1"
          opacity={0.6}
          initial={{ r: 0, opacity: 0.6 }}
          animate={{ r: 30, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}

      {/* Active gesture visualization */}
      <AnimatePresence>
        {gesture && isGesturing && (
          <g>
            {/* Gesture path */}
            <motion.line
              x1={gesture.startX}
              y1={gesture.startY}
              x2={gesture.currentX}
              y2={gesture.currentY}
              stroke={`hsl(180 ${gesture.attunement * 100}% 70%)`}
              strokeWidth={2 + gesture.attunement * 3}
              opacity={0.8}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Attunement indicator */}
            <motion.circle
              cx={gesture.currentX}
              cy={gesture.currentY}
              r={8 + gesture.attunement * 12}
              fill={`hsl(180 ${gesture.attunement * 100}% 70%)`}
              opacity={gesture.attunement * 0.6}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Gesture feedback */}
            <foreignObject
              x={gesture.currentX - 80}
              y={gesture.currentY - 50}
              width="160"
              height="40"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-2 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {gesture.attunement > 0.7 && <Focus className="w-3 h-3 text-cyan-400" />}
                  {gesture.attunement > 0.4 && gesture.attunement <= 0.7 && <Eye className="w-3 h-3 text-cyan-400" />}
                  {gesture.attunement <= 0.4 && <Waves className="w-3 h-3 text-cyan-400" />}
                  <span className="text-cyan-200 text-xs font-medium">
                    {(gesture.attunement * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-cyan-200/80 text-[10px] leading-tight">
                  {getScaleDescription(gesture.depth, gesture.arc)}
                </p>
              </motion.div>
            </foreignObject>
          </g>
        )}
      </AnimatePresence>

      {/* Temporal flow guides - show attunement zones */}
      {isActive && (
        <g className="temporal-guides" opacity={0.2}>
          {[150, 200, 250].map((radius, index) => (
            <circle
              key={`guide-${radius}`}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="hsl(180 40% 60%)"
              strokeWidth="0.5"
              strokeDasharray="2,8"
              opacity={0.3 - index * 0.1}
            />
          ))}
        </g>
      )}

      {/* Scale tool indicator */}
      {isActive && !isGesturing && (
        <foreignObject
          x={centerX - 40}
          y={centerY - 60}
          width="80"
          height="40"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/60 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-2 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-200 text-xs">Scale</span>
            </div>
            <p className="text-cyan-200/60 text-[10px]">
              Drag to attune focus
            </p>
          </motion.div>
        </foreignObject>
      )}
    </g>
  );
};