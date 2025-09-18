import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">CropAdvisor</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Welcome to CropAdvisor!</CardTitle>
            <CardDescription>Your account has been created successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              We've sent a confirmation email to your inbox. Please check your email and click the confirmation link to
              activate your account.
            </p>
            <p className="text-sm text-muted-foreground">
              Once confirmed, you can{" "}
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 underline underline-offset-4">
                sign in to your dashboard
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
