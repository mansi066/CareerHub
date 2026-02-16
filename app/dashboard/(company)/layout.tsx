import type React from "react"
import { Toaster } from "sonner"

export default function CompanyDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <>{children}
        <Toaster position="top-center" richColors />
    </>
}
