import { z } from "zod"

// Password change schema
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
})

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

// Profile update schema (extending the existing profile edit)
export const profileUpdateSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    skills: z.string().optional(),
    interests: z.string().optional(),
})

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>

// Notification settings schema
export const notificationSettingsSchema = z.object({
    emailNotifications: z.boolean(),
    jobAlerts: z.boolean(),
    applicationUpdates: z.boolean(),
    newsletter: z.boolean(),
    marketingEmails: z.boolean(),
})

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>

// Privacy settings schema
export const privacySettingsSchema = z.object({
    profileVisibility: z.enum(['public', 'private', 'connections']),
    showEmail: z.boolean(),
    showResume: z.boolean(),
    dataSharing: z.boolean(),
})

export type PrivacySettingsFormData = z.infer<typeof privacySettingsSchema>

// Account deletion schema
export const accountDeletionSchema = z.object({
    confirmation: z.string().refine((val) => val === "" || val === "DELETE", {
        message: "Please type 'DELETE' to confirm account deletion"
    }),
    reason: z.string().optional(),
})

export type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>