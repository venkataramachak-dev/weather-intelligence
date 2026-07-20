import React from 'react';
import { Wind, Compass, Droplets, Thermometer, Calendar, Eye } from 'lucide-react';
import { CurrentWeather as CurrentType, DailyWeatherData } from '../types';
import { getWeatherCodeInfo, formatDate, convertTemp } from '../utils';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherProps {
  current: CurrentType;
  daily: DailyWeatherData;
  cityName: string;
  country?: string;
  admin1?: string;
  isFahrenheit: boolean;
}

export default function CurrentWeather({
  current,
  daily,
  cityName,
  country,
  admin1,
  isFahrenheit,
}: CurrentWeatherProps) {
  const info = getWeatherCodeInfo(current.weathercode);
  const formattedTemp = convertTemp(current.temperature, isFahrenheit);
  
  // High and low for the current day (index 0)
  const todayMax = daily.temperature_2m_max[0];
  const todayMin = daily.temperature_2m_min[0];
  const formattedMax = todayMax !== undefined ? convertTemp(todayMax, isFahrenheit) : null;
  const formattedMin = todayMin !== undefined ? convertTemp(todayMin, isFahrenheit) : null;
  
  const todayPrecipitation = daily.precipitation_sum[0] ?? 0;
  
  // Format location string nicely
  const locationLabel = [cityName, admin1, country].filter(Boolean).join(', ');

  // Wind direction compass arrow rotation style
  const windDirStyle = {
    transform: `rotate(${current.winddirection}deg)`,
  };

  return (
    <div 
      id="current-weather-card" 
      className={`w-full bg-gradient-to-br ${info.bgGradient} rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]`}
    >
      {/* Decorative backdrop glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-stretch justify-between gap-6">
        {/* Left column: Location & Primary Weather */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Intelligence
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">{cityName}</h2>
            {(admin1 || country) && (
              <p className="text-white/85 text-sm font-medium mb-4 flex items-center gap-1.5">
                <Compass size={14} className="opacity-80" />
                {admin1 ? `${admin1}, ` : ''}{country}
              </p>
            )}
          </div>

          <div className="mt-4 md:mt-8">
            <div className="flex items-baseline gap-1">
              <span className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
                {formattedTemp}°
              </span>
              <span className="text-2xl md:text-4xl font-bold opacity-90">
                {isFahrenheit ? 'F' : 'C'}
              </span>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                <WeatherIcon name={info.icon} size={28} className="text-white drop-shadow" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold tracking-wide drop-shadow-sm">{info.label}</p>
                <p className="text-xs text-white/80 font-medium flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(current.time, 'full')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Vital Weather Metrics in Bento Card Layout */}
        <div className="grid grid-cols-2 gap-3 min-w-[260px] md:min-w-[320px] shrink-0 self-center md:self-end w-full md:w-auto">
          {/* Max / Min Temp */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-amber-200">
              <Thermometer size={18} />
            </div>
            <div>
              <span className="text-xs text-white/70 block font-medium">Daily Range</span>
              <span className="text-sm font-bold block">
                {formattedMax !== null ? `${formattedMax}°` : '--'} / {formattedMin !== null ? `${formattedMin}°` : '--'}
              </span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-sky-200">
              <Wind size={18} />
            </div>
            <div>
              <span className="text-xs text-white/70 block font-medium">Wind</span>
              <span className="text-sm font-bold block">
                {current.windspeed} <span className="text-xs opacity-85">km/h</span>
              </span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-blue-200">
              <Droplets size={18} />
            </div>
            <div>
              <span className="text-xs text-white/70 block font-medium">Precipitation</span>
              <span className="text-sm font-bold block">
                {todayPrecipitation} <span className="text-xs opacity-85">mm</span>
              </span>
            </div>
          </div>

          {/* Wind Direction */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-orange-200 flex items-center justify-center">
              <Compass size={18} className="transition-transform duration-1000" style={windDirStyle} />
            </div>
            <div>
              <span className="text-xs text-white/70 block font-medium">Wind Direction</span>
              <span className="text-sm font-bold block">
                {current.winddirection}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
