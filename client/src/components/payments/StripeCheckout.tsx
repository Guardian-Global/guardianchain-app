import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  CreditCard, 
  Shield, 
  Zap, 
  Crown,
  Check,
  Star,
  Rocket,
  Globe,
  Lock,
  Users,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface TierOption {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  icon: any;
}

const tiers: TierOption[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: 0,
    monthlyPrice: 0,
    description: 'Perfect for getting started with truth verification',
    features: [
      '5 truth capsules per month',
      'Basic verification tools',
      'Community access',
      'Standard support'
    ],
    color: 'border-blue-500 text-blue-400',
    icon: Globe
  },
  {
    id: 'seeker',
    name: 'Seeker',
    price: 29,
    monthlyPrice: 29,
    description: 'Enhanced tools for active truth seekers',
    features: [
      '50 truth capsules per month',
      'Advanced analytics',
      'Priority verification',
      'Email support',
      '2x GTT rewards'
    ],
    color: 'border-purple-500 text-purple-400',
    icon: Star,
    popular: true
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 99,
    monthlyPrice: 99,
    description: 'Professional tools for content creators',
    features: [
      'Unlimited truth capsules',
      'Premium analytics dashboard',
      'API access',
      'Custom verification workflows',
      '5x GTT rewards',
      'Priority support'
    ],
    color: 'border-green-500 text-green-400',
    icon: Rocket
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    price: 299,
    monthlyPrice: 299,
    description: 'Ultimate package for enterprises and institutions',
    features: [
      'Everything in Creator',
      'White-label solutions',
      'Dedicated account manager',
      'Custom integrations',
      '10x GTT rewards',
      'SLA guarantee',
      'Advanced compliance tools'
    ],
    color: 'border-yellow-500 text-yellow-400',
    icon: Crown
  }
];

export default function StripeCheckout() {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState('seeker');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTierData = tiers.find(tier => tier.id === selectedTier);
  const finalPrice = selectedTierData ? 
    (billingCycle === 'annual' ? selectedTierData.price * 10 : selectedTierData.price) : 0;

  const processPayment = useMutation({
    mutationFn: async (paymentData: any) => {
      setIsProcessing(true);
      
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock authentication check
      const isAuthenticated = Math.random() > 0.2; // 80% success rate
      
      if (!isAuthenticated) {
        throw new Error('Authentication failed - please try again');
      }
      
      return {
        success: true,
        subscriptionId: 'sub_mock_' + Math.random().toString(36).substr(2, 9),
        tier: selectedTier,
        amount: finalPrice
      };
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to GUARDIANCHAIN ${selectedTierData?.name}! Your subscription is now active.`,
      });
      
      // Redirect to profile after successful payment
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: error.message || "Please check your payment details and try again.",
        variant: "destructive"
      });
    }
  });

  const handleUpgrade = () => {
    if (selectedTierData?.price === 0) {
      toast({
        title: "Explorer Tier Selected",
        description: "You're already on the free Explorer tier! Select a paid tier to upgrade.",
      });
      return;
    }

    processPayment.mutate({
      tier: selectedTier,
      amount: finalPrice,
      billingCycle,
      paymentMethod
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Upgrade Your <span className="text-purple-400">GUARDIANCHAIN</span> Experience
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose the perfect plan to enhance your truth verification capabilities and earn more GTT tokens
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-slate-800 rounded-lg p-1 flex">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
              className="transition-all"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('annual')}
              className="transition-all"
            >
              Annual (Save 20%)
            </Button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative bg-slate-800/50 border transition-all cursor-pointer hover:scale-105 ${
                selectedTier === tier.id ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-700'
              } ${tier.popular ? 'border-green-500' : ''}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-black">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <tier.icon className={`h-12 w-12 ${tier.color.split(' ')[1]}`} />
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${billingCycle === 'annual' ? tier.price * 10 : tier.price}
                  <span className="text-lg font-normal text-slate-400">
                    /{billingCycle === 'annual' ? 'year' : 'month'}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{tier.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-400" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto Payment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input 
                        id="card-name" 
                        placeholder="John Doe" 
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="card-number" 
                        placeholder="4242 4242 4242 4242" 
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        placeholder="123" 
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="crypto" className="space-y-4 mt-6">
                  <div className="text-center p-8 border border-slate-600 rounded-lg">
                    <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Crypto Payment</h3>
                    <p className="text-slate-400 mb-4">
                      Pay with ETH, USDC, or GTT tokens for a 10% discount
                    </p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      Connect Wallet
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Order Summary */}
              <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Selected Plan:</span>
                  <span className="font-semibold">{selectedTierData?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Billing Cycle:</span>
                  <span className="capitalize">{billingCycle}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-slate-600">
                  <span>Total:</span>
                  <span className="text-green-400">${finalPrice}</span>
                </div>
              </div>
              
              {/* Secure Payment Info */}
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secured with 256-bit SSL encryption</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-green-600 hover:opacity-90"
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {selectedTierData?.price === 0 ? 'Select Paid Tier' : `Upgrade to ${selectedTierData?.name}`}
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/profile'}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Bank-Level Security</h4>
            <p className="text-sm text-slate-400">Your data is protected with enterprise-grade encryption</p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">Trusted by 50K+ Users</h4>
            <p className="text-sm text-slate-400">Join the largest truth verification community</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-semibold mb-1">30-Day Money Back</h4>
            <p className="text-sm text-slate-400">Full refund if you're not completely satisfied</p>
          </div>
        </div>
      </div>
    </div>
  );
}