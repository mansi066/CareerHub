import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/db/mongoDb"
import { CompanyModel } from "@/models/company/profile/CompanyBasicInfo.Model"
import UserModel from "@/models/User.Model"
import { companyProfileSchema } from "@/lib/validations/auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const body = await request.json()
        const validatedData = companyProfileSchema.parse(body)
        // update the company image in the database
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: session.user.email },
            { image: validatedData.logoUrl },
            { new: true }
        )
        let company = await CompanyModel.findOne({ email: session.user.email })
        if (!company) {
            const user = await UserModel.findOne({ email: session.user.email })
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 })
            }
            company = await CompanyModel.create({
                name: validatedData.name,
                email: session.user.email,
                user: user._id,
                isVerified: false,
            })
        }

        company.name = validatedData.name
        company.tagline = validatedData.tagline
        company.industry = validatedData.industry
        company.size = validatedData.size
        company.companyType = validatedData.companyType
        const isStartup = (validatedData.companyType || "").toLowerCase() === "startup"
        company.registrationNumber = isStartup ? (validatedData.registrationNumber || "NA") : (validatedData.registrationNumber ?? undefined)
        company.gstPan = isStartup ? (validatedData.gstPan || "NA") : (validatedData.gstPan ?? undefined)
        company.emailDomain = validatedData.emailDomain
        company.website = validatedData.website || company.website
        company.foundingYear = validatedData.foundingYear
        company.logo = validatedData.logoUrl || company.logo
        company.description = validatedData.about
        company.headquarters = validatedData.headquarters
        company.location = validatedData.headquarters

        await company.save()

        return NextResponse.json({ message: "Company profile updated", company }, { status: 200 })
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return NextResponse.json({ message: error.errors?.[0]?.message || "Invalid data" }, { status: 400 })
        }
        return NextResponse.json({ message: error?.message || "Failed to update company profile" }, { status: 500 })
    }
}
