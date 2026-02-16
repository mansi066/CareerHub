"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Loader2, MapPin, Briefcase, Building2, CheckCircle2,
    Calendar, DollarSign, Clock, Share2, Globe, FileText
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// --- Types ---
type JobDetail = {
    _id: string
    title: string
    department?: string
    location?: string
    type?: string
    workplaceType?: string
    description?: string
    experience?: string
    experienceRange?: string
    requirements?: string[]
    skills?: string[]
    benefits?: string[]
    salary?: { min?: number; max?: number; currency?: string; frequency?: string }
    applyUrl?: string
    applyBy?: string
    documents?: { name: string; url: string }[]
    companyId?: { name?: string; logo?: string; _id?: string }
    postedAt?: string // Assuming the API returns a posted date
}

export default function JobPage() {
    const params = useParams<{ id: string }>()
    const [job, setJob] = useState<JobDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [shareMessage, setShareMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/student/find-job-by-id?id=${params.id}`)
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data?.message || "Failed to fetch job")
                }
                const data = await res.json()
                setJob(data.job)
            } catch (err: any) {
                setError(err?.message || "Failed to fetch job")
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [params.id])

    // --- Loading State ---
    if (loading) {
        return <JobDetailsSkeleton />
    }

    // --- Error State ---
    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="p-4 bg-red-100 text-red-600 rounded-full">
                    <Briefcase className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold">Job not found</h2>
                <p className="text-muted-foreground">{error || "The job post may have expired or been removed."}</p>
                <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    // --- Helper Formatters ---
    const formatCurrency = (amount?: number) => {
        return amount ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: job.salary?.currency || "USD",
            maximumFractionDigits: 0
        }).format(amount) : ""
    }

    const companyInitial = job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : "C"

    const handleShare = async () => {
        try {
            const url = typeof window !== "undefined" ? window.location.href : ""
            const shareText = `${job.title}${job.companyId?.name ? ` at ${job.companyId.name}` : ""}`

            if (navigator.share) {
                await navigator.share({
                    title: job.title,
                    text: shareText,
                    url,
                })
                setShareMessage("Shared successfully")
                return
            }

            if (navigator.clipboard && url) {
                await navigator.clipboard.writeText(url)
                setShareMessage("Link copied to clipboard")
                return
            }

            setShareMessage("Share not supported on this device")
        } catch (err) {
            setShareMessage("Failed to share")
        } finally {
            setTimeout(() => setShareMessage(null), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-20">
            {/* --- Hero Header Section --- */}
            <div className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto max-w-6xl px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex gap-5 items-start">
                            <Avatar className="h-16 w-16 md:h-20 md:w-20 rounded-xl border shadow-sm">
                                <AvatarImage src={job.companyId?.logo} alt={job.companyId?.name} className="object-cover" />
                                <AvatarFallback className="text-2xl font-bold bg-indigo-50 text-indigo-600 rounded-xl">
                                    {companyInitial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1.5">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                    {job.companyId?.name && (
                                        <span className="flex items-center gap-1 font-medium text-foreground">
                                            <Building2 className="h-4 w-4 text-indigo-500" />
                                            {job.companyId.name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {job.location} ({job.workplaceType})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {job.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 pt-2 md:pt-0">
                            <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            {shareMessage && (
                                <span className="text-xs text-muted-foreground self-center">{shareMessage}</span>
                            )}
                            {job.applyUrl ? (
                                <Button size="lg" className="gap-2 w-full sm:w-auto" asChild>
                                    <a href={job.applyUrl} target="_blank" rel="noreferrer">
                                        Apply for this Job <Globe className="h-4 w-4" />
                                    </a>
                                </Button>
                            ) : (
                                <Button size="lg" className="w-full sm:w-auto">Apply Now</Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Left Column: Description (2/3 width) --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border p-6 md:p-8 shadow-sm">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                    Requirements
                                </h2>
                                <ul className="grid gap-3">
                                    {job.requirements.map((req, i) => (
                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                            <span className="leading-relaxed">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Attachments */}
                        {job.documents && job.documents.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-xl border p-6 shadow-sm">
                                <h2 className="text-base font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Related Documents</h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {job.documents.map((doc, idx) => (
                                        <a
                                            key={idx}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group"
                                        >
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-white transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">View Document</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* About Role */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-500" />
                                Job Description
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {job.description || "No description provided."}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: Sidebar (1/3 width) --- */}
                    <div className="space-y-6">

                        {/* Job Snapshot Card */}
                        <Card className="shadow-sm border-indigo-100 dark:border-zinc-800">
                            <CardHeader className="bg-slate-50/50 dark:bg-zinc-900/50 pb-4 border-b">
                                <CardTitle className="text-base font-semibold">Job Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="text-sm font-medium">Salary</span>
                                        </div>
                                        <div className="text-sm font-semibold text-right">
                                            {job.salary?.min ? (
                                                <div className="flex flex-col items-end">
                                                    <span>{formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)}</span>
                                                    <span className="text-xs text-muted-foreground font-normal lowercase">per {job.salary.frequency}</span>
                                                </div>
                                            ) : (
                                                <span>Competitive</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Briefcase className="h-4 w-4" />
                                            <span className="text-sm font-medium">Experience</span>
                                        </div>
                                        <span className="text-sm font-semibold">{job.experienceRange || job.experience || "Not specified"}</span>
                                    </div>

                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Building2 className="h-4 w-4" />
                                            <span className="text-sm font-medium">Department</span>
                                        </div>
                                        <span className="text-sm font-semibold">{job.department || "General"}</span>
                                    </div>

                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm font-medium">Apply By</span>
                                        </div>
                                        <span className="text-sm font-semibold text-red-600">
                                            {job.applyBy ? new Date(job.applyBy).toLocaleDateString() : "Open until filled"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Card */}
                        {job.skills && job.skills.length > 0 && (
                            <Card className="shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">Skills & Tech Stack</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="px-3 py-1 bg-white border hover:bg-slate-50 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300 transition-colors font-normal"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits Card */}
                        {job.benefits && job.benefits.length > 0 && (
                            <Card className="shadow-sm bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold text-indigo-900 dark:text-indigo-200">Perks & Benefits</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {job.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm text-indigo-800 dark:text-indigo-300">
                                                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Skeleton Component for Loading State ---
function JobDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="bg-white border-b py-8">
                <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex gap-4 w-full">
                        <Skeleton className="h-20 w-20 rounded-xl" />
                        <div className="space-y-3 flex-1">
                            <Skeleton className="h-8 w-2/3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
            <div className="container mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            </div>
        </div>
    )
}