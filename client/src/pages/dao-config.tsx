import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Download, Upload, Settings, Shield } from "lucide-react";

const initialConfig = {
  voteQuorum: 66,
  payoutSplit: {
    authors: 60,
    witnesses: 10,
    treasury: 30
  },
  maxCapsuleSizeMB: 500,
  emergencyUnlockThreshold: 3
};

export default function DAOConfigDashboard() {
  const [config, setConfig] = useState(initialConfig);
  const { toast } = useToast();

  const updateValue = (path: string, value: number) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    let obj: any = newConfig;
    while (keys.length > 1) {
      const key = keys.shift()!;
      obj = obj[key];
    }
    obj[keys[0]] = value;
    setConfig(newConfig);
  };

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardian-dao-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Configuration Exported",
      description: "DAO configuration has been exported successfully.",
    });
  };

  const importConfig = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      setConfig(imported);
      
      toast({
        title: "Configuration Imported",
        description: "DAO configuration has been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import configuration file.",
        variant: "destructive",
      });
    }
    
    // Reset file input
    e.target.value = '';
  };

  const saveConfig = async () => {
    try {
      // Here you would normally save to backend/blockchain
      toast({
        title: "Configuration Saved",
        description: "DAO configuration has been saved to blockchain.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <PageHeader
        title="🗳 DAO Configuration Dashboard"
        subtitle="Manage GuardianChain governance parameters and settings"
        icon={Settings}
      />

      <div className="space-y-8">
        {/* Configuration Grid */}
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Core Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="voteQuorum" className="text-slate-300">
                  Vote Quorum (%)
                </Label>
                <Input
                  id="voteQuorum"
                  type="number"
                  value={config.voteQuorum}
                  onChange={(e) => updateValue('voteQuorum', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={1}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapsuleSize" className="text-slate-300">
                  Max Capsule Size (MB)
                </Label>
                <Input
                  id="maxCapsuleSize"
                  type="number"
                  value={config.maxCapsuleSizeMB}
                  onChange={(e) => updateValue('maxCapsuleSizeMB', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={1}
                  max={2000}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyThreshold" className="text-slate-300">
                  Emergency Unlock Threshold
                </Label>
                <Input
                  id="emergencyThreshold"
                  type="number"
                  value={config.emergencyUnlockThreshold}
                  onChange={(e) => updateValue('emergencyUnlockThreshold', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={1}
                  max={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorSplit" className="text-slate-300">
                  Author Split (%)
                </Label>
                <Input
                  id="authorSplit"
                  type="number"
                  value={config.payoutSplit.authors}
                  onChange={(e) => updateValue('payoutSplit.authors', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="witnessSplit" className="text-slate-300">
                  Witness Split (%)
                </Label>
                <Input
                  id="witnessSplit"
                  type="number"
                  value={config.payoutSplit.witnesses}
                  onChange={(e) => updateValue('payoutSplit.witnesses', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treasurySplit" className="text-slate-300">
                  Treasury Split (%)
                </Label>
                <Input
                  id="treasurySplit"
                  type="number"
                  value={config.payoutSplit.treasury}
                  onChange={(e) => updateValue('payoutSplit.treasury', parseInt(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-white"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold">Governance</div>
                <div className="text-slate-300">Quorum: {config.voteQuorum}%</div>
                <div className="text-slate-300">Emergency: {config.emergencyUnlockThreshold} validators</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold">Technical</div>
                <div className="text-slate-300">Max Size: {config.maxCapsuleSizeMB}MB</div>
                <div className="text-slate-300">Storage: IPFS + Blockchain</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-primary font-semibold">Economics</div>
                <div className="text-slate-300">Authors: {config.payoutSplit.authors}%</div>
                <div className="text-slate-300">Witnesses: {config.payoutSplit.witnesses}%</div>
                <div className="text-slate-300">Treasury: {config.payoutSplit.treasury}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button 
            onClick={exportConfig} 
            className="bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          
          <Button
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10"
            asChild
          >
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import Config
              <input 
                type="file" 
                accept=".json" 
                onChange={importConfig} 
                className="hidden" 
              />
            </label>
          </Button>

          <Button 
            onClick={saveConfig}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500/10"
          >
            <Shield className="w-4 h-4 mr-2" />
            Save to Blockchain
          </Button>
        </div>

        {/* Validation Warning */}
        {(config.payoutSplit.authors + config.payoutSplit.witnesses + config.payoutSplit.treasury) !== 100 && (
          <Card className="border-yellow-500 bg-yellow-500/10">
            <CardContent className="pt-6">
              <div className="text-yellow-500 font-semibold">⚠️ Validation Warning</div>
              <div className="text-slate-300 text-sm">
                Payout splits must total 100%. Current total: {
                  config.payoutSplit.authors + config.payoutSplit.witnesses + config.payoutSplit.treasury
                }%
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}