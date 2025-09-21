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

  if (current?.main?.temp > 35) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Provide shade protection for sensitive crops due to extreme heat.",
      priority: "high",
    });
  } else if (current?.main?.temp < 5) {
    advice.push({
      activity: "Crop Protection",
      recommendation: "Protect crops from frost damage as temperatures are very low.",
      priority: "high",
    });
  }

  if (current?.main?.humidity > 80) {
    advice.push({
      activity: "Disease Prevention",
      recommendation: "Monitor for fungal diseases; high humidity can promote growth.",
      priority: "medium",
    });
  } else if (current?.main?.humidity < 30) {
    advice.push({
      activity: "Irrigation",
      recommendation: "Increase watering frequency due to very dry conditions.",
      priority: "medium",
    });
  }

  if (current?.wind?.speed > 20) {
    advice.push({
      activity: "Spraying",
      recommendation: "Avoid pesticide application; wind speed is too high for safe spraying.",
      priority: "high",
    });
  }

  const rainChance = forecast
    .slice(0, 8)
    .some((item) => item?.weather?.[0]?.main?.toLowerCase()?.includes("rain"));
  if (rainChance) {
    advice.push({
      activity: "Irrigation",
      recommendation: `Delay watering; rain is expected in the next 24 hours.`,
      priority: "high",
    });
  }

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
  } catch (err: unknown) {
    console.error("Geolocation failed, using default location:", err);
    latitude = 30.7333;
    longitude = 76.7794;
  }

  try {
    const currentWeatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    if (!currentWeatherRes.ok)
      throw new Error(`Failed to fetch current weather data: ${currentWeatherRes.statusText}`);
    const currentWeatherData = await currentWeatherRes.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    if (!forecastRes.ok) throw new Error(`Failed to fetch forecast data: ${forecastRes.statusText}`);
    const forecastData = await forecastRes.json();

    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
    );
    if (!geoRes.ok) throw new Error(`Failed to fetch location data: ${geoRes.statusText}`);
    const geoData = await geoRes.json();

    const locationName = geoData[0]?.name || "Your Location";
    const locationRegion = geoData[0]?.state || "";
    const locationCountry = geoData[0]?.country || "";

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
      dayData.high = Math.max(dayData.high, item?.main?.temp_max || -Infinity);
      dayData.low = Math.min(dayData.low, item?.main?.temp_min || Infinity);
      dayData.conditions.push(item?.weather?.[0]?.description);
      dayData.humidity.push(item?.main?.humidity);
      if (item?.rain) {
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

    const dummyUVIndex = 5;

    const farmingAdvice = generateFarmingAdvice(
      { ...currentWeatherData, uvIndex: dummyUVIndex },
      forecastData.list
    );

    return {
      current: {
        temperature: Math.round(currentWeatherData?.main?.temp),
        condition: currentWeatherData?.weather?.[0]?.description,
        humidity: currentWeatherData?.main?.humidity,
        windSpeed: currentWeatherData?.wind?.speed,
        visibility: currentWeatherData?.visibility
          ? currentWeatherData.visibility / 1000
          : 10,
        pressure: currentWeatherData?.main?.pressure,
        uvIndex: dummyUVIndex,
        feelsLike: currentWeatherData?.main?.feels_like,
        lastUpdated: new Date().toISOString(),
      },
      forecast: dailyForecast,
      alerts: [],
      farmingAdvice: farmingAdvice,
      location: {
        name: locationName,
        region: locationRegion,
        country: locationCountry,
      },
    };
  } catch (err: unknown) {
    console.error("Error fetching weather data:", err);
    let errorMessage = "An unknown error occurred.";
    if (err instanceof Error) {
        errorMessage = err.message;
    }
    throw new Error(`Failed to load weather data. Please try again. ${errorMessage}`);
  }
}