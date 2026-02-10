"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { privacySettingsSchema } from "@/lib/validations/settings";
import { Loader2 } from "lucide-react";

type PrivacyFormData = z.infer<typeof privacySettingsSchema>;

export function PrivacySettings() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: "public",
      showEmail: false,
      showResume: true,
      allowMessaging: true,
      dataSharing: false,
      analyticsTracking: true,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: PrivacyFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/privacy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Privacy settings updated",
          description: "Your privacy preferences have been saved.",
        });
      } else {
        throw new Error("Failed to update privacy settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Profile Visibility</h3>
          <p className="text-sm text-muted-foreground">
            Control who can see your profile information.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileVisibility">Profile Visibility</Label>
          <Select
            value={watchedValues.profileVisibility}
            onValueChange={(value) => setValue("profileVisibility", value as "public" | "private" | "connections")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
              <SelectItem value="connections">Connections - Only connections can see your profile</SelectItem>
              <SelectItem value="private">Private - Only you can see your profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Information Sharing</h3>
          <p className="text-sm text-muted-foreground">
            Choose what information to share with others.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showEmail">Show Email Address</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your email address.
              </p>
            </div>
            <Switch
              id="showEmail"
              checked={watchedValues.showEmail}
              onCheckedChange={(checked) => setValue("showEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showResume">Show Resume</Label>
              <p className="text-sm text-muted-foreground">
                Allow employers to view your resume.
              </p>
            </div>
            <Switch
              id="showResume"
              checked={watchedValues.showResume}
              onCheckedChange={(checked) => setValue("showResume", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowMessaging">Allow Messaging</Label>
              <p className="text-sm text-muted-foreground">
                Let other users send you messages.
              </p>
            </div>
            <Switch
              id="allowMessaging"
              checked={watchedValues.allowMessaging}
              onCheckedChange={(checked) => setValue("allowMessaging", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Data & Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Control how your data is used.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dataSharing">Data Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share anonymized data to improve our services.
              </p>
            </div>
            <Switch
              id="dataSharing"
              checked={watchedValues.dataSharing}
              onCheckedChange={(checked) => setValue("dataSharing", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Allow analytics tracking for usage insights.
              </p>
            </div>
            <Switch
              id="analyticsTracking"
              checked={watchedValues.analyticsTracking}
              onCheckedChange={(checked) => setValue("analyticsTracking", checked)}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Privacy Settings
      </Button>
    </form>
  );
}