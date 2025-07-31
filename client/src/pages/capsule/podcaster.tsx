import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mic, Radio, Users, Calendar, FileText, Upload, Loader2 } from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function PodcasterCapsulePage() {
  const { toast } = useToast();
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [showName, setShowName] = useState("");
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [keyTopics, setKeyTopics] = useState("");

  const createPodcastCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/capsule/podcaster", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Podcast Capsule Created",
        description: "Your podcast episode has been documented as a truth capsule.",
      });
      // Reset form
      setEpisodeTitle("");
      setShowName("");
      setDescription("");
      setGuestName("");
      setEpisodeNumber("");
      setRecordingDate("");
      setTranscriptFile(null);
      setAudioFile(null);
      setKeyTopics("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create podcast capsule.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!episodeTitle.trim() || !showName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least episode title and show name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("episodeTitle", episodeTitle.trim());
    formData.append("showName", showName.trim());
    formData.append("description", description.trim());
    formData.append("guestName", guestName.trim());
    formData.append("episodeNumber", episodeNumber.trim());
    formData.append("recordingDate", recordingDate);
    formData.append("keyTopics", keyTopics.trim());
    formData.append("capsuleType", "PODCASTER");
    
    if (transcriptFile) formData.append("transcript", transcriptFile);
    if (audioFile) formData.append("audio", audioFile);

    createPodcastCapsuleMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Podcaster Capsule</h1>
          <p className="text-slate-400">
            Document podcast episodes and conversations as verified truth capsules
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Podcast Capsule */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mic className="w-5 h-5" style={{ color: BRAND_COLORS.CHAIN }} />
                  Episode Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Episode Title *</label>
                    <Input
                      value={episodeTitle}
                      onChange={(e) => setEpisodeTitle(e.target.value)}
                      placeholder="The title of this episode"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Show Name *</label>
                    <Input
                      value={showName}
                      onChange={(e) => setShowName(e.target.value)}
                      placeholder="Your podcast show name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Episode Number</label>
                    <Input
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(e.target.value)}
                      placeholder="e.g., #42"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Guest Name</label>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Guest name (if applicable)"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Recording Date</label>
                    <Input
                      type="date"
                      value={recordingDate}
                      onChange={(e) => setRecordingDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Episode Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what was discussed in this episode..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Key Topics & Claims</label>
                  <Textarea
                    value={keyTopics}
                    onChange={(e) => setKeyTopics(e.target.value)}
                    placeholder="List key topics, claims, or truth statements discussed (one per line)..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Transcript File</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".txt,.pdf,.docx"
                        onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Upload className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Audio File</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept=".mp3,.wav,.m4a"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Radio className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createPodcastCapsuleMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {createPodcastCapsuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Podcast Capsule...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Create Podcast Capsule
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
                  Podcast Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <Radio className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Audio Archiving:</strong> Permanent audio storage
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Transcript Verification:</strong> Searchable text content
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Guest Attribution:</strong> Proper credit and verification
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Timestamp Proof:</strong> Immutable recording date
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Episodes */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Episodes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "The Truth About AI Ethics",
                    show: "Tech Truth Podcast",
                    guest: "Dr. Sarah Chen",
                    episode: "#142",
                  },
                  {
                    title: "Corporate Transparency Deep Dive",
                    show: "Business Revealed",
                    guest: "Mark Williams",
                    episode: "#89",
                  },
                  {
                    title: "Environmental Justice Stories",
                    show: "Green Truth",
                    guest: "Maria Rodriguez",
                    episode: "#67",
                  },
                ].map((episode, index) => (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-white text-sm">{episode.title}</h4>
                      <Badge variant="outline" className="text-orange-400 border-orange-600 text-xs">
                        {episode.episode}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>{episode.show}</div>
                      <div>Guest: {episode.guest}</div>
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
            <CardTitle className="text-white">How Podcast Capsules Work</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white">1. Record</h3>
              <p className="text-sm text-slate-400">Create your podcast episode with guests or solo</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">2. Upload</h3>
              <p className="text-sm text-slate-400">Add audio files, transcripts, and metadata</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">3. Verify</h3>
              <p className="text-sm text-slate-400">Content is verified and timestamped</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">4. Archive</h3>
              <p className="text-sm text-slate-400">Permanent archive for truth reference</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}