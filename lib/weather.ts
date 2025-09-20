// Weather API service using WeatherAPI.com
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '1a6a98d219f14e1484b161542252009';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    feelsLike: number;
    lastUpdated: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    humidity: number;
  }>;
  alerts: Array<{
    id: string;
    type: "warning" | "advisory" | "watch";
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    validUntil: string;
  }>;
  farmingAdvice: Array<{
    activity: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
  }>;
  location: {
    name: string;
    region: string;
    country: string;
  };
}

export interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: number;
        is_moon_up: number;
        is_sun_up: number;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        gust_mph: number;
        gust_kph: number;
        uv: number;
      }>;
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      msgtype: string;
      severity: string;
      urgency: string;
      areas: string;
      category: string;
      certainty: string;
      event: string;
      note: string;
      effective: string;
      expires: string;
      desc: string;
      instruction: string;
    }>;
  };
}

// Fetch current weather and forecast for Punjab, India
export async function fetchWeatherData(): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=Punjab,India&days=7&aqi=yes&alerts=yes`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherAPIResponse = await response.json();
    return transformWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Fetch weather alerts specifically
export async function fetchWeatherAlerts(lat: number = 31.1471, lon: number = 75.3412): Promise<any[]> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=1&aqi=yes&alerts=yes`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherAPIResponse = await response.json();
    return data.alerts?.alert || [];
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return [];
  }
}

// Transform WeatherAPI response to our WeatherData format
function transformWeatherData(data: WeatherAPIResponse): WeatherData {
  const current = data.current;
  const forecast = data.forecast.forecastday;
  const alerts = data.alerts?.alert || [];

  // Transform alerts
  const transformedAlerts = alerts.map((alert, index) => ({
    id: `alert-${index}`,
    type: alert.msgtype.toLowerCase() as "warning" | "advisory" | "watch",
    title: alert.headline,
    description: alert.desc,
    severity: getSeverityLevel(alert.severity),
    validUntil: alert.expires,
  }));

  // Generate farming advice based on weather conditions
  const farmingAdvice = generateFarmingAdvice(current, forecast);

  return {
    current: {
      temperature: Math.round(current.temp_c),
      condition: current.condition.text,
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_kph),
      visibility: Math.round(current.vis_km),
      pressure: current.pressure_mb,
      uvIndex: current.uv,
      feelsLike: Math.round(current.feelslike_c),
      lastUpdated: current.last_updated,
    },
    forecast: forecast.map((day, index) => ({
      date: day.date,
      day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      condition: day.day.condition.text,
      precipitation: day.day.daily_chance_of_rain,
      humidity: day.day.avghumidity,
    })),
    alerts: transformedAlerts,
    farmingAdvice,
    location: {
      name: data.location.name,
      region: data.location.region,
      country: data.location.country,
    },
  };
}

// Convert severity string to our severity levels
function getSeverityLevel(severity: string): "low" | "medium" | "high" {
  const severityLower = severity.toLowerCase();
  if (severityLower.includes('extreme') || severityLower.includes('severe')) {
    return 'high';
  } else if (severityLower.includes('moderate') || severityLower.includes('minor')) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Generate farming advice based on weather conditions
function generateFarmingAdvice(current: any, forecast: any[]): Array<{
  activity: string;
  recommendation: string;
  priority: "low" | "medium" | "high";
}> {
  const advice: Array<{
    activity: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
  }> = [];

  // Check for rain in the next few days
  const rainDays = forecast.slice(0, 3).filter(day => day.day.daily_chance_of_rain > 50);
  if (rainDays.length > 0) {
    advice.push({
      activity: "Irrigation",
      recommendation: `Reduce watering schedule - ${rainDays.length} day(s) of rain expected with ${Math.max(...rainDays.map(d => d.day.daily_chance_of_rain))}% chance`,
      priority: "high",
    });
  }

  // Check for high wind conditions
  if (current.wind_kph > 20) {
    advice.push({
      activity: "Spraying",
      recommendation: "Avoid pesticide application - wind speed is too high for safe spraying",
      priority: "high",
    });
  }

  // Check UV index
  if (current.uv >= 8) {
    advice.push({
      activity: "Field Work",
      recommendation: "Limit outdoor activities during peak hours (11 AM - 3 PM) - very high UV index",
      priority: "medium",
    });
  } else if (current.uv >= 6) {
    advice.push({
      activity: "Field Work",
      recommendation: "Use sun protection during outdoor activities - high UV index",
      priority: "low",
    });
  }

  // Check for temperature extremes
  if (current.temp_c > 35) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Consider shade protection for sensitive crops - extreme heat conditions",
      priority: "high",
    });
  } else if (current.temp_c < 5) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Protect crops from frost damage - low temperature warning",
      priority: "high",
    });
  }

  // Check humidity levels
  if (current.humidity > 80) {
    advice.push({
      activity: "Disease Prevention",
      recommendation: "Monitor for fungal diseases - high humidity conditions",
      priority: "medium",
    });
  } else if (current.humidity < 30) {
    advice.push({
      activity: "Irrigation",
      recommendation: "Increase watering frequency - low humidity conditions",
      priority: "medium",
    });
  }

  // Check for upcoming harvest conditions
  const harvestDays = forecast.slice(0, 5).filter(day => 
    day.day.daily_chance_of_rain < 30 && 
    day.day.maxtemp_c < 35 && 
    day.day.maxwind_kph < 25
  );
  if (harvestDays.length >= 3) {
    advice.push({
      activity: "Harvesting",
      recommendation: "Good conditions for harvesting in the next few days",
      priority: "low",
    });
  }

  return advice;
}
