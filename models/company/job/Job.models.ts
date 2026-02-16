import mongoose, { Schema, Document } from "mongoose";

export interface Job extends Document {
    companyId: mongoose.Types.ObjectId;
    title: string;
    department?: string;
    type: string;
    workplaceType?: string;
    location: string;
    remote?: boolean;
    description: string;
    experience?: string;
    experienceRange?: string;
    requirements: string[];
    skills: string[];
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
        frequency?: string;
    };
    benefits?: string[];
    applyUrl?: string;
    applyBy?: string;
    thumbnailUrl?: string;
    documents?: { name: string; url: string }[];
    status: "published" | "draft";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema: Schema<Job> = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyBasicProfile", required: true },
    title: { type: String, required: true },
    department: { type: String },
    type: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "full-time", "part-time", "contract", "internship"],
        required: true,
    },
    workplaceType: { type: String, enum: ["On-site", "Hybrid", "Remote"] },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    description: { type: String, required: true },
    experience: { type: String },
    experienceRange: { type: String },
    requirements: [{ type: String }],
    skills: [{ type: String }],
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: "USD" },
        frequency: { type: String },
    },
    benefits: [{ type: String }],
    applyUrl: { type: String },
    applyBy: { type: String },
    thumbnailUrl: { type: String },
    documents: [
        {
            name: { type: String },
            url: { type: String },
        },
    ],
    status: { type: String, enum: ["published", "draft"], default: "published" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });


export const JobModel = (mongoose.models.CompanyJob as mongoose.Model<Job>) || mongoose.model<Job>("CompanyJob", JobSchema);
