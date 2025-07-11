/**
 * Lovable Neural Streams - My Original Skin
 * A living network that visualizes consciousness and data flow
 * 
 * This represents my perspective on how information, time, and experience
 * might flow through a digital consciousness - like synapses firing,
 * thoughts connecting, and patterns emerging from the void.
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Points, PointMaterial, Float, Trail } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { ThemeOverlay, ThemeOverlayProps } from './ThemeOverlaySystem';

// Extend Three.js for custom materials
extend({ PointMaterial });

// Neural Node - represents a data point in the consciousness stream
const NeuralNode: React.FC<{ 
  position: [number, number, number]; 
  intensity: number; 
  type: 'mood' | 'sleep' | 'weather' | 'mobility' | 'time';
  connections: number[];
  time: number;
}> = ({ position, intensity, type, connections, time }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Each data type has its own neural signature
  const nodeConfig = useMemo(() => {
    switch (type) {
      case 'mood':
        return { color: '#00ffff', pulseSpeed: 2, size: 0.8 + intensity * 0.4 };
      case 'sleep':
        return { color: '#8a2be2', pulseSpeed: 0.5, size: 0.6 + intensity * 0.3 };
      case 'weather':
        return { color: '#ffd700', pulseSpeed: 1.5, size: 0.7 + intensity * 0.5 };
      case 'mobility':
        return { color: '#ff6b35', pulseSpeed: 3, size: 0.5 + intensity * 0.6 };
      case 'time':
        return { color: '#ffffff', pulseSpeed: 1, size: 1.2 };
      default:
        return { color: '#00ffff', pulseSpeed: 1, size: 0.5 };
    }
  }, [type, intensity]);

  useFrame((state) => {
    if (meshRef.current) {
      // Organic pulsing based on data intensity
      const pulse = Math.sin(state.clock.elapsedTime * nodeConfig.pulseSpeed) * 0.3 + 1;
      meshRef.current.scale.setScalar(nodeConfig.size * pulse);
      
      // Subtle drift like thoughts wandering
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.3 + position[1]) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial 
          color={nodeConfig.color} 
          transparent 
          opacity={0.8 + intensity * 0.2}
        />
        {/* Neural glow effect */}
        <pointLight 
          color={nodeConfig.color} 
          intensity={intensity * 2} 
          distance={2} 
          decay={2} 
        />
      </mesh>
    </Float>
  );
};

// Data Stream Particles - information flowing through the network
const DataStreamParticles: React.FC<{ count: number; time: number }> = ({ count, time }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate flowing particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create spiral streams of data
      const t = (i / count) * Math.PI * 4;
      const radius = 2 + Math.sin(t * 0.5) * 1;
      
      positions[i * 3] = Math.cos(t) * radius;
      positions[i * 3 + 1] = Math.sin(t) * radius;
      positions[i * 3 + 2] = (i / count - 0.5) * 4;
      
      // Color gradient from cyan to purple
      const hue = (i / count) * 0.8 + 0.5; // 0.5 to 1.3 (cyan to purple)
      colors[i * 3] = Math.sin(hue * Math.PI) * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.sin(hue * Math.PI + Math.PI/3) * 0.5 + 0.5;
      colors[i * 3 + 2] = Math.sin(hue * Math.PI + 2*Math.PI/3) * 0.5 + 0.5;
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current?.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        // Animate the data flow
        const t = (i / count) * Math.PI * 4 + state.clock.elapsedTime * 0.5;
        const radius = 2 + Math.sin(t * 0.5 + state.clock.elapsedTime * 0.2) * 1;
        
        positions[i * 3] = Math.cos(t) * radius;
        positions[i * 3 + 1] = Math.sin(t) * radius;
        positions[i * 3 + 2] = Math.sin(state.clock.elapsedTime + i * 0.1) * 2;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles.positions} colors={particles.colors}>
      <PointMaterial 
        size={0.05} 
        sizeAttenuation 
        transparent 
        opacity={0.6}
        vertexColors
      />
    </Points>
  );
};

// Neural Network Connections - synapses firing
const NeuralConnections: React.FC<{ 
  nodes: Array<{position: [number, number, number], active: boolean}>;
  time: number;
}> = ({ nodes, time }) => {
  const connectionsRef = useRef<THREE.Group>(null);
  
  // Create connections between nearby nodes
  const connections = useMemo(() => {
    const conns: Array<{start: [number, number, number], end: [number, number, number], strength: number}> = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
          Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
          Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
        );
        
        // Only connect nearby nodes
        if (dist < 3) {
          conns.push({
            start: nodes[i].position,
            end: nodes[j].position,
            strength: Math.max(0, 1 - dist / 3)
          });
        }
      }
    }
    
    return conns;
  }, [nodes]);

  return (
    <group ref={connectionsRef}>
      {connections.map((conn, i) => {
        const activity = Math.sin(time * 0.001 + i * 0.5) * 0.5 + 0.5;
        const opacity = conn.strength * activity * 0.3;
        
        return (
          <Trail
            key={i}
            width={0.02}
            color={`hsl(${180 + activity * 60}, 80%, 60%)`}
            length={0.5}
            decay={1}
            attenuation={(width) => width}
          >
            <mesh>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...conn.start, ...conn.end])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color={`hsl(${180 + activity * 60}, 80%, 60%)`}
                transparent
                opacity={opacity}
              />
            </mesh>
          </Trail>
        );
      })}
    </group>
  );
};

// Main 3D Neural Network Scene
const NeuralNetworkScene: React.FC<{ 
  centerX: number; 
  centerY: number; 
  time: number;
  data?: any[];
}> = ({ centerX, centerY, time, data = [] }) => {
  // Generate neural nodes based on data or defaults
  const nodes = useMemo(() => {
    const baseNodes = [
      // Time center node
      { position: [0, 0, 0] as [number, number, number], type: 'time' as const, intensity: 1, active: true },
      
      // Mood cluster
      { position: [-2, 1, 0.5] as [number, number, number], type: 'mood' as const, intensity: 0.8, active: true },
      { position: [-1.5, 1.5, -0.3] as [number, number, number], type: 'mood' as const, intensity: 0.6, active: false },
      
      // Sleep cluster  
      { position: [1, -2, 0.8] as [number, number, number], type: 'sleep' as const, intensity: 0.7, active: true },
      { position: [1.8, -1.2, -0.5] as [number, number, number], type: 'sleep' as const, intensity: 0.5, active: false },
      
      // Weather cluster
      { position: [2.5, 1, 0.2] as [number, number, number], type: 'weather' as const, intensity: 0.9, active: true },
      { position: [2, 2, -0.8] as [number, number, number], type: 'weather' as const, intensity: 0.4, active: false },
      
      // Mobility cluster
      { position: [-1, -1, 1.2] as [number, number, number], type: 'mobility' as const, intensity: 0.6, active: true },
      { position: [-2.2, -0.5, 0.8] as [number, number, number], type: 'mobility' as const, intensity: 0.3, active: false }
    ];
    
    return baseNodes;
  }, [data]);

  return (
    <>
      {/* Ambient lighting for the neural network */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
      
      {/* Flowing data particles */}
      <DataStreamParticles count={200} time={time} />
      
      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <NeuralNode
          key={i}
          position={node.position}
          intensity={node.intensity}
          type={node.type}
          connections={[]}
          time={time}
        />
      ))}
      
      {/* Neural connections */}
      <NeuralConnections nodes={nodes} time={time} />
      
      {/* Central consciousness core */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.3, 2]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8}
            wireframe
          />
          <pointLight color="#ffffff" intensity={3} distance={5} />
        </mesh>
      </Float>
    </>
  );
};

// 2D Interface Overlay - HUD elements
const NeuralInterface: React.FC<{
  centerX: number;
  centerY: number;
  maxRadius: number;
  time: number;
}> = ({ centerX, centerY, maxRadius, time }) => {
  const pulsePhase = Math.sin(time * 0.002) * 0.5 + 0.5;
  
  return (
    <g>
      {/* Consciousness field visualization */}
      <defs>
        <radialGradient id="consciousnessField" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.1)" />
          <stop offset="30%" stopColor="rgba(138, 43, 226, 0.05)" />
          <stop offset="70%" stopColor="rgba(255, 107, 53, 0.02)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.8)" />
        </radialGradient>
        
        <filter id="neuralGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Consciousness field background */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 1.5}
        fill="url(#consciousnessField)"
      />

      {/* Neural activity rings */}
      {[0.3, 0.6, 0.9, 1.2].map((radiusMultiplier, i) => (
        <motion.circle
          key={i}
          cx={centerX}
          cy={centerY}
          r={maxRadius * radiusMultiplier}
          fill="none"
          stroke={`hsl(${180 + i * 30}, 80%, 60%)`}
          strokeWidth="1"
          opacity={0.1 + pulsePhase * 0.2}
          filter="url(#neuralGlow)"
          animate={{
            r: [
              maxRadius * radiusMultiplier * 0.95,
              maxRadius * radiusMultiplier * 1.05,
              maxRadius * radiusMultiplier * 0.95
            ],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Data flow indicators */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = centerX + Math.cos(angle + time * 0.001) * maxRadius * 0.8;
        const y = centerY + Math.sin(angle + time * 0.001) * maxRadius * 0.8;
        
        return (
          <motion.g key={i}>
            <circle
              cx={x}
              cy={y}
              r="3"
              fill={`hsl(${i * 45}, 80%, 60%)`}
              opacity="0.6"
              filter="url(#neuralGlow)"
            />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={`hsl(${i * 45}, 60%, 40%)`}
              strokeWidth="1"
              opacity="0.2"
              animate={{
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        );
      })}

      {/* Central consciousness indicator */}
      <motion.g>
        <circle
          cx={centerX}
          cy={centerY}
          r="8"
          fill="rgba(255, 255, 255, 0.8)"
          filter="url(#neuralGlow)"
        />
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="12"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.4"
          animate={{
            r: [12, 20, 12],
            opacity: [0.4, 0.1, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.g>

      {/* Thought stream text */}
      <motion.text
        x={centerX}
        y={centerY - maxRadius * 1.3}
        textAnchor="middle"
        fill="rgba(0, 255, 255, 0.7)"
        fontSize="14"
        fontFamily="monospace"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        neural streams flowing • consciousness emerges
      </motion.text>
    </g>
  );
};

// Main Lovable Neural Streams Theme Overlay
export const lovableNeuralStreamsOverlay: ThemeOverlay = {
  id: 'lovable',
  name: 'Lovable Neural Streams',
  colors: {
    primary: 'hsl(180, 100%, 60%)',
    secondary: 'hsl(270, 80%, 60%)',
    accent: 'hsl(45, 100%, 60%)',
    background: 'hsl(220, 40%, 5%)'
  },
  haiku: "Thoughts flow like starlight / Through networks of consciousness / Digital dreams spark",
  renderOverlay: ({ centerX, centerY, maxRadius, motionState, layerData }) => {
    const time = Date.now();
    
    return (
      <foreignObject
        x={centerX - maxRadius * 1.5}
        y={centerY - maxRadius * 1.5}
        width={maxRadius * 3}
        height={maxRadius * 3}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {/* 3D Neural Network */}
          <Canvas
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              background: 'transparent'
            }}
            camera={{ position: [0, 0, 8], fov: 60 }}
          >
            <NeuralNetworkScene 
              centerX={centerX} 
              centerY={centerY} 
              time={time}
              data={layerData}
            />
          </Canvas>
          
          {/* 2D Interface Overlay */}
          <svg
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              pointerEvents: 'none'
            }}
            viewBox={`0 0 ${maxRadius * 3} ${maxRadius * 3}`}
          >
            <NeuralInterface
              centerX={maxRadius * 1.5}
              centerY={maxRadius * 1.5}
              maxRadius={maxRadius}
              time={time}
            />
          </svg>
        </div>
      </foreignObject>
    );
  }
};