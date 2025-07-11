/**
 * Date-Based Navigation Context
 * Manages current view date and zoom level with real calendar integration
 */

import React, { createContext, useContext, useState } from "react";
import { format, startOfWeek, startOfMonth, startOfYear, addDays, addWeeks, addMonths, addYears } from "date-fns";

export type ZoomLevel = "year" | "month" | "week" | "day" | "hour";

interface DateNavigationContextType {
  currentDate: Date;
  zoomLevel: ZoomLevel;
  setCurrentDate: (date: Date) => void;
  setZoomLevel: (zoom: ZoomLevel) => void;
  navigateToWeek: (weekStartDate: Date) => void;
  navigateToDay: (date: Date) => void;
  goToToday: () => void;
  getDisplayTitle: () => string;
  getNavigationPeriod: () => { start: Date; end: Date };
}

const DateNavigationContext = createContext<DateNavigationContextType | undefined>(undefined);

export const DateNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("month");

  const navigateToWeek = (weekStartDate: Date) => {
    setCurrentDate(weekStartDate);
    setZoomLevel("week");
  };

  const navigateToDay = (date: Date) => {
    setCurrentDate(date);
    setZoomLevel("day");
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDisplayTitle = (): string => {
    switch (zoomLevel) {
      case "year":
        return format(currentDate, "yyyy");
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return `Week of ${format(weekStart, "MMM d, yyyy")}`;
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "hour":
        return format(currentDate, "EEEE, MMMM d, yyyy 'at' HH:mm");
      default:
        return format(currentDate, "MMMM yyyy");
    }
  };

  const getNavigationPeriod = (): { start: Date; end: Date } => {
    switch (zoomLevel) {
      case "year":
        const yearStart = startOfYear(currentDate);
        return { start: yearStart, end: addYears(yearStart, 1) };
      case "month":
        const monthStart = startOfMonth(currentDate);
        return { start: monthStart, end: addMonths(monthStart, 1) };
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return { start: weekStart, end: addWeeks(weekStart, 1) };
      case "day":
        return { start: currentDate, end: addDays(currentDate, 1) };
      case "hour":
        return { start: currentDate, end: addDays(currentDate, 1) };
      default:
        const defaultStart = startOfMonth(currentDate);
        return { start: defaultStart, end: addMonths(defaultStart, 1) };
    }
  };

  return (
    <DateNavigationContext.Provider
      value={{
        currentDate,
        zoomLevel,
        setCurrentDate,
        setZoomLevel,
        navigateToWeek,
        navigateToDay,
        goToToday,
        getDisplayTitle,
        getNavigationPeriod,
      }}
    >
      {children}
    </DateNavigationContext.Provider>
  );
};

export const useDateNavigation = (): DateNavigationContextType => {
  const context = useContext(DateNavigationContext);
  if (!context) {
    throw new Error("useDateNavigation must be used within a DateNavigationProvider");
  }
  return context;
};