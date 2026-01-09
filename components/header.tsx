"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Briefcase,
  Building2,
  Bookmark,
  GraduationCap,
  Award,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle section scrolling
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSectionClick = (hash: string) => {
    if (window.location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
    setIsOpen(false);
  };

  const LINKS = [
    { name: "Browse", href: "/browse", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Assessments", href: "/assessments", icon: GraduationCap },
    { name: "Success Stories", hash: "testimonials", icon: Award },
    { name: "Plans", hash: "pricing", icon: CreditCard },
  ];

  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const Icon = link.icon;

    const baseClasses = mobile
      ? "group w-full rounded-xl px-4 py-3.5 text-base font-medium text-left flex items-center gap-3 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-200"
      : "group relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground flex items-center gap-2 transition-all duration-200 rounded-lg hover:bg-primary/5";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => mobile && setIsOpen(false)}
        >
          {Icon && <Icon className="w-4 h-4" />}
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
        {Icon && <Icon className="w-4 h-4" />}
        {link.name}
      </button>
    );
  };

  const renderCTA = (mobile = false) => {
    const wrapperClass = mobile
      ? "w-full flex flex-col gap-2.5"
      : "flex items-center gap-2";

    if (isAuthenticated) {
      const user = session?.user as any;
      const dashboardLink = user?.accountType === "company" ? "/company-dashboard" : "/dashboard";

      return (
        <div className={wrapperClass}>
          <Link href={dashboardLink} className={mobile ? "w-full" : ""}>
            <Button className={`${mobile ? "w-full" : ""} flex items-center justify-center gap-2 glassmorphic-button-primary shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
              <Sparkles className="w-4 h-4" />
              {mobile ? "Dashboard" : "Dashboard"}
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className={wrapperClass}>
        <Link href="/company-signup" className={mobile ? "w-full" : ""}>
          <Button
            className={mobile ? "w-full justify-center" : "justify-center"}
            variant="outline"
          >
            <Building2 className="w-4 h-4 mr-1.5" />
            Companies
          </Button>
        </Link>

        <Link href="/login" className={mobile ? "w-full" : ""}>
          <Button
            className={mobile ? "w-full justify-center" : "justify-center"}
            variant="outline"
          >
            <User className="w-4 h-4 mr-1.5" />
            Login
          </Button>
        </Link>

        <Link href="/signup" className={mobile ? "w-full" : ""}>
          <Button className={`${mobile ? "w-full justify-center" : "justify-center"} glassmorphic-button-primary shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
          <Button
            className={`${mobile ? "w-full" : ""} glassmorphic-button-primary`}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 h-16 glassmorphic border-b backdrop-blur-md bg-background/80">
      <nav className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center font-bold text-primary-foreground shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
            C
          </div>
          <span className="font-bold text-lg hidden sm:block group-hover:text-primary transition-colors">CareerHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 items-center">
          {LINKS.map((l) => renderLink(l))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <div className="w-px h-6 bg-border"></div>
          {renderCTA()}
        </div>

        {/* Mobile Toggle */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-foreground/10 hover:scale-105 transition-all"
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[400px] flex flex-col">
            <SheetHeader className="text-left space-y-3 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-primary-foreground shadow-lg">
                  C
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">CareerHub</SheetTitle>
                  <p className="text-xs text-muted-foreground">Your career companion</p>
                </div>
              </div>
            </SheetHeader>

            <Separator className="my-2" />

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 py-4">
                <div className="space-y-1">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {LINKS.map((l) => renderLink(l, true))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 px-2">
                  <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  {renderCTA(true)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t mt-auto pb-24 md:pb-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              C
            </div>
            CareerHub
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => renderLink(l))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {renderCTA()}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-background p-4">
            <div className="space-y-2">
              {LINKS.map((l) => renderLink(l, true))}
            </div>
            <div className="mt-6">{renderCTA(true)}</div>
          </div>
        </div>
      )}
    </>
  );
}
