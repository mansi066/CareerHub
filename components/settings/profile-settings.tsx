"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { profileUpdateSchema } from "@/lib/validations/settings";
import { Loader2, Upload } from "lucide-react";

type ProfileFormData = z.infer<typeof profileUpdateSchema>;

export function ProfileSettings() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      bio: "",
      location: "",
      website: "",
      skills: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await update();
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Change Photo
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            JPG, GIF or PNG. 1MB max.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="Tell us about yourself..."
          rows={3}
        />
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="City, Country"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register("website")}
            placeholder="https://yourwebsite.com"
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          {...register("skills")}
          placeholder="React, Node.js, Python, etc."
        />
        {errors.skills && (
          <p className="text-sm text-destructive">{errors.skills.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}