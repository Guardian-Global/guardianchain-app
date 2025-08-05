import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SMRIMinter } from '@/components/nft/SMRIMinter';
import { Brain, Award, Eye, EyeOff } from 'lucide-react';

interface CapsuleWithSMRIProps {
  capsule: {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
  };
  userWallet?: string;
}

export function CapsuleWithSMRI({ capsule, userWallet }: CapsuleWithSMRIProps) {
  const [showSMRIMinter, setShowSMRIMinter] = useState(false);
  const [mintedBadge, setMintedBadge] = useState<any>(null);

  const handleMintSuccess = (result: { tokenId: string; txHash: string; metadataUrl: string }) => {
    setMintedBadge(result);
    setShowSMRIMinter(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{capsule.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {capsule.author} • {new Date(capsule.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSMRIMinter(!showSMRIMinter)}
            >
              <Brain className="h-4 w-4 mr-2" />
              {showSMRIMinter ? 'Hide' : 'Generate'} SMRI
            </Button>
            {mintedBadge && (
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                <Award className="h-3 w-3 mr-1" />
                SMRI #{mintedBadge.tokenId}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{capsule.content}</p>
        </div>

        {showSMRIMinter && (
          <div className="border-t pt-4">
            <SMRIMinter
              capsuleText={capsule.content}
              recipientAddress={userWallet}
              onMintSuccess={handleMintSuccess}
            />
          </div>
        )}

        {mintedBadge && (
          <div className="p-3 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">SMRI Badge Minted</h4>
                <p className="text-xs text-muted-foreground">
                  Token #{mintedBadge.tokenId} • View on{' '}
                  <a 
                    href={`https://basescan.org/tx/${mintedBadge.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    BaseScan
                  </a>
                </p>
              </div>
              <a
                href={mintedBadge.metadataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-white/50 rounded border hover:bg-white/70 transition-colors"
              >
                View Metadata
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}