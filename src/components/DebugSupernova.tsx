import React, { useState, useEffect } from 'react';
import { SupernovaBurst } from './SupernovaBurst';

export const DebugSupernova = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Trigger first burst immediately
    setActive(true);
    
    // Then trigger every 4 seconds
    const interval = setInterval(() => {
      setActive(true);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <g>
      {/* Debug background circle to show position */}
      <circle
        cx={0}
        cy={0}
        r={10}
        fill="red"
        opacity={0.3}
      />
      
      <SupernovaBurst
        isActive={active}
        centerX={0}
        centerY={0}
        intensity={0.9}
        emotionColor="hsl(45, 100%, 60%)"
        onComplete={() => {
          console.log('💥 Debug burst completed');
          setActive(false);
        }}
      />
    </g>
  );
};