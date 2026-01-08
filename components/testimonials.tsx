"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Testimonials() {
  const [userTestimonials, setUserTestimonials] = useState([])
    useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("testimonials") || "[]"
    )
    setUserTestimonials(saved)
  }, [])

  const testimonials = [
    {
      id: 1,
      name: "Alex Morgan",
      title: "Software Engineer at Google",
      content:
        "Found my dream role through CareerHub within just 2 weeks. The matching algorithm is incredibly accurate!",
      rating: 5,
      avatar: "💼",
    },
    {
      id: 2,
      name: "Jessica Lee",
      title: "Medical School Student",
      content: "Secured a $50K scholarship that changed my life. CareerHub's scholarship database is unbeatable.",
      rating: 5,
      avatar: "🎓",
    },
    {
      id: 3,
      name: "Marcus Thompson",
      title: "Project Manager at Meta",
      content: "The career growth tools and interview prep helped me land a senior role with a 40% salary increase.",
      rating: 5,
      avatar: "📈",
    },
  ]

  return (
    <section id="testimonials" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
       <div className="flex justify-center mb-10">
        <Link href="/post-success">
          <Button size="lg">Post Your Success Story</Button>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-pretty blur-reveal">
            Success stories from our community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto blur-reveal">
            Join thousands who've advanced their careers and secured scholarships through CareerHub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[...userTestimonials, ...testimonials].map((testimonial) => (
            <Card key={testimonial.id} className="p-8 bg-card border-border spotlight-card hover-card scale-in">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
