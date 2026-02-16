import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/db/mongoDb"
import UserModel from "@/models/User.Model"
import { CompanyCultureModel } from "@/models/company/profile/CompanyCulture.Model"
import { companyCultureSchema } from "@/lib/validations/auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const body = await request.json()
        const validatedData = companyCultureSchema.parse(body)

        const user = await UserModel.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const existing = await CompanyCultureModel.findOne({ user: user._id })
        if (existing) {
            existing.workMode = validatedData.workMode
            existing.companyValues = validatedData.companyValues
            existing.perks = validatedData.perks
            existing.officePhotoUrls = validatedData.officePhotoUrls
            await existing.save()
            return NextResponse.json({ message: "Culture & working style updated", data: existing }, { status: 200 })
        }

        const created = await CompanyCultureModel.create({
            user: user._id,
            workMode: validatedData.workMode,
            companyValues: validatedData.companyValues,
            perks: validatedData.perks,
            officePhotoUrls: validatedData.officePhotoUrls,
        })

        return NextResponse.json({ message: "Culture & working style saved", data: created }, { status: 201 })
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return NextResponse.json({ message: error.errors?.[0]?.message || "Invalid data" }, { status: 400 })
        }
        return NextResponse.json({ message: error?.message || "Failed to save culture & working style" }, { status: 500 })
    }
}
