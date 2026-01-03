"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, User, Save, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface UserProfile {
  fullName: string;
  email: string;
  profileImage: string | null;
  resumeUrl: string | null;
  skills: string;
  interests: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    email: "",
    profileImage: null,
    resumeUrl: null,
    skills: "",
    interests: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewResume, setPreviewResume] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      const profileData = localStorage.getItem("userProfile");
      const profile = profileData ? JSON.parse(profileData) : null;

      const userProfile: UserProfile = {
        fullName: userData.fullName || userData.email.split("@")[0],
        email: userData.email,
        profileImage: profile?.profileImage || null,
        resumeUrl: profile?.resumeUrl || null,
        skills: profile?.skills || "",
        interests: profile?.interests || "",
      };

      setUser(userProfile);
      setFormData(userProfile);
      setPreviewImage(profile?.profileImage || null);
      setPreviewResume(profile?.resumeUrl || null);
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a PDF, DOC, or DOCX
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewResume(reader.result as string);
        setFormData(prev => ({
          ...prev,
          resumeUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveResume = () => {
    setPreviewResume(null);
    setFormData(prev => ({
      ...prev,
      resumeUrl: null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Save profile data to localStorage
      const profileData = {
        profileImage: formData.profileImage,
        resumeUrl: formData.resumeUrl,
        skills: formData.skills,
        interests: formData.interests,
      };
      
      localStorage.setItem("userProfile", JSON.stringify(profileData));

      // Update user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUserData = {
          ...userData,
          fullName: formData.fullName
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setIsSaving(false);
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
      <Header />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="w-6 h-6" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-foreground/10"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-90"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-foreground/10">
                        <User className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      aria-label="Upload profile image"
                    />
                    <Label
                      htmlFor="profileImage"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {previewImage ? "Change Image" : "Upload Image"}
                    </Label>
                    {previewImage && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-2"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                                
                {/* Resume Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="flex-1"
                      aria-label="Upload resume"
                    />
                    {previewResume && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Resume uploaded</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveResume}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                  </p>
                </div>
                                
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Enter your skills, separated by commas (e.g., JavaScript, React, Python)"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    List your technical and professional skills
                  </p>
                </div>

                {/* Interests */}
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="Enter your career interests and goals"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Describe your career interests, job preferences, and professional goals
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex items-center gap-2" disabled={isSaving}>
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}