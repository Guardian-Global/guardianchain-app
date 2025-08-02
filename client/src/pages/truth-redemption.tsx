import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  MessageSquare,
  Trophy,
  Users,
  CheckCircle,
  Star,
  Clock,
} from "lucide-react";

export default function TruthRedemptionPage() {
  const [redemptionData, setRedemptionData] = useState({
    title: "",
    acknowledgment: "",
    category: "personal",
    publicLevel: "community",
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Truth Redemption Submitted",
      description:
        "Your public acknowledgment has been posted to the community.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-pink-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Truth Redemption
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Public acknowledgments and apologies. Take responsibility, make
            amends, and rebuild trust through transparent community
            accountability.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Submit Truth Redemption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Acknowledgment Title"
                  value={redemptionData.title}
                  onChange={(e) =>
                    setRedemptionData({
                      ...redemptionData,
                      title: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                />
                <Textarea
                  placeholder="Your public acknowledgment, apology, or commitment to change..."
                  value={redemptionData.acknowledgment}
                  onChange={(e) =>
                    setRedemptionData({
                      ...redemptionData,
                      acknowledgment: e.target.value,
                    })
                  }
                  className="bg-slate-700 border-slate-600 min-h-[200px]"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Category
                    </label>
                    <select
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={redemptionData.category}
                      onChange={(e) =>
                        setRedemptionData({
                          ...redemptionData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="personal">Personal</option>
                      <option value="professional">Professional</option>
                      <option value="corporate">Corporate</option>
                      <option value="public">Public Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Visibility
                    </label>
                    <select
                      className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
                      value={redemptionData.publicLevel}
                      onChange={(e) =>
                        setRedemptionData({
                          ...redemptionData,
                          publicLevel: e.target.value,
                        })
                      }
                    >
                      <option value="community">Community</option>
                      <option value="public">Fully Public</option>
                      <option value="stakeholders">Stakeholders Only</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Submit Truth Redemption
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Recent Redemptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">
                        CEO Public Apology
                      </h4>
                      <Badge className="bg-green-600">Verified</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Acknowledging data breach oversight...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>2.3K views</span>
                      <Star className="w-3 h-3" />
                      <span>89% positive</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">
                        Research Methodology Correction
                      </h4>
                      <Badge className="bg-blue-600">Community</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Correcting previous study limitations...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>456 views</span>
                      <Star className="w-3 h-3" />
                      <span>94% positive</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">
                        Policy Reversal Acknowledgment
                      </h4>
                      <Badge className="bg-purple-600">Official</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Admitting policy implementation errors...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      <span>1.1K views</span>
                      <Star className="w-3 h-3" />
                      <span>76% positive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Redemption Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Redemptions</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Community Trust Score</span>
                  <span className="font-semibold text-green-400">+23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Positive Feedback</span>
                  <span className="font-semibold">91.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Policy Changes</span>
                  <span className="font-semibold text-blue-400">47</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
