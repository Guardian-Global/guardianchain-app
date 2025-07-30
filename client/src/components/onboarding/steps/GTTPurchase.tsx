import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Coins, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Shield,
  Zap,
  Star,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GTTPurchaseProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function GTTPurchase({ onComplete, onSkip }: GTTPurchaseProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [purchaseAmount, setPurchaseAmount] = useState("1000");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [isLoading, setIsLoading] = useState(false);

  const gttPrice = 0.0075; // $0.0075 per GTT
  const totalCost = parseFloat(purchaseAmount) * gttPrice;

  const purchasePackages = [
    {
      amount: 1000,
      price: 7.50,
      bonus: 0,
      popular: false,
      tier: "Starter Pack"
    },
    {
      amount: 5000,
      price: 35.00,
      bonus: 500,
      popular: true,
      tier: "Popular Choice"
    },
    {
      amount: 10000,
      price: 65.00,
      bonus: 1500,
      popular: false,
      tier: "Power User"
    },
    {
      amount: 25000,
      price: 150.00,
      bonus: 5000,
      popular: false,
      tier: "Enterprise"
    }
  ];

  const gttBenefits = [
    {
      icon: <Star className="h-5 w-5 text-yellow-400" />,
      title: "Premium Features",
      description: "Unlock advanced capsule creation and AI-powered analysis"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      title: "Staking Rewards",
      description: "Earn up to 25% APY by staking your GTT tokens"
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-400" />,
      title: "Truth Verification",
      description: "Participate in community verification and earn rewards"
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-400" />,
      title: "Faster Processing",
      description: "Priority processing for all your truth capsules"
    }
  ];

  const handlePurchase = async () => {
    setIsLoading(true);
    
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${purchaseAmount} GTT tokens.`,
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
          <Coins className="h-8 w-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Get GTT Tokens</h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          GTT tokens unlock premium features, staking rewards, and voting power in the GUARDIANCHAIN ecosystem.
        </p>
      </div>

      {/* Current Price */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-medium">Current GTT Price</p>
              <p className="text-white text-2xl font-bold">${gttPrice.toFixed(4)}</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +19.05% (24h)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Packages */}
      <div>
        <h4 className="text-white font-medium mb-4">Choose a Package</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchasePackages.map((pkg, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all ${
                parseInt(purchaseAmount) === pkg.amount
                  ? "bg-purple-500/20 border-purple-500"
                  : "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
              } ${pkg.popular ? "ring-2 ring-yellow-500" : ""}`}
              onClick={() => setPurchaseAmount(pkg.amount.toString())}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-white">
                  <span>{pkg.tier}</span>
                  {pkg.popular && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                      Popular
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">GTT Tokens</span>
                    <span className="text-white font-medium">
                      {pkg.amount.toLocaleString()}
                      {pkg.bonus > 0 && (
                        <span className="text-green-400 text-sm ml-1">
                          +{pkg.bonus}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Price</span>
                    <span className="text-white font-bold">${pkg.price.toFixed(2)}</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <p className="text-green-400 text-sm">
                      +{pkg.bonus} bonus tokens included!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardContent className="p-4">
          <Label htmlFor="customAmount" className="text-white mb-2 block">
            Custom Amount
          </Label>
          <div className="flex gap-3">
            <Input
              id="customAmount"
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white"
              placeholder="Enter GTT amount"
              min="100"
              max="100000"
            />
            <div className="flex items-center px-3 bg-slate-600 rounded-md">
              <span className="text-slate-300 text-sm">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <div>
        <h4 className="text-white font-medium mb-4">Payment Method</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === "card"
                ? "bg-purple-500/20 border-purple-500"
                : "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Credit/Debit Card</p>
                  <p className="text-slate-400 text-sm">Pay with Stripe (Recommended)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === "crypto"
                ? "bg-purple-500/20 border-purple-500"
                : "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
            }`}
            onClick={() => setPaymentMethod("crypto")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Cryptocurrency</p>
                  <p className="text-slate-400 text-sm">
                    {isConnected ? "Pay with connected wallet" : "Wallet required"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h4 className="text-white font-medium mb-4">What You Get with GTT</h4>
        <div className="space-y-3">
          {gttBenefits.map((benefit, index) => (
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

      {/* Warning for crypto payment without wallet */}
      {paymentMethod === "crypto" && !isConnected && (
        <Alert className="bg-yellow-500/10 border-yellow-500/20">
          <AlertDescription className="text-yellow-200">
            You need to connect a wallet first to pay with cryptocurrency. 
            <Button variant="link" className="text-yellow-400 p-0 ml-1">
              Go back to wallet connection
            </Button>
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
          onClick={handlePurchase}
          disabled={isLoading || (paymentMethod === "crypto" && !isConnected)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white min-w-[200px]"
        >
          {isLoading ? "Processing..." : `Buy ${parseInt(purchaseAmount).toLocaleString()} GTT for $${totalCost.toFixed(2)}`}
        </Button>
      </div>

      {/* Help */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">
          Need help with your purchase?
        </p>
        <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0">
          <ExternalLink className="h-3 w-3 mr-1" />
          Contact Support
        </Button>
      </div>
    </div>
  );
}