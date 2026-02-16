"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function RecruitmentSpecificsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [steps, setSteps] = useState<string[]>([
        "Resume Shortlisting",
        "Take-home Task",
        "Technical Round",
        "HR",
    ])

    const addStep = () => setSteps((prev) => [...prev, ""])
    const removeStep = (idx: number) => setSteps((prev) => prev.filter((_, i) => i !== idx))
    const moveUp = (idx: number) =>
        setSteps((prev) => {
            if (idx === 0) return prev
            const copy = [...prev]
                ;[copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]]
            return copy
        })
    const moveDown = (idx: number) =>
        setSteps((prev) => {
            if (idx === prev.length - 1) return prev
            const copy = [...prev]
                ;[copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]]
            return copy
        })

    const updateStep = (idx: number, value: string) =>
        setSteps((prev) => prev.map((s, i) => (i === idx ? value : s)))

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        const saveToastId = toast.loading("Saving recruitment details...")
        try {
            const fd = new FormData(event.currentTarget)
            const payload = {
                recruiterName: fd.get("recruiterName")?.toString().trim(),
                recruiterLinkedIn: fd.get("recruiterLinkedIn")?.toString().trim(),
                interviewProcess: steps.map((s) => s.trim()).filter(Boolean),
                idealCandidatePersona: fd.get("idealCandidatePersona")?.toString().trim(),
            }

            const res = await fetch("/api/company/profile/recruitment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error?.message || "Failed to save recruitment details")
                return
            }

            toast.success("Recruitment details saved")
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong")
        } finally {
            toast.dismiss(saveToastId)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Recruitment Specifics</h1>
                <p className="text-sm text-muted-foreground">
                    Information that streamlines the application process.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="recruiterName">Primary Recruiter Name</Label>
                        <Input id="recruiterName" name="recruiterName" placeholder="Jane Doe" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recruiterLinkedIn">Recruiter LinkedIn Profile</Label>
                        <Input
                            id="recruiterLinkedIn"
                            name="recruiterLinkedIn"
                            type="url"
                            placeholder="https://www.linkedin.com/in/jane-doe"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Average Interview Process (steps)</Label>
                    <div className="space-y-3">
                        {steps.map((step, idx) => (
                            <div key={idx} className="grid items-start gap-3 md:grid-cols-[auto_1fr_auto]">
                                <div className="pt-2 text-sm text-muted-foreground">{idx + 1}.</div>
                                <Input
                                    value={step}
                                    onChange={(e) => updateStep(idx, e.target.value)}
                                    placeholder="Describe step (e.g., Resume Shortlisting)"
                                />
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => moveUp(idx)} disabled={idx === 0}>
                                        ↑
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => moveDown(idx)}
                                        disabled={idx === steps.length - 1}
                                    >
                                        ↓
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(idx)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div>
                            <Button type="button" variant="outline" onClick={addStep}>
                                Add Step
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="idealCandidatePersona">Ideal Candidate Persona</Label>
                    <Textarea
                        id="idealCandidatePersona"
                        name="idealCandidatePersona"
                        placeholder="Describe your ideal candidate (skills, experience, mindset)..."
                        className="min-h-[140px]"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            "Save Recruitment Details"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

