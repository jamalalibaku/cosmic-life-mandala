import WeatherSunburst from '@/components/weather-sunburst';
import { WeatherSunburstRing } from '@/components/weather-sunburst-ring';
import { CosmicSunburstLayer } from '@/components/cosmic-sunburst-layer';
import { DataBlobRing } from '@/components/data-blob-ring';
import { mockWeatherData } from '@/data/weatherData';
import { mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';

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
        
        {/* Cosmic Life Mandala */}
        <div className="flex justify-center">
          <svg width="700" height="700" className="drop-shadow-2xl">
            {/* Cosmic sunburst aura layer (background) */}
            <CosmicSunburstLayer
              centerX={350}
              centerY={350}
              innerRadius={60}
              maxRadius={320}
              theme="sunfire"
              poetryMode={false}
            />
            
            {/* Data blob rings (life data layers) */}
            <DataBlobRing
              data={mockSleepData}
              centerX={350}
              centerY={350}
              innerRadius={200}
              outerRadius={240}
              type="sleep"
              label="rest"
            />
            
            <DataBlobRing
              data={mockMoodData}
              centerX={350}
              centerY={350}
              innerRadius={250}
              outerRadius={290}
              type="mood"
              label="mood"
            />
            
            <DataBlobRing
              data={mockMobilityData}
              centerX={350}
              centerY={350}
              innerRadius={300}
              outerRadius={340}
              type="mobility"
              label="movement"
            />
            
            {/* Original weather sunburst (inner core) */}
            <WeatherSunburst
              weatherData={mockWeatherData}
              centerX={350}
              centerY={350}
              innerRadius={80}
              outerRadius={140}
            />
            
            {/* Weather ring (middle layer) */}
            <WeatherSunburstRing
              weatherData={mockWeatherToday}
              centerX={350}
              centerY={350}
              innerRadius={150}
              outerRadius={190}
              theme="cosmic"
              showIcons={true}
              showSkyGradient={true}
            />
            
            {/* Center time display */}
            <g className="central-time">
              <circle
                cx="350"
                cy="350"
                r="50"
                fill="rgba(0, 0, 0, 0.3)"
                stroke="hsl(45 100% 70%)"
                strokeWidth="1"
                opacity="0.6"
              />
              <text
                x="350"
                y="335"
                textAnchor="middle"
                className="fill-yellow-200 text-sm font-light"
              >
                NOW
              </text>
              <text
                x="350"
                y="355"
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
                x="350"
                y="370"
                textAnchor="middle"
                className="fill-yellow-200 text-xs font-light"
              >
                life timeline
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Index;
