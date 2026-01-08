"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { signupAction } from "../action";
import { toast } from "@/hooks/use-toast";

// ✅ Existing Components
import Header from "@/components/header"
import Footer from "@/components/footer"

/**
 * SignupPage component
 * Handles user signup form submission and validation
 * Provides Google OAuth and email/password authentication
 */
export default function SignupPage() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // OTP verification states
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [otp, setOtp] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [resendCountdown, setResendCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for resend button
  useEffect(() => {
    if (showOtpForm && resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (resendCountdown === 0) {
      setCanResend(true)
    }
  }, [showOtpForm, resendCountdown])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear errors on input
    setError("")
  }

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (err) {
      setError("Failed to sign in with Google")
      console.error("Google sign in error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const result = await signupAction(formData)

      if (result.success) {
        setSuccess(result.message || "Account created successfully!")
        setUserEmail(formData.email)
        setShowOtpForm(true)
        setResendCountdown(60)
        setCanResend(false);
        // Show toast
       toast({
        title: "Account Created!",
        description: "Complete your profile to get the best job matches!",
        type: "foreground",
      });
      // Redirect to profile page instead of dashboard
      router.push("/profile/edit");
      } else {
        setError(result.error || "Failed to create account")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otp,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess("Email verified successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(result.message || "Invalid verification code")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("OTP verification error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess("Verification code resent successfully!")
        setResendCountdown(60)
        setCanResend(false)
        setOtp("")
      } else {
        setError(result.message || "Failed to resend verification code")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Resend OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header */}

      {/* Page Container with gradient background */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-brown from-background via-background to-primary/5 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <main className="w-full max-w-md px-4 relative z-10">
          {/* Card Wrapper with enhanced styling */}
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-red from-primary/50 via-blue-500/50 to-purple-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />

            <div className="relative glassmorphic p-8 rounded-2xl border border-foreground/10 backdrop-blur-xl bg-background/80 shadow-2xl">
              {/* Heading Section with improved styling */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-brown from-primary to-blue-500 mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-red from-foreground to-foreground/70 bg-clip-text">
                  {showOtpForm ? "Verify Your Email" : "Create Your Account"}
                </h1>
                <p className="text-muted-foreground">
                  {showOtpForm ? `Enter the code sent to ${userEmail}` : "Join thousands finding their next opportunity"}
                </p>
              </div>

              {/* Conditional rendering: OTP form or Signup form */}
              {showOtpForm ? (
                // OTP Verification Form
                <div className="form-wrapper">
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    {/* OTP Input */}
                    <div className="form-group space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Verification Code
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="Enter 6-digit code"
                          className="glass-input w-full pl-10 text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary/50 transition-all"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                        <svg className="w-5 h-5 flex-shrink-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                        <svg className="w-5 h-5 flex-shrink-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                      </div>
                    )}

                    {/* Verify Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || otp.length !== 6}
                      className="w-full bg-gradient-to-red from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Verifying...
                        </span>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>

                    {/* Resend Code Button */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResendOtp}
                        disabled={!canResend || isLoading}
                        className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {canResend ? (
                          "Resend Verification Code"
                        ) : (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Resend in {resendCountdown}s
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Back to signup */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpForm(false)
                          setOtp("")
                          setError("")
                          setSuccess("")
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        ← Back to signup
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Original Signup Form
                <div className="form-wrapper">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="form-group space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="glass-input w-full pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="glass-input w-full pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="form-group space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="glass-input w-full pl-10 pr-10 focus:ring-2 focus:ring-primary/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-lg hover:bg-foreground/5"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group space-y-2">
                      <label className="block text-sm font-medium text-foreground">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="glass-input w-full pl-10 pr-10 focus:ring-2 focus:ring-primary/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-lg hover:bg-foreground/5"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                        <svg className="w-5 h-5 flex-shrink-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Success Message */}
                    {success && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                        <svg className="w-5 h-5 flex-shrink-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-red from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-gradient-to-red from-transparent via-foreground/20 to-transparent" />
                    <span className="text-xs text-muted-foreground font-medium">OR CONTINUE WITH</span>
                    <div className="flex-1 h-px bg-gradient-to-red from-transparent via-foreground/20 to-transparent" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full glassmorphic border border-foreground/20 hover:border-foreground/30 hover:bg-foreground/5 font-semibold py-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </Button>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-primary font-semibold hover:underline transition-all"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
      </div>
    </>
  )
}
