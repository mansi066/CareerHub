"use client"

import { useState } from "react"
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
import { MarkdownTextArea } from "@/components/markdown-text-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Lightbulb } from "lucide-react"
import { toast } from "sonner"

const industries = [
    "SaaS",
    "E-commerce",
    "Fintech",
    "Healthcare",
    "EdTech",
    "AI/ML",
    "Cybersecurity",
    "Gaming",
    "Logistics",
    "Manufacturing",
    "Other",
]

const companySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "500+",
    "Other",
]

const companyTypes = ["Company", "Startup", "Other"]

const defaultHints: Record<string, string> = {
    name: "Use your official company name (e.g., Acme Corp).",
    tagline: "Short one-line summary of what your company does.",
    industry: "Select your industry. Choose Other if not listed.",
    size: "Select your current team size. Choose Other if not listed.",
    companyType: "Choose Company or Startup. Startup makes GST/registration optional.",
    registrationNumber: "8-15 alphanumeric characters. Example: 12345678AB.",
    gstPan: "10-15 alphanumeric characters. Example: 22AAAAA0000A1Z5.",
    emailDomain: "Use only the domain (e.g., company.com).",
    website: "Full URL like https://company.com. Must match email domain for companies.",
    foundingYear: "Enter the year your company was founded.",
    logo: "Upload PNG/JPG/SVG under 2MB.",
    about: "Write a clear company overview. Markdown supported.",
    headquarters: "City, State, Country.",
}

function HintButton({ text, label }: { text: string; label: string }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" aria-label={label}>
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="text-sm">{text}</PopoverContent>
        </Popover>
    )
}

export default function CompanyBasicInfoPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [about, setAbout] = useState("")
    const [industry, setIndustry] = useState("")
    const [otherIndustry, setOtherIndustry] = useState("")
    const [size, setSize] = useState("")
    const [otherSize, setOtherSize] = useState("")
    const [companyType, setCompanyType] = useState("")
    const [otherCompanyType, setOtherCompanyType] = useState("")
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [logoUploading, setLogoUploading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const uploadLogo = async (file: File) => {
        setLogoUploading(true)
        const toastId = toast.loading("Uploading logo...")
        try {
            const signRes = await fetch("/api/image-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folder: "company-logos", resourceType: "image" }),
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
            setLogoUrl(secureUrl)
            toast.success("Logo uploaded")
            return secureUrl
        } catch (error: any) {
            toast.error(error?.message || "Logo upload failed")
            throw error
        } finally {
            toast.dismiss(toastId)
            setLogoUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        const saveToastId = toast.loading("Saving basic info...")
        try {
            const formData = new FormData(event.currentTarget)
            // Basic validation for fraud detection
            const regNum = formData.get("registrationNumber")?.toString().trim() || ""
            const gstPan = formData.get("gstPan")?.toString().trim() || ""
            const emailDomainInput = formData.get("emailDomain")?.toString().trim() || ""
            const websiteInput = formData.get("website")?.toString().trim() || ""
            const logoFile = formData.get("logo") as File
            const fieldErrors: Record<string, string> = {}
            const finalIndustry = industry === "Other" ? otherIndustry.trim() : industry
            const finalSize = size === "Other" ? otherSize.trim() : size
            const finalCompanyType = companyType === "Other" ? otherCompanyType.trim() : companyType

            const normalizeDomain = (value: string) => {
                const trimmed = value.trim().toLowerCase()
                if (!trimmed) return ""
                if (trimmed.includes("@")) {
                    return trimmed.split("@").pop() || ""
                }
                try {
                    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`)
                    return url.hostname.replace(/^www\./, "")
                } catch {
                    return trimmed.replace(/^www\./, "").split("/")[0]
                }
            }

            const emailDomain = normalizeDomain(emailDomainInput)
            const website = normalizeDomain(websiteInput)

            if (!formData.get("name")?.toString().trim()) fieldErrors.name = "Company name is required."
            if (!formData.get("tagline")?.toString().trim()) fieldErrors.tagline = "Tagline is required."
            if (!finalIndustry) fieldErrors.industry = "Industry is required."
            if (!finalSize) fieldErrors.size = "Company size is required."
            if (!finalCompanyType) fieldErrors.companyType = "Company type is required."
            if (!about.trim()) fieldErrors.about = "About section is required."
            if (!formData.get("hq")?.toString().trim()) fieldErrors.headquarters = "Headquarters is required."
            // Registration number format (example: alphanumeric, 8-15 chars)
            const isStartup = companyType === "Startup" || otherCompanyType.toLowerCase() === "startup"
            if (!isStartup && !/^\w{8,15}$/.test(regNum)) {
                fieldErrors.registrationNumber = "Use 8-15 alphanumeric characters. Example: 12345678AB."
            }
            // GST/PAN format (example: 10-15 chars)
            if (!isStartup && !/^\w{10,15}$/.test(gstPan)) {
                fieldErrors.gstPan = "Use 10-15 alphanumeric characters. Example: 22AAAAA0000A1Z5."
            }
            // Email domain format
            if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(emailDomain)) {
                fieldErrors.emailDomain = "Enter a valid domain like company.com (no http/https)."
            }
            // Website required for non-startup and domain match check
            if (!isStartup && !website) {
                fieldErrors.website = "Website is required for companies. Example: https://company.com."
            }
            if (!isStartup && website) {
                if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(website)) {
                    fieldErrors.website = "Enter a valid URL like https://company.com."
                } else if (!fieldErrors.emailDomain && !website.endsWith(emailDomain)) {
                    fieldErrors.website = "Website domain must match the email domain (e.g., email@acme.com → acme.com)."
                }
            }
            if (Object.keys(fieldErrors).length) {
                setErrors(fieldErrors)
                toast.error("Please fix the highlighted fields")
                // console.error("Validation errors", fieldErrors)
                toast.dismiss(saveToastId)
                return
            }
            setErrors({})
            // Logo file validation
            if (logoFile && logoFile.size > 2 * 1024 * 1024) {
                toast.error("Logo file size should be less than 2MB.")
                setIsSubmitting(false)
                toast.dismiss(saveToastId)
                return
            }
            let uploadedLogoUrl = logoUrl
            if (logoFile && logoFile.size > 0) {
                uploadedLogoUrl = await uploadLogo(logoFile)
            }

            const payload = {
                name: formData.get("name")?.toString().trim(),
                tagline: formData.get("tagline")?.toString().trim(),
                industry: finalIndustry,
                size: finalSize,
                companyType: finalCompanyType,
                registrationNumber: isStartup ? (regNum || "NA") : regNum,
                gstPan: isStartup ? (gstPan || "NA") : gstPan,
                emailDomain,
                website: website || (isStartup ? undefined : website),
                foundingYear: Number(formData.get("foundingYear")),
                logoUrl: uploadedLogoUrl,
                about,
                headquarters: formData.get("hq")?.toString().trim(),
            }

            const res = await fetch("/api/company/profile-basic-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const error = await res.json()
                // console.error("Save failed", error)
                toast.error(error?.message || "Failed to save profile")
                toast.dismiss(saveToastId)
                return
            }
            toast.success("Basic info saved")
        } catch (error: any) {
            // console.error("Error saving company basic info:", error)
            toast.error(error?.message || "Something went wrong")
        } finally {
            toast.dismiss(saveToastId)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Company Profile · Basic Info</h1>
                <p className="text-sm text-muted-foreground">
                    Establish who the company is and its brand presence.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
                            <HintButton label="Company name help" text={errors.name || defaultHints.name} />
                        </div>
                        <Input id="name" name="name" placeholder="Acme Corp" required />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="tagline">One-Line Tagline <span className="text-red-500">*</span></Label>
                            <HintButton label="Tagline help" text={errors.tagline || defaultHints.tagline} />
                        </div>
                        <Input
                            id="tagline"
                            name="tagline"
                            placeholder="Revolutionizing renewable energy for the 21st century."
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="industry">Industry / Sector <span className="text-red-500">*</span></Label>
                                <HintButton label="Industry help" text={errors.industry || defaultHints.industry} />
                            </div>
                            <Select value={industry} onValueChange={setIndustry} required>
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {industry === "Other" && (
                                <Input
                                    id="industryOther"
                                    name="industryOther"
                                    placeholder="Enter industry"
                                    value={otherIndustry}
                                    onChange={(e) => setOtherIndustry(e.target.value)}
                                    required
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="size">Company Size <span className="text-red-500">*</span></Label>
                                <HintButton label="Company size help" text={errors.size || defaultHints.size} />
                            </div>
                            <Select value={size} onValueChange={setSize} required>
                                <SelectTrigger id="size">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companySizes.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {size === "Other" && (
                                <Input
                                    id="sizeOther"
                                    name="sizeOther"
                                    placeholder="Enter size"
                                    value={otherSize}
                                    onChange={(e) => setOtherSize(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="companyType">Company Type <span className="text-red-500">*</span></Label>
                            <HintButton label="Company type help" text={errors.companyType || defaultHints.companyType} />
                        </div>
                        <Select value={companyType} onValueChange={setCompanyType} required>
                            <SelectTrigger id="companyType">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {companyTypes.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {companyType === "Other" && (
                            <Input
                                id="companyTypeOther"
                                name="companyTypeOther"
                                placeholder="Enter company type"
                                value={otherCompanyType}
                                onChange={(e) => setOtherCompanyType(e.target.value)}
                                required
                            />
                        )}
                    </div>


                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="registrationNumber">Registration Number <span className="text-red-500">*</span></Label>
                            <HintButton label="Registration number help" text={errors.registrationNumber || defaultHints.registrationNumber} />
                        </div>
                        <Input id="registrationNumber" name="registrationNumber" placeholder="e.g. 12345678AB" required={companyType !== "Startup"} />
                        <p className="text-xs text-muted-foreground">Official company registration number (8-15 alphanumeric).</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="gstPan">GST/PAN <span className="text-red-500">*</span></Label>
                            <HintButton label="GST/PAN help" text={errors.gstPan || defaultHints.gstPan} />
                        </div>
                        <Input id="gstPan" name="gstPan" placeholder="e.g. 22AAAAA0000A1Z5" required={companyType !== "Startup"} />
                        <p className="text-xs text-muted-foreground">GST or PAN number (10-15 alphanumeric).</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="emailDomain">Official Email Domain <span className="text-red-500">*</span></Label>
                            <HintButton label="Email domain help" text={errors.emailDomain || defaultHints.emailDomain} />
                        </div>
                        <Input id="emailDomain" name="emailDomain" placeholder="company.com" required />
                        <p className="text-xs text-muted-foreground">Must match your website domain (e.g., acme.com).</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="website">Company Website <span className="text-red-500">*</span></Label>
                            <HintButton label="Website help" text={errors.website || defaultHints.website} />
                        </div>
                        <Input id="website" name="website" placeholder="https://www.company.com" required={companyType !== "Startup"} />
                        <p className="text-xs text-muted-foreground">Required for companies. Optional for startups.</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="foundingYear">Founding Year <span className="text-red-500">*</span></Label>
                            <HintButton label="Founding year help" text={errors.foundingYear || defaultHints.foundingYear} />
                        </div>
                        <Input id="foundingYear" name="foundingYear" type="number" min="1800" max={new Date().getFullYear()} placeholder="e.g. 2010" required />
                        <p className="text-xs text-muted-foreground">Year the company was founded.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="logo">Company Logo <span className="text-red-500">*</span></Label>
                        <HintButton label="Logo help" text={errors.logo || defaultHints.logo} />
                    </div>
                    <Input id="logo" name="logo" type="file" accept="image/*" required />
                    <p className="text-xs text-muted-foreground">Upload a high-resolution logo (PNG, JPG, SVG, &lt;2MB).</p>
                    {logoUploading && <p className="text-xs text-muted-foreground">Uploading logo...</p>}
                    {logoUrl && <p className="text-xs text-muted-foreground">Uploaded: {logoUrl}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="about">About Company <span className="text-red-500">*</span></Label>
                        <HintButton label="About company help" text={errors.about || defaultHints.about} />
                    </div>
                    <MarkdownTextArea
                        label=""
                        name="about"
                        placeholder="Describe your company..."
                        value={about}
                        onChange={(value) => setAbout(value)}
                        rows={10}
                        required
                    />
                    <p className="text-xs text-muted-foreground">Supports markdown for formatting.</p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="hq">Headquarters <span className="text-red-500">*</span></Label>
                        <HintButton label="Headquarters help" text={errors.headquarters || defaultHints.headquarters} />
                    </div>
                    <Input id="hq" name="hq" placeholder="City, State, Country" required />
                </div>

                <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={isSubmitting || logoUploading}>
                        {isSubmitting ? "Saving..." : "Save Basic Info"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
