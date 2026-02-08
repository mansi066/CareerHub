"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Lock, Bell, Shield, Trash2, Save, Eye, EyeOff } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import {
    passwordChangeSchema,
    profileUpdateSchema,
    notificationSettingsSchema,
    privacySettingsSchema,
    accountDeletionSchema,
    type PasswordChangeFormData,
    type ProfileUpdateFormData,
    type NotificationSettingsFormData,
    type PrivacySettingsFormData,
    type AccountDeletionFormData
} from "@/lib/validations/settings";

interface UserProfile {
    fullName: string;
    email: string;
    profileImage: string | null;
    skills: string;
    interests: string;
}

interface UserSettings {
    notifications: NotificationSettingsFormData;
    privacy: PrivacySettingsFormData;
}

export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form hooks for different sections
    const profileForm = useForm<ProfileUpdateFormData>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            fullName: "",
            email: "",
            skills: "",
            interests: "",
        }
    });

    const passwordForm = useForm<PasswordChangeFormData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        }
    });

    const notificationForm = useForm<NotificationSettingsFormData>({
        resolver: zodResolver(notificationSettingsSchema),
        defaultValues: {
            emailNotifications: true,
            jobAlerts: true,
            applicationUpdates: true,
            newsletter: false,
            marketingEmails: false,
        }
    });

    const privacyForm = useForm<PrivacySettingsFormData>({
        resolver: zodResolver(privacySettingsSchema),
        defaultValues: {
            profileVisibility: "public",
            showEmail: false,
            showResume: true,
            dataSharing: false,
        }
    });

    const deletionForm = useForm<AccountDeletionFormData>({
        resolver: zodResolver(accountDeletionSchema),
        defaultValues: {
            confirmation: "",
            reason: "",
        }
    });

    useEffect(() => {
        const loadUserData = () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                router.push("/login");
                return;
            }

            try {
                const userData = JSON.parse(storedUser);
                const profileData = localStorage.getItem("userProfile");
                const profile = profileData ? JSON.parse(profileData) : null;
                const settingsData = localStorage.getItem("userSettings");
                const userSettings = settingsData ? JSON.parse(settingsData) : null;

                const userProfile: UserProfile = {
                    fullName: userData.fullName || userData.email.split("@")[0],
                    email: userData.email,
                    profileImage: profile?.profileImage || null,
                    skills: profile?.skills || "",
                    interests: profile?.interests || "",
                };

                setUser(userProfile);
                profileForm.reset({
                    fullName: userProfile.fullName,
                    email: userProfile.email,
                    skills: userProfile.skills,
                    interests: userProfile.interests,
                });

                const defaultSettings: UserSettings = {
                    notifications: {
                        emailNotifications: true,
                        jobAlerts: true,
                        applicationUpdates: true,
                        newsletter: false,
                        marketingEmails: false,
                        ...userSettings?.notifications
                    },
                    privacy: {
                        profileVisibility: "public",
                        showEmail: false,
                        showResume: true,
                        dataSharing: false,
                        ...userSettings?.privacy
                    }
                };

                setSettings(defaultSettings);
                notificationForm.reset(defaultSettings.notifications);
                privacyForm.reset(defaultSettings.privacy);

            } catch (error) {
                console.error("Error loading user data:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [router, profileForm, notificationForm, privacyForm]);

    const handleProfileUpdate = async (data: ProfileUpdateFormData) => {
        setIsSaving(true);
        try {
            // Update user data in localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const updatedUserData = {
                    ...userData,
                    fullName: data.fullName,
                    email: data.email
                };
                localStorage.setItem("user", JSON.stringify(updatedUserData));
            }

            // Update profile data
            const profileData = {
                skills: data.skills,
                interests: data.interests,
            };
            localStorage.setItem("userProfile", JSON.stringify(profileData));

            setUser(prev => prev ? { ...prev, ...data } : null);

            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (data: PasswordChangeFormData) => {
        setIsSaving(true);
        try {
            // In a real app, this would make an API call to change the password
            // For now, we'll just simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            passwordForm.reset();
            toast({
                title: "Password Changed",
                description: "Your password has been successfully changed.",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            toast({
                title: "Error",
                description: "Failed to change password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotificationSettings = async (data: NotificationSettingsFormData) => {
        setIsSaving(true);
        try {
            const updatedSettings: UserSettings = {
                ...settings!,
                notifications: data
            };
            localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
            setSettings(updatedSettings);

            toast({
                title: "Notification Settings Updated",
                description: "Your notification preferences have been saved.",
            });
        } catch (error) {
            console.error("Error updating notification settings:", error);
            toast({
                title: "Error",
                description: "Failed to update notification settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrivacySettings = async (data: PrivacySettingsFormData) => {
        setIsSaving(true);
        try {
            const updatedSettings: UserSettings = {
                ...settings!,
                privacy: data
            };
            localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
            setSettings(updatedSettings);

            toast({
                title: "Privacy Settings Updated",
                description: "Your privacy preferences have been saved.",
            });
        } catch (error) {
            console.error("Error updating privacy settings:", error);
            toast({
                title: "Error",
                description: "Failed to update privacy settings. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAccountDeletion = async (data: AccountDeletionFormData) => {
        try {
            // In a real app, this would make an API call to delete the account
            // For now, we'll clear localStorage and redirect
            localStorage.clear();

            toast({
                title: "Account Deleted",
                description: "Your account has been successfully deleted.",
            });

            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast({
                title: "Error",
                description: "Failed to delete account. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-foreground">User not found</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your account preferences and settings
                        </p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="privacy" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Privacy
                            </TabsTrigger>
                            <TabsTrigger value="danger" className="flex items-center gap-2 text-destructive">
                                <Trash2 className="w-4 h-4" />
                                Danger Zone
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Settings */}
                        <TabsContent value="profile">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Profile Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name</Label>
                                                <Input
                                                    id="fullName"
                                                    {...profileForm.register("fullName")}
                                                    className="glassmorphic-input"
                                                />
                                                {profileForm.formState.errors.fullName && (
                                                    <p className="text-sm text-destructive">
                                                        {profileForm.formState.errors.fullName.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    {...profileForm.register("email")}
                                                    className="glassmorphic-input"
                                                />
                                                {profileForm.formState.errors.email && (
                                                    <p className="text-sm text-destructive">
                                                        {profileForm.formState.errors.email.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="skills">Skills (comma-separated)</Label>
                                            <Input
                                                id="skills"
                                                {...profileForm.register("skills")}
                                                placeholder="e.g., JavaScript, React, Node.js"
                                                className="glassmorphic-input"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="interests">Career Interests</Label>
                                            <Textarea
                                                id="interests"
                                                {...profileForm.register("interests")}
                                                placeholder="Describe your career interests..."
                                                className="glassmorphic-input"
                                                rows={3}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 glassmorphic-button-primary"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Password Settings */}
                        <TabsContent value="password">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        Change Password
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    {...passwordForm.register("currentPassword")}
                                                    className="glassmorphic-input pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordForm.formState.errors.currentPassword && (
                                                <p className="text-sm text-destructive">
                                                    {passwordForm.formState.errors.currentPassword.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    {...passwordForm.register("newPassword")}
                                                    className="glassmorphic-input pr-10"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordForm.formState.errors.newPassword && (
                                                <p className="text-sm text-destructive">
                                                    {passwordForm.formState.errors.newPassword.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmNewPassword"
                                                type="password"
                                                {...passwordForm.register("confirmNewPassword")}
                                                className="glassmorphic-input"
                                            />
                                            {passwordForm.formState.errors.confirmNewPassword && (
                                                <p className="text-sm text-destructive">
                                                    {passwordForm.formState.errors.confirmNewPassword.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 glassmorphic-button-primary"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? "Changing..." : "Change Password"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notification Settings */}
                        <TabsContent value="notifications">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notification Preferences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={notificationForm.handleSubmit(handleNotificationSettings)} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Email Notifications</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive notifications via email
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...notificationForm.register("emailNotifications")}
                                                    checked={notificationForm.watch("emailNotifications")}
                                                    onCheckedChange={(checked) =>
                                                        notificationForm.setValue("emailNotifications", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Job Alerts</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Get notified about new job opportunities
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...notificationForm.register("jobAlerts")}
                                                    checked={notificationForm.watch("jobAlerts")}
                                                    onCheckedChange={(checked) =>
                                                        notificationForm.setValue("jobAlerts", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Application Updates</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Updates on your job applications
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...notificationForm.register("applicationUpdates")}
                                                    checked={notificationForm.watch("applicationUpdates")}
                                                    onCheckedChange={(checked) =>
                                                        notificationForm.setValue("applicationUpdates", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Newsletter</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Weekly career tips and industry news
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...notificationForm.register("newsletter")}
                                                    checked={notificationForm.watch("newsletter")}
                                                    onCheckedChange={(checked) =>
                                                        notificationForm.setValue("newsletter", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Marketing Emails</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Promotional content and special offers
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...notificationForm.register("marketingEmails")}
                                                    checked={notificationForm.watch("marketingEmails")}
                                                    onCheckedChange={(checked) =>
                                                        notificationForm.setValue("marketingEmails", checked)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 glassmorphic-button-primary"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? "Saving..." : "Save Preferences"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Privacy Settings */}
                        <TabsContent value="privacy">
                            <Card className="glassmorphic">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Privacy Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={privacyForm.handleSubmit(handlePrivacySettings)} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Profile Visibility</Label>
                                                <Select
                                                    value={privacyForm.watch("profileVisibility")}
                                                    onValueChange={(value) =>
                                                        privacyForm.setValue("profileVisibility", value as any)
                                                    }
                                                >
                                                    <SelectTrigger className="glassmorphic-input">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                                                        <SelectItem value="connections">Connections - Visible to connections only</SelectItem>
                                                        <SelectItem value="private">Private - Not visible to others</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Show Email Address</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Display your email on your public profile
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...privacyForm.register("showEmail")}
                                                    checked={privacyForm.watch("showEmail")}
                                                    onCheckedChange={(checked) =>
                                                        privacyForm.setValue("showEmail", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Show Resume</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Allow others to view your resume
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...privacyForm.register("showResume")}
                                                    checked={privacyForm.watch("showResume")}
                                                    onCheckedChange={(checked) =>
                                                        privacyForm.setValue("showResume", checked)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label>Data Sharing</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Share anonymized data for platform improvement
                                                    </p>
                                                </div>
                                                <Switch
                                                    {...privacyForm.register("dataSharing")}
                                                    checked={privacyForm.watch("dataSharing")}
                                                    onCheckedChange={(checked) =>
                                                        privacyForm.setValue("dataSharing", checked)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 glassmorphic-button-primary"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? "Saving..." : "Save Settings"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Danger Zone */}
                        <TabsContent value="danger">
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive">
                                        <Trash2 className="w-5 h-5" />
                                        Danger Zone
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Irreversible actions that will permanently affect your account
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                                            <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Once you delete your account, there is no going back. This will permanently delete your account and remove your data from our servers.
                                            </p>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="flex items-center gap-2">
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete Account
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <form id="delete-account-form" onSubmit={deletionForm.handleSubmit(handleAccountDeletion as any)} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="confirmation">Type "DELETE" to confirm</Label>
                                                            <Input
                                                                id="confirmation"
                                                                {...deletionForm.register("confirmation")}
                                                                placeholder="DELETE"
                                                                className="glassmorphic-input"
                                                            />
                                                            {deletionForm.formState.errors.confirmation && (
                                                                <p className="text-sm text-destructive">
                                                                    {deletionForm.formState.errors.confirmation.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="reason">Reason for leaving (optional)</Label>
                                                            <Textarea
                                                                id="reason"
                                                                {...deletionForm.register("reason")}
                                                                placeholder="Help us improve by sharing why you're leaving..."
                                                                className="glassmorphic-input"
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                type="submit"
                                                                form="delete-account-form"
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete Account
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </form>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Footer />
        </main>
    );
}