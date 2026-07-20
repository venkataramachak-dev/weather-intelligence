import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  RefreshCw, 
  Compass, 
  CloudRain, 
  CloudSun, 
  CloudSnow, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import WeatherCharts from './components/WeatherCharts';
import IntelligencePanel from './components/IntelligencePanel';
import { WeatherResponse } from './types';

const DEFAULT_LOCATION = {
  name: 'New York',
  country: 'United States',
  admin1: 'New York',
  latitude: 40.7128,
  longitude: -74.0060,
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const stored = localStorage.getItem('weather_selected_location');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored location', e);
      }
    }
    return DEFAULT_LOCATION;
  });

  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isFahrenheit, setIsFahrenheit] = useState(() => {
    const stored = localStorage.getItem('weather_temp_unit');
    return stored ? stored === 'F' : false; // Default to Celsius (°C)
  });
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('weather_dark_mode');
    if (stored) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sync unit to localStorage
  useEffect(() => {
    localStorage.setItem('weather_temp_unit', isFahrenheit ? 'F' : 'C');
  }, [isFahrenheit]);

  // Sync dark mode to DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('weather_dark_mode', String(darkMode));
  }, [darkMode]);

  // Fetch weather data when selectedLocation or refreshTrigger changes
  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setIsLoading(true);
      setSearchError(null);
      try {
        const { latitude, longitude } = selectedLocation;
        // Query forecast, current_weather, hourly variables, and daily variables
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to retrieve forecast data.');
        const data: WeatherResponse = await res.json();
        
        if (isMounted) {
          setWeatherData(data);
          // Save the searched location as current default
          localStorage.setItem('weather_selected_location', JSON.stringify(selectedLocation));
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        if (isMounted) {
          setSearchError('Failed to fetch real-time weather. Please try refreshing or checking connection.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [selectedLocation, refreshTrigger]);

  const handleSelectLocation = (location: typeof DEFAULT_LOCATION) => {
    setSelectedLocation(location);
    setSelectedDayIndex(0); // Reset to "Today" on city search
    setSearchError(null);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Safe parameters for the selected day in intelligence calculations
  const getSelectedDayParams = () => {
    if (!weatherData) return null;
    
    const idx = selectedDayIndex;
    const daily = weatherData.daily;
    const isToday = idx === 0;

    // Estimate average temperature for future days, or use current_weather for today
    const currentTemp = isToday && weatherData.current_weather 
      ? weatherData.current_weather.temperature 
      : ((daily.temperature_2m_max[idx] ?? 20) + (daily.temperature_2m_min[idx] ?? 10)) / 2;

    const windSpeed = isToday && weatherData.current_weather
      ? weatherData.current_weather.windspeed
      : daily.windspeed_10m_max?.[idx] ?? 15;

    return {
      temperature: currentTemp,
      weathercode: daily.weathercode[idx] ?? 0,
      windSpeed: windSpeed,
      precipitation: daily.precipitation_sum[idx] ?? 0,
      tempMax: daily.temperature_2m_max[idx] ?? 20,
      tempMin: daily.temperature_2m_min[idx] ?? 10,
      dateStr: daily.time[idx],
      isToday,
    };
  };

  const selectedDayParams = getSelectedDayParams();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-16">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-500/5 pointer-events-none z-0"></div>

      {/* Primary Top Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-b border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl text-white shadow-md shadow-indigo-500/25">
            <CloudSun size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
              Weather <span className="text-indigo-600 dark:text-indigo-400">Intelligence</span>
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
              Physics & Data Engine
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            type="button"
            title="Refresh Forecast"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin text-indigo-500' : ''} />
          </button>

          {/* Unit Toggle */}
          <button
            onClick={() => setIsFahrenheit(!isFahrenheit)}
            type="button"
            title="Toggle temperature unit"
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 text-xs font-black text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-slate-100 shadow-sm transition-all hover:scale-105"
          >
            {isFahrenheit ? '°F' : '°C'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            title="Toggle dark/light theme"
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 shadow-sm transition-all hover:scale-105"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Application Interface */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-6">
        {/* Unified Search Section */}
        <SearchBar
          onSelectLocation={handleSelectLocation}
          isLoading={isLoading}
          onSearchError={setSearchError}
        />

        {/* Search Error Alert */}
        {searchError && (
          <div className="w-full max-w-2xl mx-auto bg-red-50 dark:bg-red-950/20 border-2 border-red-250 dark:border-red-950/30 text-red-800 dark:text-red-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Actionable Error</p>
              <p className="text-xs font-medium text-red-700 dark:text-red-350 mt-0.5">{searchError}</p>
            </div>
          </div>
        )}

        {isLoading && !weatherData ? (
          /* High Fidelity Loader */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-950 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm animate-pulse">
              Running geocoding & predictive computations...
            </p>
          </div>
        ) : weatherData ? (
          /* Forecast Layout Dashboard */
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            
            {/* Top row: Current weather display */}
            {weatherData.current_weather && (
              <CurrentWeather
                current={weatherData.current_weather}
                daily={weatherData.daily}
                cityName={selectedLocation.name}
                country={selectedLocation.country}
                admin1={selectedLocation.admin1}
                isFahrenheit={isFahrenheit}
              />
            )}

            {/* Middle Section: 7-day layout */}
            <ForecastList
              daily={weatherData.daily}
              isFahrenheit={isFahrenheit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />

            {/* Dynamic Intelligence Row */}
            {selectedDayParams && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Weather charts (dynamic per active day selection or 7-day view) */}
                <WeatherCharts
                  weatherData={weatherData}
                  selectedDayIndex={selectedDayIndex}
                  isFahrenheit={isFahrenheit}
                />

                {/* Intelligence panel with recommendations */}
                <IntelligencePanel
                  temperature={selectedDayParams.temperature}
                  weathercode={selectedDayParams.weathercode}
                  windSpeed={selectedDayParams.windSpeed}
                  precipitation={selectedDayParams.precipitation}
                  tempMax={selectedDayParams.tempMax}
                  tempMin={selectedDayParams.tempMin}
                  dateStr={selectedDayParams.dateStr}
                  isToday={selectedDayParams.isToday}
                />
              </div>
            )}

          </div>
        ) : (
          /* Empty Initial State */
          <div className="text-center py-20 bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
            <HelpCircle size={48} className="mx-auto text-indigo-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Begin Weather Query</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search for a city above to load interactive weather data and smart planning recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
