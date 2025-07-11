/**
 * [Phase: ZIP9-Alpha | Digest Phase]
 * Central Temporal Data Store - Unified time model for all layers
 * 
 * Purpose: Replace scattered time logic with single source of truth
 * Breaking Changes: Replaces individual component time handling
 * Dependencies: All layer components, RadialLayerSystem
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfWeek, startOfMonth, startOfYear, addDays, addWeeks, addMonths, addYears } from 'date-fns';

export type TimeZoomLevel = 'hour' | 'day' | 'week' | 'month' | 'year';

interface TimeAxisState {
  currentDate: Date;
  zoomLevel: TimeZoomLevel;
  timeSlices: TimeSlice[];
  nowAngle: number; // 0-360 degrees, where 0 = north
}

interface TimeSlice {
  id: string;
  date: Date;
  angle: number; // radial position
  isActive: boolean;
  isCurrent: boolean;
  data: {
    weather?: any;
    mood?: any;
    mobility?: any;
    plans?: any;
    sleep?: any;
  };
}

interface TimeAxisContextType extends TimeAxisState {
  setCurrentDate: (date: Date) => void;
  setZoomLevel: (level: TimeZoomLevel) => void;
  getTimeSliceData: (layerType: string) => any[];
  updateLayerData: (layerType: string, data: any[]) => void;
}

const TimeAxisContext = createContext<TimeAxisContextType | undefined>(undefined);

// Generate time slices based on zoom level
const generateTimeSlices = (currentDate: Date, zoomLevel: TimeZoomLevel): TimeSlice[] => {
  const slices: TimeSlice[] = [];
  const now = new Date();
  
  switch (zoomLevel) {
    case 'hour': {
      // 24 hour slices
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 24; i++) {
        const sliceDate = new Date(startOfDay);
        sliceDate.setHours(i);
        
        slices.push({
          id: `hour-${i}`,
          date: sliceDate,
          angle: (i * 15) - 90, // 0 = north, 15 degrees per hour
          isActive: Math.abs(sliceDate.getTime() - currentDate.getTime()) < 3600000, // within 1 hour
          isCurrent: i === now.getHours() && sliceDate.toDateString() === now.toDateString(),
          data: {}
        });
      }
      break;
    }
    
    case 'day': {
      // 7 day slices (week view)
      const weekStart = startOfWeek(currentDate);
      
      for (let i = 0; i < 7; i++) {
        const sliceDate = addDays(weekStart, i);
        
        slices.push({
          id: `day-${i}`,
          date: sliceDate,
          angle: (i * 51.43) - 90, // ~51.43 degrees per day
          isActive: sliceDate.toDateString() === currentDate.toDateString(),
          isCurrent: sliceDate.toDateString() === now.toDateString(),
          data: {}
        });
      }
      break;
    }
    
    case 'week': {
      // 4-5 week slices (month view)
      const monthStart = startOfMonth(currentDate);
      const weeksInMonth = Math.ceil(30 / 7); // approximate
      
      for (let i = 0; i < weeksInMonth; i++) {
        const sliceDate = addWeeks(monthStart, i);
        
        slices.push({
          id: `week-${i}`,
          date: sliceDate,
          angle: (i * (360 / weeksInMonth)) - 90,
          isActive: Math.abs(sliceDate.getTime() - currentDate.getTime()) < 7 * 24 * 3600000,
          isCurrent: Math.abs(sliceDate.getTime() - now.getTime()) < 7 * 24 * 3600000,
          data: {}
        });
      }
      break;
    }
    
    case 'month': {
      // 12 month slices (year view)
      const yearStart = startOfYear(currentDate);
      
      for (let i = 0; i < 12; i++) {
        const sliceDate = addMonths(yearStart, i);
        
        slices.push({
          id: `month-${i}`,
          date: sliceDate,
          angle: (i * 30) - 90, // 30 degrees per month
          isActive: sliceDate.getMonth() === currentDate.getMonth() && sliceDate.getFullYear() === currentDate.getFullYear(),
          isCurrent: sliceDate.getMonth() === now.getMonth() && sliceDate.getFullYear() === now.getFullYear(),
          data: {}
        });
      }
      break;
    }
    
    case 'year': {
      // 5 year slices
      const currentYear = currentDate.getFullYear();
      const startYear = currentYear - 2;
      
      for (let i = 0; i < 5; i++) {
        const sliceDate = new Date(startYear + i, 0, 1);
        
        slices.push({
          id: `year-${startYear + i}`,
          date: sliceDate,
          angle: (i * 72) - 90, // 72 degrees per year
          isActive: sliceDate.getFullYear() === currentDate.getFullYear(),
          isCurrent: sliceDate.getFullYear() === now.getFullYear(),
          data: {}
        });
      }
      break;
    }
  }
  
  return slices;
};

// Calculate current time angle (NOW pointer)
const calculateNowAngle = (zoomLevel: TimeZoomLevel): number => {
  const now = new Date();
  
  switch (zoomLevel) {
    case 'hour': {
      const minutes = now.getMinutes();
      return (minutes * 0.25) - 90; // 0.25 degrees per minute within current hour
    }
    case 'day': {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      return ((hours + minutes / 60) * 15) - 90; // 15 degrees per hour
    }
    case 'week': {
      const dayOfWeek = now.getDay();
      const hours = now.getHours();
      return ((dayOfWeek + hours / 24) * 51.43) - 90;
    }
    case 'month': {
      const dayOfMonth = now.getDate();
      return ((dayOfMonth / 31) * 360) - 90;
    }
    case 'year': {
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      return ((dayOfYear / 365) * 360) - 90;
    }
    default:
      return 0;
  }
};

export const TimeAxisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<TimeZoomLevel>('month');
  const [timeSlices, setTimeSlices] = useState<TimeSlice[]>([]);
  const [nowAngle, setNowAngle] = useState(0);

  // Update time slices when date or zoom changes
  useEffect(() => {
    const newSlices = generateTimeSlices(currentDate, zoomLevel);
    setTimeSlices(newSlices);
    setNowAngle(calculateNowAngle(zoomLevel));
    
    console.log('⏰ TimeAxis updated:', {
      zoomLevel,
      currentDate: format(currentDate, 'yyyy-MM-dd'),
      sliceCount: newSlices.length,
      nowAngle
    });
  }, [currentDate, zoomLevel]);

  // Update NOW angle every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNowAngle(calculateNowAngle(zoomLevel));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [zoomLevel]);

  const getTimeSliceData = (layerType: string) => {
    return timeSlices
      .filter(slice => slice.data[layerType as keyof typeof slice.data])
      .map(slice => ({
        ...slice.data[layerType as keyof typeof slice.data],
        timeSlice: slice,
        angle: slice.angle,
        isActive: slice.isActive,
        isCurrent: slice.isCurrent
      }));
  };

  const updateLayerData = (layerType: string, data: any[]) => {
    setTimeSlices(prevSlices => 
      prevSlices.map(slice => {
        const matchingData = data.find(d => {
          // Match data to time slice based on timestamp or date
          if (d.timestamp) {
            const dataDate = new Date(d.timestamp);
            return Math.abs(dataDate.getTime() - slice.date.getTime()) < 3600000; // within 1 hour
          }
          return false;
        });
        
        if (matchingData) {
          return {
            ...slice,
            data: {
              ...slice.data,
              [layerType]: matchingData
            }
          };
        }
        
        return slice;
      })
    );
  };

  return (
    <TimeAxisContext.Provider
      value={{
        currentDate,
        zoomLevel,
        timeSlices,
        nowAngle,
        setCurrentDate,
        setZoomLevel,
        getTimeSliceData,
        updateLayerData
      }}
    >
      {children}
    </TimeAxisContext.Provider>
  );
};

export const useTimeAxis = () => {
  const context = useContext(TimeAxisContext);
  if (context === undefined) {
    throw new Error('useTimeAxis must be used within a TimeAxisProvider');
  }
  return context;
};