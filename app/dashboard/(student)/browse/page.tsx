"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

type JobItem = {
    _id: string
    title: string
    department?: string
    location?: string
    type?: string
    workplaceType?: string
    skills?: string[]
    companyId?: { name?: string; logo?: string }
}

export default function BrowsePage() {
    const [jobs, setJobs] = useState<JobItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const router = useRouter();

    const fetchJobs = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (query.trim()) params.set("q", query.trim())
            const res = await fetch(`/api/student/find-job?${params.toString()}`)
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
        <div className="container mx-auto max-w-6xl py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Browse Jobs</h1>
                    <p className="text-muted-foreground">Find jobs that match your skills</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search by title, department, location..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button variant="secondary" onClick={fetchJobs}>Search</Button>
                </div>
            </div>

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
                        No jobs found. Try another search.
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <Card key={job._id} className="hover:shadow-sm transition">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-start gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{job.title}</span>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {job.companyId?.name || "Company"}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {job.location && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                                    </span>
                                )}
                                {job.workplaceType && <span>{job.workplaceType}</span>}
                                {job.type && <Badge variant="outline">{job.type}</Badge>}
                            </div>

                            {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {job.skills.slice(0, 4).map((skill) => (
                                        <Badge key={skill} variant="secondary" className="font-normal">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {job.skills.length > 4 && (
                                        <Badge variant="outline" className="font-normal">
                                            +{job.skills.length - 4}
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <Button className="w-full" variant="secondary"
                                onClick={() => {
                                    router.push(`/dashboard/browse/${job._id}`)
                                }}
                            >View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}