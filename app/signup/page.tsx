"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// ✅ add existing components
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          loggedIn: true,
        }),
      )
      router.push("/dashboard")
    } catch {
      setError("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <Header />

      {/* Signup Content */}
      <main className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center px-4 fade-in">
        <div className="w-full max-w-md">

          <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Account
            </h1>
            <p className="text-muted-foreground mb-8">
              Join thousands finding their next opportunity
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="glass-input w-full"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full glassmorphic-button-primary text-foreground font-semibold"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-foreground/10" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-foreground font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
