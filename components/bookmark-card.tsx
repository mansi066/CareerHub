"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ExternalLink,
  Trash2,
  Edit3,
  Calendar,
  Tag
} from "lucide-react";
import Link from "next/link";
import { BookmarkedOpportunity, BookmarkManager } from "@/lib/bookmark-data";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BookmarkButton from "./bookmark-button";

interface BookmarkCardProps {
  bookmark: BookmarkedOpportunity;
  onRemove?: (bookmarkId: string) => void;
  showNotes?: boolean;
  compact?: boolean;
}

export default function BookmarkCard({ 
  bookmark, 
  onRemove, 
  showNotes = true,
  compact = false 
}: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(bookmark.notes || "");
  const { toast } = useToast();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "internship": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "scholarship": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "company": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatSavedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const handleRemove = () => {
    BookmarkManager.removeBookmark(bookmark.opportunityId);
    onRemove?.(bookmark.id);
    toast({
      title: "Bookmark Removed",
      description: `${bookmark.title} has been removed from your bookmarks`,
    });
  };

  const handleSaveNotes = () => {
    BookmarkManager.updateBookmarkNotes(bookmark.opportunityId, notes);
    setIsEditing(false);
    toast({
      title: "Notes Updated",
      description: "Your notes have been saved",
    });
  };

  const getViewLink = () => {
    if (bookmark.type === "company") {
      return `/company/${bookmark.companyId}`;
    }
    // For jobs/internships/scholarships, we could add individual pages later
    return "/browse";
  };

  if (compact) {
    return (
      <Card className="glassmorphic hover-card group transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={getTypeColor(bookmark.type)} variant="secondary">
                  {bookmark.type.charAt(0).toUpperCase() + bookmark.type.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Saved {formatSavedDate(bookmark.savedAt)}
                </span>
              </div>
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {bookmark.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {bookmark.company}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Link href={getViewLink()}>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRemove}
                className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphic hover-card group transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getTypeColor(bookmark.type)}>
                {bookmark.type.charAt(0).toUpperCase() + bookmark.type.slice(1)}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Saved {formatSavedDate(bookmark.savedAt)}</span>
              </span>
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {bookmark.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              {bookmark.company}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <BookmarkButton
              opportunity={{ id: bookmark.opportunityId, title: bookmark.title }}
              type={bookmark.type}
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Opportunity Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{bookmark.location}</span>
          </div>
          
          {bookmark.salary && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>{bookmark.salary}</span>
            </div>
          )}
          
          {bookmark.deadline && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Deadline: {bookmark.deadline}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {bookmark.description}
        </p>

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <Tag className="w-3 h-3 text-muted-foreground mr-1" />
            {bookmark.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Notes Section */}
        {showNotes && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Notes</span>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="p-1 h-6 w-6"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes about this opportunity..."
                  className="w-full p-2 text-sm bg-background/50 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={2}
                />
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setIsEditing(false);
                      setNotes(bookmark.notes || "");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {bookmark.notes || "No notes added yet. Click the edit icon to add notes."}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          <Link href={getViewLink()} className="flex-1">
            <Button variant="outline" className="w-full glassmorphic-button">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}