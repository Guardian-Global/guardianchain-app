import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RefreshCw, AlertTriangle, Shield } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

export default function ConfigPage() {
  const [config, setConfig] = useState({
    // Yield Configuration
    viewYieldRate: 0.005,
    shareYieldRate: 0.01,
    resonanceYieldRate: 0.02,
    veritusMultiplier: 2.0,
    
    // Tier Configuration
    tierBonuses: {
      starter: 0,
      creator: 0.05,
      guardian: 0.10,
      institutional: 0.25
    },
    
    // Compliance Settings
    enableGeoBlocking: true,
    restrictedRegions: ['XX', 'YY'],
    largeTransactionThreshold: 1000,
    complianceAuditFrequency: 24, // hours
    
    // System Settings
    distributionFrequency: 24, // hours
    maxDailyMints: 1000,
    enableAIAdvisor: true,
    enableAutomatedReports: true,
    
    // Price Settings
    gttTargetPrice: 0.15,
    priceUpdateFrequency: 300, // seconds
    
    // Security Settings
    enableRateLimiting: true,
    maxApiCallsPerHour: 1000,
    enableTwoFactor: true
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production, this would call an API to save configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date().toLocaleString());
      console.log('Configuration saved:', config);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setConfig({
      viewYieldRate: 0.005,
      shareYieldRate: 0.01,
      resonanceYieldRate: 0.02,
      veritusMultiplier: 2.0,
      tierBonuses: {
        starter: 0,
        creator: 0.05,
        guardian: 0.10,
        institutional: 0.25
      },
      enableGeoBlocking: true,
      restrictedRegions: ['XX', 'YY'],
      largeTransactionThreshold: 1000,
      complianceAuditFrequency: 24,
      distributionFrequency: 24,
      maxDailyMints: 1000,
      enableAIAdvisor: true,
      enableAutomatedReports: true,
      gttTargetPrice: 0.15,
      priceUpdateFrequency: 300,
      enableRateLimiting: true,
      maxApiCallsPerHour: 1000,
      enableTwoFactor: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-orange-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            ⚙️ System Configuration
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Advanced configuration and settings management for {BRAND_NAME}
          </p>
          <Badge className="bg-orange-600 text-white px-4 py-2">
            <Settings className="w-4 h-4 mr-2" />
            Administrative Access Required
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Save Controls */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Configuration Management</span>
                {lastSaved && (
                  <span className="text-sm text-slate-400">
                    Last saved: {lastSaved}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6"
                  style={{ backgroundColor: BRAND_COLORS.SUCCESS }}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Yield Engine Configuration */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Yield Engine Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="viewRate" className="text-slate-300">View Yield Rate</Label>
                  <Input
                    id="viewRate"
                    type="number"
                    step="0.001"
                    value={config.viewYieldRate}
                    onChange={(e) => setConfig({...config, viewYieldRate: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="shareRate" className="text-slate-300">Share Yield Rate</Label>
                  <Input
                    id="shareRate"
                    type="number"
                    step="0.001"
                    value={config.shareYieldRate}
                    onChange={(e) => setConfig({...config, shareYieldRate: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="resonanceRate" className="text-slate-300">Resonance Yield Rate</Label>
                  <Input
                    id="resonanceRate"
                    type="number"
                    step="0.001"
                    value={config.resonanceYieldRate}
                    onChange={(e) => setConfig({...config, resonanceYieldRate: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="veritusMultiplier" className="text-slate-300">Veritus Multiplier</Label>
                  <Input
                    id="veritusMultiplier"
                    type="number"
                    step="0.1"
                    value={config.veritusMultiplier}
                    onChange={(e) => setConfig({...config, veritusMultiplier: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Configuration */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Compliance & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Enable Geo-blocking</Label>
                    <p className="text-sm text-slate-400">Block access from restricted regions</p>
                  </div>
                  <Switch
                    checked={config.enableGeoBlocking}
                    onCheckedChange={(checked) => setConfig({...config, enableGeoBlocking: checked})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="threshold" className="text-slate-300">Large Transaction Threshold ($)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={config.largeTransactionThreshold}
                    onChange={(e) => setConfig({...config, largeTransactionThreshold: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="auditFreq" className="text-slate-300">Compliance Audit Frequency (hours)</Label>
                  <Input
                    id="auditFreq"
                    type="number"
                    value={config.complianceAuditFrequency}
                    onChange={(e) => setConfig({...config, complianceAuditFrequency: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Enable AI Advisor</Label>
                    <p className="text-sm text-slate-400">AI-powered financial recommendations</p>
                  </div>
                  <Switch
                    checked={config.enableAIAdvisor}
                    onCheckedChange={(checked) => setConfig({...config, enableAIAdvisor: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Automated Reports</Label>
                    <p className="text-sm text-slate-400">Generate nightly treasury reports</p>
                  </div>
                  <Switch
                    checked={config.enableAutomatedReports}
                    onCheckedChange={(checked) => setConfig({...config, enableAutomatedReports: checked})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="distFreq" className="text-slate-300">Distribution Frequency (hours)</Label>
                    <Input
                      id="distFreq"
                      type="number"
                      value={config.distributionFrequency}
                      onChange={(e) => setConfig({...config, distributionFrequency: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMints" className="text-slate-300">Max Daily Mints</Label>
                    <Input
                      id="maxMints"
                      type="number"
                      value={config.maxDailyMints}
                      onChange={(e) => setConfig({...config, maxDailyMints: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Notice */}
          <Card className="bg-yellow-900/20 border-yellow-600">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Configuration Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-200 text-sm">
                Changes to system configuration can affect platform behavior. 
                Test thoroughly in a staging environment before applying to production.
                Some changes may require system restart to take effect.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}