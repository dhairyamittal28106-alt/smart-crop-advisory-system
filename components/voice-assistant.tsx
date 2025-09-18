"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface VoiceAssistantProps {
  onVoiceInput?: (text: string) => void
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
}

const languages = {
  english: { name: "English", code: "en-US" },
  hindi: { name: "हिंदी", code: "hi-IN" },
  tamil: { name: "தமிழ்", code: "ta-IN" },
  telugu: { name: "తెలుగు", code: "te-IN" },
  kannada: { name: "ಕನ್ನಡ", code: "kn-IN" },
  marathi: { name: "मराठी", code: "mr-IN" },
  gujarati: { name: "ગુજરાતી", code: "gu-IN" },
  punjabi: { name: "ਪੰਜਾਬੀ", code: "pa-IN" },
  bengali: { name: "বাংলা", code: "bn-IN" },
}

export function VoiceAssistant({ onVoiceInput, currentLanguage = "english", onLanguageChange }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [userLanguage, setUserLanguage] = useState(currentLanguage)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    const loadUserLanguage = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("language_preference")
          .eq("id", user.id)
          .single()

        if (profile?.language_preference) {
          setUserLanguage(profile.language_preference)
          onLanguageChange?.(profile.language_preference)
        }
      }
    }

    loadUserLanguage()
  }, [onLanguageChange])

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const speechSynthesis = window.speechSynthesis

      if (SpeechRecognition && speechSynthesis) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        synthRef.current = speechSynthesis

        // Configure speech recognition
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = languages[userLanguage as keyof typeof languages]?.code || "en-US"

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript
          setTranscript(transcript)

          if (event.results[current].isFinal) {
            onVoiceInput?.(transcript)
            setTranscript("")
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [userLanguage, onVoiceInput])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = languages[userLanguage as keyof typeof languages]?.code || "en-US"
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = languages[userLanguage as keyof typeof languages]?.code || "en-US"
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleLanguageChange = async (newLanguage: string) => {
    setUserLanguage(newLanguage)
    onLanguageChange?.(newLanguage)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase.from("profiles").update({ language_preference: newLanguage }).eq("id", user.id)

      if (error) {
        console.error("Error updating language preference:", error)
      }
    }
  }

  if (!isSupported) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <p className="text-sm text-orange-700">Voice features are not supported in your browser.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">Voice Assistant</span>
          </div>
          <Select value={userLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-40 border-green-200 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([key, lang]) => (
                <SelectItem key={key} value={key}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            className="flex items-center gap-2"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Stop Listening" : "Start Voice Input"}
          </Button>

          <Button
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            onClick={
              isSpeaking ? stopSpeaking : () => speak("Hello, I am your farming assistant. How can I help you today?")
            }
            className="flex items-center gap-2"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? "Stop Speaking" : "Test Voice"}
          </Button>
        </div>

        {isListening && (
          <div className="mb-4">
            <Badge variant="secondary" className="animate-pulse">
              Listening...
            </Badge>
            {transcript && <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border">{transcript}</p>}
          </div>
        )}

        {isSpeaking && (
          <Badge variant="secondary" className="animate-pulse">
            Speaking...
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
