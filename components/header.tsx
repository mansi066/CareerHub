"use client";

import { useState, useEffect } from "react";
import { Menu, Briefcase, Building2, Bookmark, GraduationCap, Award, CreditCard, Sparkles, X, FileText, FileUser, Mic, User, Settings, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // Ensure you have this utility from Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import dropdown components

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Handle scroll effect for the header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LINKS = [
    { name: "Browse", href: "/browse", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Assessments", href: "/assessments", icon: GraduationCap },
    { name: "Success", hash: "testimonials", icon: Award },
    { name: "Pricing", hash: "pricing", icon: CreditCard },
  ] as const;

  const RESOURCES_LINKS = [
    { name: "Career Blog", href: "/career-blog", icon: FileText },
    { name: "Resume Tips", href: "/resume-tips", icon: FileUser },
    { name: "Interview Prep", href: "/interview-prep", icon: Mic },
  ] as const;

  const handleSectionClick = (hash: string) => {
    if (pathname === "/") {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
    setIsOpen(false);
  };

  const renderCTA = (mobile = false) => {
    const isAuthenticated = status === "authenticated";
    const user = session?.user as any;
    const dashboardLink = user?.role === "company" ? "/dashboard/company" : "/dashboard";

    return (
      <div>
        {isAuthenticated ? (
          <div className={cn("flex items-center gap-2", mobile ? "flex-col w-full" : "")}>
            <Link href={dashboardLink} className={mobile ? "w-full" : ""}>
              <Button variant="ghost" className={cn(
                "gap-2 font-semibold transition-all hover:scale-105 active:scale-95",
                mobile ? "w-full h-12 text-base" : "h-9 px-4"
              )}>
                <Sparkles className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            {!mobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {user?.name || user?.email}
                  </div>
                  <Separator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/applications" className="cursor-pointer">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Applications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <Separator className="my-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <div className={cn("flex items-center gap-5", mobile ? "flex-col w-full" : "")}>
            <Link href="/login" className={mobile ? "w-full" : ""}>
              <Button variant="ghost" className={cn(mobile ? "w-full h-12 justify-center px-4 text-base" : "h-9")}>
                Login
              </Button>
            </Link>
            <Link href="/signup" className={mobile ? "w-full" : ""}>
              <Button className={cn(
                "font-semibold transition-all hover:shadow-lg active:scale-95",
                mobile ? "w-full h-12 text-base" : "h-9 px-5 bg-primary"
              )}>
                Join Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border py-2"
          : "bg-transparent border-transparent py-4"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group outline-none">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary shadow-lg transition-transform group-hover:rotate-3 group-active:scale-90">
            <span className="text-xl font-black text-primary-foreground">C</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            CareerHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-muted/50 rounded-full px-2 py-1 border border-border/40">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === (link as any).href;

            return (link as any).href ? (
              <Link
                key={link.name}
                href={(link as any).href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                  isActive
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleSectionClick((link as any).hash)}
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </button>
            );
          })}
          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-full">
                Resources
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {RESOURCES_LINKS.map((resource) => {
                const Icon = resource.icon;
                return (
                  <DropdownMenuItem key={resource.name} asChild>
                    <Link href={resource.href} className="cursor-pointer">
                      <Icon className="mr-2 h-4 w-4" />
                      {resource.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            {renderCTA()}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-muted"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:max-w-xs flex flex-col p-0 border-l-0">
              <div className="p-6 flex flex-col h-full bg-background/95 backdrop-blur-lg">
                <SheetHeader className="flex flex-row items-center justify-between space-y-0 mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      C
                    </div>
                    <span className="font-bold">CareerHub</span>
                  </SheetTitle>
                  <SheetClose className="rounded-full p-2 hover:bg-muted transition-colors">
                    <X className="h-5 w-5" />
                  </SheetClose>
                </SheetHeader>

                <div className="space-y-1 mb-8">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                    Explore
                  </p>
                  {LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={(link as any).href || "#"}
                        onClick={() => {
                          if (!(link as any).href) {
                            handleSectionClick((link as any).hash);
                          } else {
                            setIsOpen(false);
                          }
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    );
                  })}
                  <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-4 mb-2">
                    Resources
                  </p>
                  {RESOURCES_LINKS.map((resource) => {
                    const Icon = resource.icon;
                    return (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{resource.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <Separator />
                {status === "authenticated" ? (
                  <div className="space-y-2">
                    <Link href={session?.user?.role === "company" ? "/dashboard/company" : "/dashboard"} onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-12 text-base gap-2">
                        <Sparkles className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 text-base gap-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link href="/applications" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 text-base gap-2">
                          <ClipboardList className="h-4 w-4" />
                          Applications
                        </Button>
                      </Link>
                      <Link href="/settings" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 text-base gap-2">
                          <Settings className="h-4 w-4" />
                          Settings
                        </Button>
                      </Link>
                      <Link href="/api/auth/signout" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 text-base gap-2">
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  renderCTA(true)
                )}
                <div className="mt-auto space-y-6">
                  <div className="bg-muted/40 p-4 rounded-2xl space-y-4 border border-border/50">
                    <div className="flex items-center justify-between">
                      <ThemeToggle />
                      <span className="text-sm font-medium">Appearance</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}