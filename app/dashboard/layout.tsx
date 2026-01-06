import type React from "react"
import "../globals.css"
import Headers from "./_components/header"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Headers />
                {children}
            </body>
        </html>
    )
}
