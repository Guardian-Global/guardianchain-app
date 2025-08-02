import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MediaUploaderProps {
  uploadType: "profile_image" | "profile_video" | "background" | "general";
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  onUploadComplete?: (uploadedFiles: any[]) => void;
  buttonClassName?: string;
  children: ReactNode;
}

/**
 * Enhanced media uploader component with object storage integration
 * Supports various upload types with automatic categorization and NFT minting
 */
export function MediaUploader({
  uploadType,
  maxNumberOfFiles = 1,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes = ["image/*", "video/*", "audio/*", ".pdf", ".doc", ".docx"],
  onUploadComplete,
  buttonClassName = "",
  children,
}: MediaUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: acceptedFileTypes,
      },
      autoProceed: false,
      debug: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          try {
            // Get upload URL from our backend
            const response = await fetch('/api/media/upload-url', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                uploadType,
                fileSize: file.size,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to get upload URL');
            }

            const { uploadURL } = await response.json();
            
            return {
              method: 'PUT',
              url: uploadURL,
              headers: {
                'Content-Type': file.type,
              },
            };
          } catch (error) {
            console.error('Error getting upload parameters:', error);
            toast({
              title: "Upload Error",
              description: "Failed to prepare file upload. Please try again.",
              variant: "destructive",
            });
            throw error;
          }
        },
      })
      .on('upload-success', async (file, response) => {
        try {
          // Notify backend that upload is complete
          const completeResponse = await fetch('/api/media/upload-complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mediaUrl: response.uploadURL,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              uploadType,
            }),
          });

          if (!completeResponse.ok) {
            throw new Error('Failed to complete upload process');
          }

          const result = await completeResponse.json();
          
          // Store normalized URL for the file
          file.uploadURL = result.mediaUrl;
          
          toast({
            title: "Upload Successful",
            description: `${file.name} has been uploaded successfully.`,
          });
        } catch (error) {
          console.error('Error completing upload:', error);
          toast({
            title: "Upload Warning", 
            description: "File uploaded but processing failed. Please refresh and try again.",
            variant: "destructive",
          });
        }
      })
      .on('complete', (result) => {
        if (result.successful.length > 0) {
          const uploadedFiles = result.successful.map(file => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.uploadURL,
            uploadType,
          }));

          onUploadComplete?.(uploadedFiles);
          setShowModal(false);
          
          toast({
            title: "All Files Uploaded",
            description: `Successfully uploaded ${result.successful.length} file(s).`,
          });
        }

        if (result.failed.length > 0) {
          toast({
            title: "Upload Failed",
            description: `${result.failed.length} file(s) failed to upload.`,
            variant: "destructive",
          });
        }
      })
      .on('error', (error) => {
        console.error('Uppy error:', error);
        toast({
          title: "Upload Error",
          description: "An error occurred during upload. Please try again.",
          variant: "destructive",
        });
      })
  );

  const getUploadTypeLabel = () => {
    switch (uploadType) {
      case 'profile_image':
        return 'Profile Image';
      case 'profile_video':
        return 'Profile Video';
      case 'background':
        return 'Background Image';
      case 'general':
        return 'Media Files';
      default:
        return 'Files';
    }
  };

  const getUploadTypeDescription = () => {
    switch (uploadType) {
      case 'profile_image':
        return 'Upload a profile photo that represents you';
      case 'profile_video':
        return 'Upload a short video loop for your profile';
      case 'background':
        return 'Upload a background image for your profile';
      case 'general':
        return 'Upload any media files - they will be automatically organized as capsules';
      default:
        return 'Upload files to your vault';
    }
  };

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
        variant="outline"
      >
        {children}
      </Button>

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        plugins={['Dashboard']}
        metaFields={[]}
        showProgressDetails={true}
        hideUploadButton={false}
        hideRetryButton={false}
        hidePauseResumeButton={false}
        hideCancelButton={false}
        hideProgressAfterFinish={false}
        note={getUploadTypeDescription()}
        height={350}
        theme="auto"
        browserBackButtonClose={true}
        locale={{
          strings: {
            browseFilesTitle: `Select ${getUploadTypeLabel()}`,
            browseFiles: `Browse ${getUploadTypeLabel()}`,
            dropFilesHere: `Drop ${getUploadTypeLabel().toLowerCase()} here`,
          }
        }}
      />
    </div>
  );
}