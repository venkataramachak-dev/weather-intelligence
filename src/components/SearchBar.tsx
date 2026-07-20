import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Clock, Trash2, HelpCircle } from 'lucide-react';
import { GeocodingResult, SavedLocation } from '../types';

interface SearchBarProps {
  onSelectLocation: (location: { name: string; latitude: number; longitude: number; country?: string; admin1?: string }) => void;
  isLoading: boolean;
  onSearchError: (errorMsg: string | null) => void;
}

export default function SearchBar({ onSelectLocation, isLoading: parentLoading, onSearchError }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recents, setRecents] = useState<SavedLocation[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recents on mount
  useEffect(() => {
    const stored = localStorage.getItem('weather_recent_searches');
    if (stored) {
      try {
        setRecents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    } else {
      // Seed initial defaults if empty
      const defaultRecents: SavedLocation[] = [
        { id: 'london_51_5_0_1', name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
        { id: 'tokyo_35_6_139_6', name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
        { id: 'new_york_40_7_74_0', name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.0060 },
      ];
      setRecents(defaultRecents);
      localStorage.setItem('weather_recent_searches', JSON.stringify(defaultRecents));
    }
  }, []);

  // Handle click outside suggestions dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce autocomplete API calls
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      onSearchError(null);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error(err);
        // Don't fail dramatically for typing suggestions, only fallback to empty suggestions
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearchError]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    onSearchError(null);
    setShowDropdown(false);

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding API failed');
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        onSearchError(`City not found: "${query}". Please check spelling and try again.`);
        return;
      }

      // Choose first result
      const topMatch = data.results[0];
      handleSelectLocation(topMatch);
    } catch (err) {
      onSearchError('Network error while searching for city. Please check your connection.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: GeocodingResult | SavedLocation) => {
    onSelectLocation({
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      country: loc.country,
      admin1: loc.admin1,
    });

    // Save to recents
    const id = `${loc.name.toLowerCase()}_${loc.latitude.toFixed(2)}_${loc.longitude.toFixed(2)}`;
    const newRecent: SavedLocation = {
      id,
      name: loc.name,
      country: loc.country,
      admin1: loc.admin1,
      latitude: loc.latitude,
      longitude: loc.longitude,
    };

    setRecents((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      const updated = [newRecent, ...filtered].slice(0, 5); // Max 5 items
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      return updated;
    });

    setQuery('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const removeRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50 mb-8" id="search-section">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search size={20} className={isSearching || parentLoading ? 'animate-pulse' : ''} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city (e.g., Tokyo, Paris, Seattle)..."
          className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all shadow-sm font-sans"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Autocomplete / Recent Suggestions Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <div className="border-b border-slate-100 dark:border-slate-700/50 pb-2">
              <div className="px-4 py-2 text-xs font-semibold text-indigo-500 uppercase tracking-wider">Search Results</div>
              {suggestions.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 flex items-center gap-3 transition-colors text-slate-700 dark:text-slate-200"
                >
                  <MapPin size={18} className="text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-semibold">{loc.name}</span>
                    {loc.admin1 && <span className="text-slate-450 dark:text-slate-400 text-sm">, {loc.admin1}</span>}
                    {loc.country && <span className="text-slate-450 dark:text-slate-400 text-sm">, {loc.country}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches history */}
          {recents.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Recent Locations</span>
                <Clock size={12} />
              </div>
              {recents.map((loc) => (
                <div
                  key={loc.id}
                  className="group w-full flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <button
                    onClick={() => handleSelectLocation(loc)}
                    type="button"
                    className="flex-1 text-left px-4 py-3 flex items-center gap-3 text-slate-700 dark:text-slate-200"
                  >
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <div className="truncate text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{loc.name}</span>
                      {(loc.admin1 || loc.country) && (
                        <span className="text-slate-400 text-xs">
                          {' '}
                          - {loc.admin1 ? `${loc.admin1}, ` : ''}
                          {loc.country}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={(e) => removeRecent(loc.id, e)}
                    type="button"
                    title="Remove from history"
                    className="mr-3 p-1.5 rounded-lg text-slate-350 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {suggestions.length === 0 && recents.length === 0 && (
            <div className="px-5 py-6 text-center text-slate-400 dark:text-slate-500 text-sm">
              <HelpCircle size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <span>Type city name to search (e.g., Chicago) and see results here.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
