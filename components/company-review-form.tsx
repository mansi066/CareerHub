"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { companyReviewSchema, CompanyReviewFormData } from "@/lib/validations/review";
import { Loader2, Star, Plus, X, Building, DollarSign, TrendingUp } from "lucide-react";

interface CompanyReviewFormProps {
    companyId: string;
    companyName: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CompanyReviewForm({ companyId, companyName, onSuccess, onCancel }: CompanyReviewFormProps) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState<{ [key: string]: number }>({});

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CompanyReviewFormData>({
        resolver: zodResolver(companyReviewSchema),
        defaultValues: {
            rating: 0,
            workEnvironment: 0,
            compensation: 0,
            careerGrowth: 0,
            pros: [],
            cons: [],
            isVerified: false,
        },
    });

    const { fields: prosFields, append: appendPro, remove: removePro } = useFieldArray({
        control,
        name: "pros",
    });

    const { fields: consFields, append: appendCon, remove: removeCon } = useFieldArray({
        control,
        name: "cons",
    });

    const watchedValues = watch();

    const renderStarRating = (fieldName: keyof CompanyReviewFormData, label: string, icon?: React.ReactNode) => {
        const value = watchedValues[fieldName] as number;
        const hovered = hoveredRating[fieldName] || 0;

        return (
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    {icon}
                    {label}
                </Label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="p-1 hover:scale-110 transition-transform"
                            onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [fieldName]: star }))}
                            onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [fieldName]: 0 }))}
                            onClick={() => setValue(fieldName, star)}
                        >
                            <Star
                                className={`w-6 h-6 ${
                                    star <= (hovered || value)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                        {(hovered || value) > 0 ? `${hovered || value}/5` : "Select rating"}
                    </span>
                </div>
                {errors[fieldName] && (
                    <p className="text-sm text-destructive">{errors[fieldName]?.message}</p>
                )}
            </div>
        );
    };

    const onSubmit = async (data: CompanyReviewFormData) => {
        if (!session?.user?.id) {
            toast({
                title: "Authentication required",
                description: "Please sign in to submit a review.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    companyId,
                    userId: session.user.id,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Review submitted",
                    description: "Thank you for your review! It will be published after moderation.",
                });
                onSuccess?.();
            } else {
                const error = await response.json();
                throw new Error(error.message || "Failed to submit review");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!session) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        Please sign in to submit a review.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Review {companyName}
                </CardTitle>
                <CardDescription>
                    Share your experience to help others make informed decisions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Overall Rating */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Overall Rating</h3>
                        {renderStarRating("rating", "How would you rate this company overall?")}
                    </div>

                    <Separator />

                    {/* Review Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Review Details</h3>

                        <div className="space-y-2">
                            <Label htmlFor="title">Review Title</Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Summarize your experience in a few words"
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Your Review</Label>
                            <Textarea
                                id="content"
                                {...register("content")}
                                placeholder="Share details about your experience, work culture, interview process, etc."
                                rows={6}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive">{errors.content.message}</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Detailed Ratings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Detailed Ratings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {renderStarRating("workEnvironment", "Work Environment", <Building className="w-4 h-4" />)}
                            {renderStarRating("compensation", "Compensation & Benefits", <DollarSign className="w-4 h-4" />)}
                            {renderStarRating("careerGrowth", "Career Growth", <TrendingUp className="w-4 h-4" />)}
                        </div>
                    </div>

                    <Separator />

                    {/* Pros and Cons */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Pros and Cons</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pros */}
                            <div className="space-y-3">
                                <Label className="text-green-600 font-medium">Pros</Label>
                                {prosFields.map((field, index) => (
                                    <div key={`pro-${index}`} className="flex items-center gap-2">
                                        <Input
                                            {...register(`pros.${index}`)}
                                            placeholder="What did you like?"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removePro(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendPro("")}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Pro
                                </Button>
                                {errors.pros && (
                                    <p className="text-sm text-destructive">{errors.pros.message}</p>
                                )}
                            </div>

                            {/* Cons */}
                            <div className="space-y-3">
                                <Label className="text-red-600 font-medium">Cons</Label>
                                {consFields.map((field, index) => (
                                    <div key={`con-${index}`} className="flex items-center gap-2">
                                        <Input
                                            {...register(`cons.${index}`)}
                                            placeholder="What could be improved?"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeCon(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendCon("")}
                                    className="w-full"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Con
                                </Button>
                                {errors.cons && (
                                    <p className="text-sm text-destructive">{errors.cons.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Additional Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Your Position (Optional)</Label>
                                <Input
                                    id="position"
                                    {...register("position")}
                                    placeholder="e.g., Software Engineer, Intern"
                                />
                                {errors.position && (
                                    <p className="text-sm text-destructive">{errors.position.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workType">Employment Type (Optional)</Label>
                                <Select onValueChange={(value) => setValue("workType", value as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full-time</SelectItem>
                                        <SelectItem value="part-time">Part-time</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.workType && (
                                    <p className="text-sm text-destructive">{errors.workType.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isVerified"
                                checked={watchedValues.isVerified}
                                onCheckedChange={(checked) => setValue("isVerified", !!checked)}
                            />
                            <Label htmlFor="isVerified" className="text-sm">
                                I have worked at this company
                            </Label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Review
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}