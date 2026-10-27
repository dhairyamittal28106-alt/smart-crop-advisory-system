'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Link from "next/link"
import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"

export default function CropAdvisoryDashboard() {
  const [showStartupModal, setShowStartupModal] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndShowStartupModal = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        
        if (!user) {
          
          setTimeout(() => {
            setShowStartupModal(true)
          }, 1000)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        
        setTimeout(() => {
          setShowStartupModal(true)
        }, 1000)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndShowStartupModal()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLanguageSelect={() => setShowLanguageSelector(true)}
        showStartupModal={showStartupModal}
        onStartupModalClose={() => setShowStartupModal(false)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-emerald-900 dark:to-emerald-950 rounded-2xl p-8 border-0 shadow-sm">
            <h2 className="text-3xl font-bold mb-2 text-primary">Welcome, Farmer!</h2>
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
           
          <Link href="/advisory">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="icon-supermoney bg-gradient-to-br from-green-600 to-green-700 mb-2">
                  <span className="text-xl">💬</span>
                </div>
                <CardTitle className="text-lg font-semibold">Crop Advisory</CardTitle>
                <CardDescription>Get personalized recommendations for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-200">
                  Start Advisory Chat
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

           
          <Link href="/weather">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                  <span className="text-xl text-white">🌧️</span>
                </div>
                <CardTitle className="text-lg font-semibold">Weather Alerts</CardTitle>
                <CardDescription>Real-time weather updates and forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-emerald-600 rounded-xl">
                  View Weather
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

           
          <Link href="/market">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                  <span className="text-xl text-white">📊</span>
                </div>
                <CardTitle className="text-lg font-semibold">Market Prices</CardTitle>
                <CardDescription>Current market rates for crops in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-emerald-600 rounded-xl">
                  Check Prices
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

           
          <Link href="/pest-detection">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                  <span className="text-xl text-white">📷</span>
                </div>
                <CardTitle className="text-lg font-semibold">Pest Detection</CardTitle>
                <CardDescription>Upload crop photos to identify pests and diseases</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-emerald-600 rounded-xl">
                  Scan Crop
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

           
          <Link href="/voice">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                  <span className="text-xl text-white">🎤</span>
                </div>
                <CardTitle className="text-lg font-semibold">Voice Assistant</CardTitle>
                <CardDescription>Ask questions in your local language using voice</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-emerald-600 rounded-xl">
                  <span className="mr-2">🎤</span>
                  Start Voice Chat
                </Button>
              </CardContent>
            </Card>
          </Link>

           
          <Link href="/quick-tips">
            <Card className="card-supermoney cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2 shadow-md">
                  <span className="text-xl text-white">🌿</span>
                </div>
                <CardTitle className="text-lg font-semibold">Daily Tips</CardTitle>
                <CardDescription>Seasonal farming tips and best practices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white dark:hover:bg-emerald-600 rounded-xl">
                  View Tips
                  <span className="ml-2">→</span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="card-supermoney">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="icon-supermoney-sm bg-gradient-to-br from-green-600 to-green-700">
                  <span>💬</span>
                </div>
                <div>
                  <p className="font-medium">Crop Advisory Session</p>
                  <p className="text-sm text-muted-foreground">
                    Received recommendations for wheat fertilization - 2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="icon-supermoney bg-gradient-to-br from-blue-500 to-blue-600">
                  <span>🌧️</span>
                </div>
                <div>
                  <p className="font-medium">Weather Alert</p>
                  <p className="text-sm text-muted-foreground">Rain expected in next 3 days - Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <div className="icon-supermoney bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <span>📊</span>
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
