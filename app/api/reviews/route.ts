import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/db/mongoDb";
import ReviewModel from "@/models/Review.Model";
import { CompanyModel } from "@/models/Company.Model";
import { companyReviewSchema } from "@/lib/validations/review";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate the request body
        const validationResult = companyReviewSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { message: "Validation failed", errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const reviewData = validationResult.data;

        // Connect to database
        await dbConnect();

        // Check if company exists
        const company = await CompanyModel.findById(reviewData.companyId);
        if (!company) {
            return NextResponse.json(
                { message: "Company not found" },
                { status: 404 }
            );
        }

        // Check if user already reviewed this company
        const existingReview = await ReviewModel.findOne({
            userId: session.user.id,
            companyId: reviewData.companyId,
        });

        if (existingReview) {
            return NextResponse.json(
                { message: "You have already reviewed this company" },
                { status: 409 }
            );
        }

        // Create the review
        const review = new ReviewModel({
            ...reviewData,
            userId: session.user.id,
            companyId: reviewData.companyId,
        });

        await review.save();

        // Update company review stats (this could be done in a background job)
        // For now, we'll just return success

        return NextResponse.json(
            {
                message: "Review submitted successfully",
                review: {
                    id: review._id,
                    rating: review.rating,
                    title: review.title,
                    createdAt: review.createdAt,
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get("companyId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (!companyId) {
            return NextResponse.json(
                { message: "Company ID is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const reviews = await ReviewModel.find({ companyId })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await ReviewModel.countDocuments({ companyId });

        // Transform the data to match the existing CompanyReview interface
        const transformedReviews = reviews.map(review => ({
            id: review._id.toString(),
            companyId: review.companyId.toString(),
            userId: review.userId.toString(),
            userName: (review.userId as any)?.name || 'Anonymous',
            rating: review.rating,
            title: review.title,
            content: review.content,
            pros: review.pros,
            cons: review.cons,
            workEnvironment: review.workEnvironment,
            compensation: review.compensation,
            careerGrowth: review.careerGrowth,
            createdAt: review.createdAt.toISOString(),
            helpful: 0, // This would need to be implemented separately
            position: review.position,
            workType: review.workType,
        }));

        return NextResponse.json({
            reviews: transformedReviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}