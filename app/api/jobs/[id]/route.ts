import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/db/mongoDb";
import { CompanyModel } from "@/models/company/profile/CompanyBasicInfo.Model";
import { jobPostingSchema } from "@/lib/validations/auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { JobModel } from "@/models/company/job/Job.models";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

        const job = await JobModel.findOne({ _id: params.id, companyId: company._id });
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        const body = await request.json();
        const validatedData = jobPostingSchema.parse(body);

        const updatePayload: Record<string, any> = {
            ...validatedData,
            remote: typeof validatedData.remote === "boolean"
                ? validatedData.remote
                : validatedData.workplaceType === "Remote",
        };

        if (validatedData.status) {
            updatePayload.isActive = validatedData.status === "published";
        }

        const updatedJob = await JobModel.findByIdAndUpdate(
            params.id,
            updatePayload,
            { new: true }
        );

        return NextResponse.json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ message: error.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Failed to update job" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const company = await CompanyModel.findOne({ email: session.user.email });
        if (!company) {
            return NextResponse.json({ message: "Company not found" }, { status: 404 });
        }

        const job = await JobModel.findOne({ _id: params.id, companyId: company._id });
        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        await JobModel.findByIdAndDelete(params.id);

        return NextResponse.json({ message: "Job deleted successfully" });

    } catch (error) {
        return NextResponse.json({ message: "Failed to delete job" }, { status: 500 });
    }
}