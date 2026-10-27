"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Camera,
  Upload,
  ImageIcon,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Bug,
  Leaf,
  Shield,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DetectionResult {
  id: string
  confidence: number
  pestName: string
  scientificName: string
  severity: "low" | "medium" | "high"
  description: string
  symptoms: string[]
  treatment: {
    organic: string[]
    chemical: string[]
    preventive: string[]
  }
  affectedCrops: string[]
  seasonality: string
}

interface AnalysisHistory {
  id: string
  imageUrl: string
  timestamp: Date
  result: DetectionResult | null
  status: "analyzing" | "completed" | "failed"
}

const mockDetectionResults: DetectionResult[] = [
  {
    id: "aphid-detection",
    confidence: 92,
    pestName: "Green Aphids",
    scientificName: "Myzus persicae",
    severity: "medium",
    description: "Small, soft-bodied insects that feed on plant sap, causing yellowing and curling of leaves.",
    symptoms: ["Yellowing leaves", "Curled leaf edges", "Sticky honeydew on leaves", "Stunted growth"],
    treatment: {
      organic: [
        "Spray neem oil solution (5ml per liter)",
        "Release ladybugs as natural predators",
        "Use insecticidal soap spray",
        "Apply diatomaceous earth around plants",
      ],
      chemical: [
        "Imidacloprid 17.8% SL @ 0.3ml/liter",
        "Thiamethoxam 25% WG @ 0.2g/liter",
        "Acetamiprid 20% SP @ 0.2g/liter",
      ],
      preventive: [
        "Maintain proper plant spacing",
        "Avoid over-fertilization with nitrogen",
        "Regular monitoring and early detection",
        "Remove weeds that harbor aphids",
      ],
    },
    affectedCrops: ["Tomato", "Potato", "Cabbage", "Mustard", "Wheat"],
    seasonality: "Most active during cool, dry weather (October-March)",
  },
]

export default function PestDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DetectionResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    setAnalysisResult(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleImageSelect(file)
    }
  }

  const handleCameraCapture = () => {
    
    fileInputRef.current?.click()
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)

    
    const historyItem: AnalysisHistory = {
      id: Date.now().toString(),
      imageUrl: imagePreview!,
      timestamp: new Date(),
      result: null,
      status: "analyzing",
    }
    setAnalysisHistory((prev) => [historyItem, ...prev])

    
    setTimeout(() => {
      const result = mockDetectionResults[0]
      setAnalysisResult(result)
      setIsAnalyzing(false)

      
      setAnalysisHistory((prev) =>
        prev.map((item) => (item.id === historyItem.id ? { ...item, result, status: "completed" as const } : item)),
      )
    }, 3000)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
       
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bug className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Pest Detection</h1>
                <p className="text-xs text-muted-foreground">AI-powered crop analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
         
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Crop Image
            </CardTitle>
            <CardDescription>Take a photo or upload an image of your crop to detect pests and diseases</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              capture="environment"
            />

            {!imagePreview ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Upload Crop Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Take a clear photo of the affected plant parts for accurate detection
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleCameraCapture} className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Uploaded crop image"
                    width={400}
                    height={300}
                    className="w-full max-w-md mx-auto rounded-lg object-cover"
                  />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button onClick={analyzeImage} disabled={isAnalyzing} className="flex items-center gap-2" size="lg">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bug className="w-4 h-4" />
                        Analyze for Pests
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

         
        {isAnalyzing && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Analyzing Your Crop Image</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI is examining the image for pests, diseases, and other issues...
                </p>
                <Progress value={66} className="w-full max-w-sm mx-auto" />
              </div>
            </CardContent>
          </Card>
        )}

         
        {analysisResult && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Detection Results
                </CardTitle>
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {analysisResult.severity.toUpperCase()} SEVERITY
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                 
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{analysisResult.pestName}</h3>
                    <Badge variant="outline" className="text-sm">
                      {analysisResult.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-2">{analysisResult.scientificName}</p>
                  <p className="text-sm">{analysisResult.description}</p>
                </div>

                 
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Symptoms Detected
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.symptoms.map((symptom, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        {symptom}
                      </div>
                    ))}
                  </div>
                </div>

                 
                <Tabs defaultValue="organic" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="organic">Organic</TabsTrigger>
                    <TabsTrigger value="chemical">Chemical</TabsTrigger>
                    <TabsTrigger value="preventive">Prevention</TabsTrigger>
                  </TabsList>

                  <TabsContent value="organic">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          Organic Treatment
                        </CardTitle>
                        <CardDescription>Eco-friendly solutions for pest control</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.treatment.organic.map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {treatment}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="chemical">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          Chemical Treatment
                        </CardTitle>
                        <CardDescription>Fast-acting chemical solutions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.treatment.chemical.map((treatment, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {treatment}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            <strong>Warning:</strong> Always follow label instructions and safety precautions when using
                            chemical pesticides.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preventive">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-500" />
                          Prevention Measures
                        </CardTitle>
                        <CardDescription>Prevent future infestations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.treatment.preventive.map((prevention, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                              {prevention}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Affected Crops</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {analysisResult.affectedCrops.map((crop, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Seasonality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{analysisResult.seasonality}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

         
        {analysisHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Analysis</CardTitle>
              <CardDescription>Your previous pest detection results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisHistory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt="Analyzed crop"
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.status === "analyzing" && (
                          <Badge variant="outline" className="text-xs">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Analyzing
                          </Badge>
                        )}
                        {item.status === "completed" && item.result && (
                          <Badge className={getSeverityColor(item.result.severity)}>{item.result.pestName}</Badge>
                        )}
                        {item.status === "failed" && (
                          <Badge variant="destructive" className="text-xs">
                            Analysis Failed
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
