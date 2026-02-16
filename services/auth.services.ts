"use server"
import type { SignupFormData } from "@/lib/validations/auth"

const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

async function postJson(path: string, body: unknown) {
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        })
        return await res.json()
    } catch (error) {
        console.error(`API call ${path} failed:`, error)
        return { success: false, error: "API request failed" }
    }
}

export async function signupAction(data: SignupFormData) {
    return await postJson("/api/auth/register", data)
}

export async function verifyOtpAction(email: string, otp: string) {
    return await postJson("/api/auth/verify-otp", { email, otp })
}

export async function resendOtpAction(email: string) {
    return await postJson("/api/auth/resend-otp", { email })
}

export async function updateUserRoleAction(email: string, role: "user" | "company") {
    return await postJson("/api/auth/update-role", { email, role })
}

