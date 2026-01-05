"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonText, SkeletonButton } from "@/components/ui/skeleton";

interface OpportunityCardSkeletonProps {
  showBookmark?: boolean;
}

export default function OpportunityCardSkeleton({ 
  showBookmark = true 
}: OpportunityCardSkeletonProps) {
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
          </div>
          <div className="flex items-center space-x-2">
            {showBookmark && <Skeleton variant="circular" className="w-8 h-8" />}
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton variant="circular" className="w-6 h-6" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Location, Salary, Deadline */}
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
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Description */}
          <SkeletonText lines={2} />

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* Action Button */}
          <SkeletonButton size="lg" className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}