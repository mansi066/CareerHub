import mongoose, { Schema, Document } from "mongoose";

export interface Review extends Document {
    companyId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number; // 1-5 overall rating
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    workEnvironment: number; // 1-5
    compensation: number; // 1-5
    careerGrowth: number; // 1-5
    position?: string;
    workType?: 'full-time' | 'part-time' | 'internship' | 'contract';
    isVerified: boolean; // Whether the reviewer actually worked there
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema<Review> = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    pros: [{
        type: String,
        trim: true,
        maxLength: 200
    }],
    cons: [{
        type: String,
        trim: true,
        maxLength: 200
    }],
    workEnvironment: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    compensation: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    careerGrowth: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    position: {
        type: String,
        trim: true,
        maxLength: 100
    },
    workType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract']
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
ReviewSchema.index({ companyId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, companyId: 1 }, { unique: true }); // One review per user per company

// Prevent duplicate reviews from same user for same company
ReviewSchema.pre('save', function(next: any) {
    const review = this as any;
    ReviewModel.findOne({
        userId: review.userId,
        companyId: review.companyId,
        _id: { $ne: review._id }
    }).then((existingReview: any) => {
        if (existingReview) {
            const error = new Error('You have already reviewed this company');
            next(error);
        } else {
            next();
        }
    }).catch((err: any) => {
        next(err);
    });
});

const ReviewModel = mongoose.models.Review as mongoose.Model<Review> ||
    mongoose.model<Review>("Review", ReviewSchema);

export default ReviewModel;