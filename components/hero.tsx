"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [count, setCount] = useState(0)
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn)
  }, [])

  const handleStartSearch = () => {
    if (isLoggedIn) {
      router.push("/browse")
    } else {
      router.push("/signup")
    }
  }

  // Animated counter effect
  useEffect(() => {
    let start = 0
    const end = 500
    const duration = 1200
    const stepTime = Math.max(Math.floor(duration / end), 1)

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">

        {/* Animated stats badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm font-medium bg-foreground/10 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105">
          <Sparkles className="w-4 h-4" />
          <span>{count}+ new opportunities posted daily</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Find jobs, scholarships & internships
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover thousands of opportunities tailored to your skills. Get matched with roles,
          funding, and internships that fit your career goals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="glassmorphic-button-primary w-full sm:w-auto group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            onClick={handleStartSearch}
          >
            Start Your Search
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto glassmorphic flex items-center gap-2 hover:bg-foreground/5 transition-all"
          >
            <Play className="w-4 h-4" />
            Watch Tutorial
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Free to use. Sign up in 2 minutes.
        </p>
      </div>

      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-foreground/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-foreground/5 rounded-full blur-3xl -z-10" />
    </section>
  )
}
