import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Palette, Image, Brush, Camera, FileText, Upload, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function ArtistCapsulePage() {
  const { toast } = useToast();
  const [artworkTitle, setArtworkTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
  const [inspiration, setInspiration] = useState("");
  const [statement, setStatement] = useState("");

  const artMediums = [
    "Digital Art", "Oil Painting", "Acrylic", "Watercolor", "Photography", 
    "Sculpture", "Mixed Media", "Collage", "Street Art", "NFT Art", "Other"
  ];

  const createArtCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/capsule/artist", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Artist Capsule Created",
        description: "Your artwork has been documented as a verified truth capsule.",
      });
      // Reset form
      setArtworkTitle("");
      setArtistName("");
      setDescription("");
      setMedium("");
      setDimensions("");
      setCreationDate("");
      setArtworkFiles([]);
      setInspiration("");
      setStatement("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create artist capsule.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArtworkFiles(files);
  };

  const handleSubmit = () => {
    if (!artworkTitle.trim() || !artistName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least artwork title and artist name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("artworkTitle", artworkTitle.trim());
    formData.append("artistName", artistName.trim());
    formData.append("description", description.trim());
    formData.append("medium", medium.trim());
    formData.append("dimensions", dimensions.trim());
    formData.append("creationDate", creationDate);
    formData.append("inspiration", inspiration.trim());
    formData.append("statement", statement.trim());
    formData.append("capsuleType", "ARTIST");
    
    artworkFiles.forEach((file, index) => {
      formData.append(`artwork_${index}`, file);
    });

    createArtCapsuleMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Artist Capsule</h1>
          <p className="text-slate-400">
            Document and verify artistic works with immutable provenance and truth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Artist Capsule */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
                  Artwork Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Artwork Title *</label>
                    <Input
                      value={artworkTitle}
                      onChange={(e) => setArtworkTitle(e.target.value)}
                      placeholder="Name of your artwork"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Artist Name *</label>
                    <Input
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Your artist name or pseudonym"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Artwork Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your artwork, its meaning, and significance..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Medium</label>
                    <select
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Select medium</option>
                      {artMediums.map((med) => (
                        <option key={med} value={med}>
                          {med}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Dimensions</label>
                    <Input
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g., 24x36 inches"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Creation Date</label>
                    <Input
                      type="date"
                      value={creationDate}
                      onChange={(e) => setCreationDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Artwork Files</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf"
                      onChange={handleFileChange}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Upload className="w-4 h-4 text-slate-400" />
                  </div>
                  {artworkFiles.length > 0 && (
                    <div className="text-sm text-slate-400">
                      {artworkFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Inspiration & Context</label>
                  <Textarea
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    placeholder="What inspired this work? What truth does it represent or reveal?"
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Artist Statement</label>
                  <Textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="Your artistic statement about this work..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createArtCapsuleMutation.isPending}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {createArtCapsuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Artist Capsule...
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4 mr-2" />
                      Create Artist Capsule
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
                  Artist Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <Image className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Provenance Tracking:</strong> Immutable creation records
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Camera className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">High-Res Storage:</strong> Permanent artwork archival
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Brush className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Attribution Rights:</strong> Protect your creative work
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Truth Documentation:</strong> Artistic truth verification
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Artworks */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Artworks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Climate Reality #3",
                    artist: "EcoArt Collective",
                    medium: "Mixed Media",
                    date: "2025-01-15",
                  },
                  {
                    title: "Truth in Digital Spaces",
                    artist: "Maya Chen",
                    medium: "Digital Art",
                    date: "2025-01-10",
                  },
                  {
                    title: "Corporate Transparency",
                    artist: "Anonymous",
                    medium: "Street Art",
                    date: "2025-01-05",
                  },
                ].map((artwork, index) => (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-white text-sm">{artwork.title}</h4>
                      <Badge variant="outline" className="text-pink-400 border-pink-600 text-xs">
                        {artwork.medium}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>By: {artwork.artist}</div>
                      <div>Created: {new Date(artwork.date).toLocaleDateString()}</div>
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
            <CardTitle className="text-white">How Artist Capsules Work</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-pink-600/20 rounded-full flex items-center justify-center mx-auto">
                <Brush className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-semibold text-white">1. Create</h3>
              <p className="text-sm text-slate-400">Create your artistic work with truth and meaning</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">2. Document</h3>
              <p className="text-sm text-slate-400">Upload high-quality images and metadata</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">3. Verify</h3>
              <p className="text-sm text-slate-400">Immutable timestamp and authenticity proof</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <Image className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">4. Preserve</h3>
              <p className="text-sm text-slate-400">Permanent artistic truth preservation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}