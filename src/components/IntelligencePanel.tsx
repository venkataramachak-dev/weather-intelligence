import React from 'react';
import { PlanningRecommendation } from '../types';
import { generateRecommendations, formatDate } from '../utils';
import WeatherIcon from './WeatherIcon';
import { Sparkles, Shield, Shirt, Map, Smile } from 'lucide-react';

interface IntelligencePanelProps {
  temperature: number;
  weathercode: number;
  windSpeed: number;
  precipitation: number;
  tempMax: number;
  tempMin: number;
  dateStr: string;
  isToday: boolean;
}

export default function IntelligencePanel({
  temperature,
  weathercode,
  windSpeed,
  precipitation,
  tempMax,
  tempMin,
  dateStr,
  isToday,
}: IntelligencePanelProps) {
  const recommendations = generateRecommendations(
    temperature,
    weathercode,
    windSpeed,
    precipitation,
    tempMax,
    tempMin
  );

  const dayLabel = isToday ? 'Today' : formatDate(dateStr, 'weekday');

  // Helper to resolve category titles and icon
  const getCategoryHeader = (category: string) => {
    switch (category) {
      case 'safety':
        return { label: 'Alerts & Safety', icon: <Shield className="text-red-500" size={16} /> };
      case 'clothing':
        return { label: 'Apparel Advisor', icon: <Shirt className="text-indigo-500" size={16} /> };
      case 'activity':
        return { label: 'Activity Guide', icon: <Map className="text-emerald-500" size={16} /> };
      case 'comfort':
        return { label: 'Comfort & Wellness', icon: <Smile className="text-amber-500" size={16} /> };
      default:
        return { label: 'Weather Recommendation', icon: <Sparkles className="text-indigo-500" size={16} /> };
    }
  };

  return (
    <div id="weather-intelligence-panel" className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Weather Intelligence Engine</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Personalized, physics-driven planning advice for <span className="font-bold text-slate-650 dark:text-slate-405">{dayLabel}, {formatDate(dateStr, 'short').split(',')[1]}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const catHeader = getCategoryHeader(rec.category);

          // Customize styling per level (warning, success, info)
          let cardStyle = 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20';
          let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-405';
          if (rec.level === 'warning') {
            cardStyle = 'border-red-100 dark:border-red-950/20 bg-red-50/40 dark:bg-red-950/10';
            badgeStyle = 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-405';
          } else if (rec.level === 'success') {
            cardStyle = 'border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/30 dark:bg-emerald-950/10';
            badgeStyle = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-405';
          }

          return (
            <div
              key={rec.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-sm ${cardStyle}`}
            >
              <div className={`p-3 rounded-xl ${badgeStyle} shrink-0`}>
                <WeatherIcon name={rec.icon} size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-450 dark:text-slate-500 flex items-center gap-1">
                    {catHeader.icon}
                    <span>{catHeader.label}</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 leading-tight">{rec.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{rec.description}</p>
              </div>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500">
            <Smile size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-750" />
            <p className="font-semibold text-sm">Perfect Calm Weather</p>
            <p className="text-xs">No special advisories required for this pleasant day.</p>
          </div>
        )}
      </div>
    </div>
  );
}
