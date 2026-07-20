import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import { WeatherResponse } from '../types';
import { convertTemp, formatDate } from '../utils';
import { AreaChart as AreaIcon, BarChart3, CloudRain, Thermometer, Clock } from 'lucide-react';

interface WeatherChartsProps {
  weatherData: WeatherResponse;
  selectedDayIndex: number;
  isFahrenheit: boolean;
}

export default function WeatherCharts({
  weatherData,
  selectedDayIndex,
  isFahrenheit,
}: WeatherChartsProps) {
  const [chartType, setChartType] = useState<'hourly' | 'daily'>('hourly');

  // 1. Process HOURLY data for the selected day (24 points)
  const hourlyChartData = useMemo(() => {
    if (!weatherData.hourly) return [];

    const startIndex = selectedDayIndex * 24;
    const endIndex = startIndex + 24;

    const times = weatherData.hourly.time.slice(startIndex, endIndex);
    const temps = weatherData.hourly.temperature_2m.slice(startIndex, endIndex);
    const precipitations = weatherData.hourly.precipitation.slice(startIndex, endIndex);
    const probabilities = weatherData.hourly.precipitation_probability?.slice(startIndex, endIndex) || [];

    return times.map((time, index) => {
      const rawTemp = temps[index];
      const converted = rawTemp !== undefined ? convertTemp(rawTemp, isFahrenheit) : 0;
      const precipitation = precipitations[index] ?? 0;
      const probability = probabilities[index] ?? 0;
      
      // Get formatted hour label: e.g. "9 AM", "12 PM"
      const date = new Date(time);
      const hourStr = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

      return {
        timeLabel: hourStr,
        temp: converted,
        precipitation: Number(precipitation.toFixed(1)),
        probability,
      };
    });
  }, [weatherData, selectedDayIndex, isFahrenheit]);

  // 2. Process DAILY 7-day trend data
  const dailyChartData = useMemo(() => {
    const daily = weatherData.daily;
    return daily.time.map((time, index) => {
      const rawMax = daily.temperature_2m_max[index] ?? 0;
      const rawMin = daily.temperature_2m_min[index] ?? 0;
      const precipitation = daily.precipitation_sum[index] ?? 0;

      const date = new Date(time);
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        dayLabel,
        maxTemp: convertTemp(rawMax, isFahrenheit),
        minTemp: convertTemp(rawMin, isFahrenheit),
        precipitation: Number(precipitation.toFixed(1)),
      };
    });
  }, [weatherData, isFahrenheit]);

  // Format custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 dark:bg-slate-900 text-slate-100 p-4 border border-slate-700 rounded-xl shadow-xl backdrop-blur-md">
          <p className="font-bold text-sm mb-2 border-b border-slate-700 pb-1 text-slate-300">{label}</p>
          {payload.map((pld: any) => {
            const isTemp = pld.name.includes('Temp');
            const isProb = pld.name.includes('Probability') || pld.name.includes('Chance');
            const unit = isTemp ? `°${isFahrenheit ? 'F' : 'C'}` : isProb ? '%' : ' mm';
            const valueColor = pld.color || '#818cf8';
            
            return (
              <div key={pld.name} className="flex items-center justify-between gap-6 text-xs py-0.5">
                <span className="text-slate-400 font-medium">{pld.name}:</span>
                <span className="font-bold" style={{ color: valueColor }}>
                  {pld.value}
                  {unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const selectedDayName = formatDate(weatherData.daily.time[selectedDayIndex], 'weekday');

  return (
    <div id="weather-charts-card" className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AreaIcon size={20} className="text-indigo-500" />
            <span>Weather Visualization</span>
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {chartType === 'hourly'
              ? `Hourly forecast for ${selectedDayName} (24-Hour Timeline)`
              : '7-Day interactive temperature and precipitation trend'}
          </p>
        </div>

        {/* View Toggle Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setChartType('hourly')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
              chartType === 'hourly'
                ? 'bg-white dark:bg-slate-750 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock size={14} />
            <span>Hourly</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('daily')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
              chartType === 'daily'
                ? 'bg-white dark:bg-slate-750 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 size={14} />
            <span>7-Day Trend</span>
          </button>
        </div>
      </div>

      {/* Render Chart Container */}
      <div className="w-full h-[320px] sm:h-[360px] font-sans text-xs">
        {chartType === 'hourly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorPrecipProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="timeLabel"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={false}
                dy={10}
                // Only show labels for every 3 hours to prevent overlaps
                interval={2}
              />
              <YAxis
                yAxisId="left"
                stroke="#f59e0b"
                tickLine={false}
                axisLine={false}
                dx={-10}
                domain={['auto', 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#3b82f6"
                tickLine={false}
                axisLine={false}
                dx={10}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name={`Temperature (°${isFahrenheit ? 'F' : 'C'})`}
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                activeDot={{ r: 6 }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                name="Precipitation (mm)"
                fill="#60a5fa"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="probability"
                name="Rain Chance (%)"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis dataKey="dayLabel" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis
                yAxisId="left"
                stroke="#ef4444"
                tickLine={false}
                axisLine={false}
                dx={-10}
                domain={['auto', 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#06b6d4"
                tickLine={false}
                axisLine={false}
                dx={10}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="maxTemp"
                name="Max Temp"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="minTemp"
                name="Min Temp"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                name="Total Precip. (mm)"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
