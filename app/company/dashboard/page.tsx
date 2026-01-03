"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Briefcase, 
  Plus, 
  LogOut,
  User,
  BarChart
} from "lucide-react";
import Link from "next/link";

interface JobPosting {
  id: number;
  title: string;
  type: 'job' | 'internship';
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile'>('profile');
  const [jobForm, setJobForm] = useState({
    title: '',
    type: 'job' as 'job' | 'internship',
    location: '',
    salary: '',
    description: '',
    requirements: [''],
  });
  const [postedJobs, setPostedJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyProfile, setCompanyProfile] = useState({
    companyName: '',
    email: '',
    industry: '',
    description: '',
  });

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
      
      // Initialize company profile state
      setCompanyProfile({
        companyName: companyData.companyName || '',
        email: companyData.email || '',
        industry: companyData.industry || '',
        description: companyData.description || '',
      });
      
      // Load posted jobs from localStorage
      const savedJobs = localStorage.getItem("postedJobs");
      if (savedJobs) {
        setPostedJobs(JSON.parse(savedJobs));
      }
      
      // Load applications from localStorage
      const savedApplications = localStorage.getItem("applications");
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      }
    } catch {
      router.push("/company/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("companyUser");
    router.push("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: 'job' | 'internship') => {
    setJobForm(prev => ({
      ...prev,
      type
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...jobForm.requirements];
    newRequirements[index] = value;
    setJobForm(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addRequirementField = () => {
    setJobForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirementField = (index: number) => {
    if (jobForm.requirements.length <= 1) return;
    const newRequirements = jobForm.requirements.filter((_, i) => i !== index);
    setJobForm(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newJob: JobPosting = {
        id: Date.now(),
        title: jobForm.title,
        type: jobForm.type,
        company: company.companyName || company.email.split('@')[0],
        location: jobForm.location,
        salary: jobForm.salary,
        description: jobForm.description,
        requirements: jobForm.requirements.filter(req => req.trim() !== ''),
        postedDate: new Date().toISOString().split('T')[0]
      };

      const updatedJobs = [...postedJobs, newJob];
      setPostedJobs(updatedJobs);
      localStorage.setItem("postedJobs", JSON.stringify(updatedJobs));

      // Reset form
      setJobForm({
        title: '',
        type: 'job',
        location: '',
        salary: '',
        description: '',
        requirements: [''],
      });

      alert("Job posting created successfully!");
    } catch (error) {
      console.error("Error creating job posting:", error);
      alert("Error creating job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update company data in localStorage
      const updatedCompanyData = {
        ...company,
        ...companyProfile
      };
      
      localStorage.setItem("companyUser", JSON.stringify(updatedCompanyData));
      setCompany(updatedCompanyData);
      
      alert("Company profile updated successfully!");
    } catch (error) {
      console.error("Error updating company profile:", error);
      alert("Error updating company profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glassmorphic border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity relative group">
              <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold">C</div>
              <span className="font-bold text-lg">CareerHub</span>

            </Link>
          </div>

          <div className="flex items-center gap-4">
            
            <div className="relative">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-foreground hover:bg-foreground/10 p-2 rounded-md"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-foreground/20 p-3 rounded-xl">
              <Building className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {company?.companyName || company?.email.split('@')[0]}
              </h1>
              <p className="text-muted-foreground text-sm">{currentDate}</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Company Dashboard</h2>
        </div>
        
        <div className="flex flex-row gap-2 mb-8">
          <Link href="/company/dashboard/post-job">
            <Button className="glassmorphic-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
          <Link href="/company/dashboard/job-posts">
            <Button variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              Manage Job Posts
            </Button>
          </Link>
          <Link href="/company/dashboard/applications">
            <Button variant="outline">
              <Briefcase className="w-4 h-4 mr-2" />
              View Applications
            </Button>
          </Link>
        </div>
        
        {/* Company Profile Section */}
        <Card className="glassmorphic mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Profile
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="text-foreground">{company?.companyName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{company?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="text-foreground">{company?.industry || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Company Description</h3>
                <p className="text-foreground">
                  {company?.description || 'No description provided. Add a description about your company.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Link href="/company/dashboard/post-job" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  </Link>
                  <Link href="/company/dashboard/job-posts" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Manage Job Posts
                    </Button>
                  </Link>
                  <Link href="/company/dashboard/applications" className="w-full">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Applications
                    </Button>
                  </Link>
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Company Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <Card className="glassmorphic mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5">
                      <div className="bg-foreground/20 p-2 rounded-lg">
                        <Plus className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">New Job Posted</h4>
                        <p className="text-sm text-muted-foreground">Posted "Frontend Developer" position</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5">
                      <div className="bg-foreground/20 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">New Application Received</h4>
                        <p className="text-sm text-muted-foreground">For "Backend Engineer" position</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-foreground/5">
                      <div className="bg-foreground/20 p-2 rounded-lg">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Profile Updated</h4>
                        <p className="text-sm text-muted-foreground">Updated company description</p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-foreground/5">
                      <p className="text-2xl font-bold text-foreground">{postedJobs.length}</p>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-foreground/5">
                      <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-foreground/5">
                      <p className="text-2xl font-bold text-foreground">{postedJobs.filter(job => {
                        const jobDate = new Date(job.postedDate);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return jobDate >= weekAgo;
                      }).length}</p>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </main>
  );
}