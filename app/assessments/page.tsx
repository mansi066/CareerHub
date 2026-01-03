"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Star, Users, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Assessment {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  participants: number;
  rating: number;
  description: string;
  skills: string[];
  certificate: boolean;
}

const AssessmentsPage = () => {
  const [filter, setFilter] = useState<"all" | "technical" | "soft-skills" | "industry">("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn);
  }, []);

  const assessments: Assessment[] = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      category: "technical",
      duration: "45 min",
      difficulty: "Beginner",
      participants: 12500,
      rating: 4.8,
      description: "Test your knowledge of JavaScript basics, ES6 features, and modern development practices.",
      skills: ["JavaScript", "ES6", "DOM", "Async/Await"],
      certificate: true
    },
    {
      id: 2,
      title: "React Development",
      category: "technical",
      duration: "60 min",
      difficulty: "Intermediate",
      participants: 8900,
      rating: 4.9,
      description: "Comprehensive assessment covering React hooks, state management, and component architecture.",
      skills: ["React", "Hooks", "State Management", "JSX"],
      certificate: true
    },
    {
      id: 3,
      title: "Leadership & Communication",
      category: "soft-skills",
      duration: "30 min",
      difficulty: "Intermediate",
      participants: 15200,
      rating: 4.7,
      description: "Evaluate your leadership potential and communication effectiveness in professional settings.",
      skills: ["Leadership", "Communication", "Team Management", "Conflict Resolution"],
      certificate: true
    },
    {
      id: 4,
      title: "Data Science with Python",
      category: "technical",
      duration: "90 min",
      difficulty: "Advanced",
      participants: 5600,
      rating: 4.9,
      description: "Advanced assessment covering machine learning, data analysis, and statistical modeling.",
      skills: ["Python", "Machine Learning", "Pandas", "NumPy", "Statistics"],
      certificate: true
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      category: "industry",
      duration: "40 min",
      difficulty: "Intermediate",
      participants: 9800,
      rating: 4.6,
      description: "Test your understanding of modern digital marketing channels and campaign optimization.",
      skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
      certificate: true
    },
    {
      id: 6,
      title: "Problem Solving & Critical Thinking",
      category: "soft-skills",
      duration: "35 min",
      difficulty: "Beginner",
      participants: 18700,
      rating: 4.8,
      description: "Assess your analytical thinking and problem-solving approach in various scenarios.",
      skills: ["Critical Thinking", "Problem Solving", "Logic", "Decision Making"],
      certificate: true
    }
  ];

  const filteredAssessments = assessments.filter(assessment => {
    return filter === "all" || assessment.category === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "soft-skills": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "industry": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
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
            Skill Assessments
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Validate your expertise with industry-standard assessments. Earn certificates 
            and showcase your skills to potential employers.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
              <div className="text-muted-foreground">Assessments Taken</div>
            </div>
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">25+</div>
              <div className="text-muted-foreground">Skill Categories</div>
            </div>
            <div className="glassmorphic p-6 rounded-2xl">
              <div className="text-3xl font-bold text-foreground mb-2">95%</div>
              <div className="text-muted-foreground">Employer Recognition</div>
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
                All Assessments
              </Button>
              <Button
                variant={filter === "technical" ? "default" : "outline"}
                onClick={() => setFilter("technical")}
                className="glassmorphic-button"
              >
                Technical Skills
              </Button>
              <Button
                variant={filter === "soft-skills" ? "default" : "outline"}
                onClick={() => setFilter("soft-skills")}
                className="glassmorphic-button"
              >
                Soft Skills
              </Button>
              <Button
                variant={filter === "industry" ? "default" : "outline"}
                onClick={() => setFilter("industry")}
                className="glassmorphic-button"
              >
                Industry Knowledge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Assessments Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="glassmorphic hover-card">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge className={getCategoryColor(assessment.category)}>
                      {assessment.category.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{assessment.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{assessment.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{assessment.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Assessment Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{assessment.duration}</span>
                      </div>
                      <Badge className={getDifficultyColor(assessment.difficulty)}>
                        {assessment.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{assessment.participants.toLocaleString()} taken</span>
                      </div>
                      {assessment.certificate && (
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span>Certificate</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {assessment.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {assessment.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{assessment.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full glassmorphic-button-primary"
                      disabled={!isLoggedIn}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isLoggedIn ? "Start Assessment" : "Login to Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glassmorphic p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Showcase Your Skills?
              </h3>
              <p className="text-muted-foreground mb-6">
                Sign up now to take assessments, earn certificates, and boost your career prospects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button className="glassmorphic-button-primary">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="glassmorphic-button">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default AssessmentsPage;