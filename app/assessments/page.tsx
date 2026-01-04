"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import AssessmentGrid from "@/components/assessment-grid"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Award } from "lucide-react"

export default function AssessmentsPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-4 glassmorphic">
              <Trophy className="w-4 h-4 mr-2" />
              Skill Certification Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Prove Your Skills
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Take industry-standard assessments and earn certificates that boost your job applications
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Certificates Issued</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Pass Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Companies Trust Us</div>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Grid */}
        <AssessmentGrid />
      </div>

      <Footer />
    </main>
  )
}