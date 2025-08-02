import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  FileText,
  Users,
  Calendar,
  Play,
  Upload,
  Loader2,
} from "lucide-react";
import { BRAND_COLORS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export default function MusicianCapsulePage() {
  const { toast } = useToast();
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  const musicGenres = [
    "Rock",
    "Pop",
    "Hip Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "Country",
    "Folk",
    "Blues",
    "R&B",
    "Reggae",
    "Metal",
    "Punk",
    "Indie",
    "Other",
  ];

  const createMusicCapsuleMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/capsule/musician", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Music Capsule Created",
        description:
          "Your music has been documented as a verified truth capsule.",
      });
      // Reset form
      setSongTitle("");
      setArtistName("");
      setAlbumName("");
      setGenre("");
      setReleaseDate("");
      setLyrics("");
      setInspiration("");
      setCollaborators("");
      setAudioFiles([]);
      setMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create music capsule.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAudioFiles(files);
  };

  const handleSubmit = () => {
    if (!songTitle.trim() || !artistName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least song title and artist name.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("songTitle", songTitle.trim());
    formData.append("artistName", artistName.trim());
    formData.append("albumName", albumName.trim());
    formData.append("genre", genre.trim());
    formData.append("releaseDate", releaseDate);
    formData.append("lyrics", lyrics.trim());
    formData.append("inspiration", inspiration.trim());
    formData.append("collaborators", collaborators.trim());
    formData.append("message", message.trim());
    formData.append("capsuleType", "MUSICIAN");

    audioFiles.forEach((file, index) => {
      formData.append(`audio_${index}`, file);
    });

    createMusicCapsuleMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Musician Capsule</h1>
          <p className="text-slate-400">
            Document and verify musical works with authentic lyrics and creative
            truth
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Music Capsule */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music
                    className="w-5 h-5"
                    style={{ color: BRAND_COLORS.CHAIN }}
                  />
                  Music Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Song Title *
                    </label>
                    <Input
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="Name of your song"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Artist Name *
                    </label>
                    <Input
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Your artist name or band name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Album/EP Name
                    </label>
                    <Input
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      placeholder="Album or EP name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Select genre</option>
                      {musicGenres.map((genreName) => (
                        <option key={genreName} value={genreName}>
                          {genreName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                      Release Date
                    </label>
                    <Input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Lyrics
                  </label>
                  <Textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Enter the complete lyrics of your song..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Inspiration & Story
                  </label>
                  <Textarea
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    placeholder="What inspired this song? What truth or message does it convey?"
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Message & Meaning
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What message or truth are you sharing through this music?"
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Collaborators & Credits
                  </label>
                  <Textarea
                    value={collaborators}
                    onChange={(e) => setCollaborators(e.target.value)}
                    placeholder="List band members, producers, writers, or other collaborators..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[60px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Audio Files
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept="audio/*,.mp3,.wav,.m4a,.flac"
                      onChange={handleFileChange}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Upload className="w-4 h-4 text-slate-400" />
                  </div>
                  {audioFiles.length > 0 && (
                    <div className="text-sm text-slate-400">
                      {audioFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={createMusicCapsuleMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {createMusicCapsuleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Music Capsule...
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      Create Music Capsule
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
                  <FileText
                    className="w-4 h-4"
                    style={{ color: BRAND_COLORS.CHAIN }}
                  />
                  Music Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <Music className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Lyric Verification:</strong>{" "}
                    Immutable lyric records
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Play className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Audio Archive:</strong>{" "}
                    Permanent music storage
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">
                      Collaboration Credit:
                    </strong>{" "}
                    Proper attribution
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Release Proof:</strong>{" "}
                    Verified creation date
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Music */}
            <Card className="bg-slate-800/30 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Music</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Truth in the Noise",
                    artist: "Urban Truth Collective",
                    genre: "Hip Hop",
                    date: "2025-01-25",
                  },
                  {
                    title: "Climate Song",
                    artist: "Earth Voice",
                    genre: "Folk",
                    date: "2025-01-20",
                  },
                  {
                    title: "Digital Freedom",
                    artist: "Code Rebels",
                    genre: "Electronic",
                    date: "2025-01-18",
                  },
                ].map((song, index) => (
                  <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-white text-sm">
                        {song.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-purple-400 border-purple-600 text-xs"
                      >
                        {song.genre}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      <div>By: {song.artist}</div>
                      <div>
                        Released: {new Date(song.date).toLocaleDateString()}
                      </div>
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
            <CardTitle className="text-white">
              How Music Capsules Work
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white">1. Create</h3>
              <p className="text-sm text-slate-400">
                Compose music with meaningful truth and message
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white">2. Document</h3>
              <p className="text-sm text-slate-400">
                Record lyrics, audio, and creative story
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white">3. Verify</h3>
              <p className="text-sm text-slate-400">
                Immutable timestamp and authenticity proof
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white">4. Preserve</h3>
              <p className="text-sm text-slate-400">
                Permanent musical truth archive
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
