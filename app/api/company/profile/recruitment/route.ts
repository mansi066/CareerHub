import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/db/mongoDb"
import UserModel from "@/models/User.Model"
import { CompanyRecruitmentModel } from "@/models/company/profile/CompanyRecruitment.Model"
import { companyRecruitmentSchema } from "@/lib/validations/auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const body = await request.json()
        const validatedData = companyRecruitmentSchema.parse(body)

        const user = await UserModel.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const existing = await CompanyRecruitmentModel.findOne({ user: user._id })
        if (existing) {
            existing.recruiterName = validatedData.recruiterName
            existing.recruiterLinkedIn = validatedData.recruiterLinkedIn
            existing.interviewProcess = validatedData.interviewProcess
            existing.idealCandidatePersona = validatedData.idealCandidatePersona
            await existing.save()
            return NextResponse.json({ message: "Recruitment specifics updated", data: existing }, { status: 200 })
        }

        const created = await CompanyRecruitmentModel.create({
            user: user._id,
            recruiterName: validatedData.recruiterName,
            recruiterLinkedIn: validatedData.recruiterLinkedIn,
            interviewProcess: validatedData.interviewProcess,
            idealCandidatePersona: validatedData.idealCandidatePersona,
        })

        return NextResponse.json({ message: "Recruitment specifics saved", data: created }, { status: 201 })
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return NextResponse.json({ message: error.errors?.[0]?.message || "Invalid data" }, { status: 400 })
        }
        return NextResponse.json({ message: error?.message || "Failed to save recruitment specifics" }, { status: 500 })
    }
}
