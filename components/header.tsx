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

  /* ---------------------------
   * Load login states
   * --------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("companyUser");

    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn);
    setIsCompanyLoggedIn(
      !!storedCompany && JSON.parse(storedCompany)?.companyLoggedIn
    );
  }, []);

  /* ---------------------------
   * Close mobile menu on route change
   * --------------------------- */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* ---------------------------
   * Prevent background scroll
   * --------------------------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* ---------------------------
   * Smooth scroll
   * --------------------------- */
  const handleSectionClick = (hash: string) => {
    if (window.location.pathname === "/") {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
    setIsOpen(false);
  };

  const LINKS = [
    { name: "Home", href: "/" },
    { name: "Success Stories", hash: "testimonials" },
    { name: "Plans", hash: "pricing" },
    { name: "Assessments", href: "/assessments" },
    { name: "Browse", href: "/browse" },
  ];

  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const baseClasses = mobile
      ? "w-full rounded-lg px-4 py-3 text-base font-medium text-left text-foreground/80 hover:bg-foreground/10 hover:text-primary transition"
      : "relative text-sm font-medium tracking-tight text-foreground/70 hover:text-foreground transition-colors whitespace-nowrap";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => setIsOpen(false)}
        >
          {link.name}
        </Link>
      );
    }

    return (
      <button
        key={link.name}
        className={baseClasses}
        onClick={() => handleSectionClick(link.hash!)}
      >
        {link.name}
      </button>
    );
  };

  /* ---------------------------
   * CTA logic
   * --------------------------- */
  const renderCTA = (mobile = false) => {
    const wrapperClass = mobile ? "w-full space-y-3" : "flex items-center gap-3";

    if (pathname === "/browse") {
      if (isCompanyLoggedIn) {
        return (
          <div className={wrapperClass}>
            <Link href="/company/dashboard" className="w-full">
              <Button className="w-full flex items-center gap-2 glassmorphic-button-primary">
                <User className="w-4 h-4" />
                Company Dashboard
              </Button>
            </Link>
          </div>
        );
      }

      if (isLoggedIn) {
        return (
          <div className={wrapperClass}>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full flex items-center gap-2 glassmorphic-button-primary">
                <User className="w-4 h-4" />
                Student Dashboard
              </Button>
            </Link>
          </div>
        );
      }
    }

    return (
      <div className={wrapperClass}>
        <Link href="/company/login" className="w-full">
          <Button className="w-full" variant="outline">
            Company Login
          </Button>
        </Link>

        <Link href="/login" className="w-full">
          <Button className="w-full" variant="outline">
            Student Login
          </Button>
        </Link>

        <Link href="/signup" className="w-full">
          <Button className="w-full glassmorphic-button-primary">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 h-16 glassmorphic border-b">
      <nav className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo - Section 1 */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground/10 group-hover:bg-foreground/20 flex items-center justify-center font-bold transition-colors">
              C
            </div>
            <span className="font-bold hidden sm:block tracking-tight">CareerHub</span>
          </Link>
        </div>

        {/* Desktop Nav - Section 2 */}
        {/* Using flex-1 and justify-center to allow "space usage" while maintaining visual balance */}
        <div className="hidden md:flex flex-1 items-center justify-center px-4 lg:px-8">
          <div className="flex items-center gap-5 lg:gap-8">
            {LINKS.map((l) => renderLink(l))}
          </div>
        </div>

        {/* Right Section - Auth (Sec 3) + Toggle (Sec 4) */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {renderCTA()}
          {/* Theme Toggle is Section 4 (Far Right) */}
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex-shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-foreground/10"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[64px] z-40 glassmorphic border-t px-4 py-6 space-y-4">
          {LINKS.map((l) => renderLink(l, true))}

          {renderCTA(true)}

          <div className="pt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
