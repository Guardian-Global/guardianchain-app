import { TrendingUp, Trophy, Vote, Coins, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';

const xpData = [
  { name: 'Genesis', XP: 120, votes: 0, proposals: 0, gtt: 100 },
  { name: 'Vote 1', XP: 300, votes: 1, proposals: 0, gtt: 250 },
  { name: 'Vote 2', XP: 500, votes: 2, proposals: 0, gtt: 400 },
  { name: 'Proposal', XP: 800, votes: 2, proposals: 1, gtt: 650 },
  { name: 'Vote 3', XP: 1300, votes: 3, proposals: 1, gtt: 850 },
  { name: 'Vote 4', XP: 1600, votes: 4, proposals: 1, gtt: 1100 },
  { name: 'Proposal 2', XP: 2100, votes: 4, proposals: 2, gtt: 1400 },
];

const participationData = [
  { month: 'Jan', votes: 12, proposals: 3, success: 85 },
  { month: 'Feb', votes: 18, proposals: 5, success: 92 },
  { month: 'Mar', votes: 24, proposals: 4, success: 78 },
  { month: 'Apr', votes: 31, proposals: 7, success: 88 },
  { month: 'May', votes: 28, proposals: 6, success: 95 },
  { month: 'Jun', votes: 35, proposals: 8, success: 91 },
];

export default function DaoXpGraph() {
  const currentStats = {
    totalXP: 2100,
    rank: 12,
    successRate: 91,
    gttWeight: 1400
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-white">DAO Reputation Tracker</span>
          </CardTitle>
          <p className="text-slate-400">
            Visualize GTT governance XP and participation metrics over time
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{currentStats.totalXP.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total XP</div>
              <Trophy className="w-4 h-4 text-yellow-400 mx-auto mt-1" />
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">#{currentStats.rank}</div>
              <div className="text-xs text-slate-400">Global Rank</div>
              <Activity className="w-4 h-4 text-blue-400 mx-auto mt-1" />
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{currentStats.successRate}%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
              <Vote className="w-4 h-4 text-green-400 mx-auto mt-1" />
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{currentStats.gttWeight}</div>
              <div className="text-xs text-slate-400">GTT Weight</div>
              <Coins className="w-4 h-4 text-purple-400 mx-auto mt-1" />
            </div>
          </div>

          {/* XP Progress Chart */}
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">XP Growth Timeline</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={xpData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c7b7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00c7b7" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name) => [`${value} XP`, 'Experience Points']}
                />
                <Area 
                  type="monotone" 
                  dataKey="XP" 
                  stroke="#00c7b7" 
                  fillOpacity={1} 
                  fill="url(#xpGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Participation Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4">Monthly Activity</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={participationData}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="votes" fill="#3B82F6" name="Votes Cast" />
                  <Bar dataKey="proposals" fill="#8B5CF6" name="Proposals Created" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-700/20 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-4">Success Rate Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={participationData}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} domain={[70, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="success" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-600 text-white">🏆 Top 20 Voter</Badge>
              <Badge className="bg-blue-600 text-white">📊 Analytics Expert</Badge>
              <Badge className="bg-green-600 text-white">✅ High Success Rate</Badge>
              <Badge className="bg-purple-600 text-white">💎 GTT Whale</Badge>
              <Badge className="bg-orange-600 text-white">🎯 Proposal Master</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}