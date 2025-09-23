'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Phone, Mail, Globe, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const languages = {
  english: { name: "English", code: "en", flag: "🇺🇸" },
  hindi: { name: "हिंदी (Hindi)", code: "hi", flag: "🇮🇳" },
  punjabi: { name: "ਪੰਜਾਬੀ (Punjabi)", code: "pa", flag: "🇮🇳" },
  marathi: { name: "मराठी (Marathi)", code: "mr", flag: "🇮🇳" },
  tamil: { name: "தமிழ் (Tamil)", code: "ta", flag: "🇮🇳" },
  telugu: { name: "తెలుగు (Telugu)", code: "te", flag: "🇮🇳" },
  gujarati: { name: "ગુજરાતી (Gujarati)", code: "gu", flag: "🇮🇳" },
  kannada: { name: "ಕನ್ನಡ (Kannada)", code: "kn", flag: "🇮🇳" },
  bengali: { name: "বাংলা (Bengali)", code: "bn", flag: "🇧🇩" },
}

type AuthMode = 'login' | 'signup' | 'verify-email' | 'verify-phone' | 'complete-profile'
type ContactMethod = 'email' | 'phone'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email')
  const [language, setLanguage] = useState('english')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  
  // Use a simple boolean state to control the modal's internal visibility
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [location, setLocation] = useState('')
  const [farmSize, setFarmSize] = useState('')

  // This effect runs once when the component is mounted on the client side
  useEffect(() => {
    // Ensure this code only runs in a browser environment
    if (typeof window !== 'undefined') {
      const popupShown = localStorage.getItem('loginPopupShown');
      if (!popupShown) {
        setShowModal(true);
        localStorage.setItem('loginPopupShown', 'true');
      }
    }
  }, []);

  const getContact = () => contactMethod === 'email' ? email : phone

  const handleSendOTP = async (isSignup = false) => {
    const contact = getContact()
    if (!contact) {
      setError(`Please enter your ${contactMethod}`)
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      if (contactMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email: contact,
          options: {
            shouldCreateUser: isSignup
          }
        })
        if (error) throw error
        setMode(`verify-${contactMethod}` as AuthMode)
        setSuccess(`OTP sent to ${contact}`)
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone: contact,
          options: {
            shouldCreateUser: isSignup
          }
        })
        if (error) throw error
        setMode(`verify-${contactMethod}` as AuthMode)
        setSuccess(`OTP sent to ${contact}`)
      }
    } catch (error: any) {
      setError(error.message || `Failed to send OTP to ${contactMethod}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const verifyData = contactMethod === 'email' 
        ? { email: getContact(), token: otp, type: 'email' as const }
        : { phone: getContact(), token: otp, type: 'sms' as const }

      const { data, error } = await supabase.auth.verifyOtp(verifyData)
      
      if (error) throw error

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single()

        if (!profile?.full_name) {
          setMode('complete-profile')
          return
        }

        await supabase
          .from('profiles')
          .upsert({ 
            id: data.user.id, 
            language_preference: language 
          })

        setSuccess('Successfully signed in!')
        setTimeout(() => {
          onSuccess?.()
          setShowModal(false); 
          router.refresh()
        }, 1000)
      }
    } catch (error: any) {
      setError(error.message || 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteProfile = async () => {
    if (!fullName) {
      setError('Please enter your full name')
      return
    }

    setIsLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: contactMethod === 'phone' ? phone : undefined,
          location: location || undefined,
          farm_size: farmSize ? parseFloat(farmSize) : undefined,
          language_preference: language
        })

      if (error) throw error

      setSuccess('Profile completed successfully!')
      setTimeout(() => {
        onSuccess?.()
        setShowModal(false);
        router.refresh()
      }, 1000)
    } catch (error: any) {
      setError(error.message || 'Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  const renderLoginSignup = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Choose your language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(languages).map(([key, lang]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={contactMethod} onValueChange={(v) => setContactMethod(v as ContactMethod)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="phone" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button 
          onClick={() => handleSendOTP(mode === 'signup')} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          {isLoading ? 'Sending...' : `Send OTP to ${contactMethod}`}
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-emerald-600 hover:text-emerald-700 underline"
          >
            {mode === 'login' ? 'New farmer? Create account' : 'Already have account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderVerifyOTP = () => (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => setMode('login')}
        className="flex items-center gap-2 p-0 h-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {contactMethod === 'email' ? (
            <Mail className="h-8 w-8 text-emerald-600" />
          ) : (
            <Phone className="h-8 w-8 text-emerald-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold">Verify your {contactMethod}</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <strong>{getContact()}</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-3">
        <Button 
          onClick={handleVerifyOTP} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          {isLoading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSendOTP()}
          disabled={isLoading}
          className="w-full"
        >
          Resend OTP
        </Button>
      </div>
    </div>
  )

  const renderCompleteProfile = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold">Complete your profile</h3>
        <p className="text-sm text-muted-foreground">
          Help us provide better farming recommendations
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="farmSize">Farm Size (acres)</Label>
          <Input
            id="farmSize"
            type="number"
            placeholder="e.g., 5"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      <Button 
        onClick={handleCompleteProfile} 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
      >
        {isLoading ? 'Saving...' : 'Complete Profile'}
      </Button>
    </div>
  )

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome to KisanMitraa'
      case 'signup': return 'Join KisanMitraa Family'
      case 'verify-email':
      case 'verify-phone': 
        return 'Verify your account'
      case 'complete-profile': return 'Complete your profile'
      default: return 'Welcome'
    }
  }

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Sign in to access personalized crop advisory'
      case 'signup': return 'Get started with smart farming solutions'
      case 'verify-email':
      case 'verify-phone': 
        return 'We sent a verification code to your device'
      case 'complete-profile': return 'Tell us about your farming background'
      default: return ''
    }
  }
  
  // Custom close function for the dialog
  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">KisanMitraa</span>
          </div>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {(mode === 'login' || mode === 'signup') && renderLoginSignup()}
          {(mode === 'verify-email' || mode === 'verify-phone') && renderVerifyOTP()}
          {mode === 'complete-profile' && renderCompleteProfile()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
