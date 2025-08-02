import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Database, 
  Zap, 
  TrendingUp, 
  Clock,
  MemoryStick,
  Cpu,
  Activity,
  ArrowRight,
  Sparkles,
  Eye,
  Search,
  BookOpen,
  Users,
  Target,
  Settings
} from 'lucide-react';

interface MemoryNode {
  id: string;
  type: 'personal' | 'shared' | 'system' | 'learned';
  content: string;
  importance: number;
  accessCount: number;
  lastAccessed: Date;
  connections: string[];
  emotionalWeight: number;
  context: string[];
}

interface AgentMetrics {
  totalMemories: number;
  activeConnections: number;
  memoryEfficiency: number;
  recallAccuracy: number;
  learningRate: number;
  compressionRatio: number;
}

interface MemoryInsight {
  type: 'pattern' | 'gap' | 'optimization' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

const SAMPLE_MEMORIES: MemoryNode[] = [
  {
    id: '1',
    type: 'personal',
    content: 'User prefers technical explanations with practical examples',
    importance: 95,
    accessCount: 847,
    lastAccessed: new Date('2024-08-02T07:10:00'),
    connections: ['2', '5'],
    emotionalWeight: 0.8,
    context: ['communication', 'learning-style', 'preferences']
  },
  {
    id: '2',
    type: 'learned',
    content: 'GuardianChain protocol uses tier-based access control system',
    importance: 92,
    accessCount: 623,
    lastAccessed: new Date('2024-08-02T07:08:00'),
    connections: ['1', '3', '4'],
    emotionalWeight: 0.6,
    context: ['authentication', 'platform-architecture', 'security']
  },
  {
    id: '3',
    type: 'system',
    content: 'Memory capsules require emotional resonance scoring for validation',
    importance: 88,
    accessCount: 234,
    lastAccessed: new Date('2024-08-02T06:45:00'),
    connections: ['2', '6'],
    emotionalWeight: 0.9,
    context: ['validation', 'emotional-analysis', 'quality-metrics']
  },
  {
    id: '4',
    type: 'shared',
    content: 'Community verification increases capsule staking rewards',
    importance: 85,
    accessCount: 456,
    lastAccessed: new Date('2024-08-02T07:05:00'),
    connections: ['2', '7'],
    emotionalWeight: 0.7,
    context: ['rewards', 'community', 'staking', 'verification']
  },
  {
    id: '5',
    type: 'personal',
    content: 'User values comprehensive documentation and clear explanations',
    importance: 90,
    accessCount: 512,
    lastAccessed: new Date('2024-08-02T07:12:00'),
    connections: ['1'],
    emotionalWeight: 0.8,
    context: ['documentation', 'communication', 'user-experience']
  }
];

const AGENT_METRICS: AgentMetrics = {
  totalMemories: 1247,
  activeConnections: 3456,
  memoryEfficiency: 94.7,
  recallAccuracy: 97.2,
  learningRate: 8.9,
  compressionRatio: 12.4
};

const MEMORY_INSIGHTS: MemoryInsight[] = [
  {
    type: 'pattern',
    title: 'High User Communication Preference Correlation',
    description: 'Strong pattern detected: user consistently prefers detailed technical explanations',
    impact: 'high',
    actionable: true
  },
  {
    type: 'optimization',
    title: 'Memory Consolidation Opportunity',
    description: 'Similar authentication-related memories could be consolidated for efficiency',
    impact: 'medium',
    actionable: true
  },
  {
    type: 'gap',
    title: 'Limited Project History Context',
    description: 'More historical project context could improve decision-making accuracy',
    impact: 'medium',
    actionable: false
  },
  {
    type: 'recommendation',
    title: 'Increase Emotional Weight Tracking',
    description: 'Enhanced emotional context tracking could improve user interaction quality',
    impact: 'high',
    actionable: true
  }
];

const typeColors = {
  personal: 'from-blue-500 to-blue-600',
  shared: 'from-green-500 to-green-600',
  system: 'from-purple-500 to-purple-600',
  learned: 'from-orange-500 to-orange-600'
};

const impactColors = {
  low: 'bg-gray-500/20 text-gray-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  high: 'bg-red-500/20 text-red-300'
};

const insightTypeIcons = {
  pattern: TrendingUp,
  gap: Target,
  optimization: Cpu,
  recommendation: Sparkles
};

export default function OptimizedAgentMemory() {
  const [memories, setMemories] = useState(SAMPLE_MEMORIES);
  const [metrics, setMetrics] = useState(AGENT_METRICS);
  const [insights, setInsights] = useState(MEMORY_INSIGHTS);
  const [selectedMemory, setSelectedMemory] = useState<MemoryNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.context.some(ctx => ctx.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || memory.type === filterType;
    return matchesSearch && matchesType;
  });

  const runMemoryOptimization = () => {
    setIsOptimizing(true);
    
    // Simulate memory optimization process
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        memoryEfficiency: Math.min(100, prev.memoryEfficiency + Math.random() * 2),
        compressionRatio: prev.compressionRatio + Math.random() * 0.5
      }));
      setIsOptimizing(false);
    }, 3000);
  };

  const MemoryNodeCard = ({ memory }: { memory: MemoryNode }) => {
    const Icon = memory.type === 'personal' ? Users :
                 memory.type === 'shared' ? Database :
                 memory.type === 'system' ? Settings :
                 BookOpen;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => setSelectedMemory(memory)}
      >
        <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="text-purple-400" size={16} />
                <Badge className={`bg-gradient-to-r ${typeColors[memory.type]} text-white text-xs`}>
                  {memory.type}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Importance</div>
                <div className="text-sm font-bold text-white">{memory.importance}%</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {memory.content}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Access Count</span>
                <span className="text-white">{memory.accessCount}</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Emotional Weight</span>
                <span className="text-white">{(memory.emotionalWeight * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Connections</span>
                <span className="text-white">{memory.connections.length}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {memory.context.slice(0, 2).map((ctx, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                    {ctx}
                  </Badge>
                ))}
                {memory.context.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-600">
                    +{memory.context.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const MetricCard = ({ title, value, unit, icon: Icon, description }: any) => (
    <Card className="bg-slate-800/80 backdrop-blur-sm border-blue-500/30">
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <Icon className="text-blue-400" size={24} />
          <div className="flex-1">
            <div className="text-2xl font-bold text-white">{value}{unit}</div>
            <div className="text-sm text-gray-400">{title}</div>
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const InsightCard = ({ insight }: { insight: MemoryInsight }) => {
    const Icon = insightTypeIcons[insight.type];
    
    return (
      <Card className="bg-slate-800/50 border-gray-500/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Icon className="text-purple-400 mt-1" size={18} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold text-sm">{insight.title}</h3>
                <Badge className={`text-xs ${impactColors[insight.impact]}`}>
                  {insight.impact} impact
                </Badge>
              </div>
              <p className="text-gray-300 text-xs mb-3">{insight.description}</p>
              {insight.actionable && (
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-6">
                  <ArrowRight size={12} className="mr-1" />
                  Optimize
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="text-blue-400" />
            Optimized Agent Memory
            <MemoryStick className="text-purple-400" />
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced memory management system for intelligent context preservation and recall
          </p>
        </motion.div>

        {/* Memory Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <MetricCard
            title="Memory Efficiency"
            value={metrics.memoryEfficiency.toFixed(1)}
            unit="%"
            icon={Cpu}
            description="Optimization level of stored memories"
          />
          <MetricCard
            title="Recall Accuracy"
            value={metrics.recallAccuracy.toFixed(1)}
            unit="%"
            icon={Target}
            description="Precision of memory retrieval"
          />
          <MetricCard
            title="Total Memories"
            value={metrics.totalMemories.toLocaleString()}
            unit=""
            icon={Database}
            description="Active memory nodes in system"
          />
          <MetricCard
            title="Active Connections"
            value={metrics.activeConnections.toLocaleString()}
            unit=""
            icon={Activity}
            description="Inter-memory relationships"
          />
          <MetricCard
            title="Learning Rate"
            value={metrics.learningRate.toFixed(1)}
            unit="/hr"
            icon={TrendingUp}
            description="New memory formation speed"
          />
          <MetricCard
            title="Compression Ratio"
            value={metrics.compressionRatio.toFixed(1)}
            unit=":1"
            icon={Zap}
            description="Memory storage efficiency"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Memory Browser */}
          <div className="lg:col-span-2">
            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Card className="bg-slate-800/80 backdrop-blur-sm border-purple-500/30">
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        placeholder="Search memories, context, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder-gray-400 text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="personal">Personal</option>
                        <option value="shared">Shared</option>
                        <option value="system">System</option>
                        <option value="learned">Learned</option>
                      </select>
                      
                      <Button
                        onClick={runMemoryOptimization}
                        disabled={isOptimizing}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                        size="sm"
                      >
                        {isOptimizing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain size={14} className="mr-2" />
                            </motion.div>
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Zap size={14} className="mr-2" />
                            Optimize
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Memory Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              {filteredMemories.map((memory) => (
                <MemoryNodeCard key={memory.id} memory={memory} />
              ))}
            </motion.div>
          </div>

          {/* Insights Panel */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="text-yellow-400" />
                Memory Insights
              </h2>
              
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </motion.div>

            {/* Memory Health Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-slate-800/80 backdrop-blur-sm border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="text-green-400" />
                    Memory Health
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Overall Health</span>
                        <span className="text-white">97%</span>
                      </div>
                      <Progress value={97} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Connection Integrity</span>
                        <span className="text-white">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Compression Efficiency</span>
                        <span className="text-white">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    
                    <div className="pt-3 border-t border-slate-600">
                      <div className="flex items-center gap-2 text-green-300 text-sm">
                        <Activity size={14} />
                        <span>All systems optimal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Memory Detail Modal */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge className={`mb-2 bg-gradient-to-r ${typeColors[selectedMemory.type]} text-white`}>
                      {selectedMemory.type}
                    </Badge>
                    <h2 className="text-xl font-bold text-white">Memory Details</h2>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedMemory(null)}>
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Content</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedMemory.content}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Metrics</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Importance:</span>
                          <span className="text-white">{selectedMemory.importance}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Access Count:</span>
                          <span className="text-white">{selectedMemory.accessCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Emotional Weight:</span>
                          <span className="text-white">{(selectedMemory.emotionalWeight * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Connections:</span>
                          <span className="text-white">{selectedMemory.connections.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Context Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedMemory.context.map((ctx, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {ctx}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Last Accessed</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock size={16} />
                      <span>{selectedMemory.lastAccessed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}