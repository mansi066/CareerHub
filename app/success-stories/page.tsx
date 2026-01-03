"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

interface SuccessStory {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  category: "job" | "internship" | "scholarship";
  story: string;
  outcome: string;
  rating: number;
  timeToSuccess: string;
  avatar: string;
  companyLogo?: string;
}

const SuccessStoriesPage = () => {
  const [filter, setFilter] = useState<"all" | "job" | "internship" | "scholarship">("all");

  const successStories: SuccessStory[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      category: "job",
      story: "I was struggling to find my first tech job after graduation. The platform's skill assessments helped me identify my strengths and the personalized job recommendations led me to my dream role at TechCorp.",
      outcome: "Landed a $95K starting salary with full benefits and remote work options.",
      rating: 5,
      timeToSuccess: "3 weeks",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Marketing Intern",
      company: "StartupXYZ",
      location: "Austin, TX",
      category: "internship",
      story: "As a college sophomore, I needed real-world experience. The internship matching system connected me with StartupXYZ, where I learned digital marketing and contributed to a 40% increase in social media engagement.",
      outcome: "Received a full-time offer before graduation and gained invaluable industry connections.",
      rating: 5,
      timeToSuccess: "2 weeks",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Graduate Student",
      company: "MIT",
      location: "Cambridge, MA",
      category: "scholarship",
      story: "The scholarship database helped me discover funding opportunities I never knew existed. The application guidance and essay tips were instrumental in securing multiple scholarships for my Master's program.",
      outcome: "Received $45,000 in scholarship funding, covering full tuition and living expenses.",
      rating: 5,
      timeToSuccess: "6 weeks",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Data Analyst",
      company: "FinanceFlow",
      location: "New York, NY",
      category: "job",
      story: "After being laid off, I was devastated. The career transition resources and skill assessments helped me pivot from accounting to data analysis. The interview prep was game-changing.",
      outcome: "Successfully transitioned careers with a 30% salary increase and better work-life balance.",
      rating: 5,
      timeToSuccess: "8 weeks",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 5,
      name: "Emma Rodriguez",
      role: "UX Design Intern",
      company: "DesignStudio",
      location: "Los Angeles, CA",
      category: "internship",
      story: "Coming from a non-design background, I was nervous about breaking into UX. The platform's portfolio review service and mentor connections gave me the confidence and skills I needed.",
      outcome: "Completed a successful internship and built a strong portfolio that led to multiple job offers.",
      rating: 5,
      timeToSuccess: "4 weeks",
      avatar: "/placeholder-user.jpg"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "PhD Candidate",
      company: "Stanford University",
      location: "Palo Alto, CA",
      category: "scholarship",
      story: "Research funding is incredibly competitive. The platform's scholarship alerts and application tracking system helped me stay organized and apply to opportunities I would have missed otherwise.",
      outcome: "Secured a prestigious research fellowship worth $60,000 annually for 3 years.",
      rating: 5,
      timeToSuccess: "12 weeks",
      avatar: "/placeholder-user.jpg"
    }
  ];

  const filteredStories = successStories.filter(story => {
    return filter === "all" || story.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "job": return <Briefcase className="w-5 h-5" />;
      case "internship": return <GraduationCap className="w-5 h-5" />;
      case "scholarship": return <Award className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "job": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "internship": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "scholarship": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Success Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Real people, real results. Discover how our platform has helped thousands 
            of professionals achieve their career goals and transform their lives.
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">10K+</div>
              <div className="text-muted-foreground">Success Stories</div>
            </div>
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">$2.5M+</div>
              <div className="text-muted-foreground">Scholarships Won</div>
            </div>
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">85%</div>
              <div className="text-muted-foreground">Job Placement Rate</div>
            </div>
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">4.9★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="glassmorphic p-6 rounded-2xl">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="glassmorphic-button"
              >
                All Stories
              </Button>
              <Button
                variant={filter === "job" ? "default" : "outline"}
                onClick={() => setFilter("job")}
                className="glassmorphic-button"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Job Placements
              </Button>
              <Button
                variant={filter === "internship" ? "default" : "outline"}
                onClick={() => setFilter("internship")}
                className="glassmorphic-button"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Internships
              </Button>
              <Button
                variant={filter === "scholarship" ? "default" : "outline"}
                onClick={() => setFilter("scholarship")}
                className="glassmorphic-button"
              >
                <Award className="w-4 h-4 mr-2" />
                Scholarships
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStories.map((story) => (
              <Card key={story.id} className="glassmorphic hover-card">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={story.avatar}
                        alt={story.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                        {getCategoryIcon(story.category)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{story.name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground font-medium">{story.role}</p>
                      <p className="text-muted-foreground">{story.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{story.location}</span>
                        <Badge className={getCategoryColor(story.category)}>
                          {story.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Quote */}
                    <div className="relative">
                      <Quote className="w-6 h-6 text-muted-foreground/30 absolute -top-2 -left-1" />
                      <p className="text-muted-foreground italic pl-6">
                        "{story.story}"
                      </p>
                    </div>

                    {/* Outcome */}
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Outcome:</h4>
                      <p className="text-sm text-muted-foreground">{story.outcome}</p>
                    </div>

                    {/* Time to Success */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time to Success:</span>
                      <Badge variant="secondary">{story.timeToSuccess}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glassmorphic p-8 rounded-2xl">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of professionals who have transformed their careers. 
              Your success story could be next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="glassmorphic-button-primary text-lg px-8 py-3">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" className="glassmorphic-button text-lg px-8 py-3">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SuccessStoriesPage;