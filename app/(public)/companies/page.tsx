"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Building, Filter, Star } from "lucide-react";
import Footer from "@/components/footer";
import CompanyCard from "@/components/company-card";
import { CompanyProfile, CompanyDataManager } from "@/lib/company-data";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data and load companies
    CompanyDataManager.initializeSampleData();
    const loadedCompanies = CompanyDataManager.getCompanies();
    setCompanies(loadedCompanies);
    setFilteredCompanies(loadedCompanies);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = companies;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter(company => company.industry === industryFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(company => company.averageRating >= minRating);
    }

    setFilteredCompanies(filtered);
  }, [companies, searchQuery, industryFilter, ratingFilter]);

  const industries = Array.from(new Set(companies.map(company => company.industry)));

  const getCompanyStats = () => {
    return {
      total: companies.length,
      withReviews: companies.filter(c => c.totalReviews > 0).length,
      averageRating: companies.length > 0
        ? companies.reduce((sum, c) => sum + c.averageRating, 0) / companies.length
        : 0
    };
  };

  const stats = getCompanyStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading companies...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Company Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover companies, read authentic reviews, and make informed career decisions
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.withReviews}</div>
              <div className="text-sm text-muted-foreground">With Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary flex items-center justify-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{stats.averageRating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glassmorphic p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search companies, industries, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-input"
              />
            </div>

            {/* Industry Filter */}
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || industryFilter !== "all" || ratingFilter !== "all") && (
            <div className="flex items-center space-x-2 mt-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchQuery}
                </Badge>
              )}
              {industryFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Industry: {industryFilter}
                </Badge>
              )}
              {ratingFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Rating: {ratingFilter}+ stars
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setIndustryFilter("all");
                  setRatingFilter("all");
                }}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {filteredCompanies.length} Companies Found
            </h2>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setIndustryFilter("all");
                  setRatingFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}