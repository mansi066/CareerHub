"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Briefcase, 
  Users, 
  MapPin, 
  DollarSign, 
  Plus, 
  X,
  ArrowLeft
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

export default function PostJobPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobForm, setJobForm] = useState({
    title: '',
    type: 'job' as 'job' | 'internship',
    location: '',
    salary: '',
    description: '',
    requirements: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch {
      router.push("/company/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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

      // Load existing jobs from localStorage
      const savedJobs = localStorage.getItem("postedJobs");
      const existingJobs = savedJobs ? JSON.parse(savedJobs) : [];
      
      const updatedJobs = [...existingJobs, newJob];
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
      router.push("/company/dashboard");
    } catch (error) {
      console.error("Error creating job posting:", error);
      alert("Error creating job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Job Creation Form */}
            <div className="lg:w-1/2">
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Job Post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Title */}
                    <div>
                      <Label htmlFor="title">Position Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={jobForm.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Frontend Developer"
                        required
                      />
                    </div>

                    {/* Job Type */}
                    <div>
                      <Label>Position Type</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          type="button"
                          variant={jobForm.type === 'job' ? 'default' : 'outline'}
                          onClick={() => handleTypeChange('job')}
                          className="flex-1"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          Job
                        </Button>
                        <Button
                          type="button"
                          variant={jobForm.type === 'internship' ? 'default' : 'outline'}
                          onClick={() => handleTypeChange('internship')}
                          className="flex-1"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Internship
                        </Button>
                      </div>
                    </div>

                    {/* Location and Salary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="location"
                            name="location"
                            value={jobForm.location}
                            onChange={handleInputChange}
                            placeholder="e.g., New York, NY"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="salary">Salary Range</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="salary"
                            name="salary"
                            value={jobForm.salary}
                            onChange={handleInputChange}
                            placeholder="e.g., $70,000 - $90,000"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={jobForm.description}
                        onChange={handleInputChange}
                        placeholder="Describe the role, responsibilities, and what makes your company a great place to work..."
                        rows={5}
                        required
                      />
                    </div>

                    {/* Requirements */}
                    <div>
                      <Label>Requirements</Label>
                      <div className="space-y-3 mt-2">
                        {jobForm.requirements.map((req, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={req}
                              onChange={(e) => handleRequirementChange(index, e.target.value)}
                              placeholder={`Requirement ${index + 1}`}
                              className="flex-1"
                            />
                            {jobForm.requirements.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeRequirementField(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addRequirementField}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Requirement
                        </Button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full glassmorphic-button-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Job..." : "Create Job Post"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:w-1/2">
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 rounded-xl p-6 border border-foreground/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl text-foreground">{jobForm.title || "Job Title"}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">
                            {jobForm.type === 'job' ? 'Job' : 'Internship'}
                          </Badge>
                          <div className="flex items-center text-muted-foreground">
                            <Building className="w-4 h-4 mr-1" />
                            {company?.companyName || company?.email.split('@')[0] || "Company Name"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {jobForm.location || "Location"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {jobForm.salary || "Salary"}
                      </div>
                    </div>
                    
                    <p className="text-foreground mt-4">
                      {jobForm.description || "Job description will appear here..."}
                    </p>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                        {jobForm.requirements.filter(req => req.trim() !== '').map((req, index) => (
                          <li key={index} className="flex items-center text-foreground">
                            <span className="w-2 h-2 bg-foreground rounded-full mr-2"></span>
                            {req || `Requirement ${index + 1}`}
                          </li>
                        ))}
                        {jobForm.requirements.filter(req => req.trim() !== '').length === 0 && (
                          <li className="text-muted-foreground">Requirements will appear here...</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Button className="glassmorphic-button-primary">
                        Apply Now
                      </Button>
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