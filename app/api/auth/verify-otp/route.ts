import dbConnect from "@/db/mongoDb";
import UserModel from "@/models/User.Model";
import { verifyOTP } from "@/lib/services/otp";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, otp } = await request.json();

        // Input validation
        if (!email || !otp) {
            return Response.json(
                { success: false, message: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValidOtp = await verifyOTP(email, Number(otp));

        if (!isValidOtp) {
            return Response.json(
                { success: false, message: "Invalid or expired verification code" },
                { status: 400 }
            );
        }

        // Update user verification status
        const user = await UserModel.findOne({ email });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        user.isVarified = true;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Email verified successfully"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return Response.json(
            { success: false, message: "Failed to verify OTP. Please try again." },
            { status: 500 }
        );
    }
}
