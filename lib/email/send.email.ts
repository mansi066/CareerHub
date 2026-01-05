import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER || "maddison53@ethereal.email",
        pass: process.env.EMAIL_PASS || "jn7jnAPss4f63QBp6D",
    },
});

interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `Career Hub <${process.env.EMAIL_FROM || 'theanant404@gmail.com'}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}