import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, Upload, Shield, Clock, Star, Crown } from 'lucide-react';

interface StorageTier {
  size: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

export default function StorageCapsules() {
  const [pricingData, setPricingData] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await fetch('/api/checkout/storage-pricing');
      const data = await response.json();
      setPricingData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pricing information",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async (size: string) => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
      
      const response = await fetch('/api/checkout/create-storage-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size,
          email,
          userId: user.id || 'anonymous'
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStorageIcon = (size: string) => {
    switch (size) {
      case '64GB': return <Database className="w-6 h-6 text-blue-400" />;
      case '128GB': return <Upload className="w-6 h-6 text-green-400" />;
      case '256GB': return <Shield className="w-6 h-6 text-purple-400" />;
      case '512GB': return <Clock className="w-6 h-6 text-orange-400" />;
      case '1TB': return <Star className="w-6 h-6 text-yellow-400" />;
      case '2TB': return <Crown className="w-6 h-6 text-red-400" />;
      default: return <Database className="w-6 h-6 text-gray-400" />;
    }
  };

  const isPopular = (size: string) => {
    return size === '256GB' || size === '512GB';
  };

  if (!pricingData) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading storage options...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Storage Capsules
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Secure, encrypted storage for your precious memories and important documents. 
            Choose the perfect size for your needs.
          </p>
        </div>

        {/* Email Input */}
        <div className="max-w-md mx-auto mb-12">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white text-center"
          />
        </div>

        {/* Storage Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(pricingData.pricing).map(([size, price]: [string, any]) => (
            <Card 
              key={size}
              className={`bg-slate-800 border-slate-700 relative ${
                isPopular(size) ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {isPopular(size) && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getStorageIcon(size)}
                </div>
                <CardTitle className="text-white text-2xl">{size}</CardTitle>
                <div className="text-3xl font-bold text-purple-400">
                  ${price}
                  <span className="text-sm text-gray-400 font-normal">/once</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {(pricingData.features as any)[size]?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(size)}
                  disabled={isLoading || !email}
                  className={`w-full ${
                    isPopular(size) 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Purchase ${size}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Military-Grade Encryption</h3>
            <p className="text-gray-400">Your data is protected with AES-256 encryption</p>
          </div>
          <div>
            <Database className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Immutable Storage</h3>
            <p className="text-gray-400">Once sealed, your capsules cannot be altered</p>
          </div>
          <div>
            <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Long-Term Preservation</h3>
            <p className="text-gray-400">Guaranteed storage for years to come</p>
          </div>
        </div>
      </div>
    </div>
  );
}