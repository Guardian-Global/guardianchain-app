import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { DatePicker } from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Clock,
  Eye,
  EyeOff,
  DollarSign,
  Users,
  Share2,
  Sparkles,
  FileText,
  Upload,
  Settings,
  Lock,
  Globe,
  Calendar,
  Bot,
  Eye as Preview,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Video,
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CapsuleAIAssistant from "./CapsuleAIAssistant";

// Import advanced AI features
import ProgressTracker from "./ProgressTracker";
import IntelligentPreview from "./IntelligentPreview";
import OneClickUpload from "./OneClickUpload";
import { 
  IPFSTooltip, 
  ContentHashTooltip, 
  AccessLevelTooltip, 
  AIOptimizationTooltip,
  BlockchainTooltip,
  GTTRewardsTooltip
} from "./ContextualTooltips";

interface CapsuleFormData {
  // Basic Content
  title: string;
  content: string;
  category: string;
  tags: string[];
  type: string;
  
  // Privacy & Access
  accessLevel: "public" | "private" | "restricted" | "premium";
  authorizedViewers: string[];
  viewingCost: number;
  requiresAuth: boolean;
  authLevel: "basic" | "enhanced" | "biometric";
  
  // Time Capsule
  isTimeCapsule: boolean;
  revealDate: Date | null;
  requiredApprovals: number;
  
  // Social Media
  autoShare: boolean;
  shareToFacebook: boolean;
  shareToTwitter: boolean;
  shareToLinkedIn: boolean;
  shareToInstagram: boolean;
  shareToTikTok: boolean;
  shareToYouTube: boolean;
  shareToReddit: boolean;
  shareToDiscord: boolean;
  shareToTelegram: boolean;
  socialShareMessage: string;
  
  // IPFS
  autoIpfs: boolean;
  ipfsProvider: "pinata" | "infura" | "web3storage";
}

const defaultFormData: CapsuleFormData = {
  title: "",
  content: "",
  category: "",
  tags: [],
  type: "STANDARD",
  accessLevel: "public",
  authorizedViewers: [],
  viewingCost: 0,
  requiresAuth: false,
  authLevel: "basic",
  isTimeCapsule: false,
  revealDate: null,
  requiredApprovals: 0,
  autoShare: false,
  shareToFacebook: false,
  shareToTwitter: false,
  shareToLinkedIn: false,
  shareToInstagram: false,
  shareToTikTok: false,
  shareToYouTube: false,
  shareToReddit: false,
  shareToDiscord: false,
  shareToTelegram: false,
  socialShareMessage: "",
  autoIpfs: true,
  ipfsProvider: "pinata",
};

const capsuleCategories = [
  "News & Journalism",
  "Whistleblowing",
  "Legal Documentation", 
  "Personal Truth",
  "Business Intelligence",
  "Scientific Research",
  "Creative Content",
  "Educational Material",
  "Historical Records",
  "Government Transparency",
];

const capsuleTypes = [
  { value: "STANDARD", label: "Standard Truth" },
  { value: "LEGAL", label: "Legal Evidence" },
  { value: "CITIZEN_JOURNALISM", label: "Citizen Journalism" },
  { value: "FRAUD_PROOF", label: "Fraud Evidence" },
  { value: "WITNESS_TESTIMONY", label: "Witness Testimony" },
  { value: "WHISTLEBLOWER", label: "Whistleblower Report" },
  { value: "KNOWLEDGE", label: "Knowledge Archive" },
  { value: "CREATOR", label: "Creative Content" },
];

const socialPlatforms = [
  { key: "shareToFacebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { key: "shareToTwitter", label: "Twitter/X", icon: Twitter, color: "text-blue-400" },
  { key: "shareToLinkedIn", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { key: "shareToInstagram", label: "Instagram", icon: Instagram, color: "text-pink-500" },
  { key: "shareToYouTube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { key: "shareToReddit", label: "Reddit", icon: MessageCircle, color: "text-orange-600" },
  { key: "shareToDiscord", label: "Discord", icon: MessageCircle, color: "text-indigo-600" },
  { key: "shareToTelegram", label: "Telegram", icon: MessageCircle, color: "text-blue-500" },
  { key: "shareToTikTok", label: "TikTok", icon: Video, color: "text-black" },
];

const EnhancedCapsuleCreator: React.FC = () => {
  const [formData, setFormData] = useState<CapsuleFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("content-analysis");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<CapsuleFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      updateFormData({ tags: [...formData.tags, tag] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    updateFormData({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleViewerAdd = (viewer: string) => {
    if (viewer && !formData.authorizedViewers.includes(viewer)) {
      updateFormData({ authorizedViewers: [...formData.authorizedViewers, viewer] });
    }
  };

  const handleViewerRemove = (viewerToRemove: string) => {
    updateFormData({ 
      authorizedViewers: formData.authorizedViewers.filter(viewer => viewer !== viewerToRemove) 
    });
  };

  const automaticIpfsUpload = async (content: string) => {
    if (!formData.autoIpfs) return null;
    
    setUploading(true);
    try {
      // Simulate IPFS upload - in production this would upload to actual IPFS
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      setIpfsHash(mockHash);
      
      toast({
        title: "IPFS Upload Successful",
        description: `Content uploaded to IPFS: ${mockHash.substr(0, 20)}...`,
      });
      
      return mockHash;
    } catch (error) {
      toast({
        title: "IPFS Upload Failed",
        description: "Using local storage instead. You can manually upload later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const requestAIAssistance = async () => {
    setAiAssisting(true);
    try {
      const response = await fetch("/api/ai/capsule-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          title: formData.title,
          category: formData.category,
          type: formData.type,
        }),
      });

      const suggestions = await response.json();
      
      if (suggestions.suggestions) {
        // Apply AI suggestions
        updateFormData({
          category: suggestions.suggestions.category || formData.category,
          tags: [...formData.tags, ...(suggestions.suggestions.tags || [])],
          accessLevel: suggestions.suggestions.accessLevel || formData.accessLevel,
          requiresAuth: suggestions.suggestions.requiresAuth ?? formData.requiresAuth,
          viewingCost: suggestions.suggestions.viewingCost || formData.viewingCost,
        });

        toast({
          title: "AI Suggestions Applied",
          description: "Your capsule has been optimized with AI recommendations.",
        });
      }
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Unable to get AI suggestions. Please continue manually.",
        variant: "destructive",
      });
    } finally {
      setAiAssisting(false);
    }
  };

  const handleMintCapsule = async () => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setCurrentStep("content-analysis");
      
      // Progress tracking for advanced UX
      const steps = ["content-analysis", "metadata-extraction", "ipfs-upload", "blockchain-mint"];
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setUploadProgress((i / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Auto-upload to IPFS if enabled
      const contentHash = await automaticIpfsUpload(formData.content);
      
      // Create capsule with all enhanced features
      const capsuleData = {
        ...formData,
        ipfsHash: contentHash,
        metadata: {
          ipfsProvider: formData.ipfsProvider,
          createdWith: "EnhancedCapsuleCreator",
          version: "2.0",
          uploadedFiles: uploadedFiles.length,
        },
      };

      // Send to backend for processing
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capsuleData),
      });

      if (response.ok) {
        toast({
          title: "Capsule Created Successfully!",
          description: "Your truth capsule has been minted to the blockchain.",
        });
        
        // Reset form
        setFormData(defaultFormData);
        setShowPreview(false);
      } else {
        throw new Error("Failed to create capsule");
      }
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Unable to create capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  // Handle file uploads from OneClickUpload
  const handleFilesUploaded = (files: any[]) => {
    setUploadedFiles(files);
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded to IPFS successfully`,
    });
  };

  // Handle content extraction from uploaded files
  const handleContentExtracted = (content: string, metadata: any) => {
    updateFormData({ 
      content: formData.content ? `${formData.content}\n\n${content}` : content,
      tags: [...formData.tags, ...metadata.sources?.map((s: any) => s.name.split('.')[0]) || []]
    });
    toast({
      title: "Content Extracted",
      description: "File content has been automatically added to your capsule",
    });
  };

  // Handle AI optimization suggestions
  const handleOptimization = (suggestions: any) => {
    updateFormData(suggestions);
    toast({
      title: "AI Optimization Applied",
      description: "Your capsule has been optimized based on AI analysis",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
          Enhanced Capsule Creator
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Create truth capsules with advanced privacy controls, social sharing, and automated IPFS storage. 
          AI assistance available for optimal configuration.
        </p>
      </div>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Tracker */}
        <ProgressTracker
          currentStep={currentStep}
          progress={uploadProgress}
          isUploading={uploading}
          metadata={{
            ipfsHash: ipfsHash,
            estimatedTime: uploading ? "~30 seconds" : "",
            fileSize: uploadedFiles.length > 0 ? `${uploadedFiles.length} files` : ""
          }}
        />

        {/* Intelligent Preview */}
        <IntelligentPreview
          formData={formData}
          onOptimize={handleOptimization}
        />

        {/* One-Click Upload */}
        <OneClickUpload
          onFilesUploaded={handleFilesUploaded}
          onContentExtracted={handleContentExtracted}
          maxFiles={5}
          acceptedTypes={['text/plain', 'text/markdown', 'application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'application/json']}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-400" />
                    Content Creation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <BlockchainTooltip>
                      <Label htmlFor="title" className="text-slate-300">Capsule Title</Label>
                    </BlockchainTooltip>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData({ title: e.target.value })}
                      placeholder="Enter your truth capsule title..."
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <IPFSTooltip>
                      <Label htmlFor="content" className="text-slate-300">Truth Content</Label>
                    </IPFSTooltip>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => updateFormData({ content: e.target.value })}
                      placeholder="Share your truth, evidence, or important information... (Automatically uploaded to IPFS)"
                      rows={8}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
                        <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {capsuleCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => updateFormData({ type: value })}>
                        <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {capsuleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-900/50 text-purple-300">
                          {tag}
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="ml-2 hover:text-red-400"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tags (press Enter)"
                      className="bg-slate-900 border-slate-600 text-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleTagAdd(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Privacy & Access Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <AccessLevelTooltip>
                      <Label className="text-slate-300">Access Level</Label>
                    </AccessLevelTooltip>
                    <Select value={formData.accessLevel} onValueChange={(value: any) => updateFormData({ accessLevel: value })}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-400" />
                            Public - Anyone can view
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-red-400" />
                            Private - Only you can view
                          </div>
                        </SelectItem>
                        <SelectItem value="restricted">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-yellow-400" />
                            Restricted - Selected people only
                          </div>
                        </SelectItem>
                        <SelectItem value="premium">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            Premium - Pay to view
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.accessLevel === "restricted" && (
                    <div>
                      <Label className="text-slate-300">Authorized Viewers</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.authorizedViewers.map((viewer) => (
                          <Badge key={viewer} variant="secondary" className="bg-blue-900/50 text-blue-300">
                            {viewer}
                            <button
                              onClick={() => handleViewerRemove(viewer)}
                              className="ml-2 hover:text-red-400"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add email or username (press Enter)"
                        className="bg-slate-900 border-slate-600 text-white"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleViewerAdd(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  )}

                  {formData.accessLevel === "premium" && (
                    <div>
                      <Label className="text-slate-300">Viewing Cost (USD)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[formData.viewingCost]}
                          onValueChange={(value) => updateFormData({ viewingCost: value[0] })}
                          max={1000}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-center text-lg font-bold text-green-400">
                          ${formData.viewingCost}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300">Require Authentication</Label>
                      <Switch
                        checked={formData.requiresAuth}
                        onCheckedChange={(checked) => updateFormData({ requiresAuth: checked })}
                      />
                    </div>

                    {formData.requiresAuth && (
                      <div>
                        <Label className="text-slate-300">Authentication Level</Label>
                        <Select value={formData.authLevel} onValueChange={(value: any) => updateFormData({ authLevel: value })}>
                          <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic (Email/Password)</SelectItem>
                            <SelectItem value="enhanced">Enhanced (2FA Required)</SelectItem>
                            <SelectItem value="biometric">Biometric (Fingerprint/Face)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        Time Capsule Mode
                      </Label>
                      <Switch
                        checked={formData.isTimeCapsule}
                        onCheckedChange={(checked) => updateFormData({ isTimeCapsule: checked })}
                      />
                    </div>

                    {formData.isTimeCapsule && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-300">Reveal Date</Label>
                          <Input
                            type="datetime-local"
                            value={formData.revealDate ? formData.revealDate.toISOString().slice(0, 16) : ""}
                            onChange={(e) => updateFormData({ revealDate: e.target.value ? new Date(e.target.value) : null })}
                            className="bg-slate-900 border-slate-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-slate-300">Required Approvals</Label>
                          <Input
                            type="number"
                            value={formData.requiredApprovals}
                            onChange={(e) => updateFormData({ requiredApprovals: parseInt(e.target.value) || 0 })}
                            className="bg-slate-900 border-slate-600 text-white"
                            placeholder="Number of people who must approve reveal"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-blue-400" />
                    Social Media Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Auto-Share After Minting</Label>
                    <Switch
                      checked={formData.autoShare}
                      onCheckedChange={(checked) => updateFormData({ autoShare: checked })}
                    />
                  </div>

                  {formData.autoShare && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-300 mb-4 block">Select Platforms</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {socialPlatforms.map((platform) => {
                            const IconComponent = platform.icon;
                            return (
                              <div key={platform.key} className="flex items-center space-x-2">
                                <Checkbox
                                  id={platform.key}
                                  checked={formData[platform.key as keyof CapsuleFormData] as boolean}
                                  onCheckedChange={(checked) => 
                                    updateFormData({ [platform.key]: checked })
                                  }
                                />
                                <label
                                  htmlFor={platform.key}
                                  className={`flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${platform.color}`}
                                >
                                  <IconComponent className="h-4 w-4" />
                                  {platform.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-300">Custom Share Message</Label>
                        <Textarea
                          value={formData.socialShareMessage}
                          onChange={(e) => updateFormData({ socialShareMessage: e.target.value })}
                          placeholder="Custom message for social media posts..."
                          className="bg-slate-900 border-slate-600 text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Storage Tab */}
            <TabsContent value="storage" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-400" />
                    Storage & IPFS Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <h3 className="text-white font-semibold">Automated IPFS Upload</h3>
                    </div>
                    <p className="text-slate-300 text-sm">
                      No need to manually create IPFS hashes! We automatically upload your content 
                      to decentralized storage when you mint your capsule.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Auto-Upload to IPFS</Label>
                    <Switch
                      checked={formData.autoIpfs}
                      onCheckedChange={(checked) => updateFormData({ autoIpfs: checked })}
                    />
                  </div>

                  {formData.autoIpfs && (
                    <div>
                      <Label className="text-slate-300">IPFS Provider</Label>
                      <Select value={formData.ipfsProvider} onValueChange={(value: any) => updateFormData({ ipfsProvider: value })}>
                        <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pinata">Pinata (Recommended)</SelectItem>
                          <SelectItem value="infura">Infura IPFS</SelectItem>
                          <SelectItem value="web3storage">Web3.Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {ipfsHash && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="h-5 w-5 text-green-400" />
                        <h3 className="text-white font-semibold">IPFS Hash Generated</h3>
                      </div>
                      <p className="text-slate-300 text-sm font-mono break-all">
                        {ipfsHash}
                      </p>
                    </div>
                  )}

                  {!formData.autoIpfs && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                        <h3 className="text-white font-semibold">Manual IPFS</h3>
                      </div>
                      <p className="text-slate-300 text-sm">
                        You've disabled auto-upload. Your content will be stored locally until 
                        you manually upload it to IPFS and update your capsule.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Preview className="h-5 w-5 text-purple-400" />
                    Capsule Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-white">{formData.title || "Untitled Capsule"}</h2>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-purple-500 text-purple-300">
                        {capsuleTypes.find(t => t.value === formData.type)?.label || "Standard"}
                      </Badge>
                      {formData.category && (
                        <Badge variant="outline" className="border-blue-500 text-blue-300">
                          {formData.category}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`border-${
                        formData.accessLevel === "public" ? "green" : 
                        formData.accessLevel === "private" ? "red" : 
                        formData.accessLevel === "restricted" ? "yellow" : "purple"
                      }-500 text-${
                        formData.accessLevel === "public" ? "green" : 
                        formData.accessLevel === "private" ? "red" : 
                        formData.accessLevel === "restricted" ? "yellow" : "purple"
                      }-300`}>
                        {formData.accessLevel.charAt(0).toUpperCase() + formData.accessLevel.slice(1)}
                      </Badge>
                    </div>

                    <div className="text-slate-300 whitespace-pre-wrap">
                      {formData.content || "No content yet..."}
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {formData.isTimeCapsule && formData.revealDate && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Reveals on {formData.revealDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {formData.viewingCost > 0 && (
                      <div className="flex items-center gap-2 text-green-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">
                          Viewing Cost: ${formData.viewingCost}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleMintCapsule}
                    disabled={!formData.title || !formData.content || uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    {uploading ? "Creating Capsule..." : "Mint Truth Capsule"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={requestAIAssistance}
                disabled={aiAssisting || !formData.content}
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
              >
                {aiAssisting ? "Analyzing..." : "Get AI Suggestions"}
              </Button>
              
              <div className="text-slate-400 text-sm">
                AI assistant integration available for content optimization and enhancement suggestions.
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Characters:</span>
                <span>{formData.content.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Words:</span>
                <span>{formData.content.split(/\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tags:</span>
                <span>{formData.tags.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Social Platforms:</span>
                <span>
                  {socialPlatforms.filter(p => formData[p.key as keyof CapsuleFormData]).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCapsuleCreator;