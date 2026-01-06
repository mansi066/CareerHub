import type React from "react"
import Headers from "@/components/header"

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Headers />
            {children}
        </>
    )
}
