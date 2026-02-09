import type React from "react"
import "../globals.css"
import Headers from "./_components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
