"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Leaf, Languages, Eye, EyeOff } from "lucide-react"

const languages = {
  english: { name: "English", code: "en" },
  hindi: { name: "हिंदी (Hindi)", code: "hi" },
  punjabi: { name: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  marathi: { name: "मराठी (Marathi)", code: "mr" },
  tamil: { name: "தமிழ் (Tamil)", code: "ta" },
  telugu: { name: "తెలుగు (Telugu)", code: "te" },
  gujarati: { name: "ગુજરાતી (Gujarati)", code: "gu" },
  kannada: { name: "ಕನ್ನಡ (Kannada)", code: "kn" },
  bengali: { name: "বাংলা (Bengali)", code: "bn" },
}

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [language, setLanguage] = useState("english")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ language_preference: language })
          .eq("id", authData.user.id)

        if (profileError) {
          console.error("Error updating language preference:", profileError)
        }
      }

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-green-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                CropAdvisor
              </h1>
              <p className="text-sm text-gray-600 font-medium">Smart Farming Solutions</p>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Welcome back to your farming dashboard</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl shadow-green-500/10">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center font-bold text-gray-800">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Access your personalized farming insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Languages className="h-4 w-4 text-green-600" />
                  Preferred Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languages).map(([key, lang]) => (
                      <SelectItem key={key} value={key} className="py-3">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                New to CropAdvisor?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-4 transition-colors"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Trusted by over 10,000+ farmers across India</p>
        </div>
      </div>
    </div>
  )
}
