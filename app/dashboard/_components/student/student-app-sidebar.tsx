"use client"

import * as React from "react"
import {
    Bookmark,
    Briefcase,
    GraduationCap,
    LayoutDashboard,
    Newspaper,
    Settings,
    Trophy,
    User,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SideBarLogo } from "../sidebar-logo"
import { NavMain } from "../nav-main"
import { NavUser } from "../nav-user"
import { useSession } from "next-auth/react"

const navMain = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Applications",
        url: "/dashboard/applications",
        icon: Trophy,
    },
    {
        title: "Browse Jobs",
        url: "/dashboard/browse",
        icon: Briefcase,
    },
    {
        title: "Bookmarks",
        url: "/dashboard/bookmarks",
        icon: Bookmark,
    },
    {
        title: "Assessments",
        url: "/dashboard/assessments",
        icon: GraduationCap,
    },
    {
        title: "CV Analyzer",
        url: "/dashboard/cv",
        icon: Newspaper,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useSession();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTrigger className="-ml-1" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser status={session?.status} user={session?.data?.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
