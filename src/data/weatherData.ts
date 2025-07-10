// Weather data structure for radial timeline visualization
export interface WeatherData {
  date: string;
  sunrise: string;
  sunset: string;
  temperature: Array<{
    time: string;
    value: number; // Celsius
  }>;
  cloudiness: Array<{
    time: string;
    value: number; // 0-100%
  }>;
  sunIntensity: Array<{
    time: string;
    value: number; // 0-1000 lux
  }>;
  windSpeed: Array<{
    time: string;
    value: number; // km/h
  }>;
}

// Mock weather data for today
export const mockWeatherData: WeatherData = {
  date: "2025-07-10",
  sunrise: "05:12",
  sunset: "21:08",
  temperature: [
    { time: "00:00", value: 15 },
    { time: "03:00", value: 12 },
    { time: "06:00", value: 16 },
    { time: "09:00", value: 22 },
    { time: "12:00", value: 28 },
    { time: "15:00", value: 31 },
    { time: "18:00", value: 26 },
    { time: "21:00", value: 19 },
  ],
  cloudiness: [
    { time: "00:00", value: 20 },
    { time: "06:00", value: 10 },
    { time: "12:00", value: 40 },
    { time: "18:00", value: 60 },
  ],
  sunIntensity: [
    { time: "06:00", value: 100 },
    { time: "09:00", value: 600 },
    { time: "12:00", value: 900 },
    { time: "15:00", value: 800 },
    { time: "18:00", value: 300 },
    { time: "21:00", value: 50 },
  ],
  windSpeed: [
    { time: "00:00", value: 5 },
    { time: "06:00", value: 8 },
    { time: "12:00", value: 15 },
    { time: "18:00", value: 12 },
  ],
};