import { useState } from 'react';
import WeatherSunburst from '@/components/weather-sunburst';
import { WeatherSunburstRing } from '@/components/weather-sunburst-ring';
import { CosmicSunburstLayer } from '@/components/cosmic-sunburst-layer';
import { DataBlobRing } from '@/components/data-blob-ring';
import { FractalTimeZoomManager, TimeScale } from '@/components/fractal-time-zoom-manager';
import { RadialWeekView } from '@/components/radial-week-view';
import { RadialMonthView } from '@/components/radial-month-view';
import { RadialYearView } from '@/components/radial-year-view';
import { mockWeatherData } from '@/data/weatherData';
import { mockWeatherToday } from '@/data/mock-weather-data';
import { mockMobilityData, mockMoodData, mockSleepData } from '@/data/mock-life-data';
import { mockWeekData, mockMonthData, mockYearData } from '@/data/mock-temporal-data';

const Index = () => {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [reflectiveMode, setReflectiveMode] = useState(false);

  const renderTimelineContent = ({ scale, transitionProgress, zoomLevel, isTransitioning }: {
    scale: TimeScale;
    transitionProgress: number;
    zoomLevel: number;
    isTransitioning: boolean;
  }) => {
    const centerX = 350;
    const centerY = 350;
    
    return (
      <>
        {/* Always present: Cosmic sunburst aura layer */}
        <CosmicSunburstLayer
          centerX={centerX}
          centerY={centerY}
          innerRadius={60}
          maxRadius={320}
          theme="sunfire"
          poetryMode={reflectiveMode}
        />
        
        {/* Scale-specific content */}
        {scale === 'day' && (
          <>
            {/* Data blob rings (life data layers) */}
            <DataBlobRing
              data={mockSleepData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={200}
              outerRadius={240}
              type="sleep"
              label={!reflectiveMode ? "rest" : undefined}
            />
            
            <DataBlobRing
              data={mockMoodData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={250}
              outerRadius={290}
              type="mood"
              label={!reflectiveMode ? "mood" : undefined}
            />
            
            <DataBlobRing
              data={mockMobilityData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={300}
              outerRadius={340}
              type="mobility"
              label={!reflectiveMode ? "movement" : undefined}
            />
            
            {/* Original weather sunburst (inner core) */}
            <WeatherSunburst
              weatherData={mockWeatherData}
              centerX={centerX}
              centerY={centerY}
              innerRadius={80}
              outerRadius={140}
            />
            
            {/* Weather ring (middle layer) */}
            <WeatherSunburstRing
              weatherData={mockWeatherToday}
              centerX={centerX}
              centerY={centerY}
              innerRadius={150}
              outerRadius={190}
              theme="cosmic"
              showIcons={true}
              showSkyGradient={true}
            />
          </>
        )}
        
        {scale === 'week' && (
          <RadialWeekView
            weekData={mockWeekData}
            centerX={centerX}
            centerY={centerY}
            radius={280}
            theme="cosmic"
            onDayClick={(day) => {
              console.log('Day clicked:', day);
              setTimeScale('day');
            }}
          />
        )}
        
        {scale === 'month' && (
          <RadialMonthView
            monthData={mockMonthData}
            centerX={centerX}
            centerY={centerY}
            radius={300}
            theme="cosmic"
            onDayClick={(day) => {
              console.log('Day clicked:', day);
              setTimeScale('day');
            }}
          />
        )}
        
        {scale === 'year' && (
          <RadialYearView
            yearData={mockYearData}
            centerX={centerX}
            centerY={centerY}
            radius={320}
            theme="cosmic"
            onMonthClick={(month) => {
              console.log('Month clicked:', month);
              setTimeScale('month');
            }}
          />
        )}
        
        {/* Center time display - adapts to scale */}
        {!reflectiveMode && (
          <g className="central-time">
            <circle
              cx={centerX}
              cy={centerY}
              r={scale === 'year' ? 30 : scale === 'month' ? 40 : 50}
              fill="rgba(0, 0, 0, 0.3)"
              stroke="hsl(45 100% 70%)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x={centerX}
              y={centerY - 15}
              textAnchor="middle"
              className="fill-yellow-200 text-sm font-light"
            >
              NOW
            </text>
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              className="fill-yellow-100 text-2xl font-bold"
            >
              {scale === 'day' && new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
              {scale === 'week' && 'WEEK'}
              {scale === 'month' && new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              {scale === 'year' && new Date().getFullYear()}
            </text>
            <text
              x={centerX}
              y={centerY + 20}
              textAnchor="middle"
              className="fill-yellow-200 text-xs font-light"
            >
              {scale} timeline
            </text>
          </g>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center w-full">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-400 bg-clip-text">
          Cosmic Life Mandala
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Fractal Timeline Visualization
        </p>
        
        {/* Poetry mode toggle */}
        <div className="mb-8">
          <button
            onClick={() => setReflectiveMode(!reflectiveMode)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              reflectiveMode
                ? 'bg-yellow-200/20 text-yellow-200 border border-yellow-200/30'
                : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
            }`}
          >
            {reflectiveMode ? '⧖ poetry mode' : '◎ interface mode'}
          </button>
        </div>
        
        {/* Fractal Time Zoom Manager */}
        <FractalTimeZoomManager
          currentScale={timeScale}
          onScaleChange={setTimeScale}
          reflectivePlayback={reflectiveMode}
          className="w-full h-[700px] relative"
        >
          {(zoomProps) => (
            <div className="flex justify-center">
              <svg width="700" height="700" className="drop-shadow-2xl">
                {renderTimelineContent(zoomProps)}
              </svg>
            </div>
          )}
        </FractalTimeZoomManager>
      </div>
    </div>
  );
};

export default Index;