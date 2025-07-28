import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2,
  Shield,
  Zap,
  Building,
  Globe,
  Database,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Users,
  Lock,
  Cpu,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnterpriseSDK: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const integrationExamples = [
    {
      title: "Supply Chain Verification",
      code: `// Verify product authenticity
const verification = await guardianchain.verify({
  productId: "PROD-12345",
  batchNumber: "BATCH-001",
  manufacturingDate: "2025-01-15",
  certifications: ["ISO-9001", "FDA-APPROVED"]
});

if (verification.isAuthentic) {
  console.log("Product verified:", verification.truthScore);
}`,
      industry: "Manufacturing",
    },
    {
      title: "Legal Document Authentication",
      code: `// Seal legal documents with immutable proof
const legalSeal = await guardianchain.sealDocument({
  documentHash: "0x1a2b3c...",
  documentType: "CONTRACT",
  parties: ["Alice Corp", "Bob LLC"],
  timestamp: Date.now(),
  jurisdiction: "USA"
});

// Creates immutable audit trail
console.log("Document sealed:", legalSeal.capsuleId);`,
      industry: "Legal",
    },
    {
      title: "Healthcare Record Integrity",
      code: `// Secure patient data with privacy preservation
const healthRecord = await guardianchain.createPrivateCapsule({
  patientId: "encrypted_id",
  recordType: "VACCINATION",
  dataHash: "0xhealth...",
  accessControl: ["doctor", "patient", "pharmacy"],
  compliance: ["HIPAA", "GDPR"]
});`,
      industry: "Healthcare",
    },
  ];

  const enterpriseFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description:
        "Military-grade encryption, private key management, and compliance frameworks",
      benefits: [
        "SOC2 Type II",
        "ISO 27001",
        "GDPR Compliant",
        "Zero-Knowledge Architecture",
      ],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "High-Performance API",
      description: "99.99% uptime SLA with sub-100ms response times globally",
      benefits: [
        "Global CDN",
        "Auto-scaling",
        "Rate limiting",
        "Real-time monitoring",
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Multi-Chain Support",
      description:
        "Deploy across Ethereum, Polygon, Solana, and private blockchains",
      benefits: [
        "Cross-chain bridges",
        "Gas optimization",
        "Network redundancy",
        "Custom chains",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "White-Label Solutions",
      description:
        "Fully customizable interface and branding for enterprise deployment",
      benefits: [
        "Custom UI/UX",
        "Brand integration",
        "Domain mapping",
        "API customization",
      ],
    },
  ];

  const pricingTiers = [
    {
      name: "Startup",
      price: "$99/month",
      features: [
        "10,000 API calls/month",
        "Basic authentication",
        "Email support",
        "Standard SLA",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "$999/month",
      features: [
        "1M API calls/month",
        "Advanced security features",
        "24/7 phone support",
        "99.9% uptime SLA",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: true,
    },
    {
      name: "Custom",
      price: "Contact Us",
      features: [
        "Unlimited API calls",
        "Dedicated infrastructure",
        "White-label deployment",
        "99.99% uptime SLA",
        "24/7 dedicated support",
      ],
      cta: "Schedule Demo",
    },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Example code copied to clipboard",
    });
  };

  return (
    <div className="w-full space-y-8">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Code2 className="w-6 h-6 mr-2 text-blue-400" />
              GUARDIANCHAIN Enterprise SDK
            </div>
            <Badge className="bg-blue-600">Production Ready</Badge>
          </CardTitle>
          <p className="text-slate-300">
            Enterprise-grade truth verification infrastructure for Fortune 500
            companies. Deploy immutable proof systems in minutes, not months.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="examples">Code Examples</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    99.99%
                  </div>
                  <div className="text-sm text-slate-400">Uptime SLA</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    &lt; 100ms
                  </div>
                  <div className="text-sm text-slate-400">Response Time</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-sm text-slate-400">
                    Blockchain Networks
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Quick Start
                </h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">npm install</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(
                          "npm install @guardianchain/enterprise-sdk"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-green-400 font-mono">
                    npm install @guardianchain/enterprise-sdk
                  </code>
                </div>

                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">
                      Initialize SDK
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(`import { GuardianChain } from '@guardianchain/enterprise-sdk';

const gc = new GuardianChain({
  apiKey: process.env.GUARDIANCHAIN_API_KEY,
  network: 'polygon',
  environment: 'production'
});`)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-green-400 font-mono text-sm">
                    {`import { GuardianChain } from '@guardianchain/enterprise-sdk';

const gc = new GuardianChain({
  apiKey: process.env.GUARDIANCHAIN_API_KEY,
  network: 'polygon',
  environment: 'production'
});`}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-6">
              {integrationExamples.map((example, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div>
                        <div>{example.title}</div>
                        <Badge className="mt-1 bg-blue-600">
                          {example.industry}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(example.code)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 font-mono text-sm">
                        {example.code}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enterpriseFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-slate-700/50 border-slate-600"
                  >
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <div className="p-2 bg-blue-600 rounded-lg mr-3">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-slate-300 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingTiers.map((tier, index) => (
                  <Card
                    key={index}
                    className={`bg-slate-700/50 border-slate-600 ${
                      tier.popular ? "ring-2 ring-purple-500" : ""
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-center">
                        <div className="text-2xl font-bold">{tier.name}</div>
                        {tier.popular && (
                          <Badge className="mt-2 bg-purple-600">
                            Most Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">
                          {tier.price}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-slate-300 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${
                          tier.popular
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {tier.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-slate-700/50 border-slate-600">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Enterprise Volume Discounts
                    </h3>
                    <p className="text-slate-300 mb-6">
                      Save up to 40% with annual commitments and volume pricing
                      for high-scale deployments.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Schedule Demo
                      </Button>
                      <Button variant="outline" className="border-slate-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download SDK
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseSDK;
