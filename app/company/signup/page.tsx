"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail, Building } from "lucide-react";
import Link from "next/link";

export default function CompanySignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      // Simulate company signup
      const companyData = {
        companyName: formData.companyName,
        email: formData.email,
        companyLoggedIn: true,
        isCompany: true,
      };
      localStorage.setItem("companyUser", JSON.stringify(companyData));
      router.push("/company/dashboard");
    } catch (err) {
      setError("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 fade-in">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Form Container */}
        <div className="glassmorphic p-8 rounded-2xl border-foreground/10 scale-in">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-foreground/20 flex items-center justify-center">
              <Building className="w-6 h-6 text-foreground" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground text-center mb-2">Company Sign Up</h1>
          <p className="text-muted-foreground text-center mb-8">Create your company account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name Input */}
            <div>
              <Label className="text-foreground mb-2">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <Label className="text-foreground mb-2">Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@name.com"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <Label className="text-foreground mb-2">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <Label className="text-foreground mb-2">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 w-full glass-input"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glassmorphic-button-primary font-semibold"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-foreground/10" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/company/login" className="text-foreground font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}