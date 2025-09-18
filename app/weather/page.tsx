"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  Eye,
  Gauge,
  AlertTriangle,
  MapPin,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface WeatherData {
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    visibility: number
    pressure: number
    uvIndex: number
    feelsLike: number
  }
  forecast: Array<{
    date: string
    day: string
    high: number
    low: number
    condition: string
    precipitation: number
    humidity: number
  }>
  alerts: Array<{
    id: string
    type: "warning" | "advisory" | "watch"
    title: string
    description: string
    severity: "low" | "medium" | "high"
    validUntil: string
  }>
  farmingAdvice: Array<{
    activity: string
    recommendation: string
    priority: "low" | "medium" | "high"
  }>
}

const mockWeatherData: WeatherData = {
  current: {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    uvIndex: 7,
    feelsLike: 31,
  },
  forecast: [
    { date: "2024-01-15", day: "Today", high: 30, low: 18, condition: "Sunny", precipitation: 0, humidity: 60 },
    {
      date: "2024-01-16",
      day: "Tomorrow",
      high: 32,
      low: 20,
      condition: "Partly Cloudy",
      precipitation: 10,
      humidity: 65,
    },
    { date: "2024-01-17", day: "Wednesday", high: 29, low: 19, condition: "Cloudy", precipitation: 40, humidity: 75 },
    { date: "2024-01-18", day: "Thursday", high: 26, low: 17, condition: "Rain", precipitation: 80, humidity: 85 },
    { date: "2024-01-19", day: "Friday", high: 24, low: 16, condition: "Heavy Rain", precipitation: 90, humidity: 90 },
    {
      date: "2024-01-20",
      day: "Saturday",
      high: 27,
      low: 18,
      condition: "Partly Cloudy",
      precipitation: 20,
      humidity: 70,
    },
    { date: "2024-01-21", day: "Sunday", high: 29, low: 19, condition: "Sunny", precipitation: 5, humidity: 65 },
  ],
  alerts: [
    {
      id: "1",
      type: "warning",
      title: "Heavy Rain Expected",
      description:
        "Heavy rainfall expected from Thursday to Friday. Prepare for potential flooding in low-lying areas.",
      severity: "high",
      validUntil: "2024-01-19T23:59:59Z",
    },
    {
      id: "2",
      type: "advisory",
      title: "High UV Index",
      description: "UV index will be high today. Limit outdoor activities during peak hours (11 AM - 3 PM).",
      severity: "medium",
      validUntil: "2024-01-15T18:00:00Z",
    },
  ],
  farmingAdvice: [
    {
      activity: "Irrigation",
      recommendation: "Reduce watering schedule due to expected rainfall on Thursday-Friday",
      priority: "high",
    },
    {
      activity: "Harvesting",
      recommendation: "Complete harvesting of ready crops before Thursday's rain",
      priority: "high",
    },
    {
      activity: "Spraying",
      recommendation: "Avoid pesticide application during windy conditions (>15 km/h)",
      priority: "medium",
    },
    {
      activity: "Field Work",
      recommendation: "Plan field activities for early morning or evening to avoid high UV",
      priority: "low",
    },
  ],
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="w-6 h-6 text-yellow-500" />
    case "partly cloudy":
      return <Cloud className="w-6 h-6 text-gray-500" />
    case "cloudy":
      return <Cloud className="w-6 h-6 text-gray-600" />
    case "rain":
    case "heavy rain":
      return <CloudRain className="w-6 h-6 text-blue-500" />
    default:
      return <Sun className="w-6 h-6 text-yellow-500" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refreshWeather = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">Weather & Alerts</h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Punjab, India</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={refreshWeather} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Active Alerts
            </h2>
            <div className="space-y-3">
              {weatherData.alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    alert.severity === "high"
                      ? "border-l-red-500"
                      : alert.severity === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-blue-500"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.type.toUpperCase()}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Valid until {new Date(alert.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Weather</CardTitle>
              <div className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Weather Info */}
              <div className="flex items-center gap-4">
                {getWeatherIcon(weatherData.current.condition)}
                <div>
                  <div className="text-3xl font-bold text-foreground">{weatherData.current.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">{weatherData.current.condition}</div>
                  <div className="text-xs text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">{weatherData.current.humidity}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">{weatherData.current.windSpeed} km/h</div>
                    <div className="text-xs text-muted-foreground">Wind Speed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{weatherData.current.visibility} km</div>
                    <div className="text-xs text-muted-foreground">Visibility</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-medium">{weatherData.current.pressure} mb</div>
                    <div className="text-xs text-muted-foreground">Pressure</div>
                  </div>
                </div>
              </div>
            </div>

            {/* UV Index */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">UV Index</span>
                <span className="text-sm font-bold">{weatherData.current.uvIndex}/10</span>
              </div>
              <Progress value={weatherData.current.uvIndex * 10} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {weatherData.current.uvIndex >= 8
                  ? "Very High - Avoid sun exposure"
                  : weatherData.current.uvIndex >= 6
                    ? "High - Use sun protection"
                    : weatherData.current.uvIndex >= 3
                      ? "Moderate - Some protection needed"
                      : "Low - Minimal protection needed"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Forecast and Farming Advice */}
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="farming">Farming Advice</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">7-Day Weather Forecast</CardTitle>
                <CardDescription>Plan your farming activities based on upcoming weather</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(day.condition)}
                        <div>
                          <div className="font-medium text-sm">{day.day}</div>
                          <div className="text-xs text-muted-foreground">{day.condition}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span>{day.precipitation}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-gray-500" />
                          <span>{day.humidity}%</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{day.high}°</div>
                          <div className="text-xs text-muted-foreground">{day.low}°</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farming">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weather-Based Farming Advice</CardTitle>
                <CardDescription>Recommendations based on current and forecasted weather</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherData.farmingAdvice.map((advice, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          advice.priority === "high"
                            ? "bg-red-500"
                            : advice.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{advice.activity}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              advice.priority === "high"
                                ? "border-red-200 text-red-700"
                                : advice.priority === "medium"
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-green-200 text-green-700"
                            }`}
                          >
                            {advice.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{advice.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
