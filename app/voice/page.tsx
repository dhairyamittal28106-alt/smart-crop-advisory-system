"use client"

import { useState } from "react"
import { VoiceAssistant } from "@/components/voice-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MessageSquare, Volume2, Languages } from "lucide-react"

const voiceCommands = {
  english: [
    "What crops should I plant this season?",
    "How is the weather today?",
    "Show me market prices",
    "Help with pest control",
    "Give me farming advice",
  ],
  hindi: [
    "इस मौसम में कौन सी फसल लगानी चाहिए?",
    "आज मौसम कैसा है?",
    "बाजार के भाव दिखाओ",
    "कीट नियंत्रण में मदद करो",
    "खेती की सलाह दो",
  ],
  tamil: [
    "இந்த பருவத்தில் என்ன பயிர் நடவு செய்ய வேண்டும்?",
    "இன்று வானிலை எப்படி உள்ளது?",
    "சந்தை விலைகளைக் காட்டு",
    "பூச்சி கட்டுப்பாட்டில் உதவி",
    "விவசாய ஆலோசனை கொடு",
  ],
  telugu: [
    "ఈ సీజన్‌లో ఏ పంటలు పండించాలి?",
    "ఈరోజు వాతావరణం ఎలా ఉంది?",
    "మార్కెట్ ధరలు చూపించు",
    "పురుగుల నియంత్రణలో సహాయం",
    "వ్యవసాయ సలహా ఇవ్వు",
  ],
}

export default function VoicePage() {
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [voiceHistory, setVoiceHistory] = useState<Array<{ text: string; timestamp: Date; language: string }>>([])
  const [lastResponse, setLastResponse] = useState("")

  const handleVoiceInput = (text: string) => {
    setVoiceHistory((prev) => [...prev, { text, timestamp: new Date(), language: currentLanguage }])

    // Simulate AI response based on voice input
    let response = ""
    const lowerText = text.toLowerCase()

    if (
      lowerText.includes("weather") ||
      lowerText.includes("मौसम") ||
      lowerText.includes("வானிலை") ||
      lowerText.includes("వాతావరణం")
    ) {
      response =
        currentLanguage === "hindi"
          ? "आज का मौसम अच्छा है। तापमान 28 डिग्री है और हल्की बारिश की संभावना है।"
          : currentLanguage === "tamil"
            ? "இன்றைய வானிலை நல்லது. வெப்பநிலை 28 டிகிரி மற்றும் லேசான மழைக்கு வாய்ப்பு உள்ளது."
            : currentLanguage === "telugu"
              ? "ఈరోజు వాతావరణం బాగుంది. ఉష్ణోగ్రత 28 డిగ్రీలు మరియు తేలికపాటి వర్షాలకు అవకాశం ఉంది."
              : "Today's weather is good. Temperature is 28°C with chances of light rain."
    } else if (
      lowerText.includes("crop") ||
      lowerText.includes("फसल") ||
      lowerText.includes("பயிர்") ||
      lowerText.includes("పంట")
    ) {
      response =
        currentLanguage === "hindi"
          ? "इस मौसम में धान, मक्का और सब्जियां उगाना अच्छा रहेगा।"
          : currentLanguage === "tamil"
            ? "இந்த பருவத்தில் நெல், சோளம் மற்றும் காய்கறிகள் வளர்ப்பது நல்லது."
            : currentLanguage === "telugu"
              ? "ఈ సీజన్‌లో వరి, మొక్కజొన్న మరియు కూరగాయలు పండించడం మంచిది."
              : "This season is good for growing rice, corn, and vegetables."
    } else {
      response =
        currentLanguage === "hindi"
          ? "मैं आपकी खेती में मदद करने के लिए यहाँ हूँ। कृपया अपना प्रश्न दोहराएं।"
          : currentLanguage === "tamil"
            ? "உங்கள் விவசாயத்திற்கு உதவ நான் இங்கே இருக்கிறேன். தயவுசெய்து உங்கள் கேள்வியை மீண்டும் கேளுங்கள்."
            : currentLanguage === "telugu"
              ? "మీ వ్యవసాయానికి సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. దయచేసి మీ ప్రశ్నను మళ్లీ అడగండి."
              : "I'm here to help with your farming needs. Please repeat your question."
    }

    setLastResponse(response)

    // Speak the response
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(response)
      const langCode =
        currentLanguage === "hindi"
          ? "hi-IN"
          : currentLanguage === "tamil"
            ? "ta-IN"
            : currentLanguage === "telugu"
              ? "te-IN"
              : "en-US"
      utterance.lang = langCode
      window.speechSynthesis.speak(utterance)
    }
  }

  const speakCommand = (command: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(command)
      const langCode =
        currentLanguage === "hindi"
          ? "hi-IN"
          : currentLanguage === "tamil"
            ? "ta-IN"
            : currentLanguage === "telugu"
              ? "te-IN"
              : "en-US"
      utterance.lang = langCode
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Mic className="h-8 w-8 text-green-600" />
            Voice Assistant
          </h1>
          <p className="text-gray-600">Speak to get farming advice in your preferred language</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Assistant Component */}
          <div>
            <VoiceAssistant
              onVoiceInput={handleVoiceInput}
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />

            {/* Last Response */}
            {lastResponse && (
              <Card className="mt-4 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-blue-600" />
                    Assistant Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800">{lastResponse}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Voice Commands Examples */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Try These Voice Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(voiceCommands[currentLanguage as keyof typeof voiceCommands] || voiceCommands.english).map(
                    (command, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3 bg-transparent"
                        onClick={() => speakCommand(command)}
                      >
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{command}</span>
                        </div>
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Voice History */}
        {voiceHistory.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Voice History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {voiceHistory
                  .slice(-5)
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mic className="h-4 w-4 text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{entry.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {entry.language}
                          </Badge>
                          <span className="text-xs text-gray-500">{entry.timestamp.toLocaleTimeString()}</span>
                        </div>
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
