import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import CapsuleInbox from '@/components/CapsuleInbox';
import NodeLogStream from '@/components/NodeLogStream';
import QueueStats from '@/components/QueueStats';
import YieldClaim from '@/components/YieldClaim';
import PressKitGenerator from '@/components/PressKitGenerator';
import { useAuth } from '@/hooks/useAuth';

function ValidatorDashboard() {
  const { user } = useAuth();

  const validatorStats = {
    totalValidations: 847,
    pendingReviews: 23,
    weeklyEarnings: 156.7,
    reputation: 9.2,
    successRate: 94.3
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-400" />
            Validator Control Panel
          </h1>
          <p className="text-slate-400 mt-2">
            Manage capsule verifications, monitor network activity, and track validator earnings
          </p>
        </div>
        <Badge className="bg-green-600 text-white text-lg px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          Active Validator
        </Badge>
      </div>

      {/* Validator Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{validatorStats.totalValidations}</div>
            <div className="text-sm text-slate-400">Total Validations</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{validatorStats.pendingReviews}</div>
            <div className="text-sm text-slate-400">Pending Reviews</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{validatorStats.weeklyEarnings}</div>
            <div className="text-sm text-slate-400">Weekly GTT</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{validatorStats.reputation}/10</div>
            <div className="text-sm text-slate-400">Reputation</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{validatorStats.successRate}%</div>
            <div className="text-sm text-slate-400">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capsule Inbox - Takes up more space */}
        <div className="lg:col-span-2">
          <CapsuleInbox />
        </div>
        
        {/* Sidebar Components */}
        <div className="space-y-6">
          <QueueStats />
          <YieldClaim 
            availableYield={validatorStats.weeklyEarnings} 
            totalEarned={2847.3}
            nextClaimTime={new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()}
          />
          <PressKitGenerator />
        </div>
      </div>

      {/* Node Log Stream - Full Width */}
      <div className="w-full">
        <NodeLogStream />
      </div>

      {/* Validator Performance Insights */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Validator Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Top 5% Validator</h3>
              <p className="text-slate-400 text-sm">
                Your validation accuracy places you in the top 5% of all validators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trusted Authority</h3>
              <p className="text-slate-400 text-sm">
                Community members frequently request your validation on high-stakes capsules
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Reputation Leader</h3>
              <p className="text-slate-400 text-sm">
                Your 9.2/10 reputation score demonstrates consistent, high-quality validations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Protect this route - only Creators and above can access validator dashboard
