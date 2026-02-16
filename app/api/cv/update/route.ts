import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Load environment variables at the top
if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.warn('GOOGLE_GENAI_API_KEY is not set');
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Only import genkit flows at runtime
const importFlows = async () => {
    const { generateUpdatedResume } = await import('@/ai/flows/generate-updated-resume');
    return { generateUpdatedResume };
};

const schema = z.object({
    resumeFileUri: z.string().startsWith("data:", { message: "Resume must be a valid data URI." }),
    jobDescriptionText: z.string().min(50, "Job description text must be at least 50 characters."),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validation = schema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors.map(e => e.message).join(', ') },
                { status: 400 }
            );
        }

        const { resumeFileUri, jobDescriptionText } = validation.data;

        // Import flows at runtime to avoid bundling issues
        const { generateUpdatedResume } = await importFlows();

        const result = await generateUpdatedResume({ resumeFileUri, jobDescription: jobDescriptionText });
        return NextResponse.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error in CV update API:", errorMessage, error);
        return NextResponse.json(
            { error: errorMessage || "Failed to create updated resume from AI service." },
            { status: 500 }
        );
    }
}
