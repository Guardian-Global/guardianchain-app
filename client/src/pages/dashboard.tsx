import { useQuery } from "@tanstack/react-query";
import { Shield, Users, TrendingUp, Star, AlertTriangle, CheckCircle, Clock, Eye, Share2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CapsuleCard from "@/components/capsule/capsule-card";
import { Link } from "wouter";

export default function OperatorDashboard() {
  const { data: capsules, isLoading: capsulesLoading } = useQuery({
    queryKey: ["/api/capsules"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: moderationQueue } = useQuery({
    queryKey: ["/api/moderation/queue"],
  });

  // Calculate operator metrics
  const sealedCapsules = capsules?.filter((c: any) => c.isSealed) || [];
  const pendingCapsules = capsules?.filter((c: any) => !c.isSealed) || [];
  const highGriefCapsules = capsules?.filter((c: any) => c.griefScore > 80) || [];
  const totalGriefScore = capsules?.reduce((sum: number, c: any) => sum + (c.griefScore || 0), 0) || 0;
  const avgGriefScore = capsules?.length ? Math.round(totalGriefScore / capsules.length) : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Operator Dashboard
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Monitor capsule activity, seal status, and grief analytics in real-time
            </p>
          </div>
        </div>
      </section>

      {/* Operator Metrics */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Capsules</p>
                    <p className="text-3xl font-bold text-white">
                      {capsulesLoading ? "..." : capsules?.length || 0}
                    </p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Sealed Capsules</p>
                    <p className="text-3xl font-bold text-green-400">
                      {sealedCapsules.length}
                    </p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={(sealedCapsules.length / (capsules?.length || 1)) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg Grief Score</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {avgGriefScore}
                    </p>
                  </div>
                  <div className="bg-yellow-600 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress 
                    value={avgGriefScore} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">High Priority</p>
                    <p className="text-3xl font-bold text-red-400">
                      {highGriefCapsules.length}
                    </p>
                  </div>
                  <div className="bg-red-600 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Center */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/commander">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Commander Panel
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-slate-600">
                  Export Analytics
                </Button>
                <Button variant="outline" className="w-full border-slate-600">
                  Sync Capsule Index
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Moderation Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Pending Review</span>
                    <span className="text-yellow-400">{moderationQueue?.pending || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Flagged Content</span>
                    <span className="text-red-400">{moderationQueue?.flagged || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Auto-Approved</span>
                    <span className="text-green-400">{moderationQueue?.approved || 0}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-slate-600">
                  Review Queue
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">API Status</span>
                    <Badge variant="default" className="bg-green-600">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Database</span>
                    <Badge variant="default" className="bg-green-600">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">IPFS</span>
                    <Badge variant="default" className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">DocuSign</span>
                    <Badge variant="default" className="bg-green-600">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Capsules */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Capsules</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-600">
                  All
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  Sealed
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  Pending
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600">
                  High Grief
                </Button>
              </div>
            </div>

            {capsulesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="h-48 bg-slate-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {capsules?.slice(0, 8).map((capsule: any) => (
                  <Card key={capsule.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              ID: {capsule.id}
                            </Badge>
                            <Badge 
                              variant={capsule.isSealed ? "default" : "outline"}
                              className={capsule.isSealed ? "bg-green-600" : "border-yellow-500 text-yellow-400"}
                            >
                              {capsule.isSealed ? "Sealed" : "Unsealed"}
                            </Badge>
                            {capsule.griefScore > 80 && (
                              <Badge variant="outline" className="border-red-500 text-red-400">
                                High Priority
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1">{capsule.title || `Capsule #${capsule.id}`}</h3>
                          <p className="text-slate-400 text-sm mb-2">Creator: {capsule.creator}</p>
                          <p className="text-slate-300 text-sm line-clamp-2">
                            {capsule.content?.substring(0, 120)}...
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-yellow-400 mb-1">
                            {capsule.griefScore || 0}
                          </div>
                          <div className="text-xs text-slate-400">Grief Score</div>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}