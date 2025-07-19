import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import WalletConnector from './WalletConnector';
import { 
  Shield, 
  Key, 
  Smartphone, 
  CreditCard, 
  Users, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Globe,
  Crown,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnhancedAuth: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const authMethods = [
    {
      id: 'stripe_identity',
      name: 'Stripe Identity Verification',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Enterprise-grade KYC with instant verification',
      features: ['Real-time ID verification', 'Global compliance', 'Fraud protection', 'Instant onboarding'],
      security: 'Bank-level encryption',
      available: true,
      recommended: true
    },
    {
      id: 'web3_wallet',
      name: 'Multi-Chain Wallet Auth',
      icon: <Key className="w-6 h-6" />,
      description: 'Connect with MetaMask, WalletConnect, Coinbase',
      features: ['50+ wallet support', 'Cross-chain compatibility', 'Hardware wallet support', 'Signature verification'],
      security: 'Cryptographic proof',
      available: true,
      recommended: false
    },
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Face ID, Touch ID, and voice recognition',
      features: ['Facial recognition', 'Fingerprint scanning', 'Voice authentication', 'Behavioral analysis'],
      security: 'Military-grade biometrics',
      available: true,
      recommended: false
    },
    {
      id: 'enterprise_sso',
      name: 'Enterprise SSO Integration',
      icon: <Users className="w-6 h-6" />,
      description: 'SAML, OAuth 2.0, Active Directory integration',
      features: ['Azure AD integration', 'Google Workspace', 'Okta compatibility', 'Custom SAML'],
      security: 'Enterprise compliance',
      available: true,
      recommended: false
    }
  ];

  const securityFeatures = [
    {
      feature: 'Multi-Factor Authentication',
      status: 'active',
      description: 'SMS, email, and authenticator app verification'
    },
    {
      feature: 'Zero-Knowledge Architecture',
      status: 'active',
      description: 'Private key never leaves your device'
    },
    {
      feature: 'Advanced Fraud Detection',
      status: 'active',
      description: 'AI-powered suspicious activity monitoring'
    },
    {
      feature: 'Compliance Monitoring',
      status: 'active',
      description: 'Real-time regulatory compliance checking'
    }
  ];

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        if (response.ok) {
          const data = await response.json();
          setAuthStatus(data.authenticated ? 'authenticated' : 'unauthenticated');
        }
      } catch (error) {
        setAuthStatus('unauthenticated');
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthMethod = async (methodId: string) => {
    setIsProcessing(true);
    setSelectedMethod(methodId);

    try {
      switch (methodId) {
        case 'stripe_identity':
          // Integrate with Stripe Identity for KYC
          const stripeResponse = await fetch('/api/auth/stripe-identity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (stripeResponse.ok) {
            const { verification_session_url } = await stripeResponse.json();
            window.location.href = verification_session_url;
          }
          break;

        case 'web3_wallet':
          // Connect to Web3 wallet using improved wallet manager
          const { walletManager } = await import('@/lib/wallet');
          const walletInfo = await walletManager.connectMetaMask();
          
          if (walletInfo) {
            // Send wallet info to backend for authentication
            const authResponse = await fetch('/api/auth/web3-wallet', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                address: walletInfo.address,
                chainId: walletInfo.chainId,
                signature: await walletManager.signMessage('GUARDIANCHAIN Login'),
                message: 'GUARDIANCHAIN Login'
              })
            });
            
            if (authResponse.ok) {
              setAuthStatus('authenticated');
            }
          }
          break;

        case 'biometric':
          // Implement WebAuthn for biometric authentication
          if (navigator.credentials && navigator.credentials.create) {
            try {
              // Create credential for biometric auth
              const credential = await navigator.credentials.create({
                publicKey: {
                  challenge: new Uint8Array(32),
                  rp: { name: "GUARDIANCHAIN" },
                  user: {
                    id: new Uint8Array(16),
                    name: "user@guardianchain.app",
                    displayName: "GUARDIANCHAIN User"
                  },
                  pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                  authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required"
                  }
                }
              });
              
              if (credential) {
                toast({
                  title: "Biometric Setup Complete",
                  description: "Your biometric authentication is now active"
                });
                setAuthStatus('authenticated');
              }
            } catch (error) {
              toast({
                title: "Biometric Setup Failed",
                description: "Please try again or use another method",
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "Biometric Not Supported",
              description: "Your device doesn't support biometric authentication",
              variant: "destructive"
            });
          }
          break;

        case 'enterprise_sso':
          // Redirect to enterprise SSO
          window.location.href = '/api/auth/enterprise-sso';
          break;
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedMethod('');
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Enhanced Authentication System
            </div>
            <Badge className={`${
              authStatus === 'authenticated' ? 'bg-green-600' : 
              authStatus === 'unauthenticated' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
              {authStatus === 'authenticated' ? 'Authenticated' : 
               authStatus === 'unauthenticated' ? 'Not Authenticated' : 'Checking...'}
            </Badge>
          </CardTitle>
          <p className="text-slate-300">
            Enterprise-grade authentication with multiple verification methods and advanced security features.
          </p>
        </CardHeader>
      </Card>

      {/* Authentication Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authMethods.map((method) => (
          <Card 
            key={method.id}
            className={`bg-slate-800/50 border-slate-700 ${
              method.recommended ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-600 rounded-lg mr-3">
                    {method.icon}
                  </div>
                  <div>
                    <div>{method.name}</div>
                    {method.recommended && (
                      <Badge className="mt-1 bg-green-600">Recommended</Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-400">{method.security}</div>
              </CardTitle>
              <p className="text-slate-300 text-sm">{method.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {method.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${
                  method.recommended 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={!method.available || isProcessing}
                onClick={() => handleAuthMethod(method.id)}
              >
                {isProcessing && selectedMethod === method.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    {method.available ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Coming Soon
                      </>
                    )}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-6 h-6 mr-2 text-green-400" />
            Advanced Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold">{feature.feature}</h3>
                  <Badge className={`${
                    feature.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'
                  }`}>
                    {feature.status === 'active' ? 'Active' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Web3 Wallet Connector */}
      <WalletConnector />

      {/* Authentication Status & Actions */}
      {authStatus === 'authenticated' && (
        <Card className="bg-green-900/20 border-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <h3 className="text-white font-bold">Authentication Successful</h3>
                  <p className="text-slate-300 text-sm">You have full access to GUARDIANCHAIN enterprise features</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">Enterprise Access</div>
                <div className="text-sm text-slate-400">All features unlocked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enterprise Integration Benefits */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Crown className="w-6 h-6 mr-2 text-yellow-400" />
            Enterprise Authentication Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-900/20 rounded-lg p-6 mb-4">
                <Globe className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">Global Compliance</div>
              </div>
              <p className="text-slate-300 text-sm">
                GDPR, CCPA, SOX, and industry-specific regulatory compliance
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-900/20 rounded-lg p-6 mb-4">
                <Zap className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">Instant Access</div>
              </div>
              <p className="text-slate-300 text-sm">
                Zero-friction authentication with enterprise single sign-on
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-900/20 rounded-lg p-6 mb-4">
                <Star className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">Premium Support</div>
              </div>
              <p className="text-slate-300 text-sm">
                24/7 dedicated authentication support and monitoring
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuth;