"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { cn } from "@/lib/utils" // Ensure you have this utility or use standard string interpolation

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar, // <--- Import this
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const { open } = useSidebar()

    // Fallback values
    const userName = session?.user?.name || "Company Name"
    const userImage = session?.user?.image || "/default-company-logo.png"

    return (
        <SidebarGroup className="transition-all duration-300 ease-in-out">
            <SidebarMenu className="mb-6 transition-all duration-300 ease-in-out">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className={cn(
                            "transition-all duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground overflow-hidden",
                            open ? "h-auto flex-col py-6 gap-4" : "h-12 justify-center"
                        )}
                    >
                        <div
                            className={cn(
                                "relative flex items-center justify-center overflow-hidden rounded-full border border-sidebar-border shadow-sm transition-[width,height] duration-300 ease-in-out",
                                open ? "size-24" : "size-8"
                            )}
                        >
                            <Image
                                src={userImage}
                                alt={userName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {open && (
                            <div className="flex flex-col items-center gap-1 text-center transition-all duration-300 ease-in-out">
                                <span className="font-bold text-lg leading-none tracking-tight">
                                    {userName}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {session?.user?.email || "Admin Account"}
                                </span>
                            </div>
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            {/* NAVIGATION ITEMS */}
            <SidebarGroupLabel>Company Control</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`)

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                                className="transition-all active:scale-95"
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span className="font-bold">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}