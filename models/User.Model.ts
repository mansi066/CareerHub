import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    name: string;
    username: string;
    image: string;
    email: string;
    password?: string;
    isVarified: boolean;
    role?: string;
}

const UserSchema: Schema<User> = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, match: /.+@.+\..+/ },
    password: { type: String },
    isVarified: { type: Boolean, default: false, required: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'company', 'startup'], default: 'user' },

});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);
export default UserModel;