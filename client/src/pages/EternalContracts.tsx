import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Infinity, 
  Shield, 
  Clock, 
  Heart,
  FileText,
  User,
  Calendar,
  Lock,
  Unlock,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Crown,
  Gavel,
  Scroll
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface EternalContract {
  id: string;
  title: string;
  content: string;
  contractType: 'will' | 'testimony' | 'declaration' | 'covenant' | 'legacy';
  status: 'draft' | 'sealed' | 'executed' | 'activated';
  createdAt: string;
  unlockDate?: string;
  beneficiaries?: string[];
  ensName?: string;
  blockchainTx?: string;
  isPublic: boolean;
  requiresWitness: boolean;
  legalBindingLevel: 'personal' | 'notarized' | 'legal' | 'sovereign';
}

export default function EternalContractsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'contracts' | 'templates'>('create');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contractType: 'declaration' as const,
    unlockDate: '',
    beneficiaries: [] as string[],
    ensName: '',
    isPublic: false,
    requiresWitness: false,
    legalBindingLevel: 'personal' as const
  });

  const { data: contracts, isLoading } = useQuery<EternalContract[]>({
    queryKey: ['/api/eternal-contracts', user?.id],
    enabled: !!user?.id,
  });

  const createContractMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/eternal-contracts/create', data);
    },
    onSuccess: () => {
      toast({
        title: 'Eternal Contract Created',
        description: 'Your immortal declaration has been sealed on the blockchain.',
      });
      setFormData({
        title: '',
        content: '',
        contractType: 'declaration',
        unlockDate: '',
        beneficiaries: [],
        ensName: '',
        isPublic: false,
        requiresWitness: false,
        legalBindingLevel: 'personal'
      });
    },
    onError: (error) => {
      toast({
        title: 'Creation Failed',
        description: 'There was an error creating your eternal contract.',
        variant: 'destructive',
      });
    }
  });

  const contractTypes = [
    {
      type: 'will' as const,
      title: 'Digital Will',
      description: 'Legal testament for digital assets and final wishes',
      icon: Scroll,
      color: 'purple'
    },
    {
      type: 'testimony' as const,
      title: 'Personal Testimony',
      description: 'Permanent record of life experiences and wisdom',
      icon: Heart,
      color: 'red'
    },
    {
      type: 'declaration' as const,
      title: 'Immortal Declaration',
      description: 'Eternal statement of beliefs, values, or principles',
      icon: Crown,
      color: 'gold'
    },
    {
      type: 'covenant' as const,
      title: 'Sacred Covenant',
      description: 'Binding agreement or promise for future generations',
      icon: Gavel,
      color: 'blue'
    },
    {
      type: 'legacy' as const,
      title: 'Legacy Document',
      description: 'Comprehensive life story and achievements',
      icon: Infinity,
      color: 'green'
    }
  ];

  const legalLevels = [
    {
      value: 'personal' as const,
      label: 'Personal',
      description: 'Symbolic commitment with blockchain verification',
      cost: 'Free'
    },
    {
      value: 'notarized' as const,
      label: 'Notarized',
      description: 'Professional notarization with legal weight',
      cost: '25 GTT'
    },
    {
      value: 'legal' as const,
      label: 'Legal',
      description: 'Attorney-drafted with full legal standing',
      cost: '100 GTT'
    },
    {
      value: 'sovereign' as const,
      label: 'Sovereign',
      description: 'Maximum legal protection with international recognition',
      cost: '500 GTT'
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      will: 'from-purple-500/20 to-purple-600/20 border-purple-400/30',
      testimony: 'from-red-500/20 to-red-600/20 border-red-400/30',
      declaration: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30',
      covenant: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
      legacy: 'from-green-500/20 to-green-600/20 border-green-400/30'
    };
    return colors[type as keyof typeof colors] || colors.declaration;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'sealed': return <Lock className="w-4 h-4 text-blue-500" />;
      case 'executed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'activated': return <Unlock className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Infinity className="w-16 h-16 text-purple-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Eternal Contracts
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            Create immutable declarations that transcend time. Seal your final words, 
            digital wills, and sacred promises for eternity.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {['create', 'contracts', 'templates'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab as any)}
                className="mx-1"
              >
                {tab === 'create' && <FileText className="w-4 h-4 mr-2" />}
                {tab === 'contracts' && <Scroll className="w-4 h-4 mr-2" />}
                {tab === 'templates' && <Crown className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contract Type Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    Contract Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contractTypes.map((type) => (
                    <div
                      key={type.type}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.contractType === type.type
                          ? `bg-gradient-to-br ${getTypeColor(type.type)} border-opacity-100`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, contractType: type.type }))}
                    >
                      <div className="flex items-center mb-2">
                        <type.icon className="w-5 h-5 mr-2 text-purple-500" />
                        <h3 className="font-semibold">{type.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Contract Creation Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scroll className="w-5 h-5 mr-2" />
                    Create Eternal Contract
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Contract Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="My Last Testament and Will"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Contract Content *</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your eternal message here..."
                      rows={8}
                    />
                  </div>

                  {/* Legal Binding Level */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Legal Binding Level</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {legalLevels.map((level) => (
                        <div
                          key={level.value}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.legalBindingLevel === level.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, legalBindingLevel: level.value }))}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold">{level.label}</h3>
                            <Badge variant="outline">{level.cost}</Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{level.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unlock Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Unlock Date (Optional)</label>
                    <Input
                      type="datetime-local"
                      value={formData.unlockDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, unlockDate: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      When should this contract be automatically revealed?
                    </p>
                  </div>

                  {/* ENS Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">ENS Name (Optional)</label>
                    <Input
                      value={formData.ensName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ensName: e.target.value }))}
                      placeholder="yourname.eth"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Associate this contract with your ENS domain for public verification
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="isPublic" className="text-sm">
                        Make publicly viewable after sealing
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requiresWitness"
                        checked={formData.requiresWitness}
                        onChange={(e) => setFormData(prev => ({ ...prev, requiresWitness: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="requiresWitness" className="text-sm">
                        Require witness signatures for activation
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={() => createContractMutation.mutate(formData)}
                    disabled={!formData.title || !formData.content || createContractMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {createContractMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Sealing Contract...
                      </>
                    ) : (
                      <>
                        <Infinity className="w-5 h-5 mr-2" />
                        Seal Eternal Contract
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contracts && contracts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contracts.map((contract) => (
                  <Card key={contract.id} className={`bg-gradient-to-br ${getTypeColor(contract.contractType)} border`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(contract.status)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {contract.content}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{contract.contractType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{formatDate(contract.createdAt)}</span>
                        </div>
                        {contract.unlockDate && (
                          <div className="flex justify-between">
                            <span>Unlocks:</span>
                            <span>{formatDate(contract.unlockDate)}</span>
                          </div>
                        )}
                        {contract.ensName && (
                          <div className="flex justify-between">
                            <span>ENS:</span>
                            <span>{contract.ensName}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Infinity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Eternal Contracts Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first immortal declaration to preserve your legacy.
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractTypes.map((template) => (
              <Card key={template.type} className={`bg-gradient-to-br ${getTypeColor(template.type)} border hover:scale-105 transition-all cursor-pointer`}>
                <CardHeader>
                  <div className="flex items-center">
                    <template.icon className="w-8 h-8 mr-3 text-purple-500" />
                    <CardTitle>{template.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, contractType: template.type }));
                      setActiveTab('create');
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}