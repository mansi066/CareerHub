"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Building, 
  Filter,
  Download,
  Upload,
  Trash2,
  Plus,
  BookOpen,
  Star
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookmarkCard from "@/components/bookmark-card";
import { 
  BookmarkedOpportunity, 
  BookmarkStats,
  BookmarkManager 
} from "@/lib/bookmark-data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedOpportunity[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkedOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState<BookmarkStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, activeTab]);

  const loadBookmarks = () => {
    setIsLoading(true);
    const allBookmarks = BookmarkManager.getBookmarks();
    const bookmarkStats = BookmarkManager.getBookmarkStats();
    
    setBookmarks(allBookmarks);
    setStats(bookmarkStats);
    setIsLoading(false);
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Filter by type
    if (activeTab !== "all") {
      filtered = filtered.filter(bookmark => bookmark.type === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = BookmarkManager.searchBookmarks(searchQuery);
      if (activeTab !== "all") {
        filtered = filtered.filter(bookmark => bookmark.type === activeTab);
      }
    }

    setFilteredBookmarks(filtered);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    loadBookmarks(); // Reload to update stats
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all bookmarks? This action cannot be undone.")) {
      BookmarkManager.clearAllBookmarks();
      loadBookmarks();
      toast({
        title: "All Bookmarks Cleared",
        description: "All your bookmarks have been removed.",
      });
    }
  };

  const handleExport = () => {
    try {
      const data = BookmarkManager.exportBookmarks();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Bookmarks Exported",
        description: "Your bookmarks have been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export bookmarks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        BookmarkManager.importBookmarks(data);
        loadBookmarks();
        toast({
          title: "Bookmarks Imported",
          description: "Your bookmarks have been successfully imported.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format. Please select a valid bookmark export file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "job": return <Briefcase className="w-4 h-4" />;
      case "internship": return <GraduationCap className="w-4 h-4" />;
      case "scholarship": return <BookOpen className="w-4 h-4" />;
      case "company": return <Building className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Bookmarks
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your saved opportunities and companies in one place
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="glassmorphic text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.totalBookmarks}</div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </CardContent>
            </Card>
            <Card className="glassmorphic text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.jobsCount}</div>
                <div className="text-sm text-muted-foreground">Jobs</div>
              </CardContent>
            </Card>
            <Card className="glassmorphic text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.internshipsCount}</div>
                <div className="text-sm text-muted-foreground">Internships</div>
              </CardContent>
            </Card>
            <Card className="glassmorphic text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.scholarshipsCount}</div>
                <div className="text-sm text-muted-foreground">Scholarships</div>
              </CardContent>
            </Card>
            <Card className="glassmorphic text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{stats.companiesCount}</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Actions */}
        <div className="glassmorphic p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-input"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleExport} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {bookmarks.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleClearAll}
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glassmorphic">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              {getTabIcon("all")}
              <span>All ({stats?.totalBookmarks || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center space-x-2">
              {getTabIcon("job")}
              <span>Jobs ({stats?.jobsCount || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="internship" className="flex items-center space-x-2">
              {getTabIcon("internship")}
              <span>Internships ({stats?.internshipsCount || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="scholarship" className="flex items-center space-x-2">
              {getTabIcon("scholarship")}
              <span>Scholarships ({stats?.scholarshipsCount || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center space-x-2">
              {getTabIcon("company")}
              <span>Companies ({stats?.companiesCount || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <TabsContent value={activeTab} className="space-y-6">
            {filteredBookmarks.length === 0 ? (
              <Card className="glassmorphic">
                <CardContent className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery ? "No bookmarks found" : "No bookmarks yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search criteria"
                      : `Start saving ${activeTab === "all" ? "opportunities" : activeTab + "s"} to see them here`
                    }
                  </p>
                  {!searchQuery && (
                    <div className="space-x-2">
                      <Link href="/browse">
                        <Button className="glassmorphic-button-primary">
                          <Search className="w-4 h-4 mr-2" />
                          Browse Opportunities
                        </Button>
                      </Link>
                      <Link href="/companies">
                        <Button variant="outline">
                          <Building className="w-4 h-4 mr-2" />
                          Explore Companies
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} found
                  </h2>
                </div>

                {/* Bookmarks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookmarks.map((bookmark) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      onRemove={handleRemoveBookmark}
                      showNotes={true}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}