"use client"

import { use, useEffect, useRef, useState } from "react"
import { LogOut, User, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const session = useSession();
    const userName = session.data?.user?.name || "User"
    const userEmail = session.data?.user?.email || "user@example.com"
    const userImage = session.data?.user?.image || null

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

    if (!session.data?.user) {
        return null
    }

    return (
        <>
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
                                {userImage ? (
                                    <img src={userImage} alt={userName} className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    Profile
                                </span>
                            </Button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-background border border-foreground/10 rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-foreground/10">
                                        <p className="text-sm font-semibold text-foreground">{userName}</p>
                                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                                    </div>
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

        </>
    )
}
