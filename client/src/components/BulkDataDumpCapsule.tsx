import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Microphone, Upload, Share2, Users, Edit3, Zap, Image, Video, CheckCircle, Lock, Unlock } from "lucide-react";

/**
 * BulkDataDumpCapsule
 * - Allows users to upload all phone data (images/videos)
 * - Mints uploaded media as NFTs for permanent recall
 * - AI voice assistant for recall, organization, remix, edit
 * - Share controls at minting: when, how, with whom
 */
export default function BulkDataDumpCapsule() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiActive, setAiActive] = useState(false);
  const [shareSettings, setShareSettings] = useState({
    shareWith: '',
    shareWhen: 'immediate',
    shareHow: 'private',
  });
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  // Placeholder for AI voice assistant
  const handleVoiceCommand = (command: string) => {
    // TODO: Integrate with AI voice backend
    alert(`AI Command: ${command}`);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Simulate upload and minting
  const handleMint = async () => {
    setMinting(true);
    setUploadProgress(0);
    // Simulate upload progress
    for (let i = 1; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      setUploadProgress(i);
    }
    setMinting(false);
    setMinted(true);
  };

  return (
    <Card className="bg-brand-surface border-brand-primary/20 p-6 max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-400" />
          Bulk Data Dump Capsule
        </CardTitle>
        <p className="text-brand-text-muted mt-2">
          Upload all your phone images and videos, mint them as NFTs for permanent recall, and control sharing and AI-powered organization.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="ai">AI Assist</TabsTrigger>
            <TabsTrigger value="share">Share & Mint</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="space-y-4">
              <Input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
              <div className="flex flex-wrap gap-2 mt-2">
                {files.map((file, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {file.type.startsWith('image') ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {file.name}
                  </Badge>
                ))}
              </div>
              {minting && <Progress value={uploadProgress} className="h-2 mt-2" />}
              {minted && <div className="flex items-center gap-2 text-green-500 mt-2"><CheckCircle /> Minted successfully!</div>}
            </div>
          </TabsContent>

          {/* AI Assist Tab */}
          <TabsContent value="ai">
            <div className="space-y-4">
              <Button onClick={() => setAiActive(!aiActive)} variant={aiActive ? "default" : "outline"}>
                <Microphone className="w-4 h-4 mr-2" /> {aiActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
              </Button>
              {aiActive && (
                <div className="mt-2 p-3 bg-brand-surface rounded-lg border border-brand-primary/20">
                  <p className="text-sm text-brand-text-muted mb-2">Say commands like "Recall all Paris 2023 photos", "Remix my birthday videos", "Organize by location", "Edit last video".</p>
                  <Button size="sm" onClick={() => handleVoiceCommand('Recall all Paris 2023 photos')} className="mr-2">Recall Paris 2023</Button>
                  <Button size="sm" onClick={() => handleVoiceCommand('Remix my birthday videos')}>Remix Birthday Videos</Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Share & Mint Tab */}
          <TabsContent value="share">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Share With</label>
                <Input type="text" placeholder="Enter wallet address, email, or group name" value={shareSettings.shareWith} onChange={e => setShareSettings(s => ({ ...s, shareWith: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Share When</label>
                <select className="p-2 rounded border" value={shareSettings.shareWhen} onChange={e => setShareSettings(s => ({ ...s, shareWhen: e.target.value }))}>
                  <option value="immediate">Immediately</option>
                  <option value="scheduled">Schedule (set date/time)</option>
                  <option value="on-unlock">On Capsule Unlock</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Share How</label>
                <select className="p-2 rounded border" value={shareSettings.shareHow} onChange={e => setShareSettings(s => ({ ...s, shareHow: e.target.value }))}>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="group">Group Only</option>
                </select>
              </div>
              <Button onClick={handleMint} disabled={minting || files.length === 0} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-4">
                <Zap className="w-4 h-4 mr-2" /> Mint as NFT Capsule
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
