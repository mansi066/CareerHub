import { NextResponse } from "next/server"
import { buildSignedUploadPayload } from "@/lib/cloudinary/cloudinary.config"

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const payload = buildSignedUploadPayload({
            folder: body?.folder,
            uploadPreset: body?.uploadPreset,
            resourceType: body?.resourceType,
        })

        return NextResponse.json(payload, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Failed to generate signed upload payload" },
            { status: error?.statusCode || 500 }
        )
    }
}
