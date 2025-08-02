import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Coins, 
  Eye, 
  Clock,
  Award,
  Activity
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { EliteHero } from '@/components/ui/elite-hero';
import { StatsCard } from '@/components/ui/elite-card';

const monthlyData = [
  { name: 'Jan', capsules: 24, gtt: 1200, users: 89 },
  { name: 'Feb', capsules: 41, gtt: 2100, users: 156 },
  { name: 'Mar', capsules: 33, gtt: 1800, users: 203 },
  { name: 'Apr', capsules: 58, gtt: 3200, users: 289 },
  { name: 'May', capsules: 47, gtt: 2800, users: 334 },
  { name: 'Jun', capsules: 62, gtt: 3800, users: 401 },
  { name: 'Jul', capsules: 71, gtt: 4200, users: 478 },
  { name: 'Aug', capsules: 89, gtt: 5100, users: 567 },
];

const categoryData = [
  { name: 'Personal', value: 35, color: '#FFD700' },
  { name: 'Whistleblower', value: 28, color: '#FF6B6B' },
  { name: 'Research', value: 18, color: '#4ECDC4' },
  { name: 'Testimony', value: 12, color: '#45B7D1' },
  { name: 'Legacy', value: 7, color: '#96CEB4' },
];

const truthScoreData = [
  { score: '90-100', count: 42, percentage: 47 },
  { score: '80-89', count: 28, percentage: 31 },
  { score: '70-79', count: 15, percentage: 17 },
  { score: '60-69', count: 4, percentage: 4 },
  { score: '50-59', count: 1, percentage: 1 },
];

export default function EliteStats() {
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/capsules'],
  });

  const statsOverview = [
    { 
      title: 'Total Capsules', 
      value: '1,247', 
      icon: Shield, 
      trend: { value: 23, label: 'this month' },
      subtitle: 'Truth capsules created'
    },
    { 
      title: 'Active Users', 
      value: '567', 
      icon: Users, 
      trend: { value: 18, label: 'this month' },
      subtitle: 'Guardian community'
    },
    { 
      title: 'GTT Earned', 
      value: '45.7K', 
      icon: Coins, 
      trend: { value: 31, label: 'this month' },
      subtitle: 'Total yield distributed'
    },
    { 
      title: 'Truth Score', 
      value: '94.2%', 
      icon: Award, 
      trend: { value: 5, label: 'improvement' },
      subtitle: 'Average verification'
    },
    { 
      title: 'Unlocks Today', 
      value: '12', 
      icon: Clock, 
      subtitle: 'Capsules ready'
    },
    { 
      title: 'Network Health', 
      value: '99.8%', 
      icon: Activity, 
      trend: { value: 0.2, label: 'uptime' },
      subtitle: 'Validator network'
    },
  ];

  return (
    <EliteLayout>
      <EliteHero
        title="Analytics Dashboard"
        subtitle="Truth Network Intelligence"
        description="Comprehensive insights into the GuardianChain ecosystem, including capsule statistics, yield metrics, and network health monitoring."
        badge="Live Data"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statsOverview.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Monthly Growth Chart */}
          <motion.div
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="capsules" 
                  stroke="#FFD700" 
                  fill="#FFD700"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6">Capsule Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* GTT Yield Chart */}
        <motion.div
          className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">GTT Yield Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="gtt" 
                stroke="#FFD700" 
                strokeWidth={3}
                dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Truth Score Distribution */}
        <motion.div
          className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Truth Score Distribution</h3>
          <div className="space-y-4">
            {truthScoreData.map((item, index) => (
              <div key={item.score} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-400">{item.score}%</div>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-300 text-right">{item.count}</div>
                <div className="w-12 text-sm text-yellow-400 text-right">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </EliteLayout>
  );
}