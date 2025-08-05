import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import CapsuleMediaPicker from "./CapsuleMediaPicker";
import { FileText, Image, Video, Save } from "lucide-react";

interface MediaFile {
  id: string;
  type: string;
  url: string;
  title: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  isPublic: boolean;
}

interface CapsuleCreationExampleProps {
  userId: string;
}

export default function CapsuleCreationExample({ userId }: CapsuleCreationExampleProps) {
  const [capsuleData, setCapsuleData] = useState({
    title: "",
    content: "",
    category: "testimony",
    tags: ""
  });
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const { toast } = useToast();

  const handleMediaSelect = (mediaFile: MediaFile) => {
    setSelectedMedia(prev => {
      const isAlreadySelected = prev.some(item => item.id === mediaFile.id);
      if (isAlreadySelected) {
        return prev.filter(item => item.id !== mediaFile.id);
      }
      return [...prev, mediaFile];
    });
  };

  const removeMedia = (mediaId: string) => {
    setSelectedMedia(prev => prev.filter(item => item.id !== mediaId));
  };

  const handleSubmit = async () => {
    if (!capsuleData.title || !capsuleData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your capsule.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally submit to your capsule creation API
    const capsulePayload = {
      ...capsuleData,
      mediaAttachments: selectedMedia.map(media => ({
        id: media.id,
        url: media.url,
        type: media.type,
        title: media.title
      })),
      createdAt: new Date().toISOString()
    };

    console.log("Creating capsule with payload:", capsulePayload);

    toast({
      title: "Capsule Created",
      description: `Your truth capsule "${capsuleData.title}" has been created with ${selectedMedia.length} media attachments.`,
    });

    // Reset form
    setCapsuleData({ title: "", content: "", category: "testimony", tags: "" });
    setSelectedMedia([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Create Truth Capsule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Capsule Title</Label>
            <Input
              id="title"
              value={capsuleData.title}
              onChange={(e) => setCapsuleData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive title for your truth capsule..."
              data-testid="input-capsule-title"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={capsuleData.content}
              onChange={(e) => setCapsuleData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your truth, testimony, or important information..."
              rows={6}
              data-testid="textarea-capsule-content"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={capsuleData.tags}
              onChange={(e) => setCapsuleData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="truth, testimony, evidence, whistleblowing..."
              data-testid="input-capsule-tags"
            />
          </div>

          {/* Media Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Media Attachments</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMediaPicker(!showMediaPicker)}
                data-testid="button-toggle-media-picker"
              >
                {showMediaPicker ? "Hide" : "Add"} Media
                <Image className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Selected media preview */}
            {selectedMedia.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium mb-3">
                  Selected Media ({selectedMedia.length}/5):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedia.map((media) => (
                    <Badge
                      key={media.id}
                      variant="secondary"
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => removeMedia(media.id)}
                      data-testid={`badge-selected-media-${media.id}`}
                    >
                      {media.type === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <Image className="w-3 h-3" />
                      )}
                      <span>{media.title}</span>
                      <span>×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              data-testid="button-create-capsule"
            >
              <Save className="w-4 h-4 mr-2" />
              Create Capsule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Picker Section */}
      {showMediaPicker && (
        <CapsuleMediaPicker
          userId={userId}
          onSelect={handleMediaSelect}
          selectedMedia={selectedMedia}
          maxSelections={5}
          allowUpload={true}
        />
      )}
    </div>
  );
}