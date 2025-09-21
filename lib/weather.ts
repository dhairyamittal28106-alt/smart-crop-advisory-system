export type WeatherData = {
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
  forecast: {
    day: string;
    condition: string;
    high: number;
    low: number;
    precipitation: number;
    humidity: number;
  }[];
  alerts: {
    id: string;
    type: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    validUntil: string;
  }[];
  farmingAdvice: {
    activity: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
  }[];
  location: {
    name: string;
    region: string;
    country: string;
  };
};

// Generates farming advice based on current and forecasted weather conditions
function generateFarmingAdvice(
  current: any,
  forecast: any[]
): Array<{
  activity: string;
  recommendation: string;
  priority: "low" | "medium" | "high";
}> {
  const advice: Array<{
    activity: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
  }> = [];

  // **Temperature-based Advice**
  if (current.main.temp > 35) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Provide shade protection for sensitive crops due to extreme heat.",
      priority: "high",
    });
  } else if (current.main.temp < 5) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Protect crops from frost damage as temperatures are very low.",
      priority: "high",
    });
  }

  // **Humidity-based Advice**
  if (current.main.humidity > 80) {
    advice.push({
      activity: "Disease Prevention",
      recommendation: "Monitor for fungal diseases; high humidity can promote growth.",
      priority: "medium",
    });
  } else if (current.main.humidity < 30) {
    advice.push({
      activity: "Irrigation",
      recommendation: "Increase watering frequency due to very dry conditions.",
      priority: "medium",
    });
  }

  // **Wind-based Advice**
  if (current.wind.speed > 20) {
    advice.push({
      activity: "Spraying",
      recommendation: "Avoid pesticide application; wind speed is too high for safe spraying.",
      priority: "high",
    });
  }

  // **Rain-based Advice (from forecast)**
  // Checks the next 24 hours (8 data points) for rain presence
  const rainChance = forecast
    .slice(0, 8)
    .some((item) => item.weather[0].main.toLowerCase().includes("rain"));
  if (rainChance) {
    advice.push({
      activity: "Irrigation",
      recommendation: `Delay watering; rain is expected in the next 24 hours.`,
      priority: "high",
    });
  }

  // **UV Index Advice (dummy value since free plan doesn't provide it)**
  // The value `current.uvIndex` will be passed from the main fetch function, which will use a dummy value.
  if (current.uvIndex >= 8) {
    advice.push({
      activity: "Field Work",
      recommendation:
        "Limit outdoor activities during peak hours (11 AM - 3 PM) due to very high UV index.",
      priority: "medium",
    });
  } else if (current.uvIndex >= 6) {
    advice.push({
      activity: "Field Work",
      recommendation: "Use sun protection during outdoor activities; high UV index.",
      priority: "low",
    });
  }

  // Add a default tip if no specific advice was generated
  if (advice.length === 0) {
    advice.push({
      activity: "General Farm Maintenance",
      recommendation:
        "Maintain your crops with routine care. No specific weather-related alerts at this time.",
      priority: "low",
    });
  }

  return advice;
}

export async function fetchWeatherData(): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) throw new Error("API key missing!");

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
    latitude = 30.7333;
    longitude = 76.7794;
  }

  try {
    // API Call 1: Current Weather Data
    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    if (!currentWeatherRes.ok)
      throw new Error("Failed to fetch current weather data.");
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
        dayData.precipitation += item.rain["3h"] || 0;
      }
    });

    const dailyForecast = Array.from(dailyForecastMap.entries())
      .slice(0, 7)
      .map(([date, data]: any) => {
        const condition = data.conditions.reduce(
          (a: any, b: any) =>
            data.conditions.filter((v: any) => v === a).length >=
            data.conditions.filter((v: any) => v === b).length
              ? a
              : b
        );
        const avgHumidity = Math.round(
          data.humidity.reduce((a: any, b: any) => a + b, 0) /
            data.humidity.length
        );
        return {
          day: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          condition: condition,
          high: Math.round(data.high),
          low: Math.round(data.low),
          precipitation: Math.round(data.precipitation * 100),
          humidity: avgHumidity,
        };
      });

    // UV index is not available in the free plan, so we'll add a dummy value for the farming advice logic.
    const dummyUVIndex = 5;

    // Pass current weather data and the raw forecast list to the advice function
    const farmingAdvice = generateFarmingAdvice(
      { ...currentWeatherData, uvIndex: dummyUVIndex },
      forecastData.list
    );

    // Return the final, complete weather data object
    return {
      current: {
        temperature: Math.round(currentWeatherData.main.temp),
        condition: currentWeatherData.weather[0].description,
        humidity: currentWeatherData.main.humidity,
        windSpeed: currentWeatherData.wind.speed,
        visibility: currentWeatherData.visibility
          ? currentWeatherData.visibility / 1000
          : 10,
        pressure: currentWeatherData.main.pressure,
        uvIndex: dummyUVIndex,
        feelsLike: currentWeatherData.main.feels_like,
        lastUpdated: new Date().toISOString(),
      },
      forecast: dailyForecast,
      alerts: [], // Alerts are not available on the free plan
      farmingAdvice: farmingAdvice,
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