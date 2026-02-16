import mongoose, { Schema, Document } from "mongoose";

export interface CompanySocialLinks extends Document {
    user: mongoose.Types.ObjectId;
    website: string;
    linkedin: string;
    social?: string;
    reviews?: string;
    workEmailDomain: string;
    extraLinks?: { label: string; url: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const ExtraLinkSchema = new mongoose.Schema({
    label: { type: String, required: true },
    url: { type: String, required: true },
}, { _id: false });

const CompanySocialLinksSchema: Schema<CompanySocialLinks> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    website: { type: String, required: true },
    linkedin: { type: String, required: true },
    social: { type: String },
    reviews: { type: String },
    workEmailDomain: { type: String, required: true },
    extraLinks: [ExtraLinkSchema],
}, { timestamps: true });

export const CompanySocialLinksModel =
    (mongoose.models.CompanySocialLinksProfile as mongoose.Model<CompanySocialLinks>) ||
    mongoose.model<CompanySocialLinks>("CompanySocialLinksProfile", CompanySocialLinksSchema);
