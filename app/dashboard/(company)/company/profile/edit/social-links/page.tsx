"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type ExtraLink = { id: number; label: string; url: string }

export default function CompanySocialLinksPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [extraLinks, setExtraLinks] = useState<ExtraLink[]>([])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        const saveToastId = toast.loading("Saving social links...")
        try {
            const formData = new FormData(event.currentTarget)
            const payload = {
                website: formData.get("website")?.toString().trim(),
                linkedin: formData.get("linkedin")?.toString().trim(),
                social: formData.get("social")?.toString().trim() || undefined,
                reviews: formData.get("reviews")?.toString().trim() || undefined,
                workEmailDomain: formData.get("workEmailDomain")?.toString().trim(),
                extraLinks: extraLinks
                    .filter((l) => l.label.trim() && l.url.trim())
                    .map((l) => ({ label: l.label.trim(), url: l.url.trim() })),
            }

            const res = await fetch("/api/company/profile/social-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error?.message || "Failed to save social links")
                return
            }

            toast.success("Social links saved")
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong")
        } finally {
            toast.dismiss(saveToastId)
            setIsSubmitting(false)
        }
    }

    const addExtraLink = () => {
        setExtraLinks((prev) => [...prev, { id: Date.now(), label: "", url: "" }])
    }

    const updateExtraLink = (id: number, field: keyof ExtraLink, value: string) => {
        setExtraLinks((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
    }

    const removeExtraLink = (id: number) => {
        setExtraLinks((prev) => prev.filter((link) => link.id !== id))
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Company Profile · Social Links</h1>
                <p className="text-sm text-muted-foreground">
                    Add trusted links so students and the AI can verify your brand.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="website">Company Website URL</Label>
                        <Input id="website" name="website" type="url" placeholder="https://www.company.com" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="linkedin">Official LinkedIn Page</Label>
                        <Input id="linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/company/your-company" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="social">Twitter/X or Instagram (optional)</Label>
                        <Input id="social" name="social" type="url" placeholder="https://x.com/yourcompany" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reviews">Glassdoor / AmbitionBox</Label>
                        <Input id="reviews" name="reviews" type="url" placeholder="https://www.glassdoor.com/Reviews/your-company" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="workEmailDomain">Work Email Domain</Label>
                    <Input id="workEmailDomain" name="workEmailDomain" type="email" placeholder="name@yourcompany.com" required />
                    <p className="text-xs text-muted-foreground">Used to auto-verify the user belongs to this company.</p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Additional Links (optional)</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addExtraLink}>
                            Add link
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {extraLinks.length === 0 && (
                            <p className="text-sm text-muted-foreground">Add any other URLs (blog, culture page, press, etc.).</p>
                        )}
                        {extraLinks.map((link) => (
                            <div key={link.id} className="grid gap-3 rounded-md border p-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Label</Label>
                                    <Input
                                        name={`extraLabel-${link.id}`}
                                        value={link.label}
                                        onChange={(e) => updateExtraLink(link.id, "label", e.target.value)}
                                        placeholder="e.g., Engineering Blog"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                        name={`extraUrl-${link.id}`}
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateExtraLink(link.id, "url", e.target.value)}
                                        placeholder="https://blog.yourcompany.com"
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeExtraLink(link.id)}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            "Save Social Links"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
