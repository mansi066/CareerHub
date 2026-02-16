"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Briefcase, MapPin, Pencil, Eye } from "lucide-react"

type JobItem = {
    _id: string
    title: string
    department?: string
    location?: string
    workplaceType?: string
    type?: string
    status?: "published" | "draft"
    createdAt?: string
}

export default function JobPage() {
    const [jobs, setJobs] = useState<JobItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [status, setStatus] = useState<"all" | "published" | "draft">("all")

    const fetchJobs = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (query.trim()) params.set("q", query.trim())
            if (status !== "all") params.set("status", status)

            const res = await fetch(`/api/company/job?${params.toString()}`)
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data?.message || "Failed to fetch jobs")
            }
            const data = await res.json()
            setJobs(data.jobs || [])
        } catch (err: any) {
            setError(err?.message || "Failed to fetch jobs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Jobs</h1>
                    <p className="text-muted-foreground">Manage your job postings</p>
                </div>
                <Link href="/dashboard/company/jobs/create">
                    <Button>Post New Job</Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Search by title, department, location..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Select value={status} onValueChange={(v) => setStatus(v as "all" | "published" | "draft")}>
                            <SelectTrigger className="md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="secondary" onClick={fetchJobs}>Apply Filters</Button>
                    </div>
                </CardContent>
            </Card>

            {loading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading jobs...
                </div>
            )}

            {error && (
                <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3 mb-4">
                    {error}
                </div>
            )}

            {!loading && jobs.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        No jobs found. Try adjusting filters or create a new job.
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {jobs.map((job) => (
                    <Card key={job._id} className="hover:shadow-sm transition">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    {job.title}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant={job.status === "draft" ? "secondary" : "default"}>
                                        {job.status || "published"}
                                    </Badge>
                                    {job.type && <Badge variant="outline">{job.type}</Badge>}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {job.department && <span>{job.department}</span>}
                                {job.location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                                    </span>
                                )}
                                {job.workplaceType && <span>{job.workplaceType}</span>}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Link href={`/dashboard/company/jobs/${job._id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" /> View More
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/company/jobs/${job._id}/edit`}>
                                    <Button variant="secondary" size="sm">
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}