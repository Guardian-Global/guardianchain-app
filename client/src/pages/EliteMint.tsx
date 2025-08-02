import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Shield, 
  Lock, 
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { EliteHero } from '@/components/ui/elite-hero';
import { EliteCard, EliteCardContent, EliteCardHeader } from '@/components/ui/elite-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CapsuleFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  privacy: 'public' | 'private' | 'timed';
  unlockDate?: string;
  allowedViewers?: string[];
  truthVerification: boolean;
  blockchainSeal: boolean;
  files: File[];
}

const categories = [
  { value: 'personal', label: 'Personal Memory', icon: Users },
  { value: 'whistleblower', label: 'Whistleblower', icon: AlertCircle },
  { value: 'research', label: 'Research', icon: FileText },
  { value: 'testimony', label: 'Testimony', icon: Shield },
  { value: 'legacy', label: 'Legacy', icon: Clock },
  { value: 'creative', label: 'Creative Work', icon: Sparkles },
];

const privacyOptions = [
  { 
    value: 'public', 
    label: 'Public', 
    description: 'Visible to everyone on GuardianChain',
    icon: Globe 
  },
  { 
    value: 'private', 
    label: 'Private', 
    description: 'Only visible to you and specified viewers',
    icon: Lock 
  },
  { 
    value: 'timed', 
    label: 'Time-Locked', 
    description: 'Automatically unlocks at a future date',
    icon: Calendar 
  },
];

export default function EliteMint() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    description: '',
    content: '',
    category: '',
    privacy: 'private',
    truthVerification: true,
    blockchainSeal: true,
    files: []
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CapsuleFormData) => {
      // Simulate API call
      const response = await fetch('/api/capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Capsule Created Successfully",
        description: "Your truth capsule has been minted and secured on the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/capsules'] });
      // Reset form or redirect
    },
    onError: (error) => {
      toast({
        title: "Error Creating Capsule",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    return FileText;
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <EliteCard>
              <EliteCardHeader>
                <h3 className="text-xl font-semibold text-white">Basic Information</h3>
                <p className="text-gray-400">Define your capsule's core details</p>
              </EliteCardHeader>
              <EliteCardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Capsule Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a descriptive title..."
                    className="mt-2 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this capsule contains..."
                    rows={3}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </EliteCardContent>
            </EliteCard>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <EliteCard>
              <EliteCardHeader>
                <h3 className="text-xl font-semibold text-white">Content & Media</h3>
                <p className="text-gray-400">Add your content and supporting files</p>
              </EliteCardHeader>
              <EliteCardContent className="space-y-4">
                <div>
                  <Label htmlFor="content" className="text-white">Capsule Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter the main content of your truth capsule..."
                    rows={6}
                    className="mt-2 bg-white/5 border-white/10 text-white"
                  />
                </div>

                {/* File Upload Area */}
                <div>
                  <Label className="text-white">Supporting Files</Label>
                  <div
                    className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                      dragActive 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white mb-2">Drag and drop files here, or</p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      Browse Files
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Supports images, videos, documents, and audio files
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {formData.files.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Uploaded Files</Label>
                    {formData.files.map((file, index) => {
                      const Icon = getFileIcon(file);
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                          <Icon className="h-5 w-5 text-yellow-400" />
                          <span className="text-white flex-1">{file.name}</span>
                          <span className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              files: prev.files.filter((_, i) => i !== index)
                            }))}
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    })}
                    {uploadProgress < 100 && (
                      <Progress value={uploadProgress} className="mt-2" />
                    )}
                  </div>
                )}
              </EliteCardContent>
            </EliteCard>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <EliteCard>
              <EliteCardHeader>
                <h3 className="text-xl font-semibold text-white">Privacy & Access</h3>
                <p className="text-gray-400">Configure who can access your capsule</p>
              </EliteCardHeader>
              <EliteCardContent className="space-y-6">
                {/* Privacy Options */}
                <div className="space-y-4">
                  <Label className="text-white">Privacy Level</Label>
                  {privacyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          formData.privacy === option.value
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, privacy: option.value as any }))}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="h-5 w-5 text-yellow-400 mt-1" />
                          <div>
                            <h4 className="text-white font-medium">{option.label}</h4>
                            <p className="text-gray-400 text-sm">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Unlock Date for Timed Privacy */}
                {formData.privacy === 'timed' && (
                  <div>
                    <Label htmlFor="unlock-date" className="text-white">Unlock Date</Label>
                    <Input
                      id="unlock-date"
                      type="datetime-local"
                      value={formData.unlockDate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, unlockDate: e.target.value }))}
                      className="mt-2 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                )}

                {/* Verification Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Truth Verification</Label>
                      <p className="text-gray-400 text-sm">Enable AI-powered content verification</p>
                    </div>
                    <Switch
                      checked={formData.truthVerification}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, truthVerification: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Blockchain Seal</Label>
                      <p className="text-gray-400 text-sm">Immutable blockchain timestamp and hash</p>
                    </div>
                    <Switch
                      checked={formData.blockchainSeal}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, blockchainSeal: checked }))}
                    />
                  </div>
                </div>
              </EliteCardContent>
            </EliteCard>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <EliteCard>
              <EliteCardHeader>
                <h3 className="text-xl font-semibold text-white">Review & Mint</h3>
                <p className="text-gray-400">Confirm your capsule details before minting</p>
              </EliteCardHeader>
              <EliteCardContent className="space-y-6">
                {/* Summary */}
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h4 className="text-white font-medium mb-2">{formData.title}</h4>
                    <p className="text-gray-400 text-sm mb-3">{formData.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{formData.category}</Badge>
                      <Badge variant="outline">{formData.privacy}</Badge>
                      {formData.truthVerification && <Badge variant="default">Verified</Badge>}
                      {formData.blockchainSeal && <Badge variant="default">Sealed</Badge>}
                    </div>
                  </div>

                  {formData.files.length > 0 && (
                    <div>
                      <h5 className="text-white font-medium mb-2">Attached Files ({formData.files.length})</h5>
                      <div className="space-y-1">
                        {formData.files.map((file, index) => (
                          <div key={index} className="text-gray-400 text-sm">
                            • {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Minting Cost */}
                <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                    <h5 className="text-white font-medium">Minting Cost</h5>
                  </div>
                  <p className="text-gray-300 text-sm">
                    0.1 ETH + Gas fees • Includes verification, encryption, and blockchain sealing
                  </p>
                </div>

                {/* Final Action */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold"
                  onClick={() => createCapsuleMutation.mutate(formData)}
                  disabled={createCapsuleMutation.isPending}
                >
                  {createCapsuleMutation.isPending ? (
                    <>Creating Capsule...</>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Mint Truth Capsule
                    </>
                  )}
                </Button>
              </EliteCardContent>
            </EliteCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <EliteLayout>
      <EliteHero
        title="Mint Truth Capsule"
        subtitle="Preserve Your Truth Forever"
        description="Create immutable, verifiable records with blockchain security, AI verification, and sovereign control over your digital legacy."
        badge="Blockchain Secured"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                    step <= currentStep
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-200 ${
                      step < currentStep ? 'bg-yellow-400' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'text-yellow-400' : 'text-gray-400'}>
              Basic Info
            </span>
            <span className={currentStep >= 2 ? 'text-yellow-400' : 'text-gray-400'}>
              Content
            </span>
            <span className={currentStep >= 3 ? 'text-yellow-400' : 'text-gray-400'}>
              Privacy
            </span>
            <span className={currentStep >= 4 ? 'text-yellow-400' : 'text-gray-400'}>
              Review
            </span>
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            Previous
          </Button>
          
          {currentStep < 4 && (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold"
              disabled={
                (currentStep === 1 && (!formData.title || !formData.description || !formData.category)) ||
                (currentStep === 2 && !formData.content)
              }
            >
              Next Step
            </Button>
          )}
        </div>
      </div>
    </EliteLayout>
  );
}