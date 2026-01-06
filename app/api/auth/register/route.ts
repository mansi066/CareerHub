import dbConnect from "@/db/mongoDb";
import UserModel from "@/models/User.Model";
import { sendEmail } from "@/lib/email/send.email";
import bcrypt from "bcryptjs";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (minimum 8 chars, 1 uppercase, 1 number, 1 special char)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password, confirmPassword } = await request.json();

        // Input validation
        if (!name || !email || !password) {
            return Response.json(
                { success: false, message: "Please provide all required fields" },
                { status: 400 }
            );
        }

        if (!emailRegex.test(email)) {
            return Response.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return Response.json(
                { success: false, message: "Passwords do not match" },
                { status: 400 }
            );
        }

        if (!passwordRegex.test(password)) {
            return Response.json(
                {
                    success: false,
                    message: "Password must be at least 8 characters with uppercase, number, and special character"
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser && existingUser.isVarified) {
            return Response.json(
                { success: false, message: "User already exists with this email" },
                { status: 400 }
            );
        }

        // Generate verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUser && !existingUser.isVarified) {
            // Update existing unverified user
            await UserModel.findByIdAndUpdate(existingUser._id, {
                name,
                password: await bcrypt.hash(password, 10),
            });
        } else {
            // Create new user
            const username = email.split('@')[0] + Math.floor(1000 + Math.random() * 9000);
            const newUser = new UserModel({
                name,
                username,
                email,
                password: await bcrypt.hash(password, 10),
                verifyCode,
                isVarified: false,
            });
            await newUser.save();
        }
        // Set verification code expiry (15 minutes from now)

        // Send verification email
        const emailResult = await sendEmail({
            to: email,
            subject: "Verify your CareerHub Account",
            text: `Your verification code is: ${verifyCode}. This code will expire in 30 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Hello ${name},</p>
                    <p>Thank you for registering with CareerHub. Please verify your email address using the code below:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <h1 style="color: #333; letter-spacing: 5px;">${verifyCode}</h1>
                    </div>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't register for this account, please ignore this email.</p>
                    <p>Best regards,<br>CareerHub Team</p>
                </div>
            `,
        });

        if (!emailResult.success) {
            // Still save user but warn about email issue
            console.error("Failed to send verification email:", emailResult.error);
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully, but failed to send verification email. Please try again or contact support."
                },
                { status: 201 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please check your email to verify your account."
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            { success: false, message: "Failed to register user. Please try again." },
            { status: 500 }
        );
    }
}