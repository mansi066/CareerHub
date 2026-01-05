"use client"

import { Briefcase, GraduationCap, Lightbulb, MapPin, Trophy, Award, Building, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Features() {
  const features = [
    {
      id: 1,
      icon: Briefcase,
      title: "Latest Job Postings",
      description:
        "Browse hundreds of recently posted job opportunities updated in real-time from top companies worldwide.",
      link: "/browse"
    },
    {
      id: 2,
      icon: GraduationCap,
      title: "Scholarship Opportunities",
      description: "Discover and apply for scholarships that match your profile. Get funded for your education today.",
      link: "/browse"
    },
    {
      id: 3,
      icon: Lightbulb,
      title: "Internship Programs",
      description:
        "Access exclusive internship programs to gain real-world experience and build your professional network.",
      link: "/browse"
    },
    {
      id: 4,
      icon: Building,
      title: "Company Profiles & Reviews",
      description: "Research companies with detailed profiles and authentic employee reviews to make informed career decisions.",
      link: "/companies"
    },
    {
      id: 5,
      icon: Heart,
      title: "Save & Organize",
      description: "Bookmark opportunities and companies to create personalized collections for easy access later.",
      link: "/bookmarks"
    },
    {
      id: 6,
      icon: MapPin,
      title: "Smart Location Matching",
      description: "Filter by location, remote options, or relocation opportunities that suit your career preferences.",
      link: "/browse"
    },
    {
      id: 7,
      icon: Trophy,
      title: "Skill Assessments",
      description: "Take industry-standard assessments and earn certificates that verify your expertise to boost job applications.",
      link: "/assessments"
    },
    {
      id: 8,
      icon: Award,
      title: "Global Leaderboard",
      description: "Compete with professionals worldwide and showcase your skills on our global ranking system.",
      link: "/leaderboard"
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-pretty">
            Everything you need to advance your career
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From jobs to scholarships and internships, we've got you covered with tools designed for your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            const CardContent = (
              <>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground/10 rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </>
            )
            
            return (
              <Card
                key={feature.id}
                className={`p-8 glassmorphic border-foreground/10 spotlight-card hover-card scale-in ${
                  feature.link ? 'cursor-pointer hover:scale-105 transition-transform' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {feature.link ? (
                  <Link href={feature.link} className="block">
                    {CardContent}
                  </Link>
                ) : (
                  CardContent
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
