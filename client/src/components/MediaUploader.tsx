import { useState } from "react";
import type { ReactNode } from "react";
import type { NFTMintRequest } from "@/hooks/useNFT";
import { RarityTier } from "@/hooks/useNFT";
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
  onUploadComplete?: (uploadedFiles: any[], mintOptions?: NFTMintRequest) => void;
  buttonClassName?: string;
  children: ReactNode;
  enableNFTMinting?: boolean;
}

/**
 * Enhanced media uploader component with object storage integration
 * Supports various upload types with automatic categorization and NFT minting
 */
export function MediaUploader({
  uploadType,
  maxNumberOfFiles = 1,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes = [
    "image/*",
    "video/*",
    "audio/*",
    ".pdf",
    ".doc",
    ".docx",
  ],
  onUploadComplete,
  buttonClassName = "",
  children,
  enableNFTMinting = false,
}: MediaUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  // NFT minting options state
  const [mintOptions, setMintOptions] = useState<NFTMintRequest>({});

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
            const response = await fetch("/api/media/upload-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                uploadType,
                fileSize: file.size,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to get upload URL");
            }

            const { uploadURL } = await response.json();

            return {
              method: "PUT",
              url: uploadURL,
              headers: {
                "Content-Type": file.type,
              },
            };
          } catch (error) {
            console.error("Error getting upload parameters:", error);
            toast({
              title: "Upload Error",
              description: "Failed to prepare file upload. Please try again.",
              variant: "destructive",
            });
            throw error;
          }
        },
      })
  .on("upload-success", async (file, response) => {
        try {
          if (!file) return;
          // Notify backend that upload is complete
          const completeResponse = await fetch("/api/media/upload-complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
            throw new Error("Failed to complete upload process");
          }

          const result = await completeResponse.json();

          // Store normalized URL for the file
          (file as any).uploadURL = result.mediaUrl;

          toast({
            title: "Upload Successful",
            description: `${file.name} has been uploaded successfully.`,
          });
        } catch (error) {
          console.error("Error completing upload:", error);
          toast({
            title: "Upload Warning",
            description:
              "File uploaded but processing failed. Please refresh and try again.",
            variant: "destructive",
          });
        }
      })
      .on("complete", (result) => {
        if (result.successful && result.successful.length > 0) {
          const uploadedFiles = result.successful.map((file) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: (file as any).uploadURL,
            uploadType,
          }));

          onUploadComplete?.(uploadedFiles, enableNFTMinting ? mintOptions : undefined);
          setShowModal(false);

          toast({
            title: "All Files Uploaded",
            description: `Successfully uploaded ${result.successful.length} file(s).`,
          });
        }

        if (result.failed && result.failed.length > 0) {
          toast({
            title: "Upload Failed",
            description: `${result.failed.length} file(s) failed to upload.`,
            variant: "destructive",
          });
        }
      })
      .on("error", (error) => {
        console.error("Uppy error:", error);
        toast({
          title: "Upload Error",
          description: "An error occurred during upload. Please try again.",
          variant: "destructive",
        });
      }),
  );

  const getUploadTypeLabel = () => {
    switch (uploadType) {
      case "profile_image":
        return "Profile Image";
      case "profile_video":
        return "Profile Video";
      case "background":
        return "Background Image";
      case "general":
        return "Media Files";
      default:
        return "Files";
    }
  };

  const getUploadTypeDescription = () => {
    switch (uploadType) {
      case "profile_image":
        return "Upload a profile photo that represents you";
      case "profile_video":
        return "Upload a short video loop for your profile";
      case "background":
        return "Upload a background image for your profile";
      case "general":
        return "Upload any media files - they will be automatically organized as capsules";
      default:
        return "Upload files to your vault";
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

      {enableNFTMinting && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2">NFT Minting Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rarity</label>
              <select
                className="w-full p-2 rounded border"
                value={mintOptions.rarity || ''}
                onChange={e => setMintOptions({ ...mintOptions, rarity: e.target.value as RarityTier })}
              >
                <option value="">Select Rarity</option>
                {Object.values(RarityTier).map((rarity) => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">APY Boost (basis points)</label>
              <input
                type="number"
                className="w-full p-2 rounded border"
                value={mintOptions.boostedAPY || ''}
                onChange={e => setMintOptions({ ...mintOptions, boostedAPY: Number(e.target.value) })}
                min={0}
                max={10000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Staking Multiplier (basis points)</label>
              <input
                type="number"
                className="w-full p-2 rounded border"
                value={mintOptions.stakingMultiplier || ''}
                onChange={e => setMintOptions({ ...mintOptions, stakingMultiplier: Number(e.target.value) })}
                min={0}
                max={10000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tier Name</label>
              <input
                type="text"
                className="w-full p-2 rounded border"
                value={mintOptions.tierName || ''}
                onChange={e => setMintOptions({ ...mintOptions, tierName: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="earlyDAOAccess"
                checked={!!mintOptions.earlyDAOAccess}
                onChange={e => setMintOptions({ ...mintOptions, earlyDAOAccess: e.target.checked })}
              />
              <label htmlFor="earlyDAOAccess" className="text-sm">Early DAO Access</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Custom Metadata (JSON)</label>
              <textarea
                className="w-full p-2 rounded border font-mono"
                rows={3}
                value={mintOptions.metadata ? JSON.stringify(mintOptions.metadata, null, 2) : ''}
                onChange={e => {
                  try {
                    setMintOptions({ ...mintOptions, metadata: JSON.parse(e.target.value) });
                  } catch {
                    // Ignore parse errors for now
                  }
                }}
                placeholder={'{\n  "key": "value"\n}'}
              />
            </div>
          </div>
        </div>
      )}

      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        plugins={["Dashboard"]}
        metaFields={[]}
        showProgressDetails={true}
        hideUploadButton={false}
        hideRetryButton={false}
        hidePauseResumeButton={false}
        hideCancelButton={false}
        hideProgressAfterFinish={false}
        note={getUploadTypeDescription()}
  // height prop removed (not supported by DashboardModal)
        theme="auto"
        browserBackButtonClose={true}
        locale={{
          strings: {
            browseFiles: `Browse ${getUploadTypeLabel()}`,
          },
        }}
      />
    </div>
  );
}
