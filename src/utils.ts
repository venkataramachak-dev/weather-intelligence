import { PlanningRecommendation, WeatherCodeInfo } from './types';

// Map WMO Weather Interpretation Codes (WMO) to UI details
export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  // Codes based on Open-Meteo documentation
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        icon: 'Sun',
        bgGradient: 'from-amber-400 via-orange-400 to-amber-500',
        cardBg: 'bg-amber-50 border-amber-200/50 text-amber-950',
        textColor: 'text-amber-600',
        isRainy: false,
        isSnowy: false,
        isSunny: true,
        isCloudy: false,
      };
    case 1:
      return {
        label: 'Mainly Clear',
        icon: 'SunDim',
        bgGradient: 'from-amber-300 via-yellow-400 to-orange-400',
        cardBg: 'bg-yellow-50/70 border-yellow-200/50 text-yellow-950',
        textColor: 'text-yellow-600',
        isRainy: false,
        isSnowy: false,
        isSunny: true,
        isCloudy: false,
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: 'CloudSun',
        bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
        cardBg: 'bg-sky-50/70 border-sky-100 text-sky-950',
        textColor: 'text-sky-600',
        isRainy: false,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 3:
      return {
        label: 'Overcast',
        icon: 'Cloud',
        bgGradient: 'from-slate-400 to-slate-600',
        cardBg: 'bg-slate-50 border-slate-200/60 text-slate-950',
        textColor: 'text-slate-600',
        isRainy: false,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: 'CloudFog',
        bgGradient: 'from-zinc-300 to-zinc-500',
        cardBg: 'bg-zinc-50 border-zinc-200 text-zinc-950',
        textColor: 'text-zinc-600',
        isRainy: false,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: 'CloudDrizzle',
        bgGradient: 'from-blue-300 via-cyan-400 to-slate-500',
        cardBg: 'bg-blue-50/50 border-blue-200/40 text-blue-950',
        textColor: 'text-blue-500',
        isRainy: true,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: 'Snowflake',
        bgGradient: 'from-cyan-200 to-blue-400',
        cardBg: 'bg-cyan-50/50 border-cyan-200 text-cyan-950',
        textColor: 'text-cyan-600',
        isRainy: false,
        isSnowy: true,
        isSunny: false,
        isCloudy: true,
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rain',
        icon: 'CloudRain',
        bgGradient: 'from-blue-500 via-indigo-600 to-slate-700',
        cardBg: 'bg-blue-50 border-blue-200 text-blue-950',
        textColor: 'text-blue-600',
        isRainy: true,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: 'Snowflake',
        bgGradient: 'from-sky-300 via-blue-400 to-violet-500',
        cardBg: 'bg-sky-50 border-sky-200 text-sky-950',
        textColor: 'text-sky-600',
        isRainy: true,
        isSnowy: true,
        isSunny: false,
        isCloudy: true,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snow',
        icon: 'Snowflake',
        bgGradient: 'from-teal-100 via-cyan-200 to-blue-350',
        cardBg: 'bg-slate-50 border-slate-250 text-slate-900',
        textColor: 'text-cyan-500',
        isRainy: false,
        isSnowy: true,
        isSunny: false,
        isCloudy: false,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: 'CloudRain',
        bgGradient: 'from-blue-400 via-blue-600 to-indigo-800',
        cardBg: 'bg-blue-50/70 border-blue-200 text-blue-950',
        textColor: 'text-blue-600',
        isRainy: true,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: 'Snowflake',
        bgGradient: 'from-cyan-300 via-blue-300 to-indigo-400',
        cardBg: 'bg-cyan-50 border-cyan-100 text-cyan-950',
        textColor: 'text-cyan-500',
        isRainy: false,
        isSnowy: true,
        isSunny: false,
        isCloudy: true,
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        bgGradient: 'from-violet-600 via-purple-700 to-slate-900',
        cardBg: 'bg-purple-50 border-purple-200 text-purple-950',
        textColor: 'text-purple-600',
        isRainy: true,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
    default:
      return {
        label: 'Unknown',
        icon: 'Cloud',
        bgGradient: 'from-slate-300 to-slate-500',
        cardBg: 'bg-slate-100 border-slate-200 text-slate-800',
        textColor: 'text-slate-500',
        isRainy: false,
        isSnowy: false,
        isSunny: false,
        isCloudy: true,
      };
  }
}

// Generate smart weather intelligence recommendations based on criteria
export function generateRecommendations(
  temp: number,
  code: number,
  windSpeed: number,
  dailyRain: number,
  tempMax: number,
  tempMin: number
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];
  const info = getWeatherCodeInfo(code);

  // 1. SAFETY CRITICALS
  if (code >= 95) {
    recommendations.push({
      id: 'storm-safety',
      category: 'safety',
      title: 'Thunderstorm Warning',
      description: 'Lightning risk! Postpone outdoor events and seek shelter indoors immediately.',
      level: 'warning',
      icon: 'AlertTriangle',
    });
  } else if (tempMax >= 38) {
    recommendations.push({
      id: 'extreme-heat',
      category: 'safety',
      title: 'Extreme Heat Warning',
      description: 'Temperatures are dangerously high. Limit outdoor exposure, drink fluids constantly, and avoid heavy activity.',
      level: 'warning',
      icon: 'Flame',
    });
  } else if (tempMin <= -5) {
    recommendations.push({
      id: 'extreme-cold',
      category: 'safety',
      title: 'Severe Freeze Alert',
      description: 'Freezing temperatures. Frostbite risk on exposed skin. Wear thermal layers and check on pets.',
      level: 'warning',
      icon: 'AlertTriangle',
    });
  } else if (windSpeed >= 40) {
    recommendations.push({
      id: 'high-wind',
      category: 'safety',
      title: 'Gale Warning',
      description: 'High wind speeds observed. Secure outdoor furniture and watch for loose branches or flying debris.',
      level: 'warning',
      icon: 'Wind',
    });
  }

  // 2. CLOTHING (UMBRELLA, LAYERING, EYEWEAR)
  if (info.isRainy || dailyRain > 0) {
    recommendations.push({
      id: 'bring-umbrella',
      category: 'clothing',
      title: 'Rain Protection Needed',
      description: 'Rain or drizzle expected today. Make sure to pack an umbrella, waterproof coat, or water-resistant shoes.',
      level: 'warning',
      icon: 'Umbrella',
    });
  }

  if (temp <= 10) {
    recommendations.push({
      id: 'apparel-cold',
      category: 'clothing',
      title: 'Heavy Winter Apparel',
      description: 'Chilly temperatures! Equip yourself with a thick coat, insulated gloves, a beanie, and a cozy scarf.',
      level: 'info',
      icon: 'Shirt',
    });
  } else if (temp > 10 && temp <= 18) {
    recommendations.push({
      id: 'apparel-mild',
      category: 'clothing',
      title: 'Layered Clothing Ideal',
      description: 'Cool weather conditions. A light jacket, windbreaker, or warm cardigan is perfect for transitioning outdoors.',
      level: 'info',
      icon: 'Shirt',
    });
  } else if (temp > 18 && temp <= 27) {
    recommendations.push({
      id: 'apparel-comfortable',
      category: 'clothing',
      title: 'Light & Breathable Clothing',
      description: 'Comfortably warm! Perfect for T-shirts, shorts, or light summer dresses. Natural breathable fabrics are ideal.',
      level: 'success',
      icon: 'Sparkles',
    });
  } else if (temp > 27) {
    recommendations.push({
      id: 'apparel-hot',
      category: 'clothing',
      title: 'Ultra-Lightweight Apparel',
      description: 'Hot out there! Wear extremely breathable clothes, and absolutely put on sunscreen, sunglasses, and a wide-brim hat.',
      level: 'warning',
      icon: 'Glasses',
    });
  }

  // 3. OUTDOOR ACTIVITIES
  if (info.isSunny && tempMax < 32 && tempMin > 12 && windSpeed < 25 && dailyRain === 0) {
    recommendations.push({
      id: 'perfect-outdoor',
      category: 'activity',
      title: 'Pristine Outdoor Conditions',
      description: 'Stellar conditions! Ideal for hiking, cycling, running, picnic in the park, or outdoor dining.',
      level: 'success',
      icon: 'TrendingUp',
    });
  } else if (info.isRainy || info.isSnowy || tempMax >= 35 || tempMin < 5) {
    recommendations.push({
      id: 'indoor-activity',
      category: 'activity',
      title: 'Indoor Activities Recommended',
      description: 'Unfavorable elements outside. Great day for reading, gym sessions, cinema, museum trips, or cooking at home.',
      level: 'info',
      icon: 'Home',
    });
  } else {
    recommendations.push({
      id: 'moderate-outdoor',
      category: 'activity',
      title: 'Fair Outdoor Conditions',
      description: 'Decent conditions. Jogging or taking brief walks is fine, but stay mindful of potential minor cloud cover or wind gusts.',
      level: 'info',
      icon: 'Footprints',
    });
  }

  // 4. COMFORT & WELLNESS
  if (info.isSunny && tempMax > 24) {
    recommendations.push({
      id: 'sunscreen-alert',
      category: 'comfort',
      title: 'Apply UV Protection',
      description: 'Bright sun and warm temp. UV index is likely elevated. Apply SPF 30+ sunscreen and wear protective eyewear.',
      level: 'info',
      icon: 'Sun',
    });
  }

  if (windSpeed > 25 && temp < 8) {
    recommendations.push({
      id: 'wind-chill',
      category: 'comfort',
      title: 'Severe Wind Chill Factor',
      description: 'Wind gusts make the air feel significantly colder. Protect lips and skin from dry chapping with moisturizer.',
      level: 'info',
      icon: 'Wind',
    });
  } else if (temp > 25 && windSpeed < 8) {
    recommendations.push({
      id: 'stuffy-air',
      category: 'comfort',
      title: 'Stagnant Warm Air',
      description: 'Warm conditions with minimal wind can feel stuffy. Keep rooms well ventilated and stay hydrated.',
      level: 'info',
      icon: 'Compass',
    });
  }

  return recommendations;
}

// Format Unix Timestamp / ISO String into human-friendly dates
export function formatDate(isoString: string, type: 'weekday' | 'short' | 'full' | 'hour' = 'weekday'): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    if (type === 'weekday') {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else if (type === 'short') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (type === 'full') {
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } else if (type === 'hour') {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString();
  } catch {
    return isoString;
  }
}

// Convert Celsius to Fahrenheit if needed (can build unit toggles!)
export function convertTemp(celsius: number, isFahrenheit: boolean): number {
  if (isFahrenheit) {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}
