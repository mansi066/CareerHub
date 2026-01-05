"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonText, SkeletonButton } from "@/components/ui/skeleton";

export default function ReviewCardSkeleton() {
  return (
    <Card className="glassmorphic">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton variant="circular" className="w-8 h-8" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-1" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-3 w-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} variant="circular" className="w-4 h-4" />
                ))}
              </div>
              <Skeleton className="h-4 w-8" />
            </div>

            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Content */}
        <SkeletonText lines={3} />

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <div className="flex-1">
              <Skeleton className="h-3 w-20 mb-1" />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} variant="circular" className="w-4 h-4" />
                ))}
                <Skeleton className="h-3 w-6 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} variant="circular" className="w-4 h-4" />
                ))}
                <Skeleton className="h-3 w-6 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <div className="flex-1">
              <Skeleton className="h-3 w-18 mb-1" />
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} variant="circular" className="w-4 h-4" />
                ))}
                <Skeleton className="h-3 w-6 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-2 mt-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-2 mt-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-8" />
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-2 mt-1" />
                <Skeleton className="h-4 w-30" />
              </div>
              <div className="flex items-start space-x-2">
                <Skeleton className="h-4 w-2 mt-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Skeleton className="h-3 w-32" />
          <SkeletonButton size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}