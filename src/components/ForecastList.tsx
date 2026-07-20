import React from 'react';
import { DailyWeatherData } from '../types';
import { getWeatherCodeInfo, formatDate, convertTemp } from '../utils';
import WeatherIcon from './WeatherIcon';
import { Droplets, CalendarRange } from 'lucide-react';

interface ForecastListProps {
  daily: DailyWeatherData;
  isFahrenheit: boolean;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export default function ForecastList({
  daily,
  isFahrenheit,
  selectedDayIndex,
  onSelectDay,
}: ForecastListProps) {
  // We have 7 days of data in the lists
  const daysCount = daily.time.length;

  return (
    <div className="w-full flex flex-col" id="forecast-section">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <CalendarRange size={20} className="text-indigo-500" />
          <span>7-Day Weather Intel</span>
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Click any day to update recommendations & hourly charts
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: daysCount }).map((_, idx) => {
          const dateStr = daily.time[idx];
          const weathercode = daily.weathercode[idx];
          const tempMax = daily.temperature_2m_max[idx];
          const tempMin = daily.temperature_2m_min[idx];
          const precipitation = daily.precipitation_sum[idx] ?? 0;
          
          const info = getWeatherCodeInfo(weathercode);
          const isSelected = idx === selectedDayIndex;

          const formattedMax = tempMax !== undefined ? convertTemp(tempMax, isFahrenheit) : '--';
          const formattedMin = tempMin !== undefined ? convertTemp(tempMin, isFahrenheit) : '--';

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 group ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-50/80 to-blue-50/50 dark:from-indigo-950/40 dark:to-slate-900/80 border-indigo-500 dark:border-indigo-400 shadow-md ring-4 ring-indigo-50/50 dark:ring-indigo-950/20'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm'
              }`}
            >
              {/* Day indicator */}
              <span className={`text-xs font-bold tracking-wider uppercase ${
                isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {idx === 0 ? 'Today' : formatDate(dateStr, 'weekday').slice(0, 3)}
              </span>
              
              {/* Month/Day indicator */}
              <span className="text-xxs text-slate-400 dark:text-slate-500 mt-0.5">
                {formatDate(dateStr, 'short').split(',')[1] || formatDate(dateStr, 'short').slice(4)}
              </span>

              {/* Weather Icon */}
              <div className={`my-3 p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                isSelected 
                  ? 'bg-indigo-500 text-white' 
                  : `bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 ${info.textColor}`
              }`}>
                <WeatherIcon name={info.icon} size={20} />
              </div>

              {/* Weather Status Label */}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-full block mb-2">
                {info.label}
              </span>

              {/* Temperature Min/Max */}
              <div className="flex items-baseline gap-1 mt-auto font-sans">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formattedMax}°
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  {formattedMin}°
                </span>
              </div>

              {/* Rain Info if any */}
              {precipitation > 0 ? (
                <div className="mt-2 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  <Droplets size={10} />
                  <span>{precipitation.toFixed(1)}m</span>
                </div>
              ) : (
                <div className="mt-2 text-[10px] text-slate-350 dark:text-slate-650 font-bold uppercase tracking-wide">
                  Dry
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
