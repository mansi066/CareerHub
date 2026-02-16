import mongoose, { Schema, Document } from "mongoose";

export interface CompanyRecruitment extends Document {
    user: mongoose.Types.ObjectId;
    recruiterName: string;
    recruiterLinkedIn: string;
    interviewProcess: string[];
    idealCandidatePersona?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CompanyRecruitmentSchema: Schema<CompanyRecruitment> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recruiterName: { type: String, required: true },
    recruiterLinkedIn: { type: String, required: true },
    interviewProcess: [{ type: String }],
    idealCandidatePersona: { type: String },
}, { timestamps: true });

export const CompanyRecruitmentModel =
    (mongoose.models.CompanyRecruitmentProfile as mongoose.Model<CompanyRecruitment>) ||
    mongoose.model<CompanyRecruitment>("CompanyRecruitmentProfile", CompanyRecruitmentSchema);
