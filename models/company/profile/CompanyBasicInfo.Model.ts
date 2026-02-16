import mongoose, { Schema, Document } from "mongoose";

export interface Company extends Document {
    name: string;
    email: string;
    logo?: string;
    tagline?: string;
    description?: string;
    website?: string;
    location?: string;
    headquarters?: string;
    industry?: string;
    size?: string;
    companyType?: string;
    registrationNumber?: string;
    gstPan?: string;
    emailDomain?: string;
    foundingYear?: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: mongoose.Types.ObjectId;
}



const CompanySchema: Schema<Company> = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    logo: { type: String },
    tagline: { type: String },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    headquarters: { type: String },
    industry: { type: String },
    size: { type: String },
    companyType: { type: String },
    registrationNumber: { type: String },
    gstPan: { type: String },
    emailDomain: { type: String },
    foundingYear: { type: Number },
    isVerified: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const CompanyModel = (mongoose.models.CompanyBasicProfile as mongoose.Model<Company>) || mongoose.model<Company>("CompanyBasicProfile", CompanySchema);
