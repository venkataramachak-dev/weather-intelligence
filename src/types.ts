import { LucideIcon } from 'lucide-react';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_id?: number;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Province
  admin2?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyWeatherData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  uv_index_max?: number[];
  windspeed_10m_max?: number[];
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  precipitation_probability?: number[];
  relative_humidity_2m?: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeather;
  daily: DailyWeatherData;
  hourly?: HourlyWeatherData;
}

export interface WeatherCodeInfo {
  label: string;
  icon: string; // The lucide icon name we will resolve dynamically or reference
  bgGradient: string; // Tailwind gradient for current weather card
  cardBg: string; // Tailwind background for standard cards
  textColor: string;
  isRainy: boolean;
  isSnowy: boolean;
  isSunny: boolean;
  isCloudy: boolean;
}

export interface PlanningRecommendation {
  id: string;
  category: 'safety' | 'activity' | 'clothing' | 'comfort';
  title: string;
  description: string;
  level: 'info' | 'warning' | 'success';
  icon: string; // icon name from lucide
}

export interface SavedLocation {
  id: string; // name + lat + lon combo
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
