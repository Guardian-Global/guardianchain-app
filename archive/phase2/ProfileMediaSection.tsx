import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Grid3X3
} from "lucide-react";
import MediaUploader from "./MediaUploader";
import MediaGallery from "./MediaGallery";

interface ProfileMediaSectionProps {
  userId: string;
}

export default function ProfileMediaSection({ userId }: ProfileMediaSectionProps) {
  const [activeTab, setActiveTab] = useState("gallery");

  const handleUploadComplete = () => {
    // Switch to gallery tab after successful upload
    setActiveTab("gallery");
  };

  return (
    <Card className="bg-brand-secondary border-brand-surface">
      <CardHeader>
        <CardTitle className="text-brand-light flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Media & Gallery
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-brand-surface">
            <TabsTrigger 
              value="gallery" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="gallery-tab"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-brand-dark"
              data-testid="upload-tab"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-4">
            <MediaGallery 
              userId={userId} 
              selectable={false}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <MediaUploader 
              userId={userId}
              onUploadComplete={handleUploadComplete}
              maxFiles={20}
              acceptedTypes={['image/*', 'video/*']}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}