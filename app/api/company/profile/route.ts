import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/db/mongoDb"
import UserModel from "@/models/User.Model"
import { CompanyModel as CompanyBasicInfoModel } from "@/models/company/profile/CompanyBasicInfo.Model"
import { CompanyCultureModel } from "@/models/company/profile/CompanyCulture.Model"
import { CompanyRecruitmentModel } from "@/models/company/profile/CompanyRecruitment.Model"
import { CompanySocialLinksModel } from "@/models/company/profile/CompanySocialLinks.Model"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()
        const user = await UserModel.findOne({ email: session.user.email })
        // console.log("Found user:", user);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const [basicByUser, basicByEmail, culture, recruitment, socialLinks] = await Promise.all([
            CompanyBasicInfoModel.findOne({ user: user._id }),
            CompanyBasicInfoModel.findOne({ email: session.user.email }),
            CompanyCultureModel.findOne({ user: user._id }),
            CompanyRecruitmentModel.findOne({ user: user._id }),
            CompanySocialLinksModel.findOne({ user: user._id }),
        ])

        const basicInfo = basicByUser || basicByEmail
        return NextResponse.json(
            {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                },
                basicInfo,
                culture,
                recruitment,
                socialLinks,
            },
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Failed to load profile" }, { status: 500 })
    }
}

