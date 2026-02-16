import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/db/mongoDb"
import UserModel from "@/models/User.Model"
import { CompanySocialLinksModel } from "@/models/company/profile/CompanySocialLinks.Model"
import { companySocialLinksSchema } from "@/lib/validations/auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const body = await request.json()
        const validatedData = companySocialLinksSchema.parse(body)

        const user = await UserModel.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const existing = await CompanySocialLinksModel.findOne({ user: user._id })
        if (existing) {
            existing.website = validatedData.website
            existing.linkedin = validatedData.linkedin
            existing.social = validatedData.social || undefined
            existing.reviews = validatedData.reviews || undefined
            existing.workEmailDomain = validatedData.workEmailDomain
            existing.extraLinks = validatedData.extraLinks || []
            await existing.save()
            return NextResponse.json({ message: "Social links updated", data: existing }, { status: 200 })
        }

        const created = await CompanySocialLinksModel.create({
            user: user._id,
            website: validatedData.website,
            linkedin: validatedData.linkedin,
            social: validatedData.social || undefined,
            reviews: validatedData.reviews || undefined,
            workEmailDomain: validatedData.workEmailDomain,
            extraLinks: validatedData.extraLinks || [],
        })

        return NextResponse.json({ message: "Social links saved", data: created }, { status: 201 })
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return NextResponse.json({ message: error.errors?.[0]?.message || "Invalid data" }, { status: 400 })
        }
        return NextResponse.json({ message: error?.message || "Failed to save social links" }, { status: 500 })
    }
}
