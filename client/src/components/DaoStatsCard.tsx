import { Trophy, TrendingUp, Target, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DaoStatsCard = () => {
  const stats = {
    xp: 12345,
    rank: 42,
    successRate: '92%',
    votingWeight: '1,500 GTT',
  };

  const statItems = [
    { label: 'Total XP', value: stats.xp.toLocaleString(), icon: Trophy, color: 'text-yellow-400' },
    { label: 'Global Rank', value: `#${stats.rank}`, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Success Rate', value: stats.successRate, icon: Target, color: 'text-green-400' },
    { label: 'Voting Power', value: stats.votingWeight, icon: Coins, color: 'text-purple-400' }
  ];

  return (
    <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <span className="text-white text-lg font-bold">DAO Reputation Overview</span>
            <p className="text-slate-400 text-sm font-normal">Your governance performance metrics</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4 text-center hover:bg-slate-800/70 transition-colors">
              <div className="flex justify-center mb-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DaoStatsCard;