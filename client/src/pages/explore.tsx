import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CapsuleCard from "@/components/capsule/capsule-card";
import CapsuleSearch from "@/components/CapsuleSearch";
import FilterPanel from "@/components/FilterPanel";

const categories = [
  "All",
  "Technology",
  "Science",
  "Politics",
  "Economics",
  "Health",
  "Environment",
  "Social Issues",
  "Predictions",
  "Facts",
  "Analysis",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "score", label: "Highest Score" },
  { value: "verified", label: "Verified Only" },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    sortBy: "recent",
    tier: "all",
    category: "all",
    verificationStatus: "all"
  });

  const { data: allCapsules, isLoading: allLoading } = useQuery({
    queryKey: ["/api/capsules", { limit: 50 }],
  });

  const { data: trendingCapsules, isLoading: trendingLoading } = useQuery({
    queryKey: ["/api/capsules/trending"],
  });

  const { data: featuredCapsules, isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/capsules/featured"],
  });

  const filteredCapsules =
    allCapsules?.filter((capsule) => {
      const matchesSearch =
        capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || capsule.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }) || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "recent",
      tier: "all", 
      category: "all",
      verificationStatus: "all"
    });
    setSearchQuery("");
    setSelectedCategory("All");
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all" && value !== "recent").length;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Explore Truth Capsules
          </h1>
          <p className="text-slate-400 text-lg">
            Discover verified truth capsules from the global community.
          </p>
        </div>

        {/* Search and Filter Components */}
        <CapsuleSearch onSearch={handleSearch} />
        <FilterPanel 
          filters={filters} 
          setFilters={setFilters}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={handleClearFilters}
        />

        {/* Legacy Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="hidden">
              {/* Hidden legacy search - replaced by CapsuleSearch */}
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="border-slate-600"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="border-slate-600"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-96 bg-slate-800 border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary">
              All Capsules
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-primary"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-primary"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {allLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCapsules.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredCapsules.map((capsule) => (
                  <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-slate-400 text-lg mb-4">
                  No capsules found matching your criteria.
                </div>
                <p className="text-slate-500">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            {trendingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : trendingCapsules?.length ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {trendingCapsules.map((capsule) => (
                  <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <div className="text-slate-400 text-lg">
                  No trending capsules at the moment.
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredCapsules?.length ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {featuredCapsules.map((capsule) => (
                  <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <div className="text-slate-400 text-lg">
                  No featured capsules available yet.
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
