"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { notificationSettingsSchema } from "@/lib/validations/settings";
import { Loader2 } from "lucide-react";

type NotificationFormData = z.infer<typeof notificationSettingsSchema>;

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      jobAlerts: true,
      applicationUpdates: true,
      marketingEmails: false,
      weeklyDigest: true,
      pushNotifications: true,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: NotificationFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Notification settings updated",
          description: "Your notification preferences have been saved.",
        });
      } else {
        throw new Error("Failed to update notification settings");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
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
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Choose what emails you'd like to receive.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="jobAlerts">Job Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new jobs matching your preferences.
              </p>
            </div>
            <Switch
              id="jobAlerts"
              checked={watchedValues.jobAlerts}
              onCheckedChange={(checked) => setValue("jobAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="applicationUpdates">Application Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about your job applications.
              </p>
            </div>
            <Switch
              id="applicationUpdates"
              checked={watchedValues.applicationUpdates}
              onCheckedChange={(checked) => setValue("applicationUpdates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyDigest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of new jobs and updates.
              </p>
            </div>
            <Switch
              id="weeklyDigest"
              checked={watchedValues.weeklyDigest}
              onCheckedChange={(checked) => setValue("weeklyDigest", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and promotions.
              </p>
            </div>
            <Switch
              id="marketingEmails"
              checked={watchedValues.marketingEmails}
              onCheckedChange={(checked) => setValue("marketingEmails", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Push Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage push notifications on your devices.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pushNotifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications for important updates.
            </p>
          </div>
          <Switch
            id="pushNotifications"
            checked={watchedValues.pushNotifications}
            onCheckedChange={(checked) => setValue("pushNotifications", checked)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </form>
  );
}