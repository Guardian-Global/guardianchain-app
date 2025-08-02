import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Share2,
  Heart,
  MessageCircle,
  Users,
  Eye,
  Radio,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Smartphone,
  Tv,
  Filter,
  Palette,
  Sun,
  Moon,
  Contrast,
  Zap,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Calendar,
  Target,
  Award,
  Bookmark,
  ThumbsUp,
  Share,
  Download,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Grid3X3,
  List,
  Search,
  SortAsc,
} from "lucide-react";

interface StreamData {
  id: string;
  title: string;
  description: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    tier: "explorer" | "seeker" | "creator" | "sovereign";
  };
  category:
    | "institutional"
    | "earth"
    | "cultural"
    | "sovereign"
    | "technological";
  viewers: number;
  duration: number;
  status: "live" | "scheduled" | "ended";
  quality: "720p" | "1080p" | "4K";
  tags: string[];
  thumbnail: string;
  startTime: Date;
  language: string;
  region: string;
}

interface StreamFilter {
  category: string;
  quality: string;
  language: string;
  sortBy: "viewers" | "duration" | "recent" | "trending";
}

export function LiveCapsuleStreaming() {
  const [activeTab, setActiveTab] = useState<
    "live" | "scheduled" | "browse" | "following"
  >("live");
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<StreamFilter>({
    category: "all",
    quality: "all",
    language: "all",
    sortBy: "viewers",
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const [liveStreams] = useState<StreamData[]>([
    {
      id: "1",
      title:
        "Goldman Sachs Institutional Legacy Vault Creation - Live Documentation",
      description:
        "Exclusive behind-the-scenes look at creating a $75M institutional legacy vault for Fortune 500 executives.",
      streamer: {
        id: "goldman_team",
        name: "Goldman Sachs Digital Team",
        avatar: "/avatars/goldman.png",
        verified: true,
        tier: "sovereign",
      },
      category: "institutional",
      viewers: 2847,
      duration: 3600,
      status: "live",
      quality: "4K",
      tags: [
        "institutional",
        "fortune500",
        "legacy",
        "enterprise",
        "governance",
      ],
      thumbnail: "/thumbnails/goldman-stream.jpg",
      startTime: new Date(Date.now() - 3600000),
      language: "English",
      region: "United States",
    },
    {
      id: "2",
      title: "Amazon Rainforest Real-Time Conservation Monitoring",
      description:
        "Live satellite feeds and on-ground conservation efforts for our $100M rainforest preservation project.",
      streamer: {
        id: "conservation_team",
        name: "Amazon Conservation Alliance",
        avatar: "/avatars/amazon-conservation.png",
        verified: true,
        tier: "creator",
      },
      category: "earth",
      viewers: 5294,
      duration: 7200,
      status: "live",
      quality: "1080p",
      tags: [
        "environment",
        "conservation",
        "rainforest",
        "climate",
        "biodiversity",
      ],
      thumbnail: "/thumbnails/amazon-stream.jpg",
      startTime: new Date(Date.now() - 7200000),
      language: "English",
      region: "Brazil",
    },
    {
      id: "3",
      title:
        "Mayan Archaeological Site Digital Preservation - 3D Scanning Live",
      description:
        "Watch as we create high-resolution 3D models of ancient Mayan ruins for our cultural legacy archive.",
      streamer: {
        id: "maya_heritage",
        name: "Maya Heritage Foundation",
        avatar: "/avatars/maya-heritage.png",
        verified: true,
        tier: "creator",
      },
      category: "cultural",
      viewers: 1567,
      duration: 5400,
      status: "live",
      quality: "1080p",
      tags: ["culture", "archaeology", "maya", "heritage", "3d-scanning"],
      thumbnail: "/thumbnails/maya-stream.jpg",
      startTime: new Date(Date.now() - 5400000),
      language: "Spanish",
      region: "Guatemala",
    },
    {
      id: "4",
      title: "AI Superintelligence Research Lab - Breakthrough Development",
      description:
        "Live from OpenAI research facilities: documenting breakthrough AI developments for our $8.5B tech legacy.",
      streamer: {
        id: "openai_research",
        name: "OpenAI Research Team",
        avatar: "/avatars/openai.png",
        verified: true,
        tier: "sovereign",
      },
      category: "technological",
      viewers: 12847,
      duration: 1800,
      status: "live",
      quality: "4K",
      tags: [
        "ai",
        "research",
        "technology",
        "breakthrough",
        "superintelligence",
      ],
      thumbnail: "/thumbnails/openai-stream.jpg",
      startTime: new Date(Date.now() - 1800000),
      language: "English",
      region: "United States",
    },
    {
      id: "5",
      title: "Constitutional Convention Archive Documentation",
      description:
        "Historic documentation of constitutional preservation process for the U.S. Constitutional Archive project.",
      streamer: {
        id: "us_archives",
        name: "U.S. National Archives",
        avatar: "/avatars/us-archives.png",
        verified: true,
        tier: "sovereign",
      },
      category: "sovereign",
      viewers: 3621,
      duration: 2700,
      status: "live",
      quality: "1080p",
      tags: [
        "constitution",
        "government",
        "history",
        "sovereignty",
        "democracy",
      ],
      thumbnail: "/thumbnails/constitution-stream.jpg",
      startTime: new Date(Date.now() - 2700000),
      language: "English",
      region: "United States",
    },
  ]);

  const [chatMessages] = useState([
    {
      id: "1",
      username: "LegacyTrader_Pro",
      message: "This institutional vault documentation is incredible! 🔥",
      timestamp: new Date(Date.now() - 300000),
      tier: "creator",
    },
    {
      id: "2",
      username: "ConservationExpert",
      message: "Amazing to see real-time rainforest preservation in action",
      timestamp: new Date(Date.now() - 240000),
      tier: "seeker",
    },
    {
      id: "3",
      username: "TechInnovator2025",
      message: "The AI research footage is absolutely mind-blowing",
      timestamp: new Date(Date.now() - 180000),
      tier: "sovereign",
    },
    {
      id: "4",
      username: "HeritageKeeper",
      message: "Love the 3D scanning technology for cultural preservation",
      timestamp: new Date(Date.now() - 120000),
      tier: "creator",
    },
    {
      id: "5",
      username: "InstitutionalInvestor",
      message: "When will the Goldman Sachs vault be available for investment?",
      timestamp: new Date(Date.now() - 60000),
      tier: "sovereign",
    },
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "institutional":
        return "bg-purple-600/20 text-purple-400";
      case "earth":
        return "bg-green-600/20 text-green-400";
      case "cultural":
        return "bg-blue-600/20 text-blue-400";
      case "sovereign":
        return "bg-yellow-600/20 text-yellow-400";
      case "technological":
        return "bg-red-600/20 text-red-400";
      default:
        return "bg-gray-600/20 text-gray-400";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "sovereign":
        return "text-yellow-400";
      case "creator":
        return "text-purple-400";
      case "seeker":
        return "text-blue-400";
      case "explorer":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const selectedStreamData = liveStreams.find((s) => s.id === selectedStream);

  const filteredStreams = liveStreams
    .filter((stream) => {
      if (filters.category !== "all" && stream.category !== filters.category)
        return false;
      if (filters.quality !== "all" && stream.quality !== filters.quality)
        return false;
      if (filters.language !== "all" && stream.language !== filters.language)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "viewers":
          return b.viewers - a.viewers;
        case "duration":
          return b.duration - a.duration;
        case "recent":
          return b.startTime.getTime() - a.startTime.getTime();
        case "trending":
          return b.viewers - a.viewers; // Simplified trending
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {selectedStream ? (
        /* Stream Viewer */
        <div
          className={`${isFullscreen ? "fixed inset-0 z-50" : ""} flex h-screen`}
        >
          {/* Video Player */}
          <div
            className={`${isFullscreen ? "w-full" : "flex-1"} bg-black flex flex-col`}
          >
            {/* Video Container */}
            <div className="relative flex-1 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                poster={selectedStreamData?.thumbnail}
                controls={false}
                autoPlay
                muted={isMuted}
              >
                <source src="/video/sample-stream.mp4" type="video/mp4" />
              </video>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-20">
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    <Badge className="bg-red-600/90 text-white">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>

                    <span className="text-sm text-white">
                      {formatDuration(selectedStreamData?.duration || 0)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="text-white border-white/30"
                    >
                      {selectedStreamData?.quality}
                    </Badge>

                    <Button size="sm" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            {!isFullscreen && (
              <div className="p-4 bg-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">
                      {selectedStreamData?.title}
                    </h2>
                    <p className="text-slate-400 mb-3">
                      {selectedStreamData?.description}
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={selectedStreamData?.streamer.avatar}
                          />
                          <AvatarFallback>
                            {selectedStreamData?.streamer.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">
                              {selectedStreamData?.streamer.name}
                            </span>
                            {selectedStreamData?.streamer.verified && (
                              <Shield className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${getTierColor(selectedStreamData?.streamer.tier || "")}`}
                          >
                            {selectedStreamData?.streamer.tier?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>
                            {formatViewerCount(
                              selectedStreamData?.viewers || 0,
                            )}{" "}
                            viewers
                          </span>
                        </div>
                        <Badge
                          className={getCategoryColor(
                            selectedStreamData?.category || "",
                          )}
                        >
                          {selectedStreamData?.category?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedStreamData?.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-1" />
                      Like
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          {!isFullscreen && (
            <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Live Chat</h3>
                  <div className="flex items-center space-x-1 text-sm text-slate-400">
                    <Users className="h-4 w-4" />
                    <span>
                      {formatViewerCount(selectedStreamData?.viewers || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${getTierColor(msg.tier)}`}
                        >
                          {msg.username}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-slate-700 border-slate-600"
                  />
                  <Button size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Stream Browser */
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Live Capsule Streaming
              </h1>
              <p className="text-slate-400">
                Watch live creation and documentation of legacy capsules from
                around the world
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                <Radio className="h-3 w-3 mr-1" />
                {liveStreams.filter((s) => s.status === "live").length} Live Now
              </Badge>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg mb-6">
            <Button
              size="sm"
              variant={activeTab === "live" ? "default" : "ghost"}
              onClick={() => setActiveTab("live")}
              className="flex-1"
            >
              <Radio className="h-4 w-4 mr-2" />
              Live Now
            </Button>
            <Button
              size="sm"
              variant={activeTab === "scheduled" ? "default" : "ghost"}
              onClick={() => setActiveTab("scheduled")}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled
            </Button>
            <Button
              size="sm"
              variant={activeTab === "browse" ? "default" : "ghost"}
              onClick={() => setActiveTab("browse")}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse
            </Button>
            <Button
              size="sm"
              variant={activeTab === "following" ? "default" : "ghost"}
              onClick={() => setActiveTab("following")}
              className="flex-1"
            >
              <Star className="h-4 w-4 mr-2" />
              Following
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>

              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-slate-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as any })
                  }
                  className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm"
                >
                  <option value="viewers">Most Viewers</option>
                  <option value="duration">Longest Running</option>
                  <option value="recent">Recently Started</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>{filteredStreams.length} streams found</span>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="institutional">Institutional</option>
                      <option value="earth">Earth Legacy</option>
                      <option value="cultural">Cultural</option>
                      <option value="sovereign">Sovereign</option>
                      <option value="technological">Technological</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Quality
                    </label>
                    <select
                      value={filters.quality}
                      onChange={(e) =>
                        setFilters({ ...filters, quality: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All Qualities</option>
                      <option value="720p">720p HD</option>
                      <option value="1080p">1080p Full HD</option>
                      <option value="4K">4K Ultra HD</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Language
                    </label>
                    <select
                      value={filters.language}
                      onChange={(e) =>
                        setFilters({ ...filters, language: e.target.value })
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All Languages</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setFilters({
                          category: "all",
                          quality: "all",
                          language: "all",
                          sortBy: "viewers",
                        })
                      }
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stream Grid/List */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredStreams.map((stream) => (
              <Card
                key={stream.id}
                className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors"
                onClick={() => setSelectedStream(stream.id)}
              >
                <div className="relative">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600/90 text-white">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="outline"
                      className="text-white border-white/30 bg-black/50"
                    >
                      {stream.quality}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/70 text-white">
                      {formatDuration(stream.duration)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {stream.title}
                  </h3>

                  <div className="flex items-center space-x-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={stream.streamer.avatar} />
                      <AvatarFallback>
                        {stream.streamer.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">
                        {stream.streamer.name}
                      </span>
                      {stream.streamer.verified && (
                        <Shield className="h-3 w-3 text-blue-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViewerCount(stream.viewers)}</span>
                      </div>
                      <Badge className={getCategoryColor(stream.category)}>
                        {stream.category.toUpperCase()}
                      </Badge>
                    </div>
                    <span>{stream.language}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
