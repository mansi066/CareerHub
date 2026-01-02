"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// ✅ import existing components
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (email && password.length >= 6) {
        localStorage.setItem("user", JSON.stringify({ email, loggedIn: true }))
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <Header />

      {/* Login Content */}
      <main className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center px-4 fade-in">
        <div className="w-full max-w-md">

          <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to your CareerHub account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                className="w-full glassmorphic-button-primary font-semibold"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-foreground/10" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-foreground font-semibold hover:underline"
              >
                Sign Up
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
