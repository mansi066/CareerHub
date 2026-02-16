import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/db/mongoDb";
import { CompanyModel } from "@/models/company/profile/CompanyBasicInfo.Model";
import { jobPostingSchema } from "@/lib/validations/auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { JobModel } from "@/models/company/job/Job.models";
import UserModel from "@/models/User.Model";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await UserModel.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const company = await CompanyModel.findOne({ user: user._id });
        if (!company) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q")?.trim();
        const title = searchParams.get("title")?.trim();
        const department = searchParams.get("department")?.trim();
        const type = searchParams.get("type")?.trim();
        const workplaceType = searchParams.get("workplaceType")?.trim();
        const status = searchParams.get("status")?.trim();
        const location = searchParams.get("location")?.trim();
        const skills = searchParams.get("skills")?.trim();
        const from = searchParams.get("from")?.trim();
        const to = searchParams.get("to")?.trim();
        const time = searchParams.get("time")?.trim();
        const sort = searchParams.get("sort")?.trim() || "-createdAt";

        const filter: Record<string, any> = { companyId: company._id };

        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { department: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
            ];
        }

        if (title) filter.title = { $regex: title, $options: "i" };
        if (department) filter.department = { $regex: department, $options: "i" };
        if (type) filter.type = type;
        if (workplaceType) filter.workplaceType = workplaceType;
        if (status) filter.status = status;
        if (location) filter.location = { $regex: location, $options: "i" };

        if (skills) {
            const list = skills.split(",").map(s => s.trim()).filter(Boolean);
            if (list.length) filter.skills = { $all: list };
        }

        if (time && !from && !to) {
            const days = Number(time.replace(/[^0-9]/g, ""));
            if (!Number.isNaN(days) && days > 0) {
                const start = new Date();
                start.setDate(start.getDate() - days);
                filter.createdAt = { $gte: start };
            }
        }

        if (from || to) {
            const range: Record<string, Date> = {};
            if (from) range.$gte = new Date(from);
            if (to) range.$lte = new Date(to);
            filter.createdAt = { ...(filter.createdAt || {}), ...range };
        }

        const jobs = await JobModel.find(filter).sort(sort);

        return NextResponse.json({ jobs }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const company = await CompanyModel.findOne({ user: session.user.id });
        if (!company) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        const body = await request.json();
        const validatedData = jobPostingSchema.parse(body);

        const remote = typeof validatedData.remote === "boolean"
            ? validatedData.remote
            : validatedData.workplaceType === "Remote";

        const status = validatedData.status || "published";

        const job = await JobModel.create({
            ...validatedData,
            companyId: company._id,
            remote,
            isActive: status === "published",
        });

        return NextResponse.json({
            message: status === "draft" ? "Job saved as draft" : "Job posted successfully",
            job,
        }, { status: 201 });

    } catch (error: any) {
        if (error?.name === "ZodError") {
            return NextResponse.json({ message: error.errors?.[0]?.message || "Invalid data" }, { status: 400 });
        }
        return NextResponse.json({ message: error?.message || "Failed to create job" }, { status: 500 });
    }
}
