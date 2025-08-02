import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  Unlock, 
  Lock, 
  Shield, 
  Star, 
  Calendar,
  Filter,
  Search,
  Eye,
  Download,
  ExternalLink
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { EliteHero } from '@/components/ui/elite-hero';
import { EliteCard, EliteCardContent, EliteCardHeader } from '@/components/ui/elite-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimelineEvent {
  id: string;
  type: 'unlock' | 'mint' | 'verify' | 'stake' | 'reward';
  title: string;
  description: string;
  timestamp: string;
  capsuleId?: string;
  truthScore?: number;
  amount?: string;
  status: 'completed' | 'pending' | 'scheduled';
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'unlock',
    title: 'Family Legacy Capsule Unlocked',
    description: 'Time-locked family heritage documentation became available for viewing',
    timestamp: '2024-08-01T10:30:00Z',
    capsuleId: 'cap_1234',
    truthScore: 95,
    status: 'completed'
  },
  {
    id: '2',
    type: 'reward',
    title: 'GTT Yield Earned',
    description: 'Monthly yield distribution from verified capsules',
    timestamp: '2024-08-01T09:00:00Z',
    amount: '127.5 GTT',
    status: 'completed'
  },
  {
    id: '3',
    type: 'verify',
    title: 'Whistleblower Evidence Verified',
    description: 'Community verification consensus reached for corporate misconduct evidence',
    timestamp: '2024-07-30T16:45:00Z',
    capsuleId: 'cap_5678',
    truthScore: 98,
    status: 'completed'
  },
  {
    id: '4',
    type: 'mint',
    title: 'Research Data Capsule Minted',
    description: 'Climate research documentation sealed with blockchain verification',
    timestamp: '2024-07-29T14:20:00Z',
    capsuleId: 'cap_9012',
    truthScore: 92,
    status: 'completed'
  },
  {
    id: '5',
    type: 'stake',
    title: 'GTT Staked for Validation',
    description: 'Tokens staked to participate in consensus validation',
    timestamp: '2024-07-28T11:15:00Z',
    amount: '500 GTT',
    status: 'completed'
  },
  {
    id: '6',
    type: 'unlock',
    title: 'Personal Testimony Ready',
    description: 'Historical testimony capsule will unlock in 2 days',
    timestamp: '2024-08-04T12:00:00Z',
    capsuleId: 'cap_3456',
    truthScore: 89,
    status: 'scheduled'
  },
];

const eventTypeConfig = {
  unlock: { icon: Unlock, color: 'text-green-400', bg: 'bg-green-400/10' },
  mint: { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  verify: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  stake: { icon: Lock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  reward: { icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
};

export default function EliteTimeline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEvents = mockTimelineEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays > 0) return `${diffInDays} days ago`;
    return `In ${Math.abs(diffInDays)} days`;
  };

  const handleViewCapsule = (capsuleId: string) => {
    console.log('Viewing capsule:', capsuleId);
    // Navigate to capsule details
  };

  const handleDownloadCapsule = (capsuleId: string) => {
    console.log('Downloading capsule:', capsuleId);
    // Handle capsule download
  };

  return (
    <EliteLayout>
      <EliteHero
        title="Timeline"
        subtitle="Your Truth Journey"
        description="Track capsule unlocks, verifications, rewards, and all activities in your GuardianChain journey with chronological precision."
        badge="Live Timeline"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search timeline events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="unlock">Unlocks</SelectItem>
                <SelectItem value="mint">Mints</SelectItem>
                <SelectItem value="verify">Verifications</SelectItem>
                <SelectItem value="stake">Stakes</SelectItem>
                <SelectItem value="reward">Rewards</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 to-amber-500"></div>

          {/* Timeline Events */}
          <div className="space-y-8">
            {filteredEvents.map((event, index) => {
              const config = eventTypeConfig[event.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={event.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full ${config.bg} border-2 border-current ${config.color} flex items-center justify-center z-10`}>
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>

                  {/* Event Card */}
                  <div className="ml-16">
                    <EliteCard className="hover:border-white/20 transition-all duration-200">
                      <EliteCardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                              <Icon className={`h-5 w-5 ${config.color}`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                              <p className="text-gray-400 text-sm">{formatDate(event.timestamp)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={event.status === 'completed' ? 'default' : 
                                     event.status === 'pending' ? 'secondary' : 'outline'}
                            >
                              {event.status}
                            </Badge>
                            {event.truthScore && (
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {event.truthScore}% Truth
                              </Badge>
                            )}
                          </div>
                        </div>
                      </EliteCardHeader>
                      
                      <EliteCardContent>
                        <p className="text-gray-300 mb-4">{event.description}</p>
                        
                        {/* Event Details */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          {event.capsuleId && (
                            <div className="flex items-center space-x-2 text-gray-400">
                              <Shield className="h-4 w-4" />
                              <span>Capsule: {event.capsuleId}</span>
                            </div>
                          )}
                          {event.amount && (
                            <div className="flex items-center space-x-2 text-yellow-400">
                              <Clock className="h-4 w-4" />
                              <span>{event.amount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        {event.capsuleId && event.status === 'completed' && (
                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewCapsule(event.capsuleId!)}
                              className="flex items-center space-x-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadCapsule(event.capsuleId!)}
                              className="flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          </div>
                        )}
                      </EliteCardContent>
                    </EliteCard>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Your timeline will appear here as you interact with GuardianChain'}
            </p>
            <Button 
              onClick={() => window.location.href = '/mint'}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold"
            >
              <Shield className="w-4 h-4 mr-2" />
              Create First Capsule
            </Button>
          </motion.div>
        )}
      </div>
    </EliteLayout>
  );
}