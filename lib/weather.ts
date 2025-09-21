export type WeatherData = {
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
    feelsLike: number
    lastUpdated: string
  }
  forecast: {
    day: string
    condition: string
    high: number
    low: number
    precipitation: number
    humidity: number
  }[]
  alerts: {
    id: string
    type: string
    title: string
    description: string
    severity: "low" | "medium" | "high"
    validUntil: string
  }[]
  farmingAdvice: {
    activity: string
    recommendation: string
    priority: "low" | "medium" | "high"
  }[]
  location: {
    name: string
    region: string
    country: string
  }
}

// Combined helper for farming advice
function generateFarmingAdvice(current: any, forecast: any[]): Array<{
  activity: string
  recommendation: string
  priority: "low" | "medium" | "high"
}> {
  const advice: Array<{ activity: string; recommendation: string; priority: "low" | "medium" | "high" }> = []

  // UV index check
  // OpenWeatherMap's free plan doesn't provide a UV index, so we'll use a dummy value
  if (current.uvi >= 8) {
    advice.push({
      activity: "Field Work",
      recommendation: "Limit outdoor activities during peak hours (11 AM - 3 PM) - very high UV index",
      priority: "medium",
    })
  } else if (current.uvi >= 6) {
    advice.push({
      activity: "Field Work",
      recommendation: "Use sun protection during outdoor activities - high UV index",
      priority: "low",
    })
  }

  // Wind check
  if (current.wind_speed > 20) {
    advice.push({
      activity: "Spraying",
      recommendation: "Avoid pesticide application - wind speed is too high for safe spraying",
      priority: "high",
    })
  }

  // Rain check in next 3 days
  // We'll check the 3-hour forecast for rain
  const rainHours = forecast.slice(0, 24).filter(item => item.weather[0].main.toLowerCase().includes('rain'));
  if (rainHours.length > 0) {
    advice.push({
      activity: "Irrigation",
      recommendation: `Reduce watering schedule - rain expected in the next few hours`,
      priority: "high",
    })
  }

  // Temperature extremes
  if (current.temp > 35) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Provide shade protection for sensitive crops - extreme heat",
      priority: "high",
    })
  } else if (current.temp < 5) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Protect crops from frost damage - very low temperature",
      priority: "high",
    })
  }

  // Humidity
  if (current.humidity > 80) {
    advice.push({
      activity: "Disease Prevention",
      recommendation: "Monitor for fungal diseases - high humidity",
      priority: "medium",
    })
  } else if (current.humidity < 30) {
    advice.push({
      activity: "Irrigation",
      recommendation: "Increase watering frequency - very dry conditions",
      priority: "medium",
    })
  }

  return advice
}

export async function fetchWeatherData(): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
  if (!apiKey) throw new Error("API key missing!")

  let latitude: number;
  let longitude: number;

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
    );
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  } catch (err) {
    console.error("Geolocation failed, using default location:", err);
    // Fallback coordinates for Chandigarh
    latitude = 30.7333;
    longitude = 76.7794;
  }

  try {
    // API Call 1: Current Weather Data
    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    if (!currentWeatherRes.ok) throw new Error("Failed to fetch current weather data.");
    const currentWeatherData = await currentWeatherRes.json();

    // API Call 2: 5-Day / 3-Hour Forecast Data
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    if (!forecastRes.ok) throw new Error("Failed to fetch forecast data.");
    const forecastData = await forecastRes.json();

    // API Call 3: Reverse Geocoding to get location name
    const geoRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
    );
    if (!geoRes.ok) throw new Error("Failed to fetch location data.");
    const geoData = await geoRes.json();

    const locationName = geoData[0]?.name || "Your Location";
    const locationRegion = geoData[0]?.state || "";
    const locationCountry = geoData[0]?.country || "";

    // Process the 5-day/3-hour forecast into a daily forecast
    const dailyForecastMap = new Map();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecastMap.has(date)) {
        dailyForecastMap.set(date, {
          high: -Infinity,
          low: Infinity,
          conditions: [],
          humidity: [],
          precipitation: 0,
        });
      }
      const dayData = dailyForecastMap.get(date);
      dayData.high = Math.max(dayData.high, item.main.temp_max);
      dayData.low = Math.min(dayData.low, item.main.temp_min);
      dayData.conditions.push(item.weather[0].description);
      dayData.humidity.push(item.main.humidity);
      if (item.rain) {
        dayData.precipitation += item.rain['3h'];
      }
    });

    const dailyForecast = Array.from(dailyForecastMap.entries()).slice(0, 7).map(([date, data]: any) => {
      const condition = data.conditions.reduce((a: any, b: any) => data.conditions.filter((v: any) => v === a).length >= data.conditions.filter((v: any) => v === b).length ? a : b);
      const avgHumidity = Math.round(data.humidity.reduce((a: any, b: any) => a + b, 0) / data.humidity.length);
      return {
        day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        condition: condition,
        high: Math.round(data.high),
        low: Math.round(data.low),
        precipitation: Math.round(data.precipitation * 100),
        humidity: avgHumidity,
      };
    });

    // Dummy UV index since it's not available on the free plan
    const uvIndex = 5;

    return {
      current: {
        temperature: Math.round(currentWeatherData.main.temp),
        condition: currentWeatherData.weather[0].description,
        humidity: currentWeatherData.main.humidity,
        windSpeed: currentWeatherData.wind.speed,
        visibility: currentWeatherData.visibility ? currentWeatherData.visibility / 1000 : 10,
        pressure: currentWeatherData.main.pressure,
        uvIndex: uvIndex,
        feelsLike: currentWeatherData.main.feels_like,
        lastUpdated: new Date().toISOString(),
      },
      forecast: dailyForecast,
      alerts: [], // Alerts are not available on the free plan
      farmingAdvice: generateFarmingAdvice(
        { ...currentWeatherData.main, uvi: uvIndex, wind_speed: currentWeatherData.wind.speed }, 
        forecastData.list
      ),
      location: {
        name: locationName,
        region: locationRegion,
        country: locationCountry,
      },
    };
  } catch (err) {
    console.error("Error fetching weather data:", err);
    throw new Error(`Failed to load weather data. Please try again.`);
  }
}