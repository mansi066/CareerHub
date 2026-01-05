"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  Users, 
  Star, 
  ExternalLink,
  Calendar,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { CompanyProfile } from "@/lib/company-data";
import BookmarkButton from "./bookmark-button";

interface CompanyCardProps {
  company: CompanyProfile;
  showViewButton?: boolean;
}

export default function CompanyCard({ company, showViewButton = true }: CompanyCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="glassmorphic hover-card group transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {company.companyName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {company.industry}
                </Badge>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <BookmarkButton
            opportunity={company}
            type="company"
            variant="heart"
            size="sm"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{company.location}</span>
          </div>
          
          {company.employeeCount && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{company.employeeCount} employees</span>
            </div>
          )}

          {company.foundedYear && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Founded {company.foundedYear}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {company.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(company.averageRating)}
          </div>
          <span className="text-sm font-medium">
            {company.averageRating > 0 ? company.averageRating.toFixed(1) : "No ratings"}
          </span>
          {company.totalReviews > 0 && (
            <span className="text-sm text-muted-foreground">
              ({company.totalReviews} review{company.totalReviews !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        {/* Tech Stack */}
        {company.techStack && company.techStack.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Briefcase className="w-3 h-3" />
              <span>Tech Stack:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {company.techStack.slice(0, 4).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {company.techStack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{company.techStack.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Benefits Preview */}
        {company.benefits && company.benefits.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {company.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {company.benefits.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{company.benefits.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {showViewButton && (
          <div className="pt-2">
            <Link href={`/company/${company.id}`}>
              <Button variant="outline" className="w-full glassmorphic-button">
                View Company Profile
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}