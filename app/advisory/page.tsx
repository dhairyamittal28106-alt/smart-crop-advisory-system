"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Mic, MicOff, User, Bot, MapPin, Thermometer, Droplets } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  metadata?: {
    location?: string
    weather?: string
    soilType?: string
  }
}

interface QuickQuestion {
  id: string
  text: string
  category: "fertilizer" | "pest" | "weather" | "general"
}

const quickQuestions: QuickQuestion[] = [
  { id: "1", text: "What fertilizer should I use for wheat?", category: "fertilizer" },
  { id: "2", text: "How to control aphids in my crop?", category: "pest" },
  { id: "3", text: "When should I water my plants?", category: "weather" },
  { id: "4", text: "Best time to harvest tomatoes?", category: "general" },
  { id: "5", text: "Soil preparation for monsoon season", category: "general" },
  { id: "6", text: "Organic pest control methods", category: "pest" },
]

export default function CropAdvisoryChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "Namaste! I'm your crop advisory assistant. I can help you with farming advice, pest control, fertilizer recommendations, and more. What would you like to know about your crops today?",
      timestamp: new Date(),
      metadata: {
        location: "Punjab, India",
        weather: "Sunny, 28°C",
        soilType: "Alluvial",
      },
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const botResponse = generateBotResponse(message)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date(),
        metadata: {
          location: "Punjab, India",
          weather: "Sunny, 28°C",
        },
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("wheat") && message.includes("fertilizer")) {
      return "For wheat cultivation, I recommend:\n\n🌾 **NPK Fertilizer**: Use 120:60:40 kg/hectare (N:P:K)\n🌾 **Timing**: Apply 1/3 nitrogen at sowing, 1/3 at first irrigation, 1/3 at second irrigation\n🌾 **Organic option**: Well-decomposed farmyard manure (5-10 tons/hectare)\n\nBased on your soil type (Alluvial) and current weather conditions, this should give you optimal results. Would you like specific brand recommendations?"
    }

    if (message.includes("pest") || message.includes("aphid")) {
      return "For pest control, here are my recommendations:\n\n🐛 **Immediate action**: Spray neem oil solution (5ml/liter water)\n🐛 **Organic method**: Release ladybugs or lacewings as natural predators\n🐛 **Chemical option**: Use imidacloprid 17.8% SL @ 0.3ml/liter (if infestation is severe)\n🐛 **Prevention**: Maintain proper plant spacing and avoid over-fertilization\n\nMonitor your crops daily and apply treatment in early morning or evening. Need help identifying specific pests?"
    }

    if (message.includes("water") || message.includes("irrigation")) {
      return "Based on current weather (28°C, Sunny), here's your watering guide:\n\n💧 **Frequency**: Water every 2-3 days during this weather\n💧 **Best time**: Early morning (5-7 AM) or evening (6-8 PM)\n💧 **Amount**: 2-3 inches per week for most crops\n💧 **Check soil**: Insert finger 2 inches deep - if dry, it's time to water\n\nWith the sunny weather, your crops will need consistent moisture. Mulching can help retain water. What crops are you growing?"
    }

    if (message.includes("tomato") && message.includes("harvest")) {
      return "Perfect timing for tomato harvest advice!\n\n🍅 **Ripeness signs**: Fruits turn from green to pink/red, slightly soft to touch\n🍅 **Best time**: Early morning when temperatures are cool\n🍅 **Storage**: Pick slightly underripe for longer storage, fully ripe for immediate use\n🍅 **Yield**: Expect 15-20 kg per plant with proper care\n\nIn current weather conditions, check your tomatoes daily as they ripen quickly. Store in cool, dry place. Need post-harvest handling tips?"
    }

    return "Thank you for your question! Based on your location (Punjab) and current weather conditions, I'd be happy to help. Could you provide more specific details about:\n\n• What crop are you growing?\n• What specific issue are you facing?\n• How large is your farming area?\n\nThis will help me give you more targeted advice for your farming needs."
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice input functionality would be implemented here
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Crop Advisory</h1>
                <p className="text-xs text-muted-foreground">AI-powered farming assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Context Info */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Punjab, India</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">28°C Sunny</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Alluvial Soil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-4 py-4 pb-32">
        <ScrollArea className="h-[calc(100vh-280px)]" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Questions:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickQuestions.map((question) => (
                <Button
                  key={question.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3 bg-transparent"
                  onClick={() => handleQuickQuestion(question.text)}
                >
                  <span className="text-xs">{question.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about crops, fertilizers, pests, weather..."
                className="pr-12"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputMessage)
                  }
                }}
                disabled={isLoading}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={toggleVoiceInput}
              >
                {isListening ? <MicOff className="w-4 h-4 text-destructive" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {isListening && (
            <div className="mt-2 text-center">
              <Badge variant="destructive" className="animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                Listening...
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
