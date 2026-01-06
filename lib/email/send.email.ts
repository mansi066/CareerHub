import nodemailer from "nodemailer";

// Create a transporter using your SMTP configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.SMTP_USER || "maddison53@ethereal.email",
        pass: process.env.SMTP_PASS || "jn7jnAPss4f63QBp6D",
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
        const fromEmail = process.env.SENDER_EMAIL || 'theanant404@gmail.com';

        const info = await transporter.sendMail({
            from: `CareerHub <${fromEmail}>`,
            to,
            subject,
            text,
            html,
        });
        // console.log('📧 Email sent info:', info);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, error };
    }
}