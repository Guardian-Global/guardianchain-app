// client/src/pages/submit.tsx
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserCapsules } from '@/hooks/useUserCapsules';
import { useNavigate } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Eye, Lock, Users, DollarSign } from 'lucide-react';

const SubmitCapsulePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { createCapsule } = useUserCapsules();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public' | 'friends' | 'unlockable'>('private');
  const [griefScore, setGriefScore] = useState<number | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setMediaFile(file);
    }
  };

  const estimateGriefScore = () => {
    // Simple AI grief score estimation based on content
    const contentLength = content.length + description.length;
    const emotionalWords = ['loss', 'grief', 'memory', 'love', 'miss', 'remember', 'gone', 'forever'].length;
    const score = Math.min(100, Math.max(0, Math.floor((contentLength / 100) * 0.3 + emotionalWords * 15 + Math.random() * 20)));
    setGriefScore(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a capsule",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide both a title and content for your capsule",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Create form data for file upload if media is included
      let mediaUrl = null;
      if (mediaFile) {
        const formData = new FormData();
        formData.append('file', mediaFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          mediaUrl = uploadResult.url;
        }
      }

      // Create the capsule
      const capsuleData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        visibility,
        grief_score: griefScore,
        media_url: mediaUrl,
      };

      await createCapsule(capsuleData);

      toast({
        title: "Capsule submitted successfully",
        description: "Your memory capsule has been created and saved",
      });

      // Navigate to vault page
      navigate('/vault');
    } catch (error) {
      console.error('Error submitting capsule:', error);
      toast({
        title: "Submission failed",
        description: "There was an error creating your capsule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const visibilityOptions = [
    { value: 'private', label: 'Private', icon: Lock, description: 'Only visible to you' },
    { value: 'public', label: 'Public', icon: Eye, description: 'Visible to everyone' },
    { value: 'friends', label: 'Friends Only', icon: Users, description: 'Visible to your connections' },
    { value: 'unlockable', label: 'Unlockable', icon: DollarSign, description: 'Requires payment to view' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Submit Memory Capsule
          </CardTitle>
          <CardDescription>
            Create a new digital memory capsule to preserve your thoughts, experiences, and precious moments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Give your capsule a meaningful title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this memory capsule"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Share your memory, thoughts, or story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                data-testid="textarea-content"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Media Upload</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Upload an image or video
                    </span>
                    <input
                      id="media-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      data-testid="input-media"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, MP4 up to 10MB</p>
                </div>
                {mediaFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {mediaFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger data-testid="select-visibility">
                  <SelectValue placeholder="Choose visibility setting" />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="grief-score">Emotional Intensity (0-100)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={estimateGriefScore}
                  data-testid="button-estimate-grief"
                >
                  Auto Estimate
                </Button>
              </div>
              <Input
                id="grief-score"
                type="number"
                min="0"
                max="100"
                placeholder="Optional emotional intensity score"
                value={griefScore ?? ''}
                onChange={(e) => setGriefScore(e.target.value ? Number(e.target.value) : null)}
                data-testid="input-grief-score"
              />
              <p className="text-xs text-gray-500">
                Higher scores indicate more emotionally significant content
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting || !title.trim() || !content.trim()}
              className="w-full"
              data-testid="button-submit-capsule"
            >
              {submitting ? 'Submitting...' : 'Create Memory Capsule'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitCapsulePage;