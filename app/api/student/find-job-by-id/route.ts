import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/mongoDb";
import { JobModel } from "@/models/company/job/Job.models";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Job id is required" }, { status: 400 });
        }

        const job = await JobModel.findOne({ _id: id, status: "published", isActive: true })
            .populate("companyId", "name logo");

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ job }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Failed to fetch job" }, { status: 500 });
    }
}
