"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Search,
  MapPin,
  Calendar,
  BarChart3,
  RefreshCw,
  Bell,
  Star,
} from "lucide-react"
import Link from "next/link"

interface MarketPrice {
  id: string
  crop: string
  variety: string
  market: string
  district: string
  state: string
  price: number
  unit: string
  date: string
  change: number
  changePercent: number
  quality: "Premium" | "Good" | "Average"
  minPrice: number
  maxPrice: number
}

interface PriceAlert {
  id: string
  crop: string
  targetPrice: number
  currentPrice: number
  market: string
  isActive: boolean
  alertType: "above" | "below"
}

const mockMarketData: MarketPrice[] = [
  {
    id: "1",
    crop: "Wheat",
    variety: "HD-2967",
    market: "Ludhiana Mandi",
    district: "Ludhiana",
    state: "Punjab",
    price: 2150,
    unit: "per quintal",
    date: "2024-01-15",
    change: 50,
    changePercent: 2.38,
    quality: "Premium",
    minPrice: 2100,
    maxPrice: 2200,
  },
  {
    id: "2",
    crop: "Rice",
    variety: "Basmati 1121",
    market: "Karnal Mandi",
    district: "Karnal",
    state: "Haryana",
    price: 4200,
    unit: "per quintal",
    date: "2024-01-15",
    change: -100,
    changePercent: -2.33,
    quality: "Premium",
    minPrice: 4000,
    maxPrice: 4300,
  },
  {
    id: "3",
    crop: "Tomato",
    variety: "Hybrid",
    market: "Azadpur Mandi",
    district: "Delhi",
    state: "Delhi",
    price: 1800,
    unit: "per quintal",
    date: "2024-01-15",
    change: 200,
    changePercent: 12.5,
    quality: "Good",
    minPrice: 1500,
    maxPrice: 2000,
  },
  {
    id: "4",
    crop: "Onion",
    variety: "Red",
    market: "Nashik Mandi",
    district: "Nashik",
    state: "Maharashtra",
    price: 1200,
    unit: "per quintal",
    date: "2024-01-15",
    change: -50,
    changePercent: -4.0,
    quality: "Good",
    minPrice: 1100,
    maxPrice: 1300,
  },
  {
    id: "5",
    crop: "Cotton",
    variety: "Bt Cotton",
    market: "Guntur Mandi",
    district: "Guntur",
    state: "Andhra Pradesh",
    price: 6800,
    unit: "per quintal",
    date: "2024-01-15",
    change: 150,
    changePercent: 2.26,
    quality: "Premium",
    minPrice: 6500,
    maxPrice: 7000,
  },
  {
    id: "6",
    crop: "Sugarcane",
    variety: "Co-86032",
    market: "Muzaffarnagar Mandi",
    district: "Muzaffarnagar",
    state: "Uttar Pradesh",
    price: 350,
    unit: "per quintal",
    date: "2024-01-15",
    change: 10,
    changePercent: 2.94,
    quality: "Good",
    minPrice: 340,
    maxPrice: 360,
  },
]

const mockPriceAlerts: PriceAlert[] = [
  {
    id: "1",
    crop: "Wheat",
    targetPrice: 2200,
    currentPrice: 2150,
    market: "Ludhiana Mandi",
    isActive: true,
    alertType: "above",
  },
  {
    id: "2",
    crop: "Rice",
    targetPrice: 4000,
    currentPrice: 4200,
    market: "Karnal Mandi",
    isActive: true,
    alertType: "below",
  },
]

export default function MarketPricePage() {
  const [marketData, setMarketData] = useState<MarketPrice[]>(mockMarketData)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(mockPriceAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [selectedCrop, setSelectedCrop] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredData = marketData.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.market.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === "all" || item.state === selectedState
    const matchesCrop = selectedCrop === "all" || item.crop === selectedCrop
    return matchesSearch && matchesState && matchesCrop
  })

  const refreshPrices = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Premium":
        return "bg-green-100 text-green-800 border-green-200"
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Average":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const uniqueStates = Array.from(new Set(marketData.map((item) => item.state)))
  const uniqueCrops = Array.from(new Set(marketData.map((item) => item.crop)))

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
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">Market Prices</h1>
                  <p className="text-xs text-muted-foreground">Live crop prices across India</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={refreshPrices} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search crops or markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select Crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {uniqueCrops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="prices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prices">Current Prices</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="prices">
            {/* Market Prices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.crop}</CardTitle>
                        <CardDescription className="text-sm">{item.variety}</CardDescription>
                      </div>
                      <Badge className={getQualityColor(item.quality)}>{item.quality}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">₹{item.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{item.unit}</div>
                      </div>

                      {/* Price Change */}
                      <div className="flex items-center justify-center gap-2">
                        {item.change > 0 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">+₹{item.change}</span>
                            <span className="text-xs">({item.changePercent}%)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-sm font-medium">₹{item.change}</span>
                            <span className="text-xs">({item.changePercent}%)</span>
                          </div>
                        )}
                      </div>

                      {/* Price Range */}
                      <div className="text-center text-xs text-muted-foreground">
                        Range: ₹{item.minPrice} - ₹{item.maxPrice}
                      </div>

                      {/* Market Info */}
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.market}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Star className="w-3 h-3 mr-1" />
                            Watch
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Bell className="w-3 h-3 mr-1" />
                            Alert
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or filters to find market prices.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-4">
              {/* Create New Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create Price Alert</CardTitle>
                  <CardDescription>Get notified when crop prices reach your target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueCrops.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Target Price (₹)" type="number" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Alert Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above Target</SelectItem>
                        <SelectItem value="below">Below Target</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Price Alerts</CardTitle>
                  <CardDescription>Your current price monitoring alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {priceAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {priceAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{alert.crop}</span>
                              <Badge variant="outline" className="text-xs">
                                {alert.alertType === "above" ? "Above" : "Below"} ₹{alert.targetPrice}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current: ₹{alert.currentPrice} • {alert.market}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                alert.isActive
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }
                            >
                              {alert.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Active Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your first price alert to get notified about market changes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
