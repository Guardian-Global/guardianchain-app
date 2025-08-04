import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter, Globe, Lock, Clock, Shield, Star, TrendingUp,
  FileText, Mic, Image, Video, Code, Users, Zap
} from "lucide-react";

interface CapsuleFilterSidebarProps {
  filters: {
    privacy: string[];
    contentType: string[];
    truthScoreRange: [number, number];
    verificationLevel: string[];
    dateRange: string;
    tags: string[];
  };
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export function CapsuleFilterSidebar({ 
  filters, 
  onFiltersChange, 
  className = "" 
}: CapsuleFilterSidebarProps) {
  
  const privacyOptions = [
    { value: "public", label: "Public", icon: Globe, color: "text-[#10b981]" },
    { value: "private", label: "Private", icon: Lock, color: "text-[#f79009]" },
    { value: "time-locked", label: "Time-Locked", icon: Clock, color: "text-[#7c3aed]" },
    { value: "dao-sealed", label: "DAO Sealed", icon: Shield, color: "text-[#00ffe1]" }
  ];

  const contentTypes = [
    { value: "text", label: "Text", icon: FileText },
    { value: "voice", label: "Voice", icon: Mic },
    { value: "image", label: "Image", icon: Image },
    { value: "video", label: "Video", icon: Video },
    { value: "mixed", label: "Mixed Media", icon: Code }
  ];

  const verificationLevels = [
    { value: "community", label: "Community Verified", count: 1247 },
    { value: "guardian", label: "Guardian Verified", count: 456 },
    { value: "dao", label: "DAO Verified", count: 89 },
    { value: "expert", label: "Expert Verified", count: 34 }
  ];

  const popularTags = [
    "whistleblower", "corporate-crime", "privacy", "investigation", 
    "evidence", "testimony", "truth", "blockchain", "verification"
  ];

  const handlePrivacyToggle = (value: string) => {
    const newPrivacy = filters.privacy.includes(value)
      ? filters.privacy.filter(p => p !== value)
      : [...filters.privacy, value];
    onFiltersChange({ ...filters, privacy: newPrivacy });
  };

  const handleContentTypeToggle = (value: string) => {
    const newContentType = filters.contentType.includes(value)
      ? filters.contentType.filter(t => t !== value)
      : [...filters.contentType, value];
    onFiltersChange({ ...filters, contentType: newContentType });
  };

  const handleTruthScoreChange = (value: [number, number]) => {
    onFiltersChange({ ...filters, truthScoreRange: value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Privacy Filters */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00ffe1]" />
            Privacy Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.value} className="flex items-center space-x-3">
                <Checkbox
                  id={`privacy-${option.value}`}
                  checked={filters.privacy.includes(option.value)}
                  onCheckedChange={() => handlePrivacyToggle(option.value)}
                  className="border-[#30363d] data-[state=checked]:bg-[#00ffe1] data-[state=checked]:border-[#00ffe1]"
                />
                <label 
                  htmlFor={`privacy-${option.value}`}
                  className="text-sm text-[#f0f6fc] cursor-pointer flex items-center gap-2"
                >
                  <Icon className={`w-4 h-4 ${option.color}`} />
                  {option.label}
                </label>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Content Type Filters */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff00d4]" />
            Content Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="flex items-center space-x-3">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.contentType.includes(type.value)}
                  onCheckedChange={() => handleContentTypeToggle(type.value)}
                  className="border-[#30363d] data-[state=checked]:bg-[#ff00d4] data-[state=checked]:border-[#ff00d4]"
                />
                <label 
                  htmlFor={`type-${type.value}`}
                  className="text-sm text-[#f0f6fc] cursor-pointer flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-[#8b949e]" />
                  {type.label}
                </label>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Truth Score Range */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-[#f79009]" />
            Truth Score Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={filters.truthScoreRange}
              onValueChange={handleTruthScoreChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-[#8b949e]">
            <span>{filters.truthScoreRange[0]}</span>
            <span>{filters.truthScoreRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Verification Level */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#7c3aed]" />
            Verification Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {verificationLevels.map((level) => (
            <div key={level.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`verification-${level.value}`}
                  checked={filters.verificationLevel.includes(level.value)}
                  onCheckedChange={() => {
                    const newLevels = filters.verificationLevel.includes(level.value)
                      ? filters.verificationLevel.filter(l => l !== level.value)
                      : [...filters.verificationLevel, level.value];
                    onFiltersChange({ ...filters, verificationLevel: newLevels });
                  }}
                  className="border-[#30363d] data-[state=checked]:bg-[#7c3aed] data-[state=checked]:border-[#7c3aed]"
                />
                <label 
                  htmlFor={`verification-${level.value}`}
                  className="text-sm text-[#f0f6fc] cursor-pointer"
                >
                  {level.label}
                </label>
              </div>
              <Badge variant="outline" className="border-[#30363d] text-[#8b949e] text-xs">
                {level.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#10b981]" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.dateRange} onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}>
            <SelectTrigger className="bg-[#0d1117] border-[#30363d] text-[#f0f6fc]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#161b22] border-[#30363d]">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#f0f6fc] text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00ffe1]" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer text-xs transition-all ${
                  filters.tags.includes(tag) 
                    ? "bg-[#00ffe1] text-[#0d1117] border-[#00ffe1]" 
                    : "border-[#30363d] text-[#8b949e] hover:border-[#00ffe1] hover:text-[#00ffe1]"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        className="w-full border-[#30363d] text-[#8b949e] hover:border-[#f85149] hover:text-[#f85149]"
        onClick={() => onFiltersChange({
          privacy: [],
          contentType: [],
          truthScoreRange: [0, 100],
          verificationLevel: [],
          dateRange: "all",
          tags: []
        })}
      >
        Clear All Filters
      </Button>
    </div>
  );
}