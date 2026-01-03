"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft,
  Download,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

interface Application {
  id: number;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter: string;
  resumeUrl?: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const storedCompany = localStorage.getItem("companyUser");
    if (!storedCompany) {
      router.push("/company/login");
      return;
    }

    try {
      const companyData = JSON.parse(storedCompany);
      if (!companyData.isCompany || !companyData.companyLoggedIn) {
        router.push("/company/login");
        return;
      }
      setCompany(companyData);

      // Load applications from localStorage
      const savedApplications = localStorage.getItem("applications");
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      } else {
        // Initialize with empty array if no applications
        setApplications([]);
      }
    } catch {
      router.push("/company/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphic border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/company/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity relative group">
            <ArrowLeft className="w-5 h-5 text-foreground" />
            <span className="font-medium text-foreground">Back to Dashboard</span>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Go to Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-foreground/20 p-2 rounded-full">
                <Building className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-sm text-foreground">
                {company?.companyName || company?.email.split('@')[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Applications</h1>
              <p className="text-muted-foreground mt-2">
                Manage and review applications for your job postings
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge className="bg-foreground/20 text-foreground">
                {applications.length} Applications
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="glassmorphic hover:scale-[1.02] transition-transform duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{application.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">{application.applicantName}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{application.applicantEmail}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{application.applicantPhone}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Applied: {application.appliedDate}</span>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-3 mt-2">
                      {application.coverLetter}
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {applications.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No applications yet</h3>
              <p className="text-muted-foreground">Applications for your job postings will appear here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}