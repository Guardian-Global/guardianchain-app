import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Upload, 
  Clock, 
  Shield, 
  Zap,
  FileText,
  Image,
  Video,
  Mic
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CapsuleFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  timelock?: Date;
  verificationLevel: 'basic' | 'enhanced' | 'professional';
  mediaFiles: File[];
}

export default function CreateCapsulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    content: '',
    category: 'personal',
    tags: [],
    verificationLevel: 'basic',
    mediaFiles: []
  });
  const [currentTag, setCurrentTag] = useState('');

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CapsuleFormData) => {
      return apiRequest('POST', '/api/capsules/create', data);
    },
    onSuccess: () => {
      toast({
        title: 'Capsule Created',
        description: 'Your truth capsule has been sealed and added to the vault.',
      });
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        tags: [],
        verificationLevel: 'basic',
        mediaFiles: []
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation Failed',
        description: 'There was an error creating your capsule. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast({
        title: 'Incomplete Form',
        description: 'Please provide both a title and content for your capsule.',
        variant: 'destructive',
      });
      return;
    }

    createCapsuleMutation.mutate(formData);
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const categories = [
    { value: 'personal', label: 'Personal Memory', icon: FileText },
    { value: 'family', label: 'Family Legacy', icon: Shield },
    { value: 'professional', label: 'Professional', icon: Zap },
    { value: 'historical', label: 'Historical Record', icon: Clock },
    { value: 'creative', label: 'Creative Work', icon: Image }
  ];

  const verificationLevels = [
    {
      value: 'basic',
      label: 'Basic Verification',
      description: 'Standard blockchain sealing and timestamp',
      cost: 'Free'
    },
    {
      value: 'enhanced',
      label: 'Enhanced Verification',
      description: 'AI content analysis and community validation',
      cost: '10 GTT'
    },
    {
      value: 'professional',
      label: 'Professional Verification',
      description: 'Full audit trail with legal attestation',
      cost: '50 GTT'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Create Truth Capsule
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Preserve your memories, thoughts, and experiences in an immutable blockchain capsule.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capsule Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your capsule a memorable title"
                  className="w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.category === category.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    >
                      <div className="flex items-center">
                        <category.icon className="w-5 h-5 mr-2 text-blue-500" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capsule Content *
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your story, memory, or message..."
                  rows={8}
                  className="w-full"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Verification Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {verificationLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.verificationLevel === level.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, verificationLevel: level.value as any }))}
                  >
                    <h3 className="font-semibold mb-2">{level.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {level.description}
                    </p>
                    <Badge variant="outline">{level.cost}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Media Attachments (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <Image className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                    <Mic className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports images, videos, audio files up to 100MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Lock (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Time Lock (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set a future date when this capsule should be automatically revealed
                </p>
                <Input
                  type="datetime-local"
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    timelock: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                  className="w-full md:w-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={createCapsuleMutation.isPending}
              size="lg"
              className="px-8 py-3"
            >
              {createCapsuleMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Creating Capsule...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Seal Truth Capsule
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}