"use client"

import { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedCompany = localStorage.getItem("companyUser")
    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn)
    setIsCompanyLoggedIn(!!storedCompany && JSON.parse(storedCompany)?.companyLoggedIn)
  }, [])

  return (
    <header className="sticky top-0 z-50 glassmorphic border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">CareerHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/browse" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors smooth-fade group">
            Browse
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
          <Link href="/assessments" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors smooth-fade group">
            Assessments
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </Link>
          <a href="#testimonials" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors smooth-fade group">
            Success Stories
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </a>
          <a href="#pricing" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors smooth-fade group">
            Plans
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isCompanyLoggedIn ? (
            <Link href="/company/dashboard">
              <Button className="glassmorphic-button-primary flex items-center gap-2">
                <User className="w-4 h-4" />
                Company Dashboard
              </Button>
            </Link>
          ) : isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="glassmorphic-button-primary flex items-center gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/company/login">
                <Button className="glassmorphic-button-primary relative group">
                  Company 
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Company Login
                  </span>
                </Button>
              </Link>
              <Link href="/login">
                <Button className="glassmorphic-button-primary relative group">
                  Student
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Student Login
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 glassmorphic border-b p-4 md:hidden slide-up">
            <div className="flex flex-col gap-4">
              <Link href="/browse" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group">
                Browse
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
              <Link href="/assessments" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group">
                Assessments
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
              <a href="#testimonials" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group">
                Success Stories
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group">
                Plans
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </a>
              <div className="flex gap-2 pt-4">
                <ThemeToggle />
                {isCompanyLoggedIn ? (
                  <Link href="/company/dashboard" className="flex-1">
                    <Button className="w-full glassmorphic-button-primary flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Company Dashboard
                    </Button>
                  </Link>
                ) : isLoggedIn ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full glassmorphic-button-primary flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/company/login" className="flex-1">
                      <Button variant="outline" className="w-full relative group">
                        Company Login
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Company Login
                        </span>
                      </Button>
                    </Link>
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full relative group">
                        Sign In
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Student Login
                        </span>
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full glassmorphic-button-primary">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
