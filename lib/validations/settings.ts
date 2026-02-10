import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  skills: z.string().max(200, "Skills must be less than 200 characters").optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  jobAlerts: z.boolean().default(true),
  applicationUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  weeklyDigest: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "private", "connections"]).default("public"),
  showEmail: z.boolean().default(false),
  showResume: z.boolean().default(true),
  allowMessaging: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
  analyticsTracking: z.boolean().default(true),
});

export const accountDeletionSchema = z.object({
  reason: z.string().max(500, "Reason must be less than 500 characters").optional(),
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: "Please type 'DELETE' to confirm",
  }),
});
