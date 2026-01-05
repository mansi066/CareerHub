"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { BookmarkManager } from "@/lib/bookmark-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  opportunity: any;
  type: "job" | "internship" | "scholarship" | "company";
  variant?: "heart" | "bookmark";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  opportunity,
  type,
  variant = "heart",
  size = "md",
  showLabel = false,
  className,
  onBookmarkChange
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if opportunity is already bookmarked
    const bookmarked = BookmarkManager.isBookmarked(opportunity.id);
    setIsBookmarked(bookmarked);
  }, [opportunity.id]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);

    try {
      const wasBookmarked = BookmarkManager.toggleBookmark(opportunity, type);
      setIsBookmarked(wasBookmarked);
      
      // Initialize default collection if needed
      BookmarkManager.initializeDefaultCollection();

      // Show toast notification
      toast({
        title: wasBookmarked ? "Saved!" : "Removed",
        description: wasBookmarked 
          ? `${opportunity.title || opportunity.companyName} has been saved to your bookmarks`
          : `${opportunity.title || opportunity.companyName} has been removed from your bookmarks`,
        duration: 2000,
      });

      // Notify parent component
      onBookmarkChange?.(wasBookmarked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    if (variant === "bookmark") {
      return (
        <Bookmark 
          className={cn(
            "transition-all duration-200",
            size === "sm" && "w-3 h-3",
            size === "md" && "w-4 h-4", 
            size === "lg" && "w-5 h-5",
            isBookmarked ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
          )}
        />
      );
    }

    return (
      <Heart 
        className={cn(
          "transition-all duration-200",
          size === "sm" && "w-3 h-3",
          size === "md" && "w-4 h-4",
          size === "lg" && "w-5 h-5",
          isBookmarked 
            ? "fill-red-500 text-red-500 scale-110" 
            : "text-muted-foreground hover:text-red-500 hover:scale-105"
        )}
      />
    );
  };

  const getButtonSize = () => {
    switch (size) {
      case "sm": return "sm";
      case "lg": return "lg";
      default: return "sm";
    }
  };

  const getTooltipText = () => {
    if (isBookmarked) {
      return `Remove from bookmarks`;
    }
    return `Save ${type === 'company' ? 'company' : 'opportunity'}`;
  };

  return (
    <Button
      variant="ghost"
      size={getButtonSize()}
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className={cn(
        "group relative transition-all duration-200",
        "hover:bg-background/60 hover:scale-105",
        isBookmarked && variant === "heart" && "hover:bg-red-50 dark:hover:bg-red-950/20",
        isBookmarked && variant === "bookmark" && "hover:bg-primary/10",
        showLabel ? "px-3" : "p-2",
        className
      )}
      title={getTooltipText()}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showLabel && (
          <span className={cn(
            "text-sm font-medium transition-colors",
            size === "sm" && "text-xs",
            size === "lg" && "text-base",
            isBookmarked ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {isBookmarked ? "Saved" : "Save"}
          </span>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {getTooltipText()}
      </div>
    </Button>
  );
}