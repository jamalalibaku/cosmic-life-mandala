/**
 * ViewSwitcher Component - Navigation between different view modes
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Calendar, Clock, Globe, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface ViewSwitcherProps {
  onTimeScaleChange?: (scale: "day" | "week" | "month" | "year") => void;
  className?: string;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ 
  onTimeScaleChange,
  className = ""
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const views = [
    {
      name: "Camera",
      path: "/camera",
      icon: Camera,
      description: "Radial Layer View"
    },
    {
      name: "Day",
      path: "/",
      icon: Clock,
      description: "Daily Timeline",
      onClick: () => onTimeScaleChange?.("day")
    },
    {
      name: "Week", 
      path: "/",
      icon: Calendar,
      description: "Weekly View",
      onClick: () => onTimeScaleChange?.("week")
    },
    {
      name: "Month",
      path: "/",
      icon: Globe,
      description: "Monthly Overview", 
      onClick: () => onTimeScaleChange?.("month")
    },
    {
      name: "Year",
      path: "/",
      icon: User,
      description: "Yearly Perspective",
      onClick: () => onTimeScaleChange?.("year")
    }
  ];

  return (
    <div className={`flex gap-2 p-2 bg-background/80 rounded-lg backdrop-blur-sm ${className}`}>
      {views.map((view) => {
        const isActive = currentPath === view.path;
        const Icon = view.icon;
        
        if (view.onClick && view.path === "/") {
          return (
            <Button
              key={view.name}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={view.onClick}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {view.name}
            </Button>
          );
        }

        return (
          <Button
            key={view.name}
            variant={isActive ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link to={view.path} className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {view.name}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};