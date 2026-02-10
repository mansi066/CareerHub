import mongoose, { Schema, Document } from "mongoose";

export interface JobApplication extends Document {
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    status: 'applied' | 'interviewing' | 'rejected' | 'accepted' | 'withdrawn';
    appliedDate: Date;
    lastUpdated: Date;
    notes?: string;
    interviewDate?: Date;
    offerDetails?: {
        salary?: number;
        startDate?: Date;
        notes?: string;
    };
}

const JobApplicationSchema: Schema<JobApplication> = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied',
        required: true
    },
    appliedDate: { type: Date, default: Date.now, required: true },
    lastUpdated: { type: Date, default: Date.now, required: true },
    notes: { type: String },
    interviewDate: { type: Date },
    offerDetails: {
        salary: { type: Number },
        startDate: { type: Date },
        notes: { type: String }
    }
});

// Compound index to prevent duplicate applications for the same job by the same user
JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// Update lastUpdated on save
JobApplicationSchema.pre('save', function(this: JobApplication, next: (err?: Error) => void) {
    this.lastUpdated = new Date();
    next();
});

const JobApplicationModel = mongoose.models.JobApplication as mongoose.Model<JobApplication> ||
    mongoose.model<JobApplication>("JobApplication", JobApplicationSchema);

export default JobApplicationModel;