import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Play,
  Plus,
  Film,
  Star,
  Eye,
  Heart,
  Share2,
  Edit3,
  Trash2,
  Music,
  Languages,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import VoiceSummaryPlayer from "@/components/VoiceSummaryPlayer";
import { getLabel } from "@/lib/labels";

interface Capsule {
  id: string;
  title: string;
  description: string;
  summary: string;
  truthScore: number;
  mediaUrl?: string;
  mediaType: string;
  createdAt: string;
  isSelected?: boolean;
}

interface Reel {
  id: string;
  name: string;
  description?: string;
  capsuleIds: string[];
  capsules: Capsule[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  playCount: number;
  likeCount: number;
  language: string;
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [selectedCapsules, setSelectedCapsules] = useState<string[]>([]);
  const [newReelName, setNewReelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playingReel, setPlayingReel] = useState<string | null>(null);
  const [userLanguage, setUserLanguage] = useState("en");
  const { toast } = useToast();

  // Mock user capsules data
  const { data: userCapsules = [] } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules/owned"],
    enabled: false,
    initialData: [
      {
        id: "cap-1",
        title: "Family Memories 2024",
        description: "Collection of precious family moments",
        summary:
          "A heartwarming collection capturing the essence of family bonds, laughter, and shared experiences throughout 2024.",
        truthScore: 92,
        mediaType: "video",
        mediaUrl: "/placeholder-video.mp4",
        createdAt: "2024-03-15T10:00:00Z",
      },
      {
        id: "cap-2",
        title: "Truth About Corporate Fraud",
        description: "Whistleblower testimony exposing corporate misconduct",
        summary:
          "Detailed account of financial irregularities and ethical violations within a major corporation, backed by documented evidence.",
        truthScore: 96,
        mediaType: "document",
        createdAt: "2024-02-20T14:30:00Z",
      },
      {
        id: "cap-3",
        title: "Climate Change Evidence",
        description: "Scientific observations and data collection",
        summary:
          "Comprehensive documentation of local climate patterns, temperature changes, and environmental impact over the past decade.",
        truthScore: 89,
        mediaType: "image",
        mediaUrl: "/placeholder-chart.jpg",
        createdAt: "2024-01-10T09:15:00Z",
      },
      {
        id: "cap-4",
        title: "Heritage Recipe Collection",
        description: "Grandmother's secret recipes and cooking traditions",
        summary:
          "Traditional family recipes passed down through generations, including cooking techniques and cultural significance.",
        truthScore: 85,
        mediaType: "text",
        createdAt: "2024-04-05T16:45:00Z",
      },
    ],
  });

  useEffect(() => {
    // Detect user language on component mount
    const language = navigator.language.split("-")[0] || "en";
    setUserLanguage(language);

    // Load existing reels
    loadReels();
  }, []);

  const loadReels = () => {
    // Mock existing reels
    const mockReels: Reel[] = [
      {
        id: "reel-1",
        name: "Family Legacy Collection",
        description: "Personal family stories and memories",
        capsuleIds: ["cap-1", "cap-4"],
        capsules: userCapsules.filter((c) => ["cap-1", "cap-4"].includes(c.id)),
        createdAt: "2024-03-20T12:00:00Z",
        updatedAt: "2024-03-20T12:00:00Z",
        isPublic: true,
        playCount: 127,
        likeCount: 23,
        language: "en",
      },
      {
        id: "reel-2",
        name: "Truth Investigations",
        description: "Evidence-based exposures and investigations",
        capsuleIds: ["cap-2", "cap-3"],
        capsules: userCapsules.filter((c) => ["cap-2", "cap-3"].includes(c.id)),
        createdAt: "2024-02-25T15:30:00Z",
        updatedAt: "2024-02-25T15:30:00Z",
        isPublic: false,
        playCount: 89,
        likeCount: 45,
        language: "en",
      },
    ];
    setReels(mockReels);
  };

  const handleCapsuleSelect = (capsuleId: string) => {
    setSelectedCapsules((prev) =>
      prev.includes(capsuleId)
        ? prev.filter((id) => id !== capsuleId)
        : [...prev, capsuleId],
    );
  };

  const createReel = async () => {
    if (!newReelName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your reel",
        variant: "destructive",
      });
      return;
    }

    if (selectedCapsules.length === 0) {
      toast({
        title: "Select Capsules",
        description: "Please select at least one capsule for your reel",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const newReel: Reel = {
        id: `reel-${Date.now()}`,
        name: newReelName,
        description: `Custom reel containing ${selectedCapsules.length} truth capsules`,
        capsuleIds: selectedCapsules,
        capsules: userCapsules.filter((c) => selectedCapsules.includes(c.id)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        playCount: 0,
        likeCount: 0,
        language: userLanguage,
      };

      setReels((prev) => [newReel, ...prev]);
      setNewReelName("");
      setSelectedCapsules([]);

      toast({
        title: getLabel("uploadSuccess", userLanguage),
        description: `Reel "${newReelName}" created successfully`,
      });
    } catch (error) {
      console.error("Failed to create reel:", error);
      toast({
        title: "Creation Failed",
        description: "Unable to create reel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const playReel = (reelId: string) => {
    setPlayingReel(playingReel === reelId ? null : reelId);

    // Increment play count
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, playCount: reel.playCount + 1 } : reel,
      ),
    );
  };

  const deleteReel = (reelId: string) => {
    setReels((prev) => prev.filter((reel) => reel.id !== reelId));
    toast({
      title: "Reel Deleted",
      description: "Reel has been removed from your collection",
    });
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "video":
        return <Film className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {getLabel("reels", userLanguage)}
          </h1>
          <p className="text-gray-600">
            Create and share collections of your truth capsules as remixable
            reels
          </p>
        </div>

        {/* Create New Reel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {getLabel("createReel", userLanguage)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder={getLabel("reelName", userLanguage)}
                value={newReelName}
                onChange={(e) => setNewReelName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={createReel}
                disabled={isCreating || selectedCapsules.length === 0}
              >
                {isCreating ? "Creating..." : getLabel("create", userLanguage)}
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {getLabel("selectCapsules", userLanguage)} (
                {selectedCapsules.length} selected)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCapsules.includes(capsule.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleCapsuleSelect(capsule.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedCapsules.includes(capsule.id)}
                        onChange={() => handleCapsuleSelect(capsule.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getMediaIcon(capsule.mediaType)}
                          <span className="font-medium text-sm">
                            {capsule.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {capsule.truthScore}% truth
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {capsule.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Existing Reels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reels.map((reel) => (
            <Card key={reel.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{reel.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => playReel(reel.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteReel(reel.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {reel.playCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {reel.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reel.capsules.length} capsules
                  </span>
                  {reel.language !== "en" && (
                    <Badge variant="outline" className="text-xs">
                      <Languages className="w-3 h-3 mr-1" />
                      {reel.language.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Reel Capsules */}
                {playingReel === reel.id ? (
                  <div className="space-y-3">
                    {reel.capsules.map((capsule, index) => (
                      <div key={capsule.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <span className="font-medium text-sm">
                            {capsule.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {capsule.truthScore}%
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {capsule.summary}
                        </p>

                        <VoiceSummaryPlayer
                          text={capsule.summary}
                          language={reel.language}
                          autoTranslate={reel.language !== "en"}
                          showDownload={true}
                          className="border-0 bg-transparent p-0"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      {reel.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {reel.capsules.slice(0, 3).map((capsule) => (
                        <Badge
                          key={capsule.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {getMediaIcon(capsule.mediaType)}
                          <span className="ml-1">{capsule.title}</span>
                        </Badge>
                      ))}
                      {reel.capsules.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{reel.capsules.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Share2 className="w-3 h-3 mr-1" />
                    {getLabel("share", userLanguage)}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reels.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reels Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first reel to start sharing your truth capsule
                collections
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {getLabel("createReel", userLanguage)}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
