"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Briefcase, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
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

export default function JobPostsPage() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [jobPosts, setJobPosts] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'job' as 'job' | 'internship',
    location: '',
    salary: '',
    description: '',
    requirements: [''],
  });
  const [showEditForm, setShowEditForm] = useState(false);

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

      // Load job posts from localStorage
      const savedJobs = localStorage.getItem("postedJobs");
      if (savedJobs) {
        setJobPosts(JSON.parse(savedJobs));
      }
    } catch {
      router.push("/company/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      const updatedJobs = jobPosts.filter(job => job.id !== id);
      setJobPosts(updatedJobs);
      localStorage.setItem("postedJobs", JSON.stringify(updatedJobs));
    }
  };

  const handleEditClick = (job: JobPosting) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      type: job.type,
      location: job.location,
      salary: job.salary,
      description: job.description,
      requirements: [...job.requirements],
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditTypeChange = (type: 'job' | 'internship') => {
    setEditForm(prev => ({
      ...prev,
      type
    }));
  };

  const handleEditRequirementChange = (index: number, value: string) => {
    const newRequirements = [...editForm.requirements];
    newRequirements[index] = value;
    setEditForm(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const addEditRequirementField = () => {
    setEditForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeEditRequirementField = (index: number) => {
    if (editForm.requirements.length <= 1) return;
    const newRequirements = editForm.requirements.filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingJob) return;

    const updatedJob: JobPosting = {
      ...editingJob,
      title: editForm.title,
      type: editForm.type,
      location: editForm.location,
      salary: editForm.salary,
      description: editForm.description,
      requirements: editForm.requirements.filter(req => req.trim() !== ''),
    };

    const updatedJobs = jobPosts.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    );
    
    setJobPosts(updatedJobs);
    localStorage.setItem("postedJobs", JSON.stringify(updatedJobs));
    
    // Reset form and close edit mode
    setEditingJob(null);
    setShowEditForm(false);
    alert("Job post updated successfully!");
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Your Job Posts</h1>
            <Link href="/company/dashboard/post-job">
              <Button className="glassmorphic-button-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Job
              </Button>
            </Link>
          </div>

          {showEditForm && editingJob && (
            <Card className="glassmorphic mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Job Post</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowEditForm(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Job Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                      Position Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                      placeholder="e.g., Frontend Developer"
                      required
                    />
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Position Type
                    </label>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={editForm.type === 'job' ? 'default' : 'outline'}
                        onClick={() => handleEditTypeChange('job')}
                        className="flex-1"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        Job
                      </Button>
                      <Button
                        type="button"
                        variant={editForm.type === 'internship' ? 'default' : 'outline'}
                        onClick={() => handleEditTypeChange('internship')}
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
                      <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="location"
                          name="location"
                          value={editForm.location}
                          onChange={handleEditInputChange}
                          placeholder="e.g., New York, NY"
                          className="w-full pl-10 px-3 py-2 border border-foreground/20 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-foreground mb-1">
                        Salary Range
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="salary"
                          name="salary"
                          value={editForm.salary}
                          onChange={handleEditInputChange}
                          placeholder="e.g., $70,000 - $90,000"
                          className="w-full pl-10 px-3 py-2 border border-foreground/20 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                      Job Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditInputChange}
                      placeholder="Describe the role, responsibilities, and what makes your company a great place to work..."
                      rows={5}
                      className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                      required
                    />
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Requirements
                    </label>
                    <div className="space-y-3">
                      {editForm.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            value={req}
                            onChange={(e) => handleEditRequirementChange(index, e.target.value)}
                            placeholder={`Requirement ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                          />
                          {editForm.requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeEditRequirementField(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addEditRequirementField}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Requirement
                      </Button>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="glassmorphic-button-primary flex-1"
                    >
                      Update Job Post
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {jobPosts.length === 0 ? (
            <Card className="glassmorphic">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Job Posts Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't posted any jobs yet. Create your first job post to get started!
                </p>
                <Link href="/company/dashboard/post-job">
                  <Button className="glassmorphic-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Job Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPosts.map((job) => (
                <Card key={job.id} className="glassmorphic overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={job.type === 'job' ? 'default' : 'secondary'}>
                            {job.type === 'job' ? 'Job' : 'Internship'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{job.postedDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(job)}
                          className="h-8 w-8"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(job.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Building className="w-4 h-4 mr-2" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-foreground line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                      <div className="pt-2">
                        <h4 className="text-sm font-medium text-foreground mb-1">Requirements:</h4>
                        <ul className="space-y-1">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start">
                              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{job.requirements.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}