import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Edit3,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  Tag,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGTTLiveData, GTTListing } from "@/lib/gttLiveData";
import { useToast } from "@/hooks/use-toast";

export default function MyListings() {
  const { data: gttData, isLoading } = useGTTLiveData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const listings = gttData?.listings || [];

  // Filter listings based on search and filters
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || listing.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/50 text-green-400 border-green-400";
      case "sold":
        return "bg-blue-900/50 text-blue-400 border-blue-400";
      case "pending":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-400";
      case "draft":
        return "bg-gray-900/50 text-gray-400 border-gray-400";
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-400";
    }
  };

  const copyListingUrl = (listingId: string) => {
    const url = `${window.location.origin}/listing/${listingId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Listing URL Copied",
      description: "Share this link to promote your listing",
    });
  };

  const editListing = (listingId: string) => {
    // Navigate to edit page
    window.location.href = `/listing/${listingId}/edit`;
  };

  const deleteListing = (listingId: string) => {
    toast({
      title: "Listing Archived",
      description: "Your listing has been moved to archives",
    });
  };

  const categories = [...new Set(listings.map((l) => l.category))];

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              My GTT Listings
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your truth capsule listings and track performance
            </p>
          </div>
          <Link href="/create-listing">
            <Button className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Listings</p>
                  <p className="text-2xl font-bold text-white">
                    {listings.length}
                  </p>
                </div>
                <Tag className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Listings</p>
                  <p className="text-2xl font-bold text-green-400">
                    {listings.filter((l) => l.status === "active").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {listings
                      .reduce((sum, l) => sum + l.views, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {listings
                      .filter((l) => l.status === "sold")
                      .reduce((sum, l) => sum + l.price, 0)}{" "}
                    GTT
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search listings by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-800/50 border-slate-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-800/50 border-slate-700">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3 mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-slate-700 rounded w-16"></div>
                      <div className="h-6 bg-slate-700 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredListings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Tag className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "No listings match your filters"
                  : "No listings yet"}
              </h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "Create your first truth capsule listing to get started"}
              </p>
              <Link href="/create-listing">
                <Button>Create Your First Listing</Button>
              </Link>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2 text-white truncate">
                        {listing.title}
                      </CardTitle>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {listing.description}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem
                          onClick={() => editListing(listing.id)}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => copyListingUrl(listing.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/listing/${listing.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Public Page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem
                          onClick={() => deleteListing(listing.id)}
                          className="text-red-400 focus:text-red-300"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusBadgeColor(listing.status)}>
                      {listing.status.charAt(0).toUpperCase() +
                        listing.status.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {listing.price} GTT
                      </div>
                      <div className="text-xs text-slate-500">
                        $
                        {(listing.price * (gttData?.priceUSD || 2.47)).toFixed(
                          2
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {listing.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {listing.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(listing.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {listing.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-400"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {listing.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-500"
                        >
                          +{listing.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-slate-500">
                      {listing.category}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination placeholder */}
        {filteredListings.length > 12 && (
          <div className="flex justify-center mt-8">
            <div className="text-slate-400">
              Pagination controls would go here for large datasets
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
