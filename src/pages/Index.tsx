import WeatherSunburst from '@/components/weather-sunburst';
import { WeatherSunburstRing } from '@/components/weather-sunburst-ring';
import { mockWeatherData } from '@/data/weatherData';
import { mockWeatherToday } from '@/data/mock-weather-data';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-8 text-transparent bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-400 bg-clip-text">
          Cosmic Life Mandala
        </h1>
        <p className="text-xl text-slate-300 mb-12">
          Radial Timeline Visualization
        </p>
        
        {/* Weather sunburst preview */}
        <div className="flex justify-center">
          <svg width="500" height="500" className="drop-shadow-2xl">
            {/* Original weather sunburst (inner layer) */}
            <WeatherSunburst
              weatherData={mockWeatherData}
              centerX={250}
              centerY={250}
              innerRadius={80}
              outerRadius={140}
            />
            
            {/* New weather ring (outer layer) */}
            <WeatherSunburstRing
              weatherData={mockWeatherToday}
              centerX={250}
              centerY={250}
              innerRadius={150}
              outerRadius={190}
              theme="cosmic"
            />
            
            {/* Center time display */}
            <text
              x="250"
              y="240"
              textAnchor="middle"
              className="fill-yellow-200 text-sm font-light"
            >
              NOW
            </text>
            <text
              x="250"
              y="260"
              textAnchor="middle"
              className="fill-yellow-100 text-2xl font-bold"
            >
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </text>
            <text
              x="250"
              y="275"
              textAnchor="middle"
              className="fill-yellow-200 text-xs font-light"
            >
              Weather Timeline
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Index;
