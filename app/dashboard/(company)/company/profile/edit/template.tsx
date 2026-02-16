"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Briefcase, Users, Link2, Menu, X, Settings2 } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

const profileSections = [
    {
        title: "Basic Info",
        href: "/dashboard/company/profile/edit/basic-info",
        icon: Building2,
        description: "Company details & registration",
    },
    {
        title: "Culture & Working Style",
        href: "/dashboard/company/profile/edit/culture-and-working-style",
        icon: Users,
        description: "Work environment & values",
    },
    {
        title: "Recruitment Specifics",
        href: "/dashboard/company/profile/edit/recruitment-specifics",
        icon: Briefcase,
        description: "Hiring process & requirements",
    },
    {
        title: "Social Links",
        href: "/dashboard/company/profile/edit/social-links",
        icon: Link2,
        description: "Social media & online presence",
    },
]

function NavigationContent({ pathname, router, onNavigate }: { pathname: string, router: any, onNavigate?: () => void }) {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Company Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your company information</p>
            </div>
            <nav className="space-y-2">
                {profileSections.map((section) => {
                    const isActive = pathname === section.href
                    const Icon = section.icon
                    return (
                        <Button
                            key={section.href}
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 h-auto py-3 transition-all",
                                isActive && "bg-primary text-primary-foreground shadow-sm"
                            )}
                            onClick={() => {
                                router.push(section.href)
                                onNavigate?.()
                            }}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <div className="flex flex-col items-start text-left">
                                <span className="font-semibold text-sm">{section.title}</span>
                                <span className={cn(
                                    "text-xs",
                                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                )}>
                                    {section.description}
                                </span>
                            </div>
                        </Button>
                    )
                })}
            </nav>
        </>
    )
}

export default function ProfileEditLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    return (
        <div className="flex h-full flex-col lg:flex-row">
            {/* Mobile Header with Menu */}
            <div className="lg:hidden border-b bg-background p-4 sticky top-0 z-10">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            <span>Profile Sections</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <NavigationContent
                            pathname={pathname}
                            router={router}
                            onNavigate={() => setOpen(false)}
                        />
                    </PopoverContent>
                </Popover>

            </div>

            {/* Desktop Side Navigation */}
            <aside className="hidden lg:block w-64 xl:w-72 2xl:w-80 border-r bg-muted/10 p-6 overflow-y-auto">
                <NavigationContent pathname={pathname} router={router} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-h-0">
                {children}
            </main>
        </div>
    )
}
