import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shield, Zap, Crown, TrendingUp, Users, FileText, Settings } from 'lucide-react';
import CapsuleDrawer from '@/components/CapsuleDrawer';
import CapsuleList from '@/components/CapsuleList';

export default function DashboardPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Pro Dashboard
              </h1>
              <p className="text-xl text-slate-300">
                Welcome to your GUARDIANCHAIN dashboard. Access advanced tools and insights.
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Pro Access
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Stats */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Truth Capsules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">12</div>
                <p className="text-sm text-slate-400">Created this month</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  GTT Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">847</div>
                <p className="text-sm text-slate-400">Total tokens earned</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-1">34</div>
                <p className="text-sm text-slate-400">Participated in</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pro Features */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Pro Features Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="font-medium">Veritas Seal</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="font-medium">Truth Bounty</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="font-medium">Truth Redemption</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="font-medium">Conspiracy Capsule</span>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Capsule List */}
            <div className="bg-white">
              <CapsuleList />
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => window.location.href = '/create-capsule'}
                  className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-center transition-all"
                >
                  <FileText className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Create Capsule</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/veritas-seal'}
                  className="p-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg text-center transition-all"
                >
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Veritas Seal</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/truth-bounty'}
                  className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-center transition-all"
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Truth Bounty</span>
                </button>
                <button 
                  onClick={() => window.location.href = '/analytics'}
                  className="p-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-lg text-center transition-all"
                >
                  <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Enhanced Capsule Drawer */}
      <CapsuleDrawer />
    </>
  );
}