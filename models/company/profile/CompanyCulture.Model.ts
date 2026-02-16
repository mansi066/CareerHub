import mongoose, { Schema, Document } from "mongoose";

export interface CompanyCulture extends Document {
    user: mongoose.Types.ObjectId;
    workMode?: string;
    companyValues?: string[];
    perks?: string[];
    officePhotoUrls?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CompanyCultureSchema: Schema<CompanyCulture> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workMode: { type: String },
    companyValues: [{ type: String }],
    perks: [{ type: String }],
    officePhotoUrls: [{ type: String }],
}, { timestamps: true });

export const CompanyCultureModel =
    (mongoose.models.CompanyCultureProfile as mongoose.Model<CompanyCulture>) ||
    mongoose.model<CompanyCulture>("CompanyCultureProfile", CompanyCultureSchema);
