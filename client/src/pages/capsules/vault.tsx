import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Archive, 
  Search, 
  Filter, 
  Calendar, 
  Lock, 
  Eye,
  Download,
  ExternalLink,
  Star,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface VaultCapsule {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  status: 'sealed' | 'timelocked' | 'archived' | 'permanent';
  verificationLevel: string;
  griefScore: number;
  viewCount: number;
  unlockDate?: string;
  isPermanent: boolean;
}

export default function CapsuleVault() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: vaultCapsules, isLoading } = useQuery<VaultCapsule[]>({
    queryKey: ['/api/capsules/vault', user?.id],
    enabled: !!user?.id,
  });

  const filteredCapsules = vaultCapsules?.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || capsule.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || capsule.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'personal', label: 'Personal' },
    { value: 'family', label: 'Family' },
    { value: 'professional', label: 'Professional' },
    { value: 'historical', label: 'Historical' },
    { value: 'creative', label: 'Creative' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'sealed', label: 'Sealed' },
    { value: 'timelocked', label: 'Time Locked' },
    { value: 'archived', label: 'Archived' },
    { value: 'permanent', label: 'Permanent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sealed': return 'bg-blue-500';
      case 'timelocked': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      case 'permanent': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Archive className="w-12 h-12 text-purple-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Truth Vault
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your permanent archive of sealed memories and experiences.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your vault..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Capsules</p>
                  <p className="text-2xl font-bold">{vaultCapsules?.length || 0}</p>
                </div>
                <Archive className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Permanent</p>
                  <p className="text-2xl font-bold">
                    {vaultCapsules?.filter(c => c.isPermanent).length || 0}
                  </p>
                </div>
                <Lock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Locked</p>
                  <p className="text-2xl font-bold">
                    {vaultCapsules?.filter(c => c.status === 'timelocked').length || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold">
                    {vaultCapsules?.reduce((sum, c) => sum + c.viewCount, 0) || 0}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <Card key={capsule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{capsule.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{capsule.category}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(capsule.status)}`} />
                      <span className="text-xs text-gray-500 capitalize">{capsule.status}</span>
                    </div>
                  </div>
                  {capsule.isPermanent && (
                    <Lock className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {capsule.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {capsule.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {capsule.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{capsule.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(capsule.createdAt)}</span>
                    <span>Views: {capsule.viewCount}</span>
                  </div>
                  
                  {capsule.unlockDate && (
                    <div className="flex items-center text-xs text-yellow-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Unlocks: {formatDate(capsule.unlockDate)}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Grief Score: {capsule.griefScore}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span>{capsule.verificationLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCapsules.length === 0 && (
          <div className="text-center py-12">
            <Archive className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Capsules Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first truth capsule to start building your vault'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}