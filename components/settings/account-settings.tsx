"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { accountDeletionSchema } from "@/lib/validations/settings";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

type AccountDeletionFormData = z.infer<typeof accountDeletionSchema>;

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountDeletionFormData>({
    resolver: zodResolver(accountDeletionSchema),
  });

  const onSubmit = async (data: AccountDeletionFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
        // Sign out the user
        await signOut({ callbackUrl: "/" });
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete account");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Danger Zone:</strong> The actions below cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>

        <div className="space-y-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for deletion (optional)</Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="Please tell us why you're deleting your account..."
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">Type "DELETE" to confirm</Label>
            <Input
              id="confirmation"
              {...register("confirmation")}
              placeholder="DELETE"
            />
            {errors.confirmation && (
              <p className="text-sm text-destructive">{errors.confirmation.message}</p>
            )}
          </div>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account Permanently
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers, including:
                  <br /><br />
                  • Your profile and personal information
                  <br />
                  • All job applications and saved jobs
                  • Your assessment results and progress
                  <br />
                  • Any reviews or feedback you've provided
                  <br /><br />
                  You will be immediately signed out and will not be able to recover this data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmit(onSubmit)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Export Data</h3>
          <p className="text-sm text-muted-foreground">
            Download a copy of all your data before deleting your account.
          </p>
        </div>

        <Button variant="outline" className="w-full sm:w-auto">
          Export My Data
        </Button>
      </div>
    </div>
  );
}