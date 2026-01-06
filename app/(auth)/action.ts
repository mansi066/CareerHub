"use server"

import { z } from "zod"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"

export async function signupAction(data: SignupFormData) {
    try {
        // Validate with Zod
        const validatedData = signupSchema.parse(data)

        // Call the register API endpoint
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: validatedData.name,
                email: validatedData.email,
                password: validatedData.password,
            }),
        })

        const result = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: result.message || "Failed to create account",
            }
        }

        return {
            success: true,
            message: result.message || "Account created successfully! Please check your email to verify your account.",
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message,
            }
        }

        console.error("Signup error:", error)
        return {
            success: false,
            error: "Failed to create account. Please try again.",
        }
    }
}
