"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Plus, 
  X, 
  Building, 
  DollarSign, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { CompanyReview, CompanyDataManager } from "@/lib/company-data";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ 
  companyId, 
  companyName, 
  onReviewSubmitted, 
  onCancel 
}: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: '',
    position: '',
    workType: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
    rating: 0,
    title: '',
    content: '',
    workEnvironment: 0,
    compensation: 0,
    careerGrowth: 0,
    pros: [''],
    cons: ['']
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Review content is required';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Overall rating is required';
    }

    if (formData.workEnvironment === 0) {
      newErrors.workEnvironment = 'Work environment rating is required';
    }

    if (formData.compensation === 0) {
      newErrors.compensation = 'Compensation rating is required';
    }

    if (formData.careerGrowth === 0) {
      newErrors.careerGrowth = 'Career growth rating is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const review: CompanyReview = {
        id: CompanyDataManager.generateId(),
        companyId,
        userId: CompanyDataManager.generateId(), // Anonymous user ID
        userName: formData.userName,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        cons: formData.cons.filter(con => con.trim() !== ''),
        workEnvironment: formData.workEnvironment,
        compensation: formData.compensation,
        careerGrowth: formData.careerGrowth,
        createdAt: new Date().toISOString(),
        helpful: 0,
        position: formData.position,
        workType: formData.workType
      };

      // Use the new API method instead of localStorage
      const result = await CompanyDataManager.submitReview({
        companyId,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        cons: formData.cons.filter(con => con.trim() !== ''),
        workEnvironment: formData.workEnvironment,
        compensation: formData.compensation,
        careerGrowth: formData.careerGrowth,
        position: formData.position,
        workType: formData.workType,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review has been published.",
      });

      onReviewSubmitted();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    value: number, 
    onChange: (rating: number) => void,
    label: string,
    icon?: React.ReactNode,
    error?: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {icon}
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-red-500">*</span>
      </div>
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                i < value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 ? `${value}/5` : 'Select rating'}
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );

  const addListItem = (type: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeListItem = (type: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (type: 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Write a Review for {companyName}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your experience to help others make informed decisions. Your review will be anonymous.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name <span className="text-red-500">*</span></Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="Enter your name"
                className={errors.userName ? "border-red-500" : ""}
              />
              {errors.userName && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.userName}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position (Optional)</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Work Type</Label>
            <Select 
              value={formData.workType} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, workType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Overall Rating */}
          {renderStarRating(
            formData.rating,
            (rating) => setFormData(prev => ({ ...prev, rating })),
            "Overall Rating",
            <Star className="w-4 h-4" />,
            errors.rating
          )}

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Review <span className="text-red-500">*</span></Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your detailed experience working at this company..."
              rows={4}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.content}</span>
              </p>
            )}
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderStarRating(
              formData.workEnvironment,
              (rating) => setFormData(prev => ({ ...prev, workEnvironment: rating })),
              "Work Environment",
              <Building className="w-4 h-4" />,
              errors.workEnvironment
            )}

            {renderStarRating(
              formData.compensation,
              (rating) => setFormData(prev => ({ ...prev, compensation: rating })),
              "Compensation",
              <DollarSign className="w-4 h-4" />,
              errors.compensation
            )}

            {renderStarRating(
              formData.careerGrowth,
              (rating) => setFormData(prev => ({ ...prev, careerGrowth: rating })),
              "Career Growth",
              <TrendingUp className="w-4 h-4" />,
              errors.careerGrowth
            )}
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-green-600 font-medium">Pros</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('pros')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              {formData.pros.map((pro, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={pro}
                    onChange={(e) => updateListItem('pros', index, e.target.value)}
                    placeholder="What did you like?"
                    className="flex-1"
                  />
                  {formData.pros.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeListItem('pros', index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Cons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-red-600 font-medium">Cons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem('cons')}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              {formData.cons.map((con, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={con}
                    onChange={(e) => updateListItem('cons', index, e.target.value)}
                    placeholder="What could be improved?"
                    className="flex-1"
                  />
                  {formData.cons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeListItem('cons', index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="glassmorphic-button-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}