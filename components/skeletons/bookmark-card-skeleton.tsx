"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonText, SkeletonButton } from "@/components/ui/skeleton";

interface BookmarkCardSkeletonProps {
  compact?: boolean;
  showNotes?: boolean;
}

export default function BookmarkCardSkeleton({ 
  compact = false,
  showNotes = true 
}: BookmarkCardSkeletonProps) {
  if (compact) {
    return (
      <Card className="glassmorphic">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton variant="circular" className="w-6 h-6" />
              <Skeleton variant="circular" className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphic">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="flex items-center space-x-1">
                <Skeleton variant="circular" className="w-3 h-3" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opportunity Details */}
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
        <div className="flex items-center space-x-2">
          <Skeleton variant="circular" className="w-3 h-3" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
        </div>

        {/* Notes Section */}
        {showNotes && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton variant="circular" className="w-6 h-6" />
            </div>
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <SkeletonButton className="flex-1" />
          <Skeleton variant="circular" className="w-10 h-10" />
        </div>
      </CardContent>
    </Card>
  );
}