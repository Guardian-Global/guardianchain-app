import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface SubscribeFormProps {
  tier: string;
  amount: number;
  features: string[];
  onSuccess?: () => void;
}

const SubscribeForm = ({ tier, amount, features, onSuccess }: SubscribeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/subscription-success",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Successful",
        description: `Welcome to GuardianChain ${tier}!`,
      });
      onSuccess?.();
    }

    setIsProcessing(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card data-testid="subscription-details">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{tier} Plan</CardTitle>
            <Badge variant="secondary">${(amount / 100).toFixed(2)}/month</Badge>
          </div>
          <CardDescription>
            Upgrade to unlock premium features and enhanced capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card data-testid="payment-form">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Your subscription will begin immediately after payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <Button 
              type="submit" 
              disabled={!stripe || isProcessing}
              className="w-full"
              data-testid="button-subscribe"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? "Processing..." : `Subscribe for $${(amount / 100).toFixed(2)}/month`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

interface SubscribeProps {
  tier?: string;
  onSuccess?: () => void;
}

export default function Subscribe({ tier = "SEEKER", onSuccess }: SubscribeProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    // Create subscription as soon as the page loads
    apiRequest("POST", "/api/payment/create-subscription", { tier })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setSubscriptionData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Subscription creation error:", error);
        setLoading(false);
      });
  }, [tier]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" data-testid="loading-subscription">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!clientSecret || !subscriptionData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to initialize subscription. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierFeatures = {
    SEEKER: [
      "All Explorer features",
      "Priority verification",
      "Advanced analytics",
      "25 GB storage",
      "Custom themes",
    ],
    CREATOR: [
      "All Seeker features",
      "White-label options",
      "API access",
      "100 GB storage",
      "Advanced AI tools",
    ],
    SOVEREIGN: [
      "All Creator features",
      "Custom domain",
      "Priority support",
      "Unlimited storage",
      "Enterprise features",
    ],
  };

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
          <p className="text-muted-foreground">
            Unlock premium features with GuardianChain {tier}
          </p>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscribeForm 
            tier={tier}
            amount={subscriptionData.amount}
            features={tierFeatures[tier as keyof typeof tierFeatures] || []}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};