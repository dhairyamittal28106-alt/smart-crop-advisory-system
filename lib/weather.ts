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
