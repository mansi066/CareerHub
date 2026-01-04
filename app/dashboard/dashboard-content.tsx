"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, Briefcase, GraduationCap, Users, User, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface User {
  email: string
  fullName?: string
  loggedIn: boolean
}

export default function DashboardContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphic border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold">C</div>
            <span className="font-bold text-lg hidden sm:inline">CareerHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-foreground/10 relative group"
                aria-label="Go to home"
              >
                <Home className="w-5 h-5" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Go to Home
                </span>
              </Button>
            </Link>
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-foreground/10 relative group"
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User className="w-6 h-6" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Edit Profile
                </span>
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    href="/profile/edit" 
                    className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-foreground/10 w-full"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 slide-up">
          {/* Welcome Section */}
          <div className="glassmorphic p-8 rounded-2xl border-foreground/10">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {user.fullName || user.email.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground">Find your next opportunity in jobs, scholarships, or internships.</p>
          </div>

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Browse Jobs", description: "Latest job postings updated daily", icon: <Briefcase className="w-8 h-8" />, href: "/browse" },
              { title: "Find Scholarships", description: "Discover funding opportunities", icon: <GraduationCap className="w-8 h-8" />, href: "/browse" },
              { title: "Explore Internships", description: "Gain real-world experience", icon: <Users className="w-8 h-8" />, href: "/browse" },
            ].map((item, idx) => (
              <Link href={item.href} key={idx}>
                <div
                  className="glassmorphic p-6 rounded-xl border-foreground/10 hover:border-foreground/30 transition-all duration-300 cursor-pointer scale-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground/10 rounded-lg mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="glassmorphic p-6 rounded-2xl border-foreground/10">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs, scholarships, or internships..."
                  className="glass-input w-full pl-10"
                />
              </div>
              <Button className="glassmorphic-button-primary">Search</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
