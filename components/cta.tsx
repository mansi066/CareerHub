"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-pretty">
          Ready to advance your career?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Join over 100,000 job seekers and scholarship applicants who are achieving their career goals. Start your
          journey today with CareerHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <Link href="/browse">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Explore Opportunities Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
