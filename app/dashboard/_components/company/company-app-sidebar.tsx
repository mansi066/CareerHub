"use client"

import * as React from "react"
import {
    BarChart3,
    Briefcase,
    FileText,
    Settings2,
    Users,
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "../nav-user"
import { NavMain } from "../nav-main"
import { useSession } from "next-auth/react"

// Company-focused navigation data
const data = {
    navMain: [
        {
            title: "Overview",
            url: "/dashboard/company",
            icon: BarChart3,
        },
        {
            title: "Job Posts",
            url: "/dashboard/company/jobs",
            icon: Briefcase,
        },
        {
            title: "Applicants",
            url: "/dashboard/company/applicants",
            icon: Users,
        },
        {
            title: "Profile",
            url: "/dashboard/company/profile",
            icon: FileText,
        }, {
            title: "Settings",
            url: "/dashboard/company/settings",
            icon: Settings2,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useSession();
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="mx-1 mt-1 mb-2">
                <SidebarTrigger className="-ml-1" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser status={session?.status} user={session?.data?.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
