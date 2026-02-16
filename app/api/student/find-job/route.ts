import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/mongoDb";
import { JobModel } from "@/models/company/job/Job.models";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q")?.trim();
        const title = searchParams.get("title")?.trim();
        const department = searchParams.get("department")?.trim();
        const type = searchParams.get("type")?.trim();
        const workplaceType = searchParams.get("workplaceType")?.trim();
        const location = searchParams.get("location")?.trim();
        const skills = searchParams.get("skills")?.trim();
        const from = searchParams.get("from")?.trim();
        const to = searchParams.get("to")?.trim();
        const time = searchParams.get("time")?.trim();
        const sort = searchParams.get("sort")?.trim() || "-createdAt";

        const filter: Record<string, any> = {
            status: "published",
            isActive: true,
        };

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

        const jobs = await JobModel.find(filter)
            .sort(sort)
            .populate("companyId", "name logo");

        return NextResponse.json({ jobs }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Failed to fetch jobs" }, { status: 500 });
    }
}
