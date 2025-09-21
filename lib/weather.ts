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

export async function fetchWeatherData(): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
  if (!apiKey) throw new Error("API key missing!")

  // Get user location
  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  )

  const { latitude, longitude } = position.coords

  // Fetch data from OpenWeatherMap
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,hourly&appid=${apiKey}`
  )

  if (!res.ok) throw new Error("Failed to fetch weather")
  const data = await res.json()

  return {
    current: {
      temperature: Math.round(data.current.temp),
      condition: data.current.weather[0].description,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_speed,
      visibility: data.current.visibility ? data.current.visibility / 1000 : 10,
      pressure: data.current.pressure,
      uvIndex: data.current.uvi,
      feelsLike: data.current.feels_like,
      lastUpdated: new Date().toISOString(),
    },
    forecast: data.daily.slice(0, 7).map((day: any) => ({
      day: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
      condition: day.weather[0].description,
      high: Math.round(day.temp.max),
      low: Math.round(day.temp.min),
      precipitation: day.pop ? Math.round(day.pop * 100) : 0,
      humidity: day.humidity,
    })),
    alerts:
      data.alerts?.map((alert: any, index: number) => ({
        id: String(index),
        type: alert.event || "Weather Alert",
        title: alert.event || "Alert",
        description: alert.description,
        severity: "high", // You can map based on alert event
        validUntil: new Date(alert.end * 1000).toISOString(),
      })) || [],
    farmingAdvice: [
      {
        activity: "Irrigation",
        recommendation: data.current.uvi > 7 ? "Avoid irrigation during peak sunlight" : "Safe to irrigate crops",
        priority: data.current.uvi > 7 ? "high" : "low",
      },
      {
        activity: "Pesticide Spray",
        recommendation: data.daily[0].pop > 0.5 ? "Avoid spraying due to rain chances" : "Good day for spraying",
        priority: data.daily[0].pop > 0.5 ? "high" : "medium",
      },
    ],
    location: {
      name: "Your Location",
      region: "",
      country: "",
    },
  }
}
<<<<<<< HEAD
=======

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
>>>>>>> 89c72d78388868337433b2abc47355f59b1726bc
