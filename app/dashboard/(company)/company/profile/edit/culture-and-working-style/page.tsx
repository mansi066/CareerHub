"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const workModes = ["Remote", "On-site", "Hybrid"] as const
const companyValues = [
    "Fast-Paced",
    "Work-Life Balance",
    "Innovation-First",
    "Diversity-Focused",
] as const
const perks = [
    "Flexible Hours",
    "Health Insurance",
    "Free Meals",
    "ESOPs",
    "Learning Stipends",
] as const

export default function CultureAndWorkingStylePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedWorkMode, setSelectedWorkMode] = useState<string>("")
    const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({})
    const [selectedPerks, setSelectedPerks] = useState<Record<string, boolean>>({})
    const [photoFiles, setPhotoFiles] = useState<File[]>([])
    const [photoUrls, setPhotoUrls] = useState<string[]>([])
    const [photoUploading, setPhotoUploading] = useState(false)

    const previews = useMemo(
        () => photoFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
        [photoFiles]
    )

    const handlePhotosChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const files = Array.from(e.target.files ?? [])
        setPhotoFiles(files)
    }

    const uploadOfficePhotos = async (files: File[]) => {
        if (!files.length) return [] as string[]
        setPhotoUploading(true)
        const toastId = toast.loading("Uploading office photos...")
        try {
            const signRes = await fetch("/api/image-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder: "company-office-photos", resourceType: "image" }),
            })

            if (!signRes.ok) {
                throw new Error("Failed to get upload signature")
            }

            const signedPayload = await signRes.json()
            const uploads = await Promise.all(
                files.map(async (file) => {
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
                        throw new Error("Failed to upload an office photo")
                    }

                    const cloudData = await cloudRes.json()
                    return cloudData.secure_url as string
                })
            )

            setPhotoUrls(uploads)
            toast.success("Office photos uploaded")
            return uploads
        } catch (error: any) {
            toast.error(error?.message || "Office photo upload failed")
            throw error
        } finally {
            toast.dismiss(toastId)
            setPhotoUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        const saveToastId = toast.loading("Saving culture & working style...")
        try {
            let uploadedPhotoUrls = photoUrls
            if (photoFiles.length) {
                uploadedPhotoUrls = await uploadOfficePhotos(photoFiles)
            }

            const payload = {
                workMode: selectedWorkMode,
                companyValues: Object.keys(selectedValues).filter((k) => selectedValues[k]),
                perks: Object.keys(selectedPerks).filter((k) => selectedPerks[k]),
                officePhotoUrls: uploadedPhotoUrls,
            }

            const res = await fetch("/api/company/profile/culture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                toast.error(error?.message || "Failed to save culture & working style")
                return
            }

            toast.success("Culture & working style saved")
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
                <h1 className="text-2xl font-semibold">Culture & Working Style</h1>
                <p className="text-sm text-muted-foreground">
                    Help match student personalities by describing how your company works.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Work Mode */}
                <div className="space-y-2">
                    <Label htmlFor="workMode">Work Mode</Label>
                    <Select value={selectedWorkMode} onValueChange={setSelectedWorkMode} name="workMode">
                        <SelectTrigger id="workMode">
                            <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent>
                            {workModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                    {mode}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Company Values */}
                <div className="space-y-3">
                    <Label>Company Values</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {companyValues.map((val) => (
                            <label key={val} className="flex items-center gap-3">
                                <Checkbox
                                    checked={!!selectedValues[val]}
                                    onCheckedChange={(v) => setSelectedValues((prev) => ({ ...prev, [val]: Boolean(v) }))}
                                />
                                <span>{val}</span>
                                {/* Each checked value also as hidden input for submit via FormData if needed */}
                                {selectedValues[val] && <input type="hidden" name="companyValues[]" value={val} />}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Office Photos */}
                <div className="space-y-2">
                    <Label htmlFor="officePhotos">Office Photos</Label>
                    <Input
                        id="officePhotos"
                        name="officePhotos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotosChange}
                    />
                    {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {previews.map((p) => (
                                <div key={p.url} className="overflow-hidden rounded-md border">
                                    <img src={p.url} alt={p.name} className="h-24 w-full object-cover" />
                                    <p className="truncate px-2 py-1 text-xs text-muted-foreground">{p.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">Upload multiple images to showcase your workspace.</p>
                </div>

                {/* Perks & Benefits */}
                <div className="space-y-3">
                    <Label>Perks & Benefits</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {perks.map((perk) => (
                            <label key={perk} className="flex items-center gap-3">
                                <Checkbox
                                    checked={!!selectedPerks[perk]}
                                    onCheckedChange={(v) => setSelectedPerks((prev) => ({ ...prev, [perk]: Boolean(v) }))}
                                />
                                <span>{perk}</span>
                                {selectedPerks[perk] && <input type="hidden" name="perks[]" value={perk} />}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting || photoUploading}>
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            "Save Culture & Style"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

