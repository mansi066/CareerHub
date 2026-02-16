"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Building2, Briefcase, Users, Link2, MapPin, Globe,
    Mail, Pencil, CheckCircle2, Star, Linkedin, FileText,
    Calendar, Hash, ShieldCheck, AtSign,
    ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProfileData = {
    user?: { id: string; email: string; name: string; image?: string };
    basicInfo?: {
        name: string;
        industry: string;
        companyType: string;
        website: string;
        headquarters: string;
        description?: string;
        size: string;
        tagline?: string;
        registrationNumber?: string;
        gstPan?: string;
        emailDomain?: string;
        foundingYear?: number;
    };
    culture?: {
        workMode: string;
        companyValues: string[];
        perks: string[];
    };
    recruitment?: {
        recruiterName: string;
        recruiterLinkedIn: string;
        interviewProcess: string[];
    };
    socialLinks?: {
        website: string;
        linkedin: string;
        social: string;
        reviews: string;
    };
};

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/company/profile");
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err?.message || "Failed to load profile");
                }
                const data = await res.json();
                setProfile(data);
            } catch (e: any) {
                setError(e?.message || "Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, []);

    // Helper for Section Headers
    const SectionHeader = ({ title, icon: Icon, editUrl }: { title: string, icon: any, editUrl: string }) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-lg tracking-tight text-foreground">{title}</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:w-auto md:px-3 text-muted-foreground hover:text-primary" onClick={() => router.push(editUrl)}>
                <Pencil className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline text-xs">Edit</span>
            </Button>
        </div>
    );

    // Helper for Clean Data Rows
    const DetailRow = ({ icon: Icon, label, value }: { icon?: any, label: string, value?: string | number }) => (
        <div className="flex items-start gap-3 py-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />}
            <div className="flex-1 space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-foreground">{value || "—"}</p>
            </div>
        </div>
    );

    if (isLoading) return <ProfileSkeleton />;

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-4 text-center p-6">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600">
                    <Building2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold">Could not load profile</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
        );
    }

    const companyName = profile?.basicInfo?.name || profile?.user?.name || "Company Name";
    const companyInitials = companyName.substring(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-20">
            {/* --- Banner --- */}
            <div className="h-48 md:h-60 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-20 relative z-10 space-y-6">

                {/* --- 1. Header Card --- */}
                <Card className="border shadow-md overflow-hidden bg-background">
                    <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end text-center md:text-left w-full">
                                {/* Avatar overlapping banner */}
                                <Avatar className="h-32 w-32 border-[4px] border-background shadow-xl mt-[-4rem] bg-white">
                                    <AvatarImage src={profile?.user?.image} alt={companyName} className="object-cover" />
                                    <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                                        {companyInitials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="space-y-2 mb-2 flex-1">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{companyName}</h1>
                                        <p className="text-muted-foreground text-lg">{profile?.basicInfo?.tagline || "Innovating for the future"}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground pt-1">
                                        {profile?.basicInfo?.industry && (
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                <Building2 className="h-3.5 w-3.5" />
                                                {profile.basicInfo.industry}
                                            </span>
                                        )}
                                        {profile?.basicInfo?.headquarters && (
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {profile.basicInfo.headquarters}
                                            </span>
                                        )}
                                        {profile?.basicInfo?.website && (
                                            <a
                                                href={profile.basicInfo.website.startsWith('http') ? profile.basicInfo.website : `https://${profile.basicInfo.website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 hover:text-primary transition-colors hover:underline underline-offset-4"
                                            >
                                                <Globe className="h-3.5 w-3.5" />
                                                {profile.basicInfo.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <Button onClick={() => router.push('/dashboard/company/profile/edit/basic-info')}>
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Information */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <SectionHeader
                                    title="Company Overview"
                                    icon={FileText}
                                    editUrl="/dashboard/company/profile/edit/basic-info"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Description */}
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-3">About Us</h4>
                                    {profile?.basicInfo?.description ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {profile.basicInfo.description}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No description provided yet.</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                                    <div className="space-y-4">
                                        <h5 className="font-semibold text-sm flex items-center gap-2 text-foreground/80">
                                            <Building2 className="h-4 w-4" /> Operational Details
                                        </h5>
                                        <div className="space-y-1 pl-1">
                                            <DetailRow label="Company Size" value={profile?.basicInfo?.size} />
                                            <DetailRow label="Company Type" value={profile?.basicInfo?.companyType} />
                                            <DetailRow label="Founded Year" value={profile?.basicInfo?.foundingYear} />
                                            <DetailRow label="Headquarters" value={profile?.basicInfo?.headquarters} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h5 className="font-semibold text-sm flex items-center gap-2 text-foreground/80">
                                            <ShieldCheck className="h-4 w-4" /> Legal & Registration
                                        </h5>
                                        <div className="space-y-1 pl-1">
                                            <DetailRow label="Registration No." value={profile?.basicInfo?.registrationNumber} />
                                            <DetailRow label="GST / PAN" value={profile?.basicInfo?.gstPan} />
                                            <DetailRow label="Official Email Domain" value={profile?.basicInfo?.emailDomain} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Culture */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <SectionHeader
                                    title="Culture & Values"
                                    icon={Users}
                                    editUrl="/dashboard/company/profile/edit/culture-and-working-style"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border">
                                    <div className="bg-background p-2 rounded-full shadow-sm">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase">Primary Work Mode</p>
                                        <p className="font-semibold text-lg">{profile?.culture?.workMode || "Not Specified"}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Core Values</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.culture?.companyValues?.length ? (
                                            profile.culture.companyValues.map((val, i) => (
                                                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm font-normal border-transparent bg-primary/5 text-primary hover:bg-primary/10">
                                                    {val}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">No values listed yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-3">Perks & Benefits</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {profile?.culture?.perks?.length ? (
                                            profile.culture.perks.map((perk, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                                    <span>{perk}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">No perks listed yet.</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recruitment */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <SectionHeader
                                    title="Recruitment Process"
                                    icon={Briefcase}
                                    editUrl="/dashboard/company/profile/edit/recruitment-specifics"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800">
                                            <AvatarFallback className="bg-blue-100 text-blue-700">HR</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Hiring Manager</p>
                                            <p className="font-semibold text-lg">{profile?.recruitment?.recruiterName || "Not assigned"}</p>
                                        </div>
                                    </div>
                                    {profile?.recruitment?.recruiterLinkedIn && (
                                        <Button variant="outline" size="sm" className="gap-2 bg-white dark:bg-zinc-900" asChild>
                                            <Link href={profile.recruitment.recruiterLinkedIn} target="_blank">
                                                <Linkedin className="h-4 w-4 text-blue-600" />
                                                Connect on LinkedIn
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-4">Interview Pipeline</h4>
                                    {profile?.recruitment?.interviewProcess?.length ? (
                                        <div className="relative pl-2">
                                            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-muted-foreground/20" />
                                            <div className="space-y-6">
                                                {profile.recruitment.interviewProcess.map((step, index) => (
                                                    <div key={index} className="relative flex items-center gap-4">
                                                        <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-bold shadow-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 rounded-lg border bg-card p-3 shadow-sm text-sm">
                                                            {step}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border-2 border-dashed rounded-lg">
                                            <p className="text-sm text-muted-foreground italic">Interview process not defined yet.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- RIGHT COLUMN (Sidebar) --- */}
                    <div className="space-y-6">
                        {/* Profile Strength */}
                        <Card className="bg-gradient-to-br from-white to-green-50 dark:from-zinc-900 dark:to-green-950/20 border-green-200 dark:border-green-900 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Profile Strength</p>
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold text-foreground">Excellent</span>
                                </div>
                                <div className="w-full bg-green-200/50 h-2 rounded-full mb-2 overflow-hidden">
                                    <div className="bg-green-600 h-full w-[85%]" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your profile is well optimized for visibility.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b">
                                <SectionHeader
                                    title="Online Presence"
                                    icon={Link2}
                                    editUrl="/dashboard/company/profile/edit/social-links"
                                />
                            </CardHeader>
                            <CardContent className="space-y-0 pt-2">
                                <Link
                                    href={profile?.socialLinks?.website || "#"}
                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-md group-hover:bg-background group-hover:shadow-sm transition-all">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="text-sm font-medium">Website</span>
                                    </div>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                                </Link>

                                <Link
                                    href={profile?.socialLinks?.linkedin || "#"}
                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md group-hover:bg-background group-hover:shadow-sm transition-all">
                                            <Linkedin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium">LinkedIn</span>
                                    </div>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                                </Link>

                                <Link
                                    href={`mailto:${profile?.user?.email}`}
                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-md group-hover:bg-background group-hover:shadow-sm transition-all">
                                            <Mail className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <span className="text-sm font-medium">Email Contact</span>
                                    </div>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-muted/5 pb-20">
            <div className="h-48 md:h-64 bg-muted animate-pulse w-full" />
            <div className="container mx-auto px-4 max-w-6xl -mt-20 relative z-10 space-y-6">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-end">
                        <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                        <div className="space-y-2 flex-1 w-full">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}