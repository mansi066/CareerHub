"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        })
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
        })
      } else {
        toast({
          title: "Failed to send message",
          description: data.error || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative py-12 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm font-medium bg-foreground/10 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105">
            <MessageCircle className="w-4 h-4" />
            <span>We're here to help</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Get in Touch
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Have questions or feedback? We'd love to hear from you. Our team is ready to assist you with any inquiries.
          </p>
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-foreground/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-foreground/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* CONTACT INFO */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Let's Start a Conversation
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether you have a question, feedback, or need support, our team is here to help you succeed.
                </p>
              </div>

              <div className="space-y-6">
                <ContactCard
                  icon={<Mail className="w-5 h-5" />}
                  title="Email"
                  value="support@careerhub.com"
                  description="Send us an email anytime"
                />
                <ContactCard
                  icon={<Phone className="w-5 h-5" />}
                  title="Phone"
                  value="+91 98765 43210"
                  description="Mon-Fri from 9am to 6pm IST"
                />
                <ContactCard
                  icon={<MapPin className="w-5 h-5" />}
                  title="Location"
                  value="India"
                  description="Serving students and companies nationwide"
                />
              </div>

              {/* Additional Info */}
              <Card className="p-6 border border-border bg-card/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Quick Response</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CONTACT FORM */}
            <Card className="p-8 border border-border bg-card/50 backdrop-blur-sm shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full bg-background/50">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="account">Account Help</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief description of your inquiry"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-32 bg-background/50"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full group transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our terms and privacy policy.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}

function ContactCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: string
  description?: string
}) {
  return (
    <Card className="p-6 border border-border bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center text-foreground">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-foreground font-medium">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
