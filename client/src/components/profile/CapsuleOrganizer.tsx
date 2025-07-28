import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Eye,
  Share,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface Capsule {
  id: string;
  title: string;
  status: "draft" | "sealed" | "verified" | "yielding";
  type: "document" | "media" | "data" | "testimony";
  gttValue: number;
  yieldGenerated: number;
  createdDate: string;
  verificationCount: number;
  privacy: "public" | "private";
}

export default function CapsuleOrganizer() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const capsules: Capsule[] = [
    {
      id: "1",
      title: "Climate Research Data Verification",
      status: "verified",
      type: "data",
      gttValue: 823.75,
      yieldGenerated: 147.5,
      createdDate: "2024-11-15",
      verificationCount: 23,
      privacy: "public",
    },
    {
      id: "2",
      title: "Legal Document Authentication",
      status: "yielding",
      type: "document",
      gttValue: 1156.8,
      yieldGenerated: 289.33,
      createdDate: "2024-10-22",
      verificationCount: 45,
      privacy: "public",
    },
    {
      id: "3",
      title: "Personal Medical Records",
      status: "sealed",
      type: "document",
      gttValue: 0,
      yieldGenerated: 0,
      createdDate: "2024-12-01",
      verificationCount: 0,
      privacy: "private",
    },
    {
      id: "4",
      title: "AI Training Data Integrity",
      status: "verified",
      type: "data",
      gttValue: 2267.45,
      yieldGenerated: 567.45,
      createdDate: "2024-09-08",
      verificationCount: 67,
      privacy: "public",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-500",
      sealed: "bg-blue-500",
      verified: "bg-green-500",
      yielding: "bg-purple-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      document: Shield,
      media: Eye,
      data: TrendingUp,
      testimony: Calendar,
    };
    return icons[type as keyof typeof icons] || Shield;
  };

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch = capsule.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || capsule.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search capsules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sealed">Sealed</option>
            <option value="verified">Verified</option>
            <option value="yielding">Yielding</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>

          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>

          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Capsule
          </Button>
        </div>
      </div>

      {/* Capsules Display */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => {
            const TypeIcon = getTypeIcon(capsule.type);

            return (
              <Card
                key={capsule.id}
                className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-5 h-5 text-purple-400" />
                      <Badge
                        className={`${getStatusColor(
                          capsule.status
                        )} text-white text-xs`}
                      >
                        {capsule.status}
                      </Badge>
                    </div>

                    <Badge
                      variant="outline"
                      className={`${
                        capsule.privacy === "private"
                          ? "border-red-400 text-red-400"
                          : "border-green-400 text-green-400"
                      }`}
                    >
                      {capsule.privacy}
                    </Badge>
                  </div>

                  <CardTitle className="text-lg line-clamp-2">
                    {capsule.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Value: </span>
                        <span className="text-amber-400">
                          {capsule.gttValue.toLocaleString()} GTT
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400">Yield: </span>
                        <span className="text-green-400">
                          {capsule.yieldGenerated.toLocaleString()} GTT
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Created: </span>
                        <span className="text-white">
                          {new Date(capsule.createdDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400">Verified: </span>
                        <span className="text-blue-400">
                          {capsule.verificationCount}x
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>

                      <Button size="sm" variant="outline" className="flex-1">
                        <Share className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredCapsules.map((capsule, index) => {
                const TypeIcon = getTypeIcon(capsule.type);

                return (
                  <div
                    key={capsule.id}
                    className={`p-4 flex items-center justify-between hover:bg-slate-750 transition-colors ${
                      index !== filteredCapsules.length - 1
                        ? "border-b border-slate-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <TypeIcon className="w-5 h-5 text-purple-400" />

                      <div>
                        <h3 className="font-medium text-white">
                          {capsule.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>
                            Created:{" "}
                            {new Date(capsule.createdDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{capsule.verificationCount} verifications</span>
                          <span>•</span>
                          <span className="capitalize">{capsule.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-amber-400 font-medium">
                          {capsule.gttValue.toLocaleString()} GTT
                        </div>
                        <div className="text-green-400 text-sm">
                          +{capsule.yieldGenerated.toLocaleString()} yield
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`${getStatusColor(
                            capsule.status
                          )} text-white`}
                        >
                          {capsule.status}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={`${
                            capsule.privacy === "private"
                              ? "border-red-400 text-red-400"
                              : "border-green-400 text-green-400"
                          }`}
                        >
                          {capsule.privacy}
                        </Badge>
                      </div>

                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>

                        <Button size="sm" variant="outline">
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredCapsules.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No capsules found
            </h3>
            <p className="text-slate-400 mb-4">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Start by creating your first truth capsule."}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Capsule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
