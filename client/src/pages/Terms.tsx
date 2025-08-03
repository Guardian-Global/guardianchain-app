import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Users, Gavel } from "lucide-react";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | GuardianChain</title>
        <meta name="description" content="GuardianChain Terms of Service - Transparent, compliant, and user-first policies for sovereign content creation and blockchain-based truth preservation." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparent, compliant, and user-first policies for sovereign content creation
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: August 3, 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  1. Service Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  GuardianChain provides a decentralized platform for creating, storing, and monetizing digital content through blockchain technology. 
                  Our service enables users to mint "Capsules" (NFT-based content containers) with sovereign ownership and AI-powered verification.
                </p>
                <p className="text-muted-foreground">
                  By using GuardianChain, you acknowledge that you are interacting with decentralized blockchain infrastructure. 
                  We provide interfaces and tools, but do not control the underlying smart contracts or your digital assets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  2. User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-400">Content Ownership & Rights</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>You retain full ownership of all content you submit to GuardianChain</li>
                    <li>You warrant that you have the legal right to upload and mint your content</li>
                    <li>You are responsible for ensuring your content complies with applicable laws</li>
                    <li>You grant GuardianChain limited rights to display and process your content for platform functionality</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-400">Account Security</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>You are responsible for maintaining the security of your wallet and private keys</li>
                    <li>GuardianChain cannot recover lost wallets or reverse blockchain transactions</li>
                    <li>You must immediately notify us of any unauthorized access to your account</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  3. Revenue Sharing & GTT Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-purple-400">Revenue Distribution</h4>
                  <p className="text-muted-foreground text-sm">
                    GuardianChain operates on a transparent revenue-sharing model:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li><strong>Capsule Minting:</strong> 70% to creator, 20% to DAO treasury, 10% to platform</li>
                    <li><strong>Capsule Unlocks:</strong> 50% to creator, 25% to referrer (if applicable), 25% to DAO</li>
                    <li><strong>GTT Yield:</strong> 90% to creator, 10% to DAO reserve</li>
                    <li><strong>Subscription Revenue:</strong> 60% to creator, 30% to platform, 10% to DAO</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-purple-400">Token Disclaimers</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>GTT tokens are utility tokens, not securities or investment contracts</li>
                    <li>Token values may fluctuate and we make no guarantees about future value</li>
                    <li>Yield rates are variable and depend on protocol performance and DAO governance</li>
                    <li>AI yield estimates are advisory only and not financial guarantees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-red-400" />
                  4. Platform Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-red-400">Prohibited Content</h4>
                  <p className="text-muted-foreground text-sm">
                    While we support free speech and decentralization, the following content is prohibited:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>Content that violates applicable laws or regulations</li>
                    <li>Malicious software, viruses, or harmful code</li>
                    <li>Content that infringes on intellectual property rights of others</li>
                    <li>Spam, misleading information, or fraudulent content</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-red-400">Service Modifications</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                    <li>We may modify or discontinue features with 30 days notice</li>
                    <li>Critical security updates may be implemented immediately</li>
                    <li>Your content remains accessible via blockchain even if our service changes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  GuardianChain provides a decentralized platform interface. We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                  <li>Loss of access to wallets, private keys, or blockchain assets</li>
                  <li>Smart contract bugs, exploits, or blockchain network issues</li>
                  <li>Content uploaded by other users or third parties</li>
                  <li>Market volatility affecting token values or yield rates</li>
                  <li>Service interruptions due to network congestion or technical issues</li>
                </ul>
                
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-amber-200 text-sm">
                    <strong>Important:</strong> Blockchain transactions are irreversible. Always verify contract addresses, 
                    transaction details, and maintain secure backups of your wallet and content.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Compliance & Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  GuardianChain operates in compliance with applicable laws and regulations. Users are responsible for 
                  complying with their local laws regarding blockchain technology, digital assets, and content creation.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium">KYC/AML Compliance</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Enhanced due diligence may be required for high-value transactions</li>
                    <li>We comply with FATF guidelines and local regulatory requirements</li>
                    <li>Suspicious activity may be reported to relevant authorities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact & Governance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  For questions about these terms or our service:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                  <li>General inquiries: <a href="mailto:support@guardianchain.app" className="text-blue-400 hover:underline">support@guardianchain.app</a></li>
                  <li>Legal/compliance: <a href="mailto:compliance@guardianchain.app" className="text-blue-400 hover:underline">compliance@guardianchain.app</a></li>
                  <li>Platform governance: Participate in DAO voting with GTT tokens</li>
                </ul>
                
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-200 text-sm">
                    <strong>Decentralized Governance:</strong> Major platform decisions are governed by the GuardianChain DAO. 
                    GTT token holders can propose and vote on protocol changes, fee structures, and platform policies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              These terms constitute a binding agreement between you and GuardianChain. 
              By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}