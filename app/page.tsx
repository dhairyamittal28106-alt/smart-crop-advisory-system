'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Link from "next/link"
import { useState } from 'react'

export default function CropAdvisoryDashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLanguageSelect={() => setShowLanguageSelector(true)}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="rounded-lg bg-muted/50 p-6 border">
            <h2 className="text-3xl font-bold mb-2">Welcome, Farmer!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Get personalized crop advice, weather updates, and market prices to make informed farming decisions.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <span className="mr-1">👥</span>
                Trusted by farmers
              </Badge>
              <Badge variant="outline">
                <span className="mr-1">📈</span>
                Better yields
              </Badge>
              <Badge variant="outline">
                <span className="mr-1">⭐</span>
                4.8/5 rating
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Crop Advisory */}
          <Link href="/advisory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-primary-foreground">💬</span>
                </div>
                <CardTitle>Crop Advisory</CardTitle>
                <CardDescription>Get personalized recommendations for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Start Advisory Chat
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Weather Updates */}
          <Link href="/weather">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-white">🌧️</span>
                </div>
                <CardTitle>Weather Alerts</CardTitle>
                <CardDescription>Real-time weather updates and forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  View Weather
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Market Prices */}
          <Link href="/market">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-white">📊</span>
                </div>
                <CardTitle>Market Prices</CardTitle>
                <CardDescription>Current market rates for crops in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Check Prices
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Pest Detection */}
          <Link href="/pest-detection">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-white">📷</span>
                </div>
                <CardTitle>Pest Detection</CardTitle>
                <CardDescription>Upload crop photos to identify pests and diseases</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Scan Crop
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Voice Assistant */}
          <Link href="/voice">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-white">🎤</span>
                </div>
                <CardTitle>Voice Assistant</CardTitle>
                <CardDescription>Ask questions in your local language using voice</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <span className="mr-2">🎤</span>
                  Start Voice Chat
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Quick Tips */}
          <Link href="/quick-tips">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl text-white">🌿</span>
                </div>
                <CardTitle>Daily Tips</CardTitle>
                <CardDescription>Seasonal farming tips and best practices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  View Tips
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground">💬</span>
                </div>
                <div>
                  <p className="font-medium">Crop Advisory Session</p>
                  <p className="text-sm text-muted-foreground">
                    Received recommendations for wheat fertilization - 2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">🌧️</span>
                </div>
                <div>
                  <p className="font-medium">Weather Alert</p>
                  <p className="text-sm text-muted-foreground">Rain expected in next 3 days - Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white">📊</span>
                </div>
                <div>
                  <p className="font-medium">Market Update</p>
                  <p className="text-sm text-muted-foreground">
                    Wheat prices increased by 5% in local market - 3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link href="/advisory">
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <span>💬</span>
                <span className="text-xs">Advisory</span>
              </Button>
            </Link>
            <Link href="/weather">
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <span>🌧️</span>
                <span className="text-xs">Weather</span>
              </Button>
            </Link>
            <Link href="/market">
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <span>📊</span>
                <span className="text-xs">Market</span>
              </Button>
            </Link>
            <Link href="/pest-detection">
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <span>📷</span>
                <span className="text-xs">Scan</span>
              </Button>
            </Link>
            <Link href="/voice">
              <Button variant="ghost" size="sm" className="flex-col gap-1 h-auto py-2">
                <span>🎤</span>
                <span className="text-xs">Voice</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  )
}
