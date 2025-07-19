import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Smartphone, 
  CreditCard, 
  Chrome, 
  Github, 
  Wallet,
  Fingerprint,
  CheckCircle,
  AlertCircle,
  Brain,
  Crown,
  Zap
} from 'lucide-react';
import { 
  AUTH_PROVIDERS, 
  USER_TIERS, 
  enterpriseAuth, 
  getTierDisplayName, 
  getTierColor,
  type UserProfile,
  type AuthProvider,
  type UserTier
} from '@/lib/auth/enterprise-auth';

const PROVIDER_ICONS = {
  'google-oauth': Chrome,
  'github-oauth': Github,
  'metamask-web3': Wallet,
  'coinbase-web3': Wallet,
  'stripe-identity': CreditCard,
  'webauthn-biometric': Fingerprint
};

const TIER_FEATURES = {
  [USER_TIERS.STARTER]: [
    'Basic capsule creation',
    'Limited viral tools access',
    'Basic profile management',
    'Community support'
  ],
  [USER_TIERS.PROFESSIONAL]: [
    'Unlimited capsule creation',
    'Full viral tools suite',
    'AI-powered analysis',
    'Advanced analytics',
    'Priority support'
  ],
  [USER_TIERS.ENTERPRISE]: [
    'Enterprise compliance tools',
    'Advanced API access',
    'White-label options',
    'Custom integrations',
    'Dedicated account manager'
  ],
  [USER_TIERS.SOVEREIGN]: [
    'Full protocol control',
    'AI training access',
    'Revenue analytics',
    'System configuration',
    'Executive support'
  ]
};

interface AuthenticationHubProps {
  onAuthenticated?: (user: UserProfile) => void;
  requiredTier?: UserTier;
}

export default function AuthenticationHub({ onAuthenticated, requiredTier }: AuthenticationHubProps) {
  const [activeTab, setActiveTab] = useState('tier-selection');
  const [selectedTier, setSelectedTier] = useState<UserTier>(USER_TIERS.PROFESSIONAL);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

  useEffect(() => {
    // Load AI recommendations for current context
    loadAiRecommendations();
  }, [selectedTier, activeTab]);

  const loadAiRecommendations = async () => {
    try {
      const recommendations = await enterpriseAuth.getOnboardingRecommendations(onboardingStep, {
        selectedTier,
        activeTab,
        providers: selectedProviders
      });
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleAuthenticate = async (providerId: string) => {
    setLoading(true);
    try {
      await enterpriseAuth.authenticate(providerId, {
        tier: selectedTier,
        returnUrl: window.location.origin + '/onboarding'
      });
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelection = (tier: UserTier) => {
    setSelectedTier(tier);
    setActiveTab('security-setup');
  };

  const handleSecuritySetup = () => {
    setActiveTab('verification');
  };

  const handleVerification = () => {
    setActiveTab('ai-onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-purple-400 mr-4" />
            <h1 className="text-4xl font-bold">GUARDIANCHAIN Access</h1>
          </div>
          <p className="text-xl text-slate-300 mb-6">
            Enterprise-grade authentication with AI-assisted onboarding
          </p>
          
          {/* Progress indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Setup Progress</span>
              <span>{Math.round((onboardingStep / 5) * 100)}%</span>
            </div>
            <Progress value={(onboardingStep / 5) * 100} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 mb-8">
            <TabsTrigger value="tier-selection" className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Tier Selection
            </TabsTrigger>
            <TabsTrigger value="security-setup" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security Setup
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="ai-onboarding" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Onboarding
            </TabsTrigger>
          </TabsList>

          {/* Tier Selection */}
          <TabsContent value="tier-selection">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(USER_TIERS).map((tier) => (
                <Card 
                  key={tier}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedTier === tier 
                      ? 'ring-2 ring-purple-500 bg-slate-800' 
                      : 'bg-slate-800/50 hover:bg-slate-800'
                  }`}
                  onClick={() => setSelectedTier(tier)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 rounded-full ${getTierColor(tier)} flex items-center justify-center mx-auto mb-2`}>
                      {tier === USER_TIERS.SOVEREIGN ? (
                        <Crown className="w-6 h-6 text-white" />
                      ) : (
                        <Zap className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{getTierDisplayName(tier)}</CardTitle>
                    <Badge variant="outline" className="mx-auto">
                      {tier === USER_TIERS.STARTER && '$0/month'}
                      {tier === USER_TIERS.PROFESSIONAL && '$49/month'}
                      {tier === USER_TIERS.ENTERPRISE && '$299/month'}
                      {tier === USER_TIERS.SOVEREIGN && '$999/month'}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-slate-300 space-y-2">
                      {TIER_FEATURES[tier].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {selectedTier === tier && (
                      <Button 
                        onClick={() => handleTierSelection(tier)}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                      >
                        Select {getTierDisplayName(tier)}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Setup */}
          <TabsContent value="security-setup">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-purple-400" />
                    Authentication Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {AUTH_PROVIDERS.map((provider) => {
                    const IconComponent = PROVIDER_ICONS[provider.id as keyof typeof PROVIDER_ICONS];
                    return (
                      <div 
                        key={provider.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedProviders.includes(provider.id)
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        onClick={() => handleProviderSelect(provider.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <IconComponent className="w-5 h-5 mr-3" />
                            <div>
                              <span className="font-medium">{provider.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {provider.type}
                              </Badge>
                            </div>
                          </div>
                          {selectedProviders.includes(provider.id) && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  <Button 
                    onClick={handleSecuritySetup}
                    disabled={selectedProviders.length === 0}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Configure Security ({selectedProviders.length} methods selected)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-green-400" />
                    AI Security Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiRecommendations ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-400 mb-2">Recommended Setup</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {aiRecommendations.recommendations?.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-blue-400 mb-2">Next Steps</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {aiRecommendations.nextSteps?.map((step: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <AlertCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-700 p-3 rounded">
                        <span className="text-xs text-slate-400">
                          Estimated setup time: {aiRecommendations.estimatedTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verification */}
          <TabsContent value="verification">
            <div className="grid md:grid-cols-3 gap-6">
              {selectedProviders.map((providerId) => {
                const provider = AUTH_PROVIDERS.find(p => p.id === providerId);
                if (!provider) return null;
                
                const IconComponent = PROVIDER_ICONS[providerId as keyof typeof PROVIDER_ICONS];
                
                return (
                  <Card key={providerId} className="bg-slate-800">
                    <CardHeader className="text-center">
                      <IconComponent className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                      <CardTitle>{provider.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleAuthenticate(providerId)}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {loading ? 'Connecting...' : `Connect ${provider.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                onClick={handleVerification}
                variant="outline"
                className="bg-slate-700 hover:bg-slate-600"
              >
                Continue to AI Onboarding
              </Button>
            </div>
          </TabsContent>

          {/* AI Onboarding */}
          <TabsContent value="ai-onboarding">
            <Card className="bg-slate-800">
              <CardHeader className="text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <CardTitle className="text-2xl">AI-Powered Onboarding</CardTitle>
                <p className="text-slate-300">
                  Personalized setup recommendations based on your goals and tier selection
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-slate-700 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 text-purple-400">Your Selected Configuration</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Tier:</span>
                        <span className="ml-2 font-medium">{getTierDisplayName(selectedTier)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Auth Methods:</span>
                        <span className="ml-2 font-medium">{selectedProviders.length} selected</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Complete Setup & Enter GUARDIANCHAIN
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}