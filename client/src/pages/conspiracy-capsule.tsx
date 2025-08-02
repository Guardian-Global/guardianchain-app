import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Shield,
  Lock,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  Globe,
} from "lucide-react";

export default function ConspiracyCapsulePage() {
  const [conspiracyData, setConspiracyData] = useState({
    title: "",
    allegation: "",
    evidence: "",
    securityLevel: "high",
    category: "corporate",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Conspiracy Capsule Created",
      description:
        "Your secure conspiracy disclosure has been submitted for verification.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Conspiracy Capsule
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Secure conspiracy disclosure portal. Submit sensitive allegations
            with military-grade encryption and witness protection protocols for
            maximum safety.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Secure Conspiracy Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Conspiracy Title (Anonymous ID will be assigned)"
                  value={conspiracyData.title}
                  onChange={(e) =>
                    setConspiracyData({
                      ...conspiracyData,
                      title: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                />
                <Textarea
                  placeholder="Detailed conspiracy allegation, key players, timeline, and methods..."
                  value={conspiracyData.allegation}
                  onChange={(e) =>
                    setConspiracyData({
                      ...conspiracyData,
                      allegation: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 min-h-[200px]"
                />
                <Textarea
                  placeholder="Supporting evidence, documents, witness accounts, or data sources..."
                  value={conspiracyData.evidence}
                  onChange={(e) =>
                    setConspiracyData({
                      ...conspiracyData,
                      evidence: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 min-h-[150px]"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Security Level
                    </label>
                    <select
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={conspiracyData.securityLevel}
                      onChange={(e) =>
                        setConspiracyData({
                          ...conspiracyData,
                          securityLevel: e.target.value,
                        })
                      }
                    >
                      <option value="maximum">
                        Maximum (Tor + Encryption)
                      </option>
                      <option value="high">High (Anonymous)</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Category
                    </label>
                    <select
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={conspiracyData.category}
                      onChange={(e) =>
                        setConspiracyData({
                          ...conspiracyData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="corporate">Corporate Conspiracy</option>
                      <option value="government">Government Cover-up</option>
                      <option value="financial">Financial Fraud</option>
                      <option value="scientific">Scientific Suppression</option>
                      <option value="environmental">
                        Environmental Cover-up
                      </option>
                      <option value="medical">Medical Conspiracy</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Evidence Files
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Encrypted Backup
                  </Button>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Submit Conspiracy Capsule
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-yellow-400" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Anonymous Submission</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Tor Network Routing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">
                      Witness Protection Protocols
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Blockchain Immutability</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Legal Shield Protection</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Recent Disclosures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">
                        Corporate Price Fixing
                      </h4>
                      <Badge className="bg-red-600">INVESTIGATING</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Anonymous #47291 - Evidence of coordinated pricing...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      <span>3,247 views</span>
                      <FileText className="w-3 h-3" />
                      <span>12 documents</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">
                        Research Data Suppression
                      </h4>
                      <Badge className="bg-orange-600">VERIFIED</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Anonymous #42885 - Clinical trial results hidden...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3 h-3" />
                      <span>8,291 views</span>
                      <FileText className="w-3 h-3" />
                      <span>23 documents</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Safety Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-yellow-900/20 to-red-900/20 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>Maximum Security Protocol Active</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    Your identity is completely protected. All submissions are
                    anonymized, encrypted, and routed through secure networks.
                    Legal protection frameworks are automatically activated for
                    high-risk disclosures.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
