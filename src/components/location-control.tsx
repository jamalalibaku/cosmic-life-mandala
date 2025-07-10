/**
 * (c) 2025 Cosmic Life Mandala – Radial Timeline Project
 * Founder and Author: Jamal Ali
 * Built by ChatGPT & Lovable · MIT Licensed
 */

import { useState } from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
  flag: string;
}

const CITIES: City[] = [
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    lat: 52.5200,
    lng: 13.4050,
    flag: '🇩🇪'
  },
  {
    id: 'baku',
    name: 'Baku',
    country: 'Azerbaijan',
    timezone: 'Asia/Baku',
    lat: 40.4093,
    lng: 49.8671,
    flag: '🇦🇿'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    flag: '🇯🇵'
  },
  {
    id: 'new_york',
    name: 'New York',
    country: 'USA',
    timezone: 'America/New_York',
    lat: 40.7128,
    lng: -74.0060,
    flag: '🇺🇸'
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    timezone: 'Europe/London',
    lat: 51.5074,
    lng: -0.1278,
    flag: '🇬🇧'
  }
];

interface LocationControlProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
  theme: any;
}

export const LocationControl = ({ selectedCity, onCityChange, theme }: LocationControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [useLocation, setUseLocation] = useState(false);

  const selectedCityData = CITIES.find(city => city.id === selectedCity) || CITIES[0];

  const getCurrentTime = (timezone: string) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'Unknown';
    }
  };

  const handleCitySelect = (cityId: string) => {
    onCityChange(cityId);
    setIsOpen(false);
  };

  const handleLocationDetection = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode to find the nearest city
          // For now, we'll just enable location mode
          setUseLocation(true);
          console.log('Location detected:', position.coords);
        },
        (error) => {
          console.log('Location detection failed:', error);
          setUseLocation(false);
        }
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* Current Location Display */}
      <div 
        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
        style={{
          backgroundColor: `${theme.colors.primary}10`,
          borderColor: theme.colors.primary,
          color: theme.colors.text
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCityData.flag}</span>
          <div>
            <div className="text-sm font-medium">
              {selectedCityData.name}, {selectedCityData.country}
            </div>
            <div className="text-xs opacity-70 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getCurrentTime(selectedCityData.timezone)}
            </div>
          </div>
        </div>
        <MapPin className="w-4 h-4" />
      </div>

      {/* City Selector Dropdown */}
      {isOpen && (
        <div 
          className="border rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.accent
          }}
        >
          {/* Pinned Cities Header */}
          <div 
            className="px-3 py-2 text-xs font-medium"
            style={{ 
              backgroundColor: `${theme.colors.accent}20`,
              color: theme.colors.accent
            }}
          >
            Pinned Locations
          </div>

          {/* Berlin and Baku - Always First */}
          {CITIES.filter(city => city.id === 'berlin' || city.id === 'baku').map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city.id)}
              className={`w-full flex items-center justify-between p-3 hover:bg-opacity-20 transition-colors border-b ${
                selectedCity === city.id ? 'bg-opacity-30' : ''
              }`}
              style={{
                backgroundColor: selectedCity === city.id ? `${theme.colors.accent}30` : 'transparent',
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{city.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{city.name}</div>
                  <div className="text-xs opacity-70">{city.country}</div>
                </div>
              </div>
              <div className="text-xs opacity-70">
                {getCurrentTime(city.timezone)}
              </div>
            </button>
          ))}

          {/* Other Cities */}
          <div 
            className="px-3 py-2 text-xs font-medium border-t"
            style={{ 
              backgroundColor: `${theme.colors.text}10`,
              borderColor: `${theme.colors.text}20`,
              color: theme.colors.text
            }}
          >
            Other Locations
          </div>

          {CITIES.filter(city => city.id !== 'berlin' && city.id !== 'baku').map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city.id)}
              className={`w-full flex items-center justify-between p-3 hover:bg-opacity-20 transition-colors border-b ${
                selectedCity === city.id ? 'bg-opacity-30' : ''
              }`}
              style={{
                backgroundColor: selectedCity === city.id ? `${theme.colors.accent}30` : 'transparent',
                borderColor: `${theme.colors.text}20`,
                color: theme.colors.text
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{city.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{city.name}</div>
                  <div className="text-xs opacity-70">{city.country}</div>
                </div>
              </div>
              <div className="text-xs opacity-70">
                {getCurrentTime(city.timezone)}
              </div>
            </button>
          ))}

          {/* Auto-detect Location */}
          <button
            onClick={handleLocationDetection}
            className="w-full flex items-center gap-2 p-3 hover:bg-opacity-20 transition-colors border-t"
            style={{
              borderColor: `${theme.colors.accent}40`,
              color: theme.colors.accent
            }}
          >
            <Navigation className="w-4 h-4" />
            <span className="text-sm">Detect my location</span>
          </button>
        </div>
      )}
    </div>
  );
};
