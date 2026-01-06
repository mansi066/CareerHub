import dbConnect from "@/db/mongoDb";
import UserModel from "@/models/User.Model";
import { sendEmail } from "@/lib/email/send.email";
import { createAndStoreOTP } from "@/lib/services/otp";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();

        // Input validation
        if (!email) {
            return Response.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (user.isVarified) {
            return Response.json(
                { success: false, message: "Email already verified" },
                { status: 400 }
            );
        }

        // Generate new verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in Redis (15 minutes expiry)
        const setOtp = await createAndStoreOTP(email, Number(verifyCode), 6, 15 * 60);

        if (!setOtp) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to generate verification code. Please try again."
                },
                { status: 500 }
            );
        }

        // Send verification email
        const emailResult = await sendEmail({
            to: email,
            subject: "Verify your CareerHub Account",
            text: `Your verification code is: ${verifyCode}. This code will expire in 15 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Hello ${user.name},</p>
                    <p>You requested a new verification code. Please use the code below:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <h1 style="color: #333; letter-spacing: 5px;">${verifyCode}</h1>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <p>Best regards,<br>CareerHub Team</p>
                </div>
            `,
        });

        if (!emailResult.success) {
            console.error("Failed to send verification email:", emailResult.error);
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email. Please try again."
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Verification code resent successfully"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error resending OTP:", error);
        return Response.json(
            { success: false, message: "Failed to resend verification code. Please try again." },
            { status: 500 }
        );
    }
}
