"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"

// Desktop nav links
const DESKTOP_LINKS = [
  { name: "Browse", hash: "features" },
  { name: "Assessments", href: "/assessments" },
  { name: "Success Stories", hash: "testimonials" },
  { name: "Plans", hash: "pricing" },
]

// Mobile nav links
const MOBILE_LINKS = [
  { name: "Browse", hash: "features" },
  { name: "Assessments", href: "/assessments" },
  { name: "Success Stories", hash: "testimonials" },
  { name: "Plans", hash: "pricing" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  /** Generate correct href for desktop links */
  const getDesktopHref = (link: typeof DESKTOP_LINKS[number]) => {
    if (link.href) return link.href
    return pathname === "/" ? `#${link.hash}` : `/#${link.hash}`
  }

  /** Generate correct href for mobile links */
  const getMobileHref = (link: typeof MOBILE_LINKS[number]) => {
    if (link.href) return link.href
    return pathname === "/" ? `#${link.hash}` : `/#${link.hash}`
  }

  /** Class for desktop nav links */
  const getDesktopLinkClass = () => {
    return "relative text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1 rounded-md hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 font-medium tracking-wide"
  }

  /** Class for mobile nav links */
  const getMobileLinkClass = () => {
    return "text-foreground hover:text-muted-foreground transition-colors duration-300 transform hover:translate-x-1 hover:shadow-sm px-2 py-1 rounded-md"
  }

  /** Smooth scroll on homepage */
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }, [pathname])

  /** Desktop navigation JSX */
  const DesktopNav = () => (
    <div className="hidden md:flex items-center gap-10 desktop-nav-wrapper">
      {DESKTOP_LINKS.map((link) => (
        <div key={link.name} className="desktop-nav-item">
          <Link href={getDesktopHref(link)} className={getDesktopLinkClass()}>
            {link.name}
          </Link>
        </div>
      ))}
    </div>
  )

  /** Mobile navigation JSX */
  const MobileNav = () => (
    <div className="absolute top-20 left-0 right-0 glassmorphic border-b p-4 md:hidden rounded-b-xl shadow-lg backdrop-blur-md slide-down-animation mobile-nav-wrapper">
      <div className="flex flex-col gap-4 mobile-links-wrapper">
        {MOBILE_LINKS.map((link) => (
          <div key={link.name} className="mobile-link-item">
            <Link
              href={getMobileHref(link)}
              className={getMobileLinkClass()}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          </div>
        ))}

        {/* Mobile CTA Buttons */}
        <div className="flex gap-2 pt-4 mobile-cta-wrapper">
          <ThemeToggle />
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent hover:opacity-80 transition duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" className="flex-1">
            <Button className="w-full glassmorphic-button-primary text-black shadow-lg hover:scale-105 hover:shadow-xl hover:ring-1 hover:ring-primary/50 transition-all duration-300">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 glassmorphic border-b shadow-md backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 logo-wrapper">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold text-lg shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300">
              C
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline tracking-wider group-hover:opacity-90 transition-opacity duration-300">
              CareerHub
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <DesktopNav />

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 desktop-cta-wrapper">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-foreground/10 transition duration-300">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="glassmorphic-button-primary text-black shadow-lg hover:scale-105 hover:shadow-xl hover:ring-1 hover:ring-primary/50 transition-all duration-300">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-button md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground" aria-label="Toggle menu">
            {isOpen ? (
              <X size={24} className="transition-transform duration-300 group-hover:-rotate-12" />
            ) : (
              <Menu size={24} className="transition-transform duration-300 group-hover:rotate-12" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <MobileNav />}
      </nav>
    </header>
  )
}
