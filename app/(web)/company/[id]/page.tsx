"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  MapPin,
  Users,
  Star,
  ExternalLink,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Plus,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/footer";
import ReviewCard from "@/components/review-card";
import { CompanyReviewForm } from "@/components/company-review-form";
import {
  CompanyProfile,
  CompanyReview,
  ReviewStats,
  CompanyDataManager
} from "@/lib/company-data";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params.id as string;
  const { toast } = useToast();

  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadCompanyData();
  }, [companyId]);

  const loadCompanyData = async () => {
    setIsLoading(true);

    try {
      // Initialize sample data
      CompanyDataManager.initializeSampleData();

      // Load company profile
      const companyData = CompanyDataManager.getCompanyById(companyId);
      setCompany(companyData);

      if (companyData) {
        // Load reviews and stats asynchronously
        const [companyReviews, stats] = await Promise.all([
          CompanyDataManager.getCompanyReviews(companyId),
          CompanyDataManager.getReviewStats(companyId)
        ]);

        setReviews(companyReviews);
        setReviewStats(stats);
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      toast({
        title: "Error",
        description: "Failed to load company data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    await loadCompanyData(); // Reload data to show new review
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpfulClick = (reviewId: string) => {
    // In a real app, this would update the helpful count
    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded.",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
          }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading company profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Company Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The company profile you're looking for doesn't exist.
            </p>
            <Link href="/companies">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/companies">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
        </div>

        {/* Company Header */}
        <div className="glassmorphic p-8 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Building className="w-10 h-10 text-primary" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <h1 className="text-3xl font-bold">{company.companyName}</h1>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center space-x-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{company.location}</span>
                </div>
                {company.employeeCount && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{company.employeeCount} employees</span>
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {company.foundedYear}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{company.industry}</Badge>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(company.averageRating)}
                  </div>
                  <span className="font-medium">
                    {company.averageRating > 0 ? company.averageRating.toFixed(1) : "No ratings"}
                  </span>
                  {company.totalReviews > 0 && (
                    <span className="text-muted-foreground">
                      ({company.totalReviews} review{company.totalReviews !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowReviewForm(true)}
              className="glassmorphic-button-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <CompanyReviewForm
              companyId={company.id}
              companyName={company.companyName}
              onSuccess={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="glassmorphic mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glassmorphic">
                  <CardHeader>
                    <CardTitle>About {company.companyName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {company.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                {company.techStack && company.techStack.length > 0 && (
                  <Card className="glassmorphic">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>Tech Stack</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {company.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Benefits */}
                {company.benefits && company.benefits.length > 0 && (
                  <Card className="glassmorphic">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Benefits & Perks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {company.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Rating Breakdown */}
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <Card className="glassmorphic">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>Rating Breakdown</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Overall Rating */}
                      <div className="text-center pb-4 border-b border-border/50">
                        <div className="text-3xl font-bold text-primary">
                          {reviewStats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          {renderStars(reviewStats.averageRating)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Rating Distribution */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <Progress
                              value={(reviewStats.ratingDistribution[rating] / reviewStats.totalReviews) * 100}
                              className="flex-1 h-2"
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {reviewStats.ratingDistribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Category Ratings */}
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Work Environment</span>
                          </div>
                          <span className="text-sm font-medium">
                            {reviewStats.averageWorkEnvironment.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Compensation</span>
                          </div>
                          <span className="text-sm font-medium">
                            {reviewStats.averageCompensation.toFixed(1)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Career Growth</span>
                          </div>
                          <span className="text-sm font-medium">
                            {reviewStats.averageCareerGrowth.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="glassmorphic">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("reviews")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Read Reviews
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("jobs")}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      View Jobs
                    </Button>
                    {company.website && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Employee Reviews ({reviews.length})
              </h2>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="glassmorphic-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </div>

            {reviews.length === 0 ? (
              <Card className="glassmorphic">
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share your experience working at {company.companyName}
                  </p>
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="glassmorphic-button-primary"
                  >
                    Write First Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={handleHelpfulClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Open Positions</h2>
            </div>

            <Card className="glassmorphic">
              <CardContent className="text-center py-12">
                <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No open positions</h3>
                <p className="text-muted-foreground mb-4">
                  {company.companyName} doesn't have any job postings at the moment.
                </p>
                <Link href="/browse">
                  <Button variant="outline">
                    Browse Other Opportunities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Form Modal */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write a Review for {company?.companyName}</DialogTitle>
          </DialogHeader>
          <CompanyReviewForm
            companyId={companyId}
            companyName={company?.companyName || ''}
            onSuccess={handleReviewSubmitted}
          />
        </DialogContent>
      </Dialog>

    </div>
  );
}