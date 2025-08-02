import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Loader2, Search as SearchIcon, Shield, Eye, Clock } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isPrivate?: boolean;
  created_at: string;
  content?: {
    encrypted?: boolean;
    minted?: boolean;
    tx_hash?: string;
  };
}

export default function SearchPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const query = urlParams.get("q") || "";
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [onlyPublic, setOnlyPublic] = useState(true);
  const [error, setError] = useState("");

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&public_only=${onlyPublic}`);
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results);
      } else {
        setError(data.error || "Search failed");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Network error occurred. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query, onlyPublic]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.pushState({}, "", newUrl);
      performSearch(searchQuery.trim());
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            <SearchIcon className="w-8 h-8 inline-block mr-3" />
            Search Truth Capsules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover capsules, stories, and truth preserved on the blockchain
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capsules, tags, or content..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={onlyPublic}
                onChange={(e) => setOnlyPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Show only public capsules
            </label>
          </div>
        </form>

        {/* Search Results */}
        {query && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Results for "{query}"
            </h2>
            {!loading && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {results.length} capsule{results.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">Searching capsules...</p>
            </div>
          ) : results.length === 0 && query ? (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No capsules found matching your search.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try different keywords or check your search filters.
              </p>
            </div>
          ) : (
            results.map((capsule) => (
              <Card key={capsule.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {capsule.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {capsule.content?.minted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Minted
                          </Badge>
                        )}
                        {capsule.content?.encrypted && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Encrypted
                          </Badge>
                        )}
                        {capsule.isPrivate && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <Eye className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(capsule.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {capsule.content?.encrypted && !capsule.description.includes("[ENCRYPTED]") 
                      ? "🔒 Encrypted content - unlock required to view"
                      : capsule.description?.slice(0, 200) + (capsule.description?.length > 200 ? "..." : "") || "No description available."
                    }
                  </p>

                  {/* Tags */}
                  {capsule.tags && capsule.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {capsule.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {capsule.tags.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{capsule.tags.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Link href={`/capsule/${capsule.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Capsule
                      </Button>
                    </Link>
                    
                    {capsule.content?.tx_hash && (
                      <a
                        href={`https://polygonscan.com/tx/${capsule.content.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 dark:text-green-400 hover:underline"
                      >
                        View on Blockchain →
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}