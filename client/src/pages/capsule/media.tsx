import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Newspaper, FileText, Users, Calendar, Video, Upload, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function MediaCapsulePage() {
  const { toast } = useToast();
  const [articleTitle, setArticleTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [publication, setPublication] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [content, setContent] = useState("");
  const [sources, setSources] = useState("");
  const [factChecks, setFactChecks] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [corrections, setCorrections] = useState("");

  const mediaTypes = [
    "News Article", "Investigative Report", "Editorial", "Interview", 
    "Documentary", "News Video", "Podcast Episode", "Blog Post", "Social Media Post", "Other"
  ];

  const createMediaCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/capsule/media", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Media Capsule Created",
        description: "Your media content has been documented for truth verification.",
      });
      // Reset form
      setArticleTitle("");
      setAuthorName("");
      setPublication("");
      setMediaType("");
      setContent("");
      setSources("");
      setFactChecks("");
      setPublishDate("");
      setMediaFiles([]);
      setCorrections("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create media capsule.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
  };

  const handleSubmit = () => {
    if (!articleTitle.trim() || !authorName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least article title and author name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("articleTitle", articleTitle.trim());
    formData.append("authorName", authorName.trim());
    formData.append("publication", publication.trim());
    formData.append("mediaType", mediaType.trim());
    formData.append("content", content.trim());
    formData.append("sources", sources.trim());
    formData.append("factChecks", factChecks.trim());
    formData.append("publishDate", publishDate);
    formData.append("corrections", corrections.trim());
    formData.append("capsuleType", "MEDIA");
    
    mediaFiles.forEach((file, index) => {
      formData.append(`media_${index}`, file);
    });

    createMediaCapsuleMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Media Capsule</h1>
          <p className="text-slate-400">
            Document and verify media content with full source attribution and fact-checking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Media Capsule */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Newspaper className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
                  Media Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Article/Content Title *</label>
                    <Input
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Title of the media content"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Author/Reporter *</label>
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author or reporter name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Publication/Outlet</label>
                    <Input
                      value={publication}
                      onChange={(e) => setPublication(e.target.value)}
                      placeholder="News outlet or publication"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Media Type</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Select type</option>
                      {mediaTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Publish Date</label>
                    <Input
                      type="date"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Content Summary/Excerpt</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide a summary or key excerpts from the media content..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Sources & References</label>
                  <Textarea
                    value={sources}
                    onChange={(e) => setSources(e.target.value)}
                    placeholder="List primary sources, interviews, documents, or references cited (one per line)..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Fact-Checking & Verification</label>
                  <Textarea
                    value={factChecks}
                    onChange={(e) => setFactChecks(e.target.value)}
                    placeholder="Document fact-checking process, verification methods, or third-party validations..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Corrections & Updates</label>
                  <Textarea
                    value={corrections}
                    onChange={(e) => setCorrections(e.target.value)}
                    placeholder="Any corrections, retractions, or updates to the original content..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Media Files</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf"
                      onChange={handleFileChange}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Upload className="w-4 h-4 text-slate-400" />
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="text-sm text-slate-400">
                      {mediaFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createMediaCapsuleMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {createMediaCapsuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Media Capsule...
                    </>
                  ) : (
                    <>
                      <Newspaper className="w-4 h-4 mr-2" />
                      Create Media Capsule
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines & Features */}
          <div className="space-y-6">
            {/* Features */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-4 h-4" style={{ color: BRAND_COLORS.CHAIN }} />
                  Media Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <Newspaper className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Source Verification:</strong> Track original sources
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Fact-Check Record:</strong> Document verification process
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Publication Trail:</strong> Immutable publication history
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Media Archive:</strong> Preserve original content
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Media */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Corporate Accountability Investigation",
                    author: "Jane Smith",
                    outlet: "Truth Tribune",
                    type: "Investigative Report",
                  },
                  {
                    title: "Climate Policy Analysis",
                    author: "Dr. Alex Johnson",
                    outlet: "Environmental Weekly",
                    type: "News Article",
                  },
                  {
                    title: "Tech Industry Transparency",
                    author: "Maria Garcia",
                    outlet: "Digital Truth",
                    type: "Documentary",
                  },
                ].map((media, index) => (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-white text-sm">{media.title}</h4>
                      <Badge variant="outline" className="text-green-400 border-green-600 text-xs">
                        {media.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>By: {media.author}</div>
                      <div>Published in: {media.outlet}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How Media Capsules Work</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <Newspaper className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">1. Report</h3>
              <p className="text-sm text-slate-400">Create media content with thorough research</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">2. Source</h3>
              <p className="text-sm text-slate-400">Document all sources and verification methods</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">3. Verify</h3>
              <p className="text-sm text-slate-400">Community fact-checking and validation</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-white">4. Archive</h3>
              <p className="text-sm text-slate-400">Permanent media truth preservation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}