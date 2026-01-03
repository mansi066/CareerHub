"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, GraduationCap, Users, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  type: "job" | "internship" | "scholarship";
  location: string;
  salary?: string;
  deadline?: string;
  description: string;
  tags: string[];
}

const BrowsePage = () => {
  const [filter, setFilter] = useState<"all" | "job" | "internship" | "scholarship">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get company posted jobs from localStorage
    const companyPostedJobs: Opportunity[] = [];
    const savedJobs = localStorage.getItem("postedJobs");
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        const formattedJobs: Opportunity[] = parsedJobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          type: job.type,
          location: job.location,
          salary: job.salary,
          description: job.description,
          tags: job.requirements || [],
        }));
        companyPostedJobs.push(...formattedJobs);
      } catch (error) {
        console.error("Error parsing company jobs:", error);
      }
    }
    
    // Only use company posted jobs (no mock opportunities)
    setAllOpportunities(companyPostedJobs);
    setIsLoading(false);
  }, []);

  const filteredOpportunities = allOpportunities.filter(opp => {
    const matchesFilter = filter === "all" || opp.type === filter;
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "internship": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "scholarship": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground mb-4"></div>
            <p className="text-foreground">Loading opportunities...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Your Next Opportunity
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse thousands of jobs, internships, and scholarships tailored to your skills and career goals.
            </p>
          </section>

          {/* Search and Filter Section */}
          <section className="mb-12">
            <div className="glassmorphic p-6 rounded-2xl border-foreground/10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    className="glass-input w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={filter === "all" ? "default" : "outline"} 
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-foreground text-background" : ""}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === "job" ? "default" : "outline"} 
                    onClick={() => setFilter("job")}
                    className={filter === "job" ? "bg-blue-600 text-white" : ""}
                  >
                    Jobs
                  </Button>
                  <Button 
                    variant={filter === "internship" ? "default" : "outline"} 
                    onClick={() => setFilter("internship")}
                    className={filter === "internship" ? "bg-green-600 text-white" : ""}
                  >
                    Internships
                  </Button>
                  <Button 
                    variant={filter === "scholarship" ? "default" : "outline"} 
                    onClick={() => setFilter("scholarship")}
                    className={filter === "scholarship" ? "bg-purple-600 text-white" : ""}
                  >
                    Scholarships
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Opportunities Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="glassmorphic hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                      <Badge className={getTypeColor(opportunity.type)}>
                        {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground">{opportunity.company}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{opportunity.location}</span>
                      </div>
                      
                      {opportunity.salary && (
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{opportunity.salary}</span>
                        </div>
                      )}
                      
                      {opportunity.deadline && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Deadline: {opportunity.deadline}</span>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                        {opportunity.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {opportunity.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button className="w-full mt-4 glassmorphic-button-primary">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No opportunities found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </section>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default BrowsePage;