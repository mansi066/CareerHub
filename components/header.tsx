"use client";

import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false);

  const pathname = usePathname();

  /** ---------------------------
   * Load login states from localStorage
   * --------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("companyUser");
    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn);
    setIsCompanyLoggedIn(!!storedCompany && JSON.parse(storedCompany)?.companyLoggedIn);
  }, []);

  /** ---------------------------
   * Handle smooth scroll for sections
   * --------------------------- */
  const handleSectionClick = (hash: string) => {
    if (window.location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
    setIsOpen(false);
  };

  /** ---------------------------
   * Navigation Links Config
   * --------------------------- */
  const LINKS = [
    { name: "Browse", href: "/browse" },
    { name: "Assessments", href: "/assessments" },
    { name: "Success Stories", hash: "testimonials" },
    { name: "Plans", hash: "pricing" },
  ];

  /** ---------------------------
   * Render Nav Link
   * --------------------------- */
  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const baseClasses = mobile
      ? "relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors group"
      : "relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors smooth-fade group";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => setIsOpen(false)}
        >
          {link.name}
          {!mobile && (
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          )}
        </Link>
      );
    } else {
      return (
        <button
          key={link.name}
          className={baseClasses}
          onClick={() => handleSectionClick(link.hash!)}
        >
          {link.name}
          {!mobile && (
            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-foreground/80 group-hover:bg-foreground group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
          )}
        </button>
      );
    }
  };

  /** ---------------------------
   * Desktop CTA Buttons Logic
   * --------------------------- */
  const renderDesktopCTA = () => {
    // Only for /browse show dashboard buttons
    if (pathname === "/browse") {
      if (isCompanyLoggedIn) {
        return (
          <Link href="/company/dashboard">
            <Button className="glassmorphic-button-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Company Dashboard
            </Button>
          </Link>
        );
      } else if (isLoggedIn) {
        return (
          <Link href="/dashboard">
            <Button className="glassmorphic-button-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Dashboard
            </Button>
          </Link>
        );
      }
    }

    // On all other pages, show login/signup
    return (
      <>
        <Link href="/company/login">
          <Button className="glassmorphic-button-primary relative group">
            Company Login
          </Button>
        </Link>
        <Link href="/login">
          <Button className="glassmorphic-button-primary relative group">
            Student Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="glassmorphic-button-primary">Sign Up</Button>
        </Link>
      </>
    );
  };

  /** ---------------------------
   * Mobile CTA Buttons Logic
   * --------------------------- */
  const renderMobileCTA = () => {
    if (pathname === "/browse") {
      if (isCompanyLoggedIn) {
        return (
          <Link href="/company/dashboard" className="flex-1">
            <Button className="w-full glassmorphic-button-primary flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Company Dashboard
            </Button>
          </Link>
        );
      } else if (isLoggedIn) {
        return (
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full glassmorphic-button-primary flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Student Dashboard
            </Button>
          </Link>
        );
      }
    }

    // Login/Signup for all other pages
    return (
      <>
        <Link href="/company/login" className="flex-1">
          <Button variant="outline" className="w-full relative group">
            Company Login
          </Button>
        </Link>
        <Link href="/login" className="flex-1">
          <Button variant="outline" className="w-full relative group">
            Student Login
          </Button>
        </Link>
        <Link href="/signup" className="flex-1">
          <Button className="w-full glassmorphic-button-primary">Sign Up</Button>
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 glassmorphic border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">CareerHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {LINKS.map((link) => renderLink(link))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {renderDesktopCTA()}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 glassmorphic border-b p-4 md:hidden slide-up">
            <div className="flex flex-col gap-4">
              {LINKS.map((link) => renderLink(link, true))}
              <div className="flex gap-2 pt-4">{renderMobileCTA()}</div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
