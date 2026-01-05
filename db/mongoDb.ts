import { DB_NAME } from "@/constant";
import mongoose from "mongoose";

export let dbInstance: mongoose.Mongoose | null = null;

const connectDB = async (): Promise<mongoose.Mongoose> => {
    const baseUri = process.env.MONGODB_URI;

    if (!baseUri) {
        throw new Error("Missing MONGODB_URI environment variable");
    }

    try {
        const connectionInstance = await mongoose.connect(`${baseUri}/${DB_NAME}`);
        dbInstance = connectionInstance;
        console.log(`\n MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`);
        return connectionInstance;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;