"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Users, Building2, Loader2 } from "lucide-react"
import { updateUserRoleAction } from "../../../services/auth.services"

interface RoleSelectionDialogProps {
    isOpen: boolean
    userEmail: string
    userName: string
}

export function RoleSelectionDialog({
    isOpen,
    userEmail,
    userName,
}: RoleSelectionDialogProps) {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState<"user" | "company" | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleRoleSelection = async (role: "user" | "company") => {
        setSelectedRole(role)
        setIsLoading(true)
        setError("")

        try {
            const result = await updateUserRoleAction(userEmail, role)
            router.refresh()
            if (result.success) {
                // Redirect based on role
                const redirectPath = role === "user" ? "/dashboard" : "/dashboard/company"
                setTimeout(() => {
                    router.push(redirectPath)
                }, 500)
            } else {
                setError((result as any).message || (result as any).error || "Failed to update role")
                setSelectedRole(null)
                setIsLoading(false)
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
            console.error("Role selection error:", err)
            setSelectedRole(null)
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl">Welcome, {userName}! 👋</DialogTitle>
                    <DialogDescription className="text-base">
                        How would you like to use CareerHub? Choose your role to get started.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 py-4">
                    {/* Student Role */}
                    <button
                        onClick={() => handleRoleSelection("user")}
                        disabled={isLoading}
                        className={`relative group overflow-hidden rounded-lg p-6 transition-all duration-300 ${selectedRole === "user"
                            ? "bg-gradient-to-br from-primary to-blue-600 text-white"
                            : "border-2 border-foreground/20 hover:border-primary/50 hover:bg-foreground/5"
                            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {/* Background gradient for hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex flex-col items-center justify-center h-full gap-3">
                            <div
                                className={`p-3 rounded-full transition-colors ${selectedRole === "user"
                                    ? "bg-white/20"
                                    : "bg-primary/10 group-hover:bg-primary/20"
                                    }`}
                            >
                                <Users
                                    className={`w-8 h-8 ${selectedRole === "user" ? "text-white" : "text-primary"
                                        }`}
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Student</h3>
                                <p
                                    className={`text-sm mt-1 ${selectedRole === "user"
                                        ? "text-white/80"
                                        : "text-muted-foreground group-hover:text-foreground/70"
                                        }`}
                                >
                                    Browse jobs & assessments
                                </p>
                            </div>
                            {selectedRole === "user" && isLoading && (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            )}
                        </div>
                    </button>

                    {/* Company Role */}
                    <button
                        onClick={() => handleRoleSelection("company")}
                        disabled={isLoading}
                        className={`relative group overflow-hidden rounded-lg p-6 transition-all duration-300 ${selectedRole === "company"
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                            : "border-2 border-foreground/20 hover:border-emerald-500/50 hover:bg-foreground/5"
                            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {/* Background gradient for hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex flex-col items-center justify-center h-full gap-3">
                            <div
                                className={`p-3 rounded-full transition-colors ${selectedRole === "company"
                                    ? "bg-white/20"
                                    : "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                                    }`}
                            >
                                <Building2
                                    className={`w-8 h-8 ${selectedRole === "company"
                                        ? "text-white"
                                        : "text-emerald-500"
                                        }`}
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Company</h3>
                                <p
                                    className={`text-sm mt-1 ${selectedRole === "company"
                                        ? "text-white/80"
                                        : "text-muted-foreground group-hover:text-foreground/70"
                                        }`}
                                >
                                    Post jobs & hire talent
                                </p>
                            </div>
                            {selectedRole === "company" && isLoading && (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            )}
                        </div>
                    </button>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => handleRoleSelection(selectedRole || "user")}
                        disabled={isLoading || !selectedRole}
                        className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Continue"
                        )}
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    You can change your role anytime in settings
                </p>
            </DialogContent>
        </Dialog>
    )
}
