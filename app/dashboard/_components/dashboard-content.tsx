"use client"

import { useEffect, useRef, useState } from "react"
import { LogOut, Search, Briefcase, GraduationCap, Users, User, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut } from "next-auth/react"
import type { Session } from "next-auth"

interface DashboardContentProps {
  session: Session
}

export default function DashboardContent({ session }: DashboardContentProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userName = session.user?.name || "User"
  const userEmail = session.user?.email || "user@example.com"
  const userImage = session.user?.image || null

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

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  if (!session?.user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background fade-in">
      {/* Header */}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 slide-up">
          {/* Welcome Section */}
          <div className="glassmorphic p-8 rounded-2xl border-foreground/10">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Email: <span className="text-foreground font-medium">{userEmail}</span>
            </p>
            <p className="text-muted-foreground mt-2">Find your next opportunity in jobs, scholarships, or internships.</p>
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
