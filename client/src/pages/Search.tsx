import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import VoteButton from "@/components/VoteButton";
import {
  Loader2,
  Search as SearchIcon,
  Shield,
  Eye,
  Clock,
} from "lucide-react";
import { useAccount } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  tags: string[];
  isPrivate?: boolean;
  created_at: string;
  creator?: string;
  ens?: string;
  vote_count?: number;
  content?: {
    encrypted?: boolean;
    minted?: boolean;
    tx_hash?: string;
  };
}

export default function SearchPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const query = urlParams.get("q") || "";
  const { address } = useAccount();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [onlyPublic, setOnlyPublic] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState("");

  const performSearch = async (
    searchTerm: string,
    pageNum: number = 1,
    append: boolean = false,
  ) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasMore(false);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: searchTerm,
        sort: sortBy,
        page: pageNum.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.results) {
        // Filter results based on privacy setting
        const filtered = onlyPublic
          ? data.results.filter((r: SearchResult) => !r.isPrivate)
          : data.results;

        if (append && pageNum > 1) {
          setResults((prev) => [...prev, ...filtered]);
        } else {
          setResults(filtered);
        }
        setTotalResults(data.total || 0);
        setHasMore(filtered.length >= 10);
      } else {
        setError(data.error || "Search failed");
        if (!append) {
          setResults([]);
          setTotalResults(0);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Network error occurred. Please try again.");
      if (!append) {
        setResults([]);
        setTotalResults(0);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Reset search when filters change
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
  }, [query, sortBy, onlyPublic]);

  // Perform search when query or filters change
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, 1, false);
    }
  }, [query, onlyPublic, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.pushState({}, "", newUrl);
      setPage(1);
      performSearch(searchQuery.trim(), 1, false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && query) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(query, nextPage, true);
    }
  };

  const handleVote = async (capsuleId: string) => {
    if (!address) {
      toast.error("Connect your wallet to vote");
      return;
    }

    try {
      const response = await fetch(`/api/capsules/${capsuleId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });

      const data = await response.json();

      if (data.message || response.ok) {
        toast.success("🔥 Vote counted!");
        // Refresh the search results to show updated vote count
        if (query) {
          performSearch(query, 1, false);
        }
      } else {
        toast.error(data.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white py-12 px-6">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Search Results for "{query}"
          </h1>
          <div className="max-w-4xl mx-auto text-center text-slate-300 mb-10">
            <p className="text-lg">
              GuardianChain capsules are more than memories — they're
              yield-generating, sovereign-authored, and permanently stored
              truths.
            </p>
            <p className="mt-2">
              Each verified capsule contributes to the Truth Vault economy,
              earning GTT while preserving your legacy with full cryptographic
              authorship.
            </p>
            <p className="mt-2 text-indigo-300">
              Immutable. Monetizable. Yours forever.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capsules, tags, or content..."
              className="flex-1 bg-slate-800 border-slate-700 text-white"
            />
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
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
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={onlyPublic}
                onChange={(e) => setOnlyPublic(e.target.checked)}
                className="w-4 h-4"
              />
              Show only public capsules
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-300">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 text-white px-2 py-1 rounded"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="relevant">Most Relevant</option>
              </select>
            </div>
          </div>
        </form>

        {/* Search Results Header */}
        {query && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Results for "{query}"
            </h2>
            {!loading && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {results.length} of {totalResults} capsule
                  {totalResults !== 1 ? "s" : ""}
                </p>
                {sortBy && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Sorted by{" "}
                    {sortBy === "recent"
                      ? "most recent"
                      : sortBy === "popular"
                        ? "most popular"
                        : "relevance"}
                  </p>
                )}
              </div>
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
              <p className="text-gray-600 dark:text-gray-400">
                Searching capsules...
              </p>
            </div>
          ) : results.length === 0 && query ? (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No capsules found matching your search.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Try different keywords or check your search filters.
              </p>
            </div>
          ) : (
            results.map((capsule) => (
              <Card
                key={capsule.id}
                className="bg-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-white mb-1">
                        {capsule.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {capsule.content?.minted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Minted
                          </Badge>
                        )}
                        {capsule.content?.encrypted && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
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
                  <p className="text-slate-300 mb-2">
                    {capsule.description?.slice(0, 140) || "Encrypted capsule."}
                  </p>

                  <p className="text-xs text-slate-400 mb-2">
                    By {capsule.ens || capsule.creator || "Anonymous"}
                  </p>

                  {/* Vote Count */}
                  {capsule.vote_count !== undefined && (
                    <p className="text-sm text-orange-400 mb-2">
                      🔥 {capsule.vote_count} votes
                    </p>
                  )}

                  {/* Tags */}
                  {capsule.tags && capsule.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {capsule.tags.slice(0, 5).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
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
                    <div className="flex items-center gap-2">
                      <Link href={`/capsule/${capsule.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Capsule
                        </Button>
                      </Link>

                      <VoteButton
                        capsuleId={capsule.id}
                        wallet={address || ""}
                        initialLikes={capsule.vote_count || 0}
                        className="ml-2"
                      />

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                        onClick={() => handleVote(capsule.id)}
                      >
                        Vote
                      </motion.button>
                    </div>

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

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-10">
            <Button onClick={handleLoadMore} className="bg-indigo-600 hover:bg-indigo-700">
              Load More
            </Button>
          </div>
        )}

        {/* Loading indicator for pagination */}
        {loading && page > 1 && (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-blue-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Loading more results...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
