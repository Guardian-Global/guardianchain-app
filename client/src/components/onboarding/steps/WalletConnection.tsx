import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wallet, 
  CheckCircle, 
  ExternalLink, 
  Info,
  Shield,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectionProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function WalletConnection({ onComplete, onSkip }: WalletConnectionProps) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [hasConnected, setHasConnected] = useState(false);

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      setHasConnected(true);
      toast({
        title: "Wallet Connected!",
        description: "Your wallet has been successfully connected to GUARDIANCHAIN.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const walletBenefits = [
    {
      icon: <Coins className="h-5 w-5 text-yellow-400" />,
      title: "GTT Token Integration",
      description: "Earn, stake, and spend GTT tokens directly from your wallet"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-400" />,
      title: "Blockchain Verification",
      description: "Sign transactions to prove ownership of truth capsules"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-purple-400" />,
      title: "Decentralized Identity",
      description: "Use your wallet as a secure, decentralized identity"
    }
  ];

  if (isConnected && address) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Wallet Connected!</h3>
          <p className="text-slate-400">
            Your wallet is now connected and ready for blockchain features.
          </p>
        </div>

        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Connected Wallet</p>
                <p className="text-slate-400 text-sm font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                {chain && (
                  <Badge className="mt-2" variant="outline">
                    {chain.name}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => disconnect()}
                className="border-slate-600 text-slate-300"
              >
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h4 className="text-white font-medium">What's Next?</h4>
          {walletBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              {benefit.icon}
              <div>
                <p className="text-white text-sm font-medium">{benefit.title}</p>
                <p className="text-slate-400 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleComplete}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Continue to Next Step
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Connect your Web3 wallet to unlock blockchain features like GTT token management 
          and decentralized verification.
        </p>
      </div>

      {/* Optional Notice */}
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>This step is optional.</strong> You can use GUARDIANCHAIN without a wallet, 
          but connecting one unlocks additional blockchain features.
        </AlertDescription>
      </Alert>

      {/* Benefits */}
      <div>
        <h4 className="text-white font-medium mb-4">Benefits of Connecting Your Wallet</h4>
        <div className="space-y-3">
          {walletBenefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
              {benefit.icon}
              <div>
                <p className="text-white text-sm font-medium">{benefit.title}</p>
                <p className="text-slate-400 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Options */}
      <div>
        <h4 className="text-white font-medium mb-4">Choose Your Wallet</h4>
        <div className="grid gap-3">
          {connectors.map((connector) => (
            <Card 
              key={connector.uid}
              className="bg-slate-700/50 border-slate-600 cursor-pointer transition-all hover:bg-slate-700/70"
            >
              <CardContent className="p-4">
                <Button
                  onClick={() => handleConnect(connector)}
                  disabled={isLoading}
                  className="w-full justify-start bg-transparent hover:bg-slate-600 text-white border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <span>{connector.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-200">
            Failed to connect wallet: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {onSkip && (
          <Button
            onClick={onSkip}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            Skip for Now
          </Button>
        )}
        
        <Button
          onClick={handleComplete}
          disabled={!hasConnected && !isConnected}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isConnected ? "Continue" : "Continue Without Wallet"}
        </Button>
      </div>
    </div>
  );
}