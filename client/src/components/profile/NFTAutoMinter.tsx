import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Gem,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image,
  Video,
  FileText,
  Music,
  Star,
} from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadType: string;
}

interface NFTMintResult {
  success: boolean;
  tokenId?: string;
  transactionHash?: string;
  ipfsHash?: string;
  error?: string;
}

interface AutoMinterProps {
  mediaFiles: MediaFile[];
  onMintComplete?: (results: NFTMintResult[]) => void;
  autoMint?: boolean;
  className?: string;
}

export default function NFTAutoMinter({
  mediaFiles,
  onMintComplete,
  autoMint = true,
  className = "",
}: AutoMinterProps) {
  const [mintingStatus, setMintingStatus] = useState<Record<string, 'pending' | 'minting' | 'success' | 'error'>>({});
  const { toast } = useToast();

  // Auto-mint mutation
  const mintNFT = useMutation({
    mutationFn: async (file: MediaFile) => {
      return apiRequest('/api/nft/auto-mint', {
        method: 'POST',
        body: JSON.stringify({
          mediaUrl: file.url,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadType: file.uploadType,
          metadata: {
            name: `GuardianChain: ${file.name}`,
            description: `Permanently sealed on GuardianChain - ${getFileTypeDescription(file.type)}`,
            image: file.url,
            attributes: [
              {
                trait_type: "File Type",
                value: getFileCategory(file.type)
              },
              {
                trait_type: "Upload Type", 
                value: file.uploadType
              },
              {
                trait_type: "Size",
                value: formatFileSize(file.size)
              },
              {
                trait_type: "Preservation Date",
                value: new Date().toISOString().split('T')[0]
              }
            ]
          }
        }),
      });
    },
    onMutate: (file) => {
      setMintingStatus(prev => ({ ...prev, [file.id]: 'minting' }));
    },
    onSuccess: (result, file) => {
      setMintingStatus(prev => ({ ...prev, [file.id]: 'success' }));
      toast({
        title: "NFT Minted Successfully",
        description: `${file.name} has been minted as NFT #${result.tokenId}`,
      });
    },
    onError: (error, file) => {
      setMintingStatus(prev => ({ ...prev, [file.id]: 'error' }));
      toast({
        title: "Minting Failed",
        description: `Could not mint ${file.name} as NFT`,
        variant: "destructive",
      });
    },
  });

  // Batch mint all files
  const batchMint = async () => {
    const results: NFTMintResult[] = [];
    
    for (const file of mediaFiles) {
      if (mintingStatus[file.id] === 'success') continue;
      
      try {
        const result = await mintNFT.mutateAsync(file);
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    onMintComplete?.(results);
  };

  // Auto-mint when files are added
  if (autoMint && mediaFiles.length > 0) {
    mediaFiles.forEach(file => {
      if (!mintingStatus[file.id]) {
        setMintingStatus(prev => ({ ...prev, [file.id]: 'pending' }));
        mintNFT.mutate(file);
      }
    });
  }

  const getFileTypeDescription = (type: string): string => {
    if (type.startsWith('image/')) return 'Digital Image Preservation';
    if (type.startsWith('video/')) return 'Video Memory Capsule';
    if (type.startsWith('audio/')) return 'Audio Truth Testimony';
    if (type.includes('pdf') || type.includes('document')) return 'Document Legacy Archive';
    return 'Digital Asset Preservation';
  };

  const getFileCategory = (type: string): string => {
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf') || type.includes('document')) return 'Document';
    return 'Digital Asset';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    return FileText;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'minting':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'minting':
        return 'Minting NFT...';
      case 'success':
        return 'NFT Minted';
      case 'error':
        return 'Mint Failed';
      default:
        return 'Pending';
    }
  };

  if (mediaFiles.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="w-5 h-5" />
          NFT Auto-Minting
          {autoMint && (
            <Badge variant="secondary" className="ml-2">
              <Zap className="w-3 h-3 mr-1" />
              Auto-Enabled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mediaFiles.map((file) => {
            const status = mintingStatus[file.id] || 'pending';
            const FileIcon = getFileIcon(file.type);
            
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* File Icon */}
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-gray-600" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getFileCategory(file.type)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)} • {getFileTypeDescription(file.type)}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-sm font-medium">
                    {getStatusText(status)}
                  </span>
                </div>

                {/* Manual Mint Button */}
                {!autoMint && status !== 'success' && (
                  <Button
                    size="sm"
                    onClick={() => mintNFT.mutate(file)}
                    disabled={status === 'minting'}
                    className="ml-2"
                  >
                    <Gem className="w-3 h-3 mr-1" />
                    Mint NFT
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Auto-mint Information */}
        {autoMint && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Automatic NFT Minting Active</p>
                <p className="text-xs">
                  All uploads are automatically minted as NFTs and permanently sealed on the blockchain.
                  This ensures your digital assets are preserved forever with verifiable ownership.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Batch Actions */}
        {!autoMint && mediaFiles.length > 1 && (
          <div className="mt-4 flex gap-2">
            <Button onClick={batchMint} disabled={mintNFT.isPending}>
              <Gem className="w-4 h-4 mr-2" />
              Mint All as NFTs
            </Button>
          </div>
        )}

        {/* Success Summary */}
        {Object.values(mintingStatus).includes('success') && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Star className="w-4 h-4" />
              <span className="font-medium">
                {Object.values(mintingStatus).filter(s => s === 'success').length} NFT(s) minted successfully!
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Your digital assets are now permanently preserved on the blockchain.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}