"use client"
import { Fragment } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "../_components/student/student-app-sidebar"
import { usePathname } from "next/navigation"
import { SideBarLogo } from "../_components/sidebar-logo"
export default function Page({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 overflow-hidden transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex min-w-0 flex-1 items-center gap-2 px-4 whitespace-nowrap">
                        <div className="justify-center items-center flex">
                            <SideBarLogo />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                        </div>

                        <Breadcrumb className="min-w-0">
                            <BreadcrumbList className="flex flex-nowrap items-center gap-2 overflow-hidden">
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Student Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {(() => {
                                    const segments = (pathName || "").split("?")[0].split("/").filter(Boolean)
                                    const dashboardIdx = segments.indexOf("dashboard")
                                    const trail = dashboardIdx >= 0 ? segments.slice(dashboardIdx + 1) : []
                                    const format = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

                                    if (trail.length === 0) return null

                                    const items = trail.map((seg, i) => {
                                        const href = "/dashboard/" + trail.slice(0, i + 1).join("/")
                                        const label = format(seg)
                                        const isLast = i === trail.length - 1
                                        return (
                                            <Fragment key={href}>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                                <BreadcrumbItem>
                                                    {isLast ? (
                                                        <BreadcrumbPage>{label}</BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        )
                                    })
                                    return items
                                })()}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex-1 overflow-auto">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
