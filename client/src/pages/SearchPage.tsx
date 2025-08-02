import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  Filter,
  Shield,
  Heart,
  Clock,
  User,
  FileText,
  Star,
  Eye,
  Bookmark,
  Share,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "capsule" | "guardian" | "contract";
  content: string;
  creator: string;
  created_at: string;
  grief_tier: number;
  verification_status: "verified" | "pending" | "unverified";
  tags: string[];
  smri_score?: number;
}

export default function SearchPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [activeSearch, setActiveSearch] = useState("");

  // Search API
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/search", activeSearch, searchType, sortBy],
    queryFn: async () => {
      if (!activeSearch) return [];
      const response = await apiRequest(
        "GET",
        `/api/search?q=${encodeURIComponent(activeSearch)}&type=${searchType}&sort=${sortBy}`,
      );
      return response.json();
    },
    enabled: !!activeSearch,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "capsule":
        return <Shield className="w-4 h-4" />;
      case "guardian":
        return <User className="w-4 h-4" />;
      case "contract":
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "unverified":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getGriefTierColor = (tier: number) => {
    if (tier >= 4) return "text-red-400";
    if (tier >= 3) return "text-orange-400";
    if (tier >= 2) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Truth Search
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover truth capsules, guardians, and eternal contracts across the
            GuardianChain ecosystem
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search for truth capsules, guardians, contracts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-12 h-12 text-lg bg-slate-800/50 border-indigo-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
                >
                  Search
                </Button>
              </div>

              {/* Filters */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-indigo-500/30">
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="capsule">Truth Capsules</SelectItem>
                      <SelectItem value="guardian">Guardians</SelectItem>
                      <SelectItem value="contract">
                        Eternal Contracts
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-indigo-500/30">
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="grief">Highest Grief</SelectItem>
                      <SelectItem value="verified">Verified First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {activeSearch && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-300">
                Search Results for "{activeSearch}"
              </h2>
              {searchResults && (
                <Badge
                  variant="outline"
                  className="border-indigo-500/30 text-indigo-300"
                >
                  {searchResults.length} results
                </Badge>
              )}
            </div>

            {isLoading ? (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardContent className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-400">
                    Searching across the truth network...
                  </p>
                </CardContent>
              </Card>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result: SearchResult) => (
                  <Card
                    key={result.id}
                    className="bg-black/40 backdrop-blur-xl border-indigo-500/20 hover:bg-black/60 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(result.type)}
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {result.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              by {result.creator} •{" "}
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${getVerificationColor(result.verification_status)} text-white border-none`}
                          >
                            {result.verification_status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-gray-500/30 text-gray-300"
                          >
                            {result.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {result.content}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {result.grief_tier > 0 && (
                            <div className="flex items-center space-x-1">
                              <Heart
                                className={`w-4 h-4 ${getGriefTierColor(result.grief_tier)}`}
                              />
                              <span
                                className={`text-sm ${getGriefTierColor(result.grief_tier)}`}
                              >
                                Grief {result.grief_tier}
                              </span>
                            </div>
                          )}

                          {result.smri_score && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400">
                                SMRI {result.smri_score}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {new Date(result.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>

                          {isAuthenticated && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Bookmark className="w-4 h-4 mr-1" />
                                Save
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Share className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Tags */}
                      {result.tags && result.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-indigo-500/30 text-indigo-300 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults && searchResults.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {/* Popular Searches */}
        {!activeSearch && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-xl border-gray-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-300">
                  Popular Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Truth Capsules",
                    "Veritas Guardians",
                    "Memory Lineage",
                    "Eternal Contracts",
                    "Grief Testimonies",
                    "Legacy Archives",
                    "Whistleblower",
                    "Evidence Vault",
                  ].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        setActiveSearch(term);
                      }}
                      className="justify-start border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
