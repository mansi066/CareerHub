import { NextRequest, NextResponse } from "next/server"
import { ai } from "@/ai/genkit"
import { z } from "genkit"

const buildApplyBy = () => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split("T")[0]
}

const JobAIInputSchema = z.object({
    context: z.string().describe("Short context about the job, team, or role"),
})

const JobAIOutputSchema = z.object({
    title: z.string(),
    department: z.string(),
    jobType: z.string(),
    workplaceType: z.string(),
    location: z.string(),
    description: z.string().describe("Long Markdown job description with multiple sections"),
    experience: z.string(),
    experienceRange: z.string(),
    skills: z.array(z.string()),
    requirements: z.array(z.string()),
    salaryMin: z.string(),
    salaryMax: z.string(),
    currency: z.string(),
    salaryFrequency: z.string(),
    benefits: z.array(z.string()),
    applyUrl: z.string(),
    applyBy: z.string(),
    thumbnailUrl: z.string().optional(),
    documents: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
})

const jobCreatePrompt = ai.definePrompt({
    name: "aiJobCreatePrompt",
    input: { schema: JobAIInputSchema },
    output: { schema: JobAIOutputSchema },
    prompt: `You are a senior technical recruiter. Create a complete, detailed job post from the context.
Return ONLY valid JSON matching the output schema. The description must be long and detailed (at least 6 paragraphs) in Markdown using ONLY the basic syntax from https://www.markdownguide.org/basic-syntax/ (headings, paragraphs, emphasis, lists, links).
Include sections: About the Role, Responsibilities, Qualifications, Nice to Have, Tech Stack/Tools, Hiring Process, Benefits, and Company Culture.
Use realistic values, avoid placeholders, and make sure every field is filled.

Constraints:
- jobType MUST be one of: Full-time, Part-time, Contract, Freelance, Internship
- experience MUST be one of: Entry Level, Mid Level, Senior Level, Lead / Manager, Director, Executive
- workplaceType MUST be one of: On-site, Hybrid, Remote
- salaryFrequency MUST be one of: Yearly, Monthly, Hourly

Context:
{{context}}`,
})

export async function POST(request: NextRequest) {
    try {
        if (!process.env.GOOGLE_GENAI_API_KEY && process.env.GEMINI_API_KEY) {
            process.env.GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY
        }

        const { context } = await request.json()
        const safeContext = typeof context === "string" ? context.trim() : ""
        if (!safeContext) {
            return NextResponse.json({ message: "Context is required" }, { status: 400 })
        }

        const { output } = await jobCreatePrompt({ context: safeContext })

        const fallbackDescription = `## About the Role
We’re looking for a motivated professional to join our team and deliver measurable impact across the product lifecycle.

## Responsibilities
- Own features from discovery to delivery
- Collaborate with product, design, and engineering
- Write clean, maintainable, and well-tested code

## Qualifications
- Strong fundamentals and practical experience
- Excellent communication and collaboration skills
- Ability to solve ambiguous problems

## Nice to Have
- Experience with modern frameworks and tooling
- Exposure to cloud platforms and CI/CD

## Tech Stack / Tools
- React, TypeScript, Node.js
- REST APIs, Postgres, CI/CD pipelines

## Hiring Process
- Initial screening
- Technical interview
- Final team round

## Benefits
- Competitive compensation
- Flexible work options
- Growth and learning opportunities

## Company Culture
We value ownership, transparency, and continuous improvement.`

        const payload = {
            ...output,
            description: output?.description?.trim() || fallbackDescription,
            applyBy: output?.applyBy || buildApplyBy(),
            documents: output?.documents || [],
            thumbnailUrl: output?.thumbnailUrl || "",
        }

        return NextResponse.json(payload, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Failed to generate job" }, { status: 500 })
    }
}