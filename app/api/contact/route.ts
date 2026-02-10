import { NextResponse } from "next/server"
import { z } from "zod"
import dbConnect from "@/db/mongoDb"
import ContactModel from "@/models/Contact.Model"

// Define validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum([
    "general",
    "support",
    "bug",
    "feedback",
    "partnership",
    "account",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Simple rate limiting (in-memory, not production-ready)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5 // Max 5 requests per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(ip) || []
  
  // Filter out old requests
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  )
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)
  return true
}

export async function POST(req: Request) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
        },
        { status: 429 }
      )
    }

    const data = await req.json()
    
    // Validate data
    const validatedData = contactSchema.parse(data)
    
    // Connect to database
    await dbConnect()
    
    // Save contact message to database
    const contactMessage = await ContactModel.create({
      ...validatedData,
      status: "new",
    })
    
    console.log("Contact form submission saved:", contactMessage._id)
    
    // In a production app, you would:
    // 1. Save the message to a Contact model in the database
    // 2. Send notification email to support team using sendEmail function
    // 3. Send confirmation email to the user
    
    // Example email sending (if you have email configured):
    // import { sendEmail } from "@/lib/email/send.email"
    // await sendEmail({
    //   to: "support@careerhub.com",
    //   subject: `New Contact Form: ${validatedData.subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${validatedData.name}</p>
    //     <p><strong>Email:</strong> ${validatedData.email}</p>
    //     <p><strong>Category:</strong> ${validatedData.category}</p>
    //     <p><strong>Subject:</strong> ${validatedData.subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${validatedData.message}</p>
    //   `,
    // })

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll get back to you soon!",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0].message,
        },
        { status: 400 }
      )
    }

    console.error("Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process your request. Please try again later.",
      },
      { status: 500 }
    )
  }
}
