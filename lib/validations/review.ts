import { z } from "zod";

export const companyReviewSchema = z.object({
    companyId: z.string().min(1, "Company ID is required"),
    rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
    title: z.string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must be less than 200 characters"),
    content: z.string()
        .min(20, "Review content must be at least 20 characters")
        .max(2000, "Review content must be less than 2000 characters"),
    workEnvironment: z.number().min(1, "Please rate work environment").max(5),
    compensation: z.number().min(1, "Please rate compensation").max(5),
    careerGrowth: z.number().min(1, "Please rate career growth").max(5),
    pros: z.array(z.string().min(1, "Pro cannot be empty").max(200, "Pro must be less than 200 characters"))
        .min(0)
        .max(10, "Maximum 10 pros allowed"),
    cons: z.array(z.string().min(1, "Con cannot be empty").max(200, "Con must be less than 200 characters"))
        .min(0)
        .max(10, "Maximum 10 cons allowed"),
    position: z.string().max(100, "Position must be less than 100 characters").optional(),
    workType: z.enum(['full-time', 'part-time', 'internship', 'contract']).optional(),
    isVerified: z.boolean().default(false),
});

export type CompanyReviewFormData = z.infer<typeof companyReviewSchema>;