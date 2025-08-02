import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Lock, 
  Unlock, 
  Eye,
  Star,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';
import { EliteLayout } from '@/components/layout/EliteLayout';
import { EliteHero } from '@/components/ui/elite-hero';
import { CapsuleCard, StatsCard } from '@/components/ui/elite-card';
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

interface Capsule {
  id: string;
  title: string;
  description: string;
  truthScore: number;
  status: 'locked' | 'unlockable' | 'unlocked';
  unlockDate?: string;
  category: string;
  createdAt: string;
  preview?: string;
}

export default function EliteVault() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { data: capsules = [], isLoading } = useQuery({
    queryKey: ['/api/capsules'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/user/stats'],
  });

  // Mock data for demonstration
  const mockCapsules: Capsule[] = [
    {
      id: '1',
      title: 'Family Legacy Documentation',
      description: 'Comprehensive family history and heritage preservation with photos, documents, and personal stories spanning three generations.',
      truthScore: 95,
      status: 'unlocked',
      category: 'Personal',
      createdAt: '2024-01-15',
      unlockDate: '2024-08-01'
    },
    {
      id: '2',
      title: 'Corporate Whistleblower Evidence',
      description: 'Critical documentation exposing financial irregularities and ethical violations within a major corporation.',
      truthScore: 98,
      status: 'unlockable',
      category: 'Whistleblower',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      title: 'Scientific Research Data',
      description: 'Groundbreaking climate research data and observations collected over a decade of field studies.',
      truthScore: 92,
      status: 'locked',
      category: 'Research',
      createdAt: '2024-03-10',
      unlockDate: '2025-01-01'
    },
    {
      id: '4',
      title: 'Personal Testimony',
      description: 'Important personal account of historical events with supporting documentation and witness statements.',
      truthScore: 89,
      status: 'unlocked',
      category: 'Testimony',
      createdAt: '2024-01-05',
      unlockDate: '2024-07-15'
    }
  ];

  const filteredCapsules = mockCapsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || capsule.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || capsule.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewCapsule = (id: string) => {
    console.log('Viewing capsule:', id);
    // Navigate to capsule detail page
  };

  const handleUnlockCapsule = (id: string) => {
    console.log('Unlocking capsule:', id);
    // Handle capsule unlock logic
  };

  const statsData = [
    { title: 'Total Capsules', value: mockCapsules.length, icon: Shield, trend: { value: 12, label: 'this month' } },
    { title: 'Unlocked', value: mockCapsules.filter(c => c.status === 'unlocked').length, icon: Unlock },
    { title: 'Ready to Unlock', value: mockCapsules.filter(c => c.status === 'unlockable').length, icon: Clock },
    { title: 'Average Truth Score', value: '94%', icon: Star, trend: { value: 3, label: 'improvement' } },
  ];

  return (
    <EliteLayout>
      <EliteHero
        title="Truth Vault"
        subtitle="Secure Memory Infrastructure"
        description="Manage your encrypted capsules, track unlock schedules, and explore your verified truth collection with sovereign control."
        primaryAction={{
          label: 'Create New Capsule',
          href: '/mint',
          onClick: () => window.location.href = '/mint'
        }}
        secondaryAction={{
          label: 'View Analytics',
          href: '/stats'
        }}
        badge="Vault Active"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, index) => (
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

        {/* Controls */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search capsules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
                <SelectItem value="unlockable">Ready</SelectItem>
                <SelectItem value="unlocked">Unlocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 backdrop-blur-md border-white/10">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Whistleblower">Whistleblower</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Testimony">Testimony</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-white/5 border border-white/10 p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400">
            Showing {filteredCapsules.length} of {mockCapsules.length} capsules
          </p>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Vault Secured</span>
          </div>
        </motion.div>

        {/* Capsules Grid/List */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredCapsules.map((capsule, index) => (
            <motion.div
              key={capsule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <CapsuleCard
                title={capsule.title}
                description={capsule.description}
                truthScore={capsule.truthScore}
                status={capsule.status}
                unlockDate={capsule.unlockDate}
                onView={() => handleViewCapsule(capsule.id)}
                onUnlock={capsule.status === 'unlockable' ? () => handleUnlockCapsule(capsule.id) : undefined}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCapsules.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No capsules found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Create your first capsule to get started'}
            </p>
            <Button 
              onClick={() => window.location.href = '/mint'}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Capsule
            </Button>
          </motion.div>
        )}
      </div>
    </EliteLayout>
  );
}