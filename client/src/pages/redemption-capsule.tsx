import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Undo2,
  Scale,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

export default function RedemptionCapsulePage() {
  const [selectedRedemptionType, setSelectedRedemptionType] = useState('');
  const [capsuleReference, setCapsuleReference] = useState('');

  const redemptionTypes = [
    {
      id: 'response',
      name: 'Public Response',
      icon: FileText,
      description: 'Issue a verified public response to allegations in a truth capsule',
      cost: 'Free',
      features: ['Public statement', 'Evidence submission', 'Community review'],
      color: 'blue'
    },
    {
      id: 'reconciliation',
      name: 'Reconciliation Process',
      icon: HeartHandshake,
      description: 'Offer reparations, apologies, or corrective actions',
      cost: '$99',
      features: ['Mediated process', 'Legal protections', 'Verified outcomes', 'Public transparency'],
      color: 'pink'
    },
    {
      id: 'evidence',
      name: 'Counter-Evidence',
      icon: ShieldCheck,
      description: 'Present verified evidence that contradicts or clarifies allegations',
      cost: '$199',
      features: ['Expert verification', 'Forensic analysis', 'Legal admissibility', 'Reputation protection'],
      color: 'green'
    }
  ];

  const recentRedemptions = [
    {
      case: "Corporate Ethics Review",
      status: "Completed",
      type: "Reconciliation",
      outcome: "Settlement Reached",
      time: "2 weeks ago"
    },
    {
      case: "Research Misconduct",
      status: "In Progress", 
      type: "Counter-Evidence",
      outcome: "Under Review",
      time: "5 days ago"
    },
    {
      case: "Public Statement",
      status: "Published",
      type: "Public Response",
      outcome: "Community Verified",
      time: "1 week ago"
    }
  ];

  const redemptionProcess = [
    { step: 1, title: 'Reference Original Capsule', description: 'Identify the truth capsule you wish to respond to' },
    { step: 2, title: 'Choose Redemption Type', description: 'Select response, reconciliation, or counter-evidence' },
    { step: 3, title: 'Submit Your Case', description: 'Provide detailed response with supporting materials' },
    { step: 4, title: 'Community Review', description: 'Independent verification and community assessment' },
    { step: 5, title: 'Public Resolution', description: 'Transparent outcome published to blockchain' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🕊️ REDEMPTION CAPSULE
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            If you were named in a Truth Capsule, this page allows you to issue a public response, seek reconciliation, or present counter-evidence
          </p>
          <Badge className="bg-yellow-600/20 text-yellow-400 text-lg px-4 py-2">
            TRUTH RECONCILIATION SYSTEM
          </Badge>
        </div>

        {/* Capsule Reference */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <span>Reference Original Truth Capsule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Capsule ID or Hash</label>
                <Input
                  placeholder="Enter the ID or hash of the truth capsule you're responding to"
                  value={capsuleReference}
                  onChange={(e) => setCapsuleReference(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              {capsuleReference && (
                <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-1">Capsule Found</h4>
                      <p className="text-slate-300 text-sm">
                        "Corporate Misconduct at TechCorp Inc" - Published 3 weeks ago
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Status: Verified | Heat Index: 87🔥 | Views: 12,847
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redemption Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Your Redemption Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {redemptionTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedRedemptionType === type.id;
              
              return (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? `bg-${type.color}-600/20 border-${type.color}-500`
                      : 'bg-slate-800/50 border-slate-600 hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedRedemptionType(type.id)}
                >
                  <CardHeader>
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        type.color === 'blue' ? 'bg-blue-600/20' :
                        type.color === 'pink' ? 'bg-pink-600/20' :
                        'bg-green-600/20'
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          type.color === 'blue' ? 'text-blue-400' :
                          type.color === 'pink' ? 'text-pink-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <CardTitle className="text-white text-lg mb-2">{type.name}</CardTitle>
                      <div className="text-2xl font-bold text-green-400">{type.cost}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 text-sm mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-slate-300 text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Redemption Process */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              How Redemption Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {redemptionProcess.map((step, index) => (
                <div key={step.step} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{step.title}</h3>
                    <p className="text-slate-300 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Redemption Form */}
        {selectedRedemptionType && (
          <Card className="bg-slate-800/50 border-slate-700 mb-12">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Undo2 className="h-6 w-6 text-yellow-400" />
                <span>Submit Redemption Capsule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Response Title</label>
                <Input
                  placeholder="Brief title for your redemption response"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Detailed Response</label>
                <Textarea
                  placeholder="Provide your complete response, including any explanations, evidence, or proposed reconciliation actions..."
                  rows={8}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Supporting Evidence</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Upload documents, recordings, or other evidence</p>
                  <p className="text-slate-400 text-sm">All evidence will be verified by independent experts</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Select Files
                  </Button>
                </div>
              </div>
              
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <HeartHandshake className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-semibold mb-1">Growth & Reconciliation</h4>
                    <p className="text-slate-300 text-sm">
                      GUARDIANCHAIN believes every truth should allow for growth. Your response will be fairly reviewed and published transparently.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                  disabled={!capsuleReference}
                >
                  <Undo2 className="h-5 w-5 mr-2" />
                  Begin Redemption Process
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-green-500 text-green-400 hover:bg-green-600/20"
                >
                  <Scale className="h-5 w-5 mr-2" />
                  Request Mediation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Redemptions */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <Clock className="h-6 w-6 text-blue-400" />
              <span>Recent Redemption Cases</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRedemptions.map((redemption, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      redemption.status === 'Completed' ? 'bg-green-400' :
                      redemption.status === 'Published' ? 'bg-blue-400' :
                      'bg-yellow-400'
                    }`}></div>
                    <div>
                      <p className="text-white font-semibold">{redemption.case}</p>
                      <p className="text-slate-400 text-sm">{redemption.type} • {redemption.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`
                      ${redemption.status === 'Completed' ? 'bg-green-600/20 text-green-400' : ''}
                      ${redemption.status === 'Published' ? 'bg-blue-600/20 text-blue-400' : ''}
                      ${redemption.status === 'In Progress' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                    `}>
                      {redemption.outcome}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help with Your Redemption?
            </h2>
            <p className="text-slate-300 mb-6">
              Our mediation team provides expert guidance through the redemption process
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-400 font-bold">Expert Mediation</p>
                <p className="text-slate-400 text-sm">Professional conflict resolution</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold">Fair Pricing</p>
                <p className="text-slate-400 text-sm">Transparent, affordable rates</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-yellow-400 font-bold">24/7 Support</p>
                <p className="text-slate-400 text-sm">Round-the-clock assistance</p>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <HeartHandshake className="h-5 w-5 mr-2" />
              Contact Mediation Team
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}