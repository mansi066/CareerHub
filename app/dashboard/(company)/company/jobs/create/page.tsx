"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
    Loader2, X, Plus, UploadCloud, MapPin,
    Briefcase, DollarSign, Globe,
    CheckCircle2, Building2, Layers, Sparkles
} from "lucide-react"
import { MarkdownTextArea } from "@/components/markdown-text-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Textarea } from "@/components/ui/textarea"

// --- Constants ---
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"]
const EXP_LEVELS = ["Entry Level", "Mid Level", "Senior Level", "Lead / Manager", "Director", "Executive"]
const WORKPLACE_TYPES = ["On-site", "Hybrid", "Remote"]
const SALARY_FREQUENCIES = ["Yearly", "Monthly", "Hourly"]
const JOB_STATUS = ["published", "draft"] as const

// --- Types ---
type DocLink = { id: number; name: string; url: string }

export default function CreateJobPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [aiContext, setAiContext] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [aiOpen, setAiOpen] = useState(false)
    const [status, setStatus] = useState<(typeof JOB_STATUS)[number]>("published")

    // --- State: Basic Info ---
    const [title, setTitle] = useState("")
    const [department, setDepartment] = useState("")
    const [jobType, setJobType] = useState<string>("")
    const [workplaceType, setWorkplaceType] = useState<string>("On-site")
    const [location, setLocation] = useState("")

    // --- State: Role Details ---
    const [description, setDescription] = useState("")
    const [experience, setExperience] = useState<string>("")
    const [experienceRange, setExperienceRange] = useState<string>("")
    const [skills, setSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState("")
    const [requirements, setRequirements] = useState<string[]>([""])

    // --- State: Compensation & Perks ---
    const [salaryMin, setSalaryMin] = useState("")
    const [salaryMax, setSalaryMax] = useState("")
    const [currency, setCurrency] = useState("USD")
    const [salaryFrequency, setSalaryFrequency] = useState("Yearly")
    const [benefits, setBenefits] = useState<string[]>([])
    const [benefitInput, setBenefitInput] = useState("")

    // --- State: Application & Media ---
    const [applyUrl, setApplyUrl] = useState("")
    const [applyBy, setApplyBy] = useState<string>("")
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [thumbnailUrl, setThumbnailUrl] = useState<string>("")
    const [thumbnailUploading, setThumbnailUploading] = useState(false)
    const [docs, setDocs] = useState<DocLink[]>([])

    // --- Derived State ---
    const thumbnailPreview = useMemo(() => {
        if (thumbnailUrl) return thumbnailUrl
        if (thumbnailFile) return URL.createObjectURL(thumbnailFile)
        return ""
    }, [thumbnailFile, thumbnailUrl])

    // --- Handlers: Lists ---
    const addRequirement = () => setRequirements((prev) => [...prev, ""])
    const updateRequirement = (idx: number, value: string) =>
        setRequirements((prev) => prev.map((r, i) => (i === idx ? value : r)))
    const removeRequirement = (idx: number) =>
        setRequirements((prev) => prev.filter((_, i) => i !== idx))

    const addTag = (
        value: string,
        list: string[],
        setList: React.Dispatch<React.SetStateAction<string[]>>,
        setInput: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const s = value.trim()
        if (!s || list.includes(s)) return
        setList((prev) => [...prev, s])
        setInput("")
    }

    const removeTag = (value: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        setList((prev) => prev.filter((s) => s !== value))
    }

    // --- Handlers: Upload ---
    const uploadThumbnail = async (file: File) => {
        setThumbnailUploading(true)
        const toastId = toast.loading("Uploading thumbnail...")
        try {
            const signRes = await fetch("/api/image-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder: "job-thumbnails", resourceType: "image" }),
            })

            if (!signRes.ok) {
                throw new Error("Failed to get upload signature")
            }

            const signedPayload = await signRes.json()
            const uploadForm = new FormData()
            Object.entries(signedPayload.fields).forEach(([key, value]) => {
                if (value) uploadForm.append(key, String(value))
            })
            uploadForm.append("file", file)

            const cloudRes = await fetch(signedPayload.uploadUrl, {
                method: "POST",
                body: uploadForm,
            })

            if (!cloudRes.ok) {
                throw new Error("Failed to upload image")
            }

            const cloudData = await cloudRes.json()
            const secureUrl = cloudData.secure_url as string
            setThumbnailUrl(secureUrl)
            toast.success("Thumbnail uploaded")
            return secureUrl
        } catch (error: any) {
            toast.error("Upload failed")
            throw error
        } finally {
            toast.dismiss(toastId)
            setThumbnailUploading(false)
        }
    }

    const generateWithAI = async () => {
        if (!aiContext.trim()) {
            toast.error("Please add job context or description")
            return
        }
        setAiLoading(true)
        const toastId = toast.loading("Generating job with AI...")
        try {
            const res = await fetch("/api/ai/job-create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ context: aiContext }),
            })
            // console.log(res)
            if (!res.ok) throw new Error("Failed to generate")

            const data = await res.json()
            // console.log("AI Response:", data)
            // Hydrate state (Simplified for example)
            setTitle(data.title || "")
            setDepartment(data.department || "")
            setJobType(data.jobType || "")
            setWorkplaceType(data.workplaceType || "On-site")
            setLocation(data.location || "")
            setDescription(data.description || "")
            setExperience(data.experience || "")
            setExperienceRange(data.experienceRange || "")
            setSkills(Array.isArray(data.skills) ? data.skills : [])
            setRequirements(Array.isArray(data.requirements) ? data.requirements : [])
            setSalaryMin(data.salaryMin || "")
            setSalaryMax(data.salaryMax || "")
            setCurrency(data.currency || "USD")
            setSalaryFrequency(data.salaryFrequency || "Yearly")
            setBenefits(Array.isArray(data.benefits) ? data.benefits : [])
            setApplyUrl(data.applyUrl || "")
            setApplyBy(data.applyBy || "")
            setStatus(data.status === "draft" ? "draft" : "published")
            if (data.thumbnailUrl) setThumbnailUrl(data.thumbnailUrl)
            if (data.documents) {
                const docsData = data.documents.map((doc: any, idx: number) => ({
                    id: Date.now() + idx,
                    name: doc.name,
                    url: doc.url,
                }))
                setDocs(docsData)
            }

            toast.success("AI filled the job form")
            setActiveTab("details")
        } catch (error: any) {
            toast.error("AI generation failed (Mock)")
        } finally {
            toast.dismiss(toastId)
            setAiLoading(false)
            setAiOpen(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        if (!title || !description || !location) {
            toast.error("Please fill required fields")
            setIsSubmitting(false)
            return
        }
        const toastId = toast.loading("Publishing job...")
        try {
            const payload = {
                title,
                department,
                location,
                workplaceType,
                type: jobType || "Full-time",
                description,
                experience: experience || "Mid Level",
                experienceRange,
                skills,
                requirements: requirements.filter(Boolean),
                salary: {
                    min: salaryMin ? Number(salaryMin) : undefined,
                    max: salaryMax ? Number(salaryMax) : undefined,
                    currency,
                    frequency: salaryFrequency,
                },
                benefits,
                applyUrl,
                applyBy,
                thumbnailUrl,
                documents: docs.map((d) => ({ name: d.name, url: d.url })),
                status,
                remote: workplaceType === "Remote",
            }

            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error?.message || "Failed to post job")
                setIsSubmitting(false)
                return
            }

            toast.success(status === "draft" ? "Job saved as draft" : "Job posted successfully!")
        } catch (error: any) {
            toast.error(error?.message || "Failed to post job")
        } finally {
            toast.dismiss(toastId)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 pb-20">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
                    <p className="text-muted-foreground mt-1">
                        Create a compelling job post to attract the best talent.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Dialog open={aiOpen} onOpenChange={setAiOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300">
                                <Sparkles className="h-4 w-4" />
                                Auto-Fill with AI
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg overflow-y-auto no-scrollbar max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle>AI Job Builder</DialogTitle>
                                <DialogDescription>
                                    Paste a rough job description or list of requirements. We'll fill out the form for you.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                                <Textarea
                                    value={aiContext}
                                    onChange={(e) => setAiContext(e.target.value)}
                                    placeholder="e.g. We need a Senior React Developer who knows Next.js and Tailwind. Salary up to $120k. Remote friendly..."
                                    rows={6}
                                    className="resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setAiOpen(false)}>Cancel</Button>
                                    <Button onClick={generateWithAI} disabled={aiLoading}>
                                        {aiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                                        Generate
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => window.history.back()}>Discard</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Publish Job
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-muted/50 p-1">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="description">Role</TabsTrigger>
                    <TabsTrigger value="compensation">Perks</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                {/* --- TAB 1: DETAILS --- */}
                <TabsContent value="details" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Job Basics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Job Title <span className="text-red-500">*</span></Label>
                                    <Input placeholder="e.g. Senior Frontend Engineer" value={title} onChange={e => setTitle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Input placeholder="e.g. Engineering" value={department} onChange={e => setDepartment(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Job Type</Label>
                                        <Select value={jobType} onValueChange={setJobType}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                {JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Experience</Label>
                                        <Select value={experience} onValueChange={setExperience}>
                                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                {EXP_LEVELS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={status} onValueChange={(value) => setStatus(value as (typeof JOB_STATUS)[number])}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {JOB_STATUS.map(s => (
                                                <SelectItem key={s} value={s}>
                                                    {s === "published" ? "Published" : "Draft"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Workplace Type</Label>
                                    <Select value={workplaceType} onValueChange={setWorkplaceType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {WORKPLACE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {workplaceType !== "Remote" && (
                                    <div className="space-y-2 animate-in fade-in">
                                        <Label>Office Location <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input className="pl-9" placeholder="e.g. San Francisco, CA" value={location} onChange={e => setLocation(e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Application Link</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input className="pl-9" placeholder="https://..." value={applyUrl} onChange={e => setApplyUrl(e.target.value)} />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Optional: Candidates will apply via this URL.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Deadline</Label>
                                    <Input type="date" value={applyBy} onChange={e => setApplyBy(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- TAB 2: ROLE --- */}
                <TabsContent value="description" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Role Description
                            </CardTitle>
                            <CardDescription>Detail the responsibilities and requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <MarkdownTextArea
                                name="description"
                                value={description}
                                onChange={setDescription}
                                placeholder="## About the role..."
                                rows={10}
                            />

                            <Separator />

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-base">Required Skills</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={skillInput}
                                            onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag(skillInput, skills, setSkills, setSkillInput))}
                                            placeholder="Type skill & press Enter"
                                        />
                                        <Button type="button" variant="secondary" onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}>Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[40px] p-4 border rounded-lg bg-muted/20">
                                        {skills.map(skill => (
                                            <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                                                {skill}
                                                <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(skill, setSkills)} />
                                            </Badge>
                                        ))}
                                        {skills.length === 0 && <span className="text-sm text-muted-foreground italic">No skills added yet.</span>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base">Key Requirements</Label>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                        {requirements.map((req, idx) => (
                                            <div key={idx} className="flex gap-2 group">
                                                <div className="flex-1">
                                                    <Input
                                                        value={req}
                                                        onChange={e => updateRequirement(idx, e.target.value)}
                                                        placeholder={`Requirement ${idx + 1}`}
                                                    />
                                                </div>
                                                <Button size="icon" variant="ghost" className="opacity-50 group-hover:opacity-100" onClick={() => removeRequirement(idx)} disabled={requirements.length === 1}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="w-full border-dashed">
                                        <Plus className="h-4 w-4 mr-2" /> Add Another Requirement
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB 3: COMPENSATION --- */}
                <TabsContent value="compensation" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Salary & Benefits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Currency</Label>
                                    <Input value={currency} onChange={e => setCurrency(e.target.value)} placeholder="USD" />
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Frequency</Label>
                                    <Select value={salaryFrequency} onValueChange={setSalaryFrequency}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {SALARY_FREQUENCIES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label>Min</Label>
                                    <Input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="0" />
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label>Max</Label>
                                    <Input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="0" />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="text-base">Perks & Benefits</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={benefitInput}
                                        onChange={e => setBenefitInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag(benefitInput, benefits, setBenefits, setBenefitInput))}
                                        placeholder="e.g. Health Insurance, Gym Membership..."
                                    />
                                    <Button type="button" variant="secondary" onClick={() => addTag(benefitInput, benefits, setBenefits, setBenefitInput)}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-4 border rounded-lg bg-muted/20">
                                    {benefits.map(b => (
                                        <Badge key={b} variant="outline" className="pl-2 pr-1 py-1 gap-1 bg-background">
                                            {b}
                                            <X className="h-3 w-3 cursor-pointer hover:text-foreground" onClick={() => removeTag(b, setBenefits)} />
                                        </Badge>
                                    ))}
                                    {benefits.length === 0 && <span className="text-sm text-muted-foreground italic">Add benefits to attract more candidates.</span>}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Cover Image (Optional)</Label>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 w-full space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="cursor-pointer"
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setThumbnailFile(file);
                                                    uploadThumbnail(file);
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">Recommended: 1200x630px JPG or PNG.</p>
                                    </div>
                                    {thumbnailPreview && (
                                        <div className="relative h-32 w-48 rounded-lg overflow-hidden border shadow-sm shrink-0 bg-muted">
                                            <img src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover" />
                                            {thumbnailUploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB 4: PREVIEW --- */}
                <TabsContent value="preview" className="animate-in fade-in-50 slide-in-from-bottom-2">
                    <Card className="max-w-5xl mx-auto border overflow-hidden shadow-lg bg-background">
                        {/* Preview Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-8 border-b">
                            <div className="flex gap-5 items-start">
                                <div className="h-16 w-16 rounded-xl bg-white dark:bg-zinc-800 border shadow-sm flex items-center justify-center text-xl font-bold shrink-0">
                                    <Building2 className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">{title || "Untitled Position"}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {department || "General"}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {workplaceType} {location && workplaceType !== "Remote" && `• ${location}`}</span>
                                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {jobType || "Full-time"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            <div className="flex flex-row">
                                <div className="w-full shrink-0 bg-muted/10 p-6 space-y-8">
                                    {/* Snapshot */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Job Snapshot</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm py-2 border-b">
                                                <span className="text-muted-foreground">Salary</span>
                                                <span className="font-medium text-foreground">
                                                    {salaryMin && salaryMax
                                                        ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(salaryMin))} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(salaryMax))}`
                                                        : "Competitive"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b">
                                                <span className="text-muted-foreground">Experience</span>
                                                <span className="font-medium text-foreground">{experience || "—"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b">
                                                <span className="text-muted-foreground">Frequency</span>
                                                <span className="font-medium text-foreground">{salaryFrequency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {skills.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.map(s => <Badge key={s} variant="secondary" className="font-normal border-transparent bg-slate-200 dark:bg-slate-800 text-foreground hover:bg-slate-300">{s}</Badge>)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Benefits */}
                                    {benefits.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Perks</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {benefits.map(b => (
                                                    <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-2 py-1.5 rounded-md border shadow-sm">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                        {b}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                {/* Left Content: Description */}
                                <div className="flex-1 p-8 space-y-8 border-r-0 md:border-r border-b md:border-b-0">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4 text-foreground">About the Role</h3>
                                        {description ? (
                                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground italic bg-muted/30">
                                                No description provided. Go to the "Role" tab to add one.
                                            </div>
                                        )}
                                    </div>

                                    {requirements.length > 0 && requirements[0] !== "" && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 text-foreground">Key Requirements</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground marker:text-primary">
                                                {requirements.map((r, i) => r && <li key={i} className="pl-1">{r}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-background border shadow-sm space-y-4">
                                <Button className="w-full text-base font-semibold shadow-md" size="lg">Apply Now</Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Posted on {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}