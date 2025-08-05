import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SMRIMinter } from '@/components/nft/SMRIMinter';
import { useAuth } from '@/hooks/useAuth';
import { Brain, Award, Zap } from 'lucide-react';

export default function SMRIBadges() {
  const { user } = useAuth();
  const [capsuleText, setCapsuleText] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleMintSuccess = (result: { tokenId: string; txHash: string; metadataUrl: string }) => {
    console.log('SMRI Badge minted successfully:', result);
    // Could integrate with profile system or badge gallery here
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          SMRI Badge Generator
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate Subjective Memory Resonance Index badges based on capsule content analysis
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              Content Input
            </CardTitle>
            <CardDescription>
              Provide capsule content and wallet address for badge generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capsule-text">Capsule Content</Label>
              <Textarea
                id="capsule-text"
                placeholder="Enter your memory, story, or capsule content here..."
                value={capsuleText}
                onChange={(e) => setCapsuleText(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient-address">Recipient Wallet Address</Label>
              <Input
                id="recipient-address"
                placeholder="0x742d35Cc64C32C8c2D3E9D6b8F4f8e8b8F8d8F8e"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRecipientAddress(user.walletAddress || '')}
                  className="text-xs"
                >
                  Use My Address
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SMRI Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              About SMRI Badges
            </CardTitle>
            <CardDescription>
              Understanding Subjective Memory Resonance Index
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-cyan-400">Memory Types</h4>
                <ul className="text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Visual:</strong> Image-based memories</li>
                  <li><strong>Auditory:</strong> Sound-based memories</li>
                  <li><strong>Kinesthetic:</strong> Touch and movement</li>
                  <li><strong>Emotional:</strong> Feeling-centered</li>
                  <li><strong>Cognitive:</strong> Thought-based</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400">Grief Scores</h4>
                <ul className="text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Low:</strong> Joy and celebration</li>
                  <li><strong>Medium:</strong> Nostalgia and change</li>
                  <li><strong>High:</strong> Loss and mourning</li>
                  <li><strong>Transcendent:</strong> Eternal wisdom</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-400">Profile Affinities</h4>
                <ul className="text-muted-foreground list-disc list-inside space-y-1">
                  <li><strong>Curious:</strong> Exploratory nature</li>
                  <li><strong>Empathetic:</strong> Understanding others</li>
                  <li><strong>Analytical:</strong> Logic-driven</li>
                  <li><strong>Protective:</strong> Guardian instinct</li>
                  <li><strong>Visionary:</strong> Future-focused</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SMRI Minter Component */}
      <div className="mt-8">
        <SMRIMinter
          capsuleText={capsuleText}
          recipientAddress={recipientAddress}
          onMintSuccess={handleMintSuccess}
        />
      </div>

      {/* Setup Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Setup Instructions
          </CardTitle>
          <CardDescription>
            Configure SMRI badge minting for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">1. Add Contract Address to Environment</h4>
              <code className="text-xs bg-background p-2 rounded block">
                VITE_SMRI_NFT_CONTRACT=0xYourDeployedSMRIBadgeContractAddress
              </code>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">2. Deploy SMRI Badge Contract</h4>
              <p className="text-muted-foreground">
                Use Thirdweb CLI or Remix with ERC-721 implementation that includes <code>mintTo(address, metadata)</code> function.
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">3. Integrate with Profile System</h4>
              <p className="text-muted-foreground">
                Link badges to user profiles and capsule creation workflows for automatic trait generation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}