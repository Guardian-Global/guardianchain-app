import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface FilterState {
  sortBy: string;
  tier: string;
  category: string;
  verificationStatus: string;
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  activeFiltersCount?: number;
  onClearFilters?: () => void;
}

export default function FilterPanel({
  filters,
  setFilters,
  activeFiltersCount = 0,
  onClearFilters,
}: FilterPanelProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">
            Filter & Sort
          </span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {onClearFilters && activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sort By</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select sort..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="yield">Highest Yield</SelectItem>
              <SelectItem value="grief-score">Grief Score</SelectItem>
              <SelectItem value="verification">Verification Status</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Access Tier
          </label>
          <Select
            value={filters.tier}
            onValueChange={(value) => updateFilter("tier", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="explorer">Explorer</SelectItem>
              <SelectItem value="seeker">Seeker</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="sovereign">Sovereign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="memory">Memory Vault</SelectItem>
              <SelectItem value="truth">Truth Claims</SelectItem>
              <SelectItem value="legacy">Family Legacy</SelectItem>
              <SelectItem value="conspiracy">Conspiracy</SelectItem>
              <SelectItem value="whistleblower">Whistleblower</SelectItem>
              <SelectItem value="media">Media Evidence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Verification
          </label>
          <Select
            value={filters.verificationStatus}
            onValueChange={(value) => updateFilter("verificationStatus", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Veritas Sealed</SelectItem>
              <SelectItem value="pending">Under Review</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
