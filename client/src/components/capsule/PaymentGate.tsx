import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  CreditCard, 
  Star, 
  Crown, 
  FileText,
  ArrowRight,
  Check
} from "lucide-react";

interface PaymentGateProps {
  onPaymentComplete: (tier: string) => void;
  onCancel: () => void;
}

export default function PaymentGate({ onPaymentComplete, onCancel }: PaymentGateProps) {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const capsuleTiers = [
    {
      id: "basic",
      name: "Basic Capsule",
      price: 0.99,
      gttReward: 5,
      icon: FileText,
      features: [
        "Community verification",
        "Standard priority",
        "30-day verification window",
        "5 GTT reward on approval"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "premium",
      name: "Premium Capsule",
      price: 4.99,
      gttReward: 25,
      icon: Star,
      popular: true,
      features: [
        "Priority verification queue",
        "Advanced analytics",
        "24-hour verification window",
        "25 GTT reward on approval",
        "Truth seal certification"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "enterprise",
      name: "Enterprise Capsule",
      price: 19.99,
      gttReward: 100,
      icon: Crown,
      features: [
        "Instant verification priority",
        "Professional truth seal",
        "4-hour verification window",
        "100 GTT reward on approval",
        "Legal-grade documentation",
        "White-label verification"
      ],
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const handlePayment = async (tierId: string) => {
    setProcessing(true);
    setSelectedTier(tierId);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, integrate with Stripe
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     tier: tierId,
      //     amount: capsuleTiers.find(t => t.id === tierId)?.price 
      //   })
      // });
      
      onPaymentComplete(tierId);
    } catch (error) {
      console.error('Payment failed:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">
                Choose Your Capsule Tier
              </h2>
            </div>
            <p className="text-slate-300 text-lg">
              Select a verification tier to create your truth capsule
            </p>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                💰 Higher tiers = Faster verification + Bigger GTT rewards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {capsuleTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:scale-105 relative ${
                  selectedTier === tier.id ? 'ring-2 ring-purple-500' : ''
                } ${tier.popular ? 'ring-2 ring-purple-500/50' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 bg-gradient-to-r ${tier.color}/20 rounded-full`}>
                      <tier.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-white">${tier.price}</div>
                    <div className="text-green-400 font-medium">+{tier.gttReward} GTT</div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 bg-gradient-to-r ${tier.color} hover:opacity-90 text-white`}
                    onClick={() => handlePayment(tier.id)}
                    disabled={processing}
                  >
                    {processing && selectedTier === tier.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Choose ${tier.price}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={processing}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => window.location.href = '/capsule-pricing'}
              variant="ghost"
              className="text-purple-400 hover:bg-purple-500/10"
            >
              View Full Pricing Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}