import { CheckCircle, Clock, Shield, Award, FileText, Coins, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CapsuleTimeline = () => {
  const events = [
    { 
      id: 1,
      label: 'Capsule Submitted', 
      date: '2025-06-01T10:30:00Z',
      status: 'completed',
      icon: FileText,
      description: 'Initial capsule creation with content hash stored',
      details: {
        hash: '0xabc...def',
        size: '2.4 MB',
        creator: '0xAb...123'
      }
    },
    { 
      id: 2,
      label: 'GTT Staked', 
      date: '2025-06-02T14:20:00Z',
      status: 'completed',
      icon: Coins,
      description: '50 GTT tokens staked for capsule verification',
      details: {
        amount: '50 GTT',
        txHash: '0x123...789',
        blockNumber: 18542931
      }
    },
    { 
      id: 3,
      label: 'Community Verification', 
      date: '2025-06-03T09:15:00Z',
      status: 'completed',
      icon: Users,
      description: 'Peer review and verification process completed',
      details: {
        verifiers: 8,
        score: 94,
        consensus: '87.5%'
      }
    },
    { 
      id: 4,
      label: 'DocuSign Sealed', 
      date: '2025-06-05T16:45:00Z',
      status: 'completed',
      icon: Shield,
      description: 'Legal verification and tamper-proof sealing',
      details: {
        docuSignId: 'DS-7891234',
        legalStatus: 'Certified',
        sealType: 'Permanent'
      }
    },
    { 
      id: 5,
      label: 'NFT Certificate Issued', 
      date: '2025-06-07T11:20:00Z',
      status: 'completed',
      icon: Award,
      description: 'Veritas NFT certificate minted to creator wallet',
      details: {
        tokenId: '#4521',
        rarity: 'Rare',
        contractAddress: '0xCf7...Fc9'
      }
    },
    { 
      id: 6,
      label: 'Marketplace Listed', 
      date: '2025-06-08T13:30:00Z',
      status: 'in-progress',
      icon: CheckCircle,
      description: 'NFT available for secondary market trading',
      details: {
        listingPrice: '320 GTT',
        marketplace: 'GuardianChain',
        status: 'Active'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in-progress':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-yellow-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-blue-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Clock className="h-5 w-5 text-green-400" />
          </div>
          <span className="text-white">Capsule Evolution Timeline</span>
        </CardTitle>
        <p className="text-slate-400">
          Track the complete lifecycle of a truth capsule from submission to NFT certification
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Capsule ID: VC-001</h3>
              <p className="text-sm text-slate-400">Climate Data Analysis Q3 2024</p>
            </div>
            <Badge className="bg-green-600 text-white">Fully Certified</Badge>
          </div>

          {/* Timeline Events */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600"></div>
            
            <div className="space-y-8">
              {events.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <div key={event.id} className="relative flex gap-6">
                    {/* Timeline Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center z-10 border-4 border-slate-900`}>
                      <IconComponent className={`w-5 h-5 ${getIconColor(event.status)}`} />
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-semibold">{event.label}</h4>
                            <p className="text-sm text-slate-400">{formatDate(event.date)}</p>
                          </div>
                          <Badge 
                            className={`${getStatusColor(event.status)} text-white text-xs`}
                          >
                            {event.status === 'completed' ? '✓' : event.status === 'in-progress' ? '⏳' : '⏸'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-300 mb-3">{event.description}</p>
                        
                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key} className="bg-slate-600/30 rounded p-2">
                              <div className="text-xs font-medium text-slate-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                              <div className="text-sm text-white font-mono">
                                {typeof value === 'string' && value.startsWith('0x') 
                                  ? `${value.slice(0, 8)}...${value.slice(-6)}`
                                  : value
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Stats */}
          <div className="bg-slate-700/20 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Evolution Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">7</div>
                <div className="text-xs text-slate-400">Days Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">6</div>
                <div className="text-xs text-slate-400">Stages Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">94%</div>
                <div className="text-xs text-slate-400">Verification Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">320</div>
                <div className="text-xs text-slate-400">Current Value (GTT)</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapsuleTimeline;