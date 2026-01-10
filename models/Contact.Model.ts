import mongoose, { Schema, Document } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  category: "general" | "support" | "bug" | "feedback" | "partnership" | "account"
  message: string
  status: "new" | "in-progress" | "resolved" | "closed"
  createdAt: Date
  updatedAt: Date
}

const ContactSchema: Schema<IContact> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["general", "support", "bug", "feedback", "partnership", "account"],
      required: [true, "Category is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
)

// Add indexes for better query performance
ContactSchema.index({ email: 1 })
ContactSchema.index({ category: 1 })
ContactSchema.index({ status: 1 })
ContactSchema.index({ createdAt: -1 })

const ContactModel = mongoose.models.Contact as mongoose.Model<IContact> || mongoose.model<IContact>("Contact", ContactSchema)

export default ContactModel
