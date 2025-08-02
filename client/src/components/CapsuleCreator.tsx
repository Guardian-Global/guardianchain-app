import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  FileText,
  Heart,
  MapPin,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  CapsuleCreationRequest,
  CAPSULE_CATEGORIES,
} from "@shared/types/capsule";

export default function CapsuleCreator() {
  const [formData, setFormData] = useState<Partial<CapsuleCreationRequest>>({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: [],
    privacyLevel: "public",
    expectedGriefScore: undefined,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (request: CapsuleCreationRequest) => {
      return apiRequest("POST", "/api/capsules", request);
    },
    onSuccess: (data) => {
      toast({
        title: "Truth Capsule Created",
        description: `Your capsule "${formData.title}" has been sealed and submitted for verification`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "",
        tags: [],
        privacyLevel: "public",
        expectedGriefScore: undefined,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["/api/capsules"] });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create truth capsule",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (
    field: keyof CapsuleCreationRequest,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      handleInputChange("tags", [...(formData.tags || []), currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.content ||
      !formData.category
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const request: CapsuleCreationRequest = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      category: formData.category,
      tags: formData.tags || [],
      privacyLevel: formData.privacyLevel || "public",
      authorWalletAddress: "", // Will be set by backend
      expectedGriefScore: formData.expectedGriefScore,
    };

    createMutation.mutate(request);
  };

  const estimatedGriefScore = () => {
    if (!formData.content) return 0;

    const content = formData.content.toLowerCase();
    let score = 30; // Base score

    // Emotional indicators
    if (content.includes("death") || content.includes("loss")) score += 25;
    if (content.includes("love") || content.includes("family")) score += 20;
    if (content.includes("injustice") || content.includes("truth")) score += 15;
    if (content.includes("hope") || content.includes("change")) score += 10;

    // Content depth
    if (formData.content.length > 500) score += 10;
    if (formData.content.length > 1000) score += 10;

    return Math.min(100, score);
  };

  const estimatedYield = () => {
    const grief = estimatedGriefScore();
    const baseYield = 10;
    const griefMultiplier = Math.pow(grief / 100, 1.5);
    const bonusMultiplier = grief > 80 ? 1.5 : grief > 60 ? 1.2 : 1.0;

    return (
      Math.round(baseYield * griefMultiplier * bonusMultiplier * 100) / 100
    );
  };

  return (
    <Card className="bg-slate-800 border-slate-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <PlusCircle className="w-5 h-5 mr-2 text-blue-400" />
          Create Truth Capsule
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Preserve your truth for eternity. Share your story, evidence, or
          memory with the world.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Give your truth capsule a meaningful title"
              className="bg-slate-700 border-slate-600 text-white"
              maxLength={100}
            />
            {formData.title && (
              <div className="text-xs text-slate-500 mt-1">
                {formData.title.length}/100 characters
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Briefly describe what this capsule contains"
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
              maxLength={300}
            />
            {formData.description && (
              <div className="text-xs text-slate-500 mt-1">
                {formData.description.length}/300 characters
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category *
            </label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CAPSULE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content *
            </label>
            <Textarea
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Share your truth, story, or evidence here. Be as detailed as you need to preserve the full context."
              className="bg-slate-700 border-slate-600 text-white"
              rows={8}
            />
            {formData.content && (
              <div className="text-xs text-slate-500 mt-1">
                {formData.content.length} characters •{" "}
                {formData.content.split(" ").length} words
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags (Optional)
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add relevant tags"
                className="bg-slate-700 border-slate-600 text-white flex-1"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-slate-600"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-slate-600 text-slate-300 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Privacy Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Privacy Level
            </label>
            <Select
              value={formData.privacyLevel || "public"}
              onValueChange={(value: any) =>
                handleInputChange("privacyLevel", value)
              }
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all</SelectItem>
                <SelectItem value="restricted">
                  Restricted - Tier-based access
                </SelectItem>
                <SelectItem value="private">Private - Creator only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Metrics */}
          {formData.content && formData.content.length > 50 && (
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <h3 className="text-slate-300 font-medium flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-400" />
                Estimated Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {estimatedGriefScore()}
                  </div>
                  <div className="text-sm text-slate-400">Grief Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {estimatedYield()} GTT
                  </div>
                  <div className="text-sm text-slate-400">Estimated Yield</div>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                These are estimates. Final values will be determined by AI
                analysis and community validation.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <div className="flex items-center text-sm text-slate-400">
              <Shield className="w-4 h-4 mr-2" />
              Your capsule will be cryptographically sealed and submitted for
              verification
            </div>

            <Button
              type="submit"
              disabled={
                createMutation.isPending || !formData.title || !formData.content
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Capsule...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Truth Capsule
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
