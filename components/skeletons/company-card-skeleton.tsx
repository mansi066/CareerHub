"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonText, SkeletonButton } from "@/components/ui/skeleton";

interface CompanyCardSkeletonProps {
  showBookmark?: boolean;
}

export default function CompanyCardSkeleton({ 
  showBookmark = true 
}: CompanyCardSkeletonProps) {
  return (
    <Card className="glassmorphic">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton variant="circular" className="w-3 h-3" />
              </div>
            </div>
          </div>
          {showBookmark && <Skeleton variant="circular" className="w-8 h-8" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Description */}
        <SkeletonText lines={2} />

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} variant="circular" className="w-4 h-4" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Skeleton variant="circular" className="w-3 h-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-18 rounded-md" />
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-18 rounded-full" />
        </div>

        {/* Action Button */}
        <SkeletonButton className="w-full" />
      </CardContent>
    </Card>
  );
}