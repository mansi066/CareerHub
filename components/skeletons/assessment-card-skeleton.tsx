"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonText, SkeletonButton } from "@/components/ui/skeleton";

export default function AssessmentCardSkeleton() {
  return (
    <Card className="glassmorphic hover-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-14 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-10 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </div>
        </div>

        {/* Participants and Pass Rate */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
          </div>
        </div>

        {/* Action Button */}
        <SkeletonButton className="w-full" />
      </CardContent>
    </Card>
  );
}