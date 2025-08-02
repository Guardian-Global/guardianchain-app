import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Heart, MessageCircle, Share2, Search, Calendar, User, Tag } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags?: string[];
  verification_status: "verified" | "pending" | "rejected";
  grief_score: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  created_at: string;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
  note?: string;
}

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  // Extract query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const urlQuery = urlParams.get('q') || '';
    setQuery(urlQuery);
    setSearchInput(urlQuery);
    if (urlQuery) {
      performSearch(urlQuery);
    }
  }, [location]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data: SearchResponse = await response.json();
      setResults(data.results);
      setTotalResults(data.total);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Truth Capsules
          </h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <Input
              type="text"
              placeholder="Search by title, description, author, category, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Search Results */}
        {query && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Results for "{query}"
              </h2>
              <Badge variant="outline" className="text-sm">
                {loading ? "Searching..." : `${totalResults} results found`}
              </Badge>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                      <div className="flex space-x-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={result.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {result.title}
                        </h3>
                        <Badge className={getStatusColor(result.verification_status)}>
                          {result.verification_status}
                        </Badge>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {result.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {result.author}
                        </span>
                        <span className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {result.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(result.created_at)}
                        </span>
                        <span>Grief Score: {result.grief_score}</span>
                      </div>

                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {parseInt(result.views).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {parseInt(result.likes).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {parseInt(result.comments).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Share2 className="w-4 h-4 mr-1" />
                            {parseInt(result.shares).toLocaleString()}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Capsule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No capsules found matching "{query}". Try different keywords or check your spelling.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!query && (
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Search Truth Capsules
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter keywords to search through thousands of truth capsules, testimonies, and verified content.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}