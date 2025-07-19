import React from 'react';
import EnterpriseSDK from '@/components/EnterpriseSDK';
import TokenomicsEngine from '@/components/TokenomicsEngine';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, TrendingUp, Shield, Globe } from "lucide-react";

const EnterpriseSuite: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            GUARDIANCHAIN Enterprise Suite
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Complete enterprise infrastructure for building the world's most valuable truth verification protocol. 
            Production-ready SDK, sustainable tokenomics, and billion-dollar scaling potential.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="sdk" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sdk" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Enterprise SDK
            </TabsTrigger>
            <TabsTrigger value="tokenomics" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Tokenomics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sdk">
            <EnterpriseSDK />
          </TabsContent>

          <TabsContent value="tokenomics">
            <TokenomicsEngine />
          </TabsContent>
        </Tabs>

        {/* Strategic Initiatives */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Strategic Value Creation Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Building className="w-6 h-6 mr-2 text-blue-400" />
                  Enterprise Adoption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>• Fortune 500 partnerships</li>
                  <li>• Supply chain integration</li>
                  <li>• Legal document verification</li>
                  <li>• Healthcare record integrity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-green-400" />
                  Global Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>• Multi-chain deployment</li>
                  <li>• 99.99% uptime SLA</li>
                  <li>• Global data centers</li>
                  <li>• Regulatory compliance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
                  Value Mechanisms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>• Revenue-backed tokens</li>
                  <li>• Deflationary burn model</li>
                  <li>• Staking yield generation</li>
                  <li>• Protocol fee sharing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                  Security & Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>• Immutable verification</li>
                  <li>• AI-powered validation</li>
                  <li>• Cryptographic proofs</li>
                  <li>• Audit trail integrity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSuite;