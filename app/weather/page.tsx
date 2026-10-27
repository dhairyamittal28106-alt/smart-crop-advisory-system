"use client"

import { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { fetchWeatherData, WeatherData } from "@/lib/weather"



const defaultWeatherData: WeatherData = {
  current: {
    temperature: 0,
    condition: "Loading...",
    humidity: 0,
    windSpeed: 0,
    visibility: 0,
    pressure: 0,
    uvIndex: 0,
    feelsLike: 0,
    lastUpdated: new Date().toISOString(),
  },
  forecast: [],
  alerts: [],
  farmingAdvice: [],
  location: {
    name: "Punjab",
    region: "Punjab",
    country: "India",
  },
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase()
  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return <Sun className="w-6 h-6 text-yellow-500" />
  } else if (conditionLower.includes("partly cloudy") || conditionLower.includes("partly")) {
    return <Cloud className="w-6 h-6 text-gray-500" />
  } else if (conditionLower.includes("cloudy") || conditionLower.includes("overcast")) {
    return <Cloud className="w-6 h-6 text-gray-600" />
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle") || conditionLower.includes("shower")) {
    return <CloudRain className="w-6 h-6 text-blue-500" />
  } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
    return <CloudRain className="w-6 h-6 text-blue-300" />
  } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return <Cloud className="w-6 h-6 text-gray-400" />
  } else {
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
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const refreshInterval = 10 * 60 * 1000 

  const loadWeatherData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchWeatherData()
      setWeatherData(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load weather data:', err)
      setError('Failed to load weather data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshWeather = async () => {
    await loadWeatherData()
  }

  
  useEffect(() => {
    loadWeatherData()
  }, [])

  
  useEffect(() => {
    const interval = setInterval(() => {
      loadWeatherData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return (
    <div className="min-h-screen bg-background">
       
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
                    <span>{weatherData.location.name}, {weatherData.location.country}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={refreshWeather} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
         
        {error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Error Loading Weather Data</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshWeather}
                  className="mt-2"
                  disabled={isLoading}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

         
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

         
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Weather</CardTitle>
              <div className="text-xs text-muted-foreground">
                {isLoading ? "Loading..." : `Last updated: ${new Date(weatherData.current.lastUpdated).toLocaleTimeString()}`}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading weather data...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(weatherData.current.condition)}
                    <div>
                      <div className="text-3xl font-bold text-foreground">{weatherData.current.temperature}°C</div>
                      <div className="text-sm text-muted-foreground">{weatherData.current.condition}</div>
                      <div className="text-xs text-muted-foreground">Feels like {weatherData.current.feelsLike}°C</div>
                    </div>
                  </div>

                   
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
              </>
            )}
          </CardContent>
        </Card>

         
        <Tabs defaultValue="forecast" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forecast">6-Day Forecast</TabsTrigger>
            <TabsTrigger value="farming">Farming Advice</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">6-Day Weather Forecast</CardTitle>
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
