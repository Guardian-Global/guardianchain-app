import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Microscope, 
  Globe, 
  Shield, 
  Zap, 
  Database,
  FileSearch,
  Users,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';
import { useState } from 'react';

export default function SpecializedIntake() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('standard');

  const specialties = [
    {
      id: 'ai_ethics',
      name: 'AI & Technology Ethics',
      icon: Brain,
      description: 'AI bias, algorithmic manipulation, tech censorship, data misuse',
      expertise: 'AI researchers, ethicists, tech industry insiders',
      reward: '10,000 TRUTH',
      badge: 'CRITICAL'
    },
    {
      id: 'scientific',
      name: 'Scientific Research Integrity',
      icon: Microscope,
      description: 'Research fraud, data manipulation, suppressed studies, peer review corruption',
      expertise: 'PhDs, research scientists, academic institutions',
      reward: '15,000 TRUTH',
      badge: 'HIGH PRIORITY'
    },
    {
      id: 'geopolitical',
      name: 'Geopolitical Intelligence',
      icon: Globe,
      description: 'International corruption, war crimes, diplomatic misconduct, election interference',
      expertise: 'Intelligence analysts, diplomats, international law experts',
      reward: '25,000 TRUTH',
      badge: 'MAXIMUM RISK'
    },
    {
      id: 'cyber_security',
      name: 'Cybersecurity & Privacy',
      icon: Shield,
      description: 'Data breaches, surveillance abuse, privacy violations, cyber warfare',
      expertise: 'Security researchers, privacy advocates, tech whistleblowers',
      reward: '12,000 TRUTH',
      badge: 'URGENT'
    },
    {
      id: 'energy_climate',
      name: 'Energy & Climate Truth',
      icon: Zap,
      description: 'Climate data suppression, energy industry cover-ups, green-washing',
      expertise: 'Climate scientists, energy industry insiders, environmental lawyers',
      reward: '20,000 TRUTH',
      badge: 'GLOBAL IMPACT'
    },
    {
      id: 'financial',
      name: 'Financial System Crimes',
      icon: Database,
      description: 'Market manipulation, banking fraud, regulatory capture, crypto crimes',
      expertise: 'Financial analysts, banking insiders, regulatory experts',
      reward: '18,000 TRUTH',
      badge: 'HIGH VALUE'
    }
  ];

  const urgencyLevels = [
    {
      id: 'standard',
      name: 'Standard Review',
      timeline: '7-14 days',
      features: ['Expert panel review', 'Standard verification', 'Basic protection'],
      multiplier: '1x'
    },
    {
      id: 'urgent',
      name: 'Urgent Priority',
      timeline: '2-3 days',
      features: ['Expedited review', 'Enhanced verification', 'Priority protection', 'Media coordination'],
      multiplier: '2x'
    },
    {
      id: 'critical',
      name: 'Critical Emergency',
      timeline: '24-48 hours',
      features: ['Emergency response', 'Immediate protection', 'Global coordination', 'Maximum security'],
      multiplier: '5x'
    }
  ];

  const verificationSteps = [
    { step: 1, title: 'Initial Assessment', status: 'completed' },
    { step: 2, title: 'Expert Panel Review', status: 'in-progress' },
    { step: 3, title: 'Evidence Verification', status: 'pending' },
    { step: 4, title: 'Truth Validation', status: 'pending' },
    { step: 5, title: 'Public Release Prep', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎯 SPECIALIZED TRUTH INTAKE
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            High-Impact Truth Verification for Critical Global Issues
          </p>
          <Badge className="bg-blue-600/20 text-blue-400 text-lg px-4 py-2">
            EXPERT VALIDATION NETWORK
          </Badge>
        </div>

        {/* Truth Vault Token Branding */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">
              💎 TRUTH VAULT TOKEN REWARDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Earn TRUTH Tokens for Verified Disclosures</h3>
              <p className="text-slate-300 text-lg">
                Truth Vault (TRUTH) tokens increase in value as more truth is preserved and validated
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">$0.15</div>
                <p className="text-slate-300 text-sm">Current TRUTH Price</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <Database className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">2.5M</div>
                <p className="text-slate-300 text-sm">Total TRUTH Supply</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">12,847</div>
                <p className="text-slate-300 text-sm">Truth Capsules Verified</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">$2.75M</div>
                <p className="text-slate-300 text-sm">Market Cap</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialty Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Select Specialized Area
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => {
              const Icon = specialty.icon;
              const isSelected = selectedSpecialty === specialty.id;
              
              return (
                <Card 
                  key={specialty.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-slate-800/50 border-slate-600 hover:border-blue-500/50'
                  }`}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Icon className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                      <h3 className="text-white font-bold text-lg mb-2">{specialty.name}</h3>
                      <Badge className={`
                        ${specialty.badge === 'CRITICAL' ? 'bg-red-600/20 text-red-400' : ''}
                        ${specialty.badge === 'HIGH PRIORITY' ? 'bg-orange-600/20 text-orange-400' : ''}
                        ${specialty.badge === 'MAXIMUM RISK' ? 'bg-purple-600/20 text-purple-400' : ''}
                        ${specialty.badge === 'URGENT' ? 'bg-yellow-600/20 text-yellow-400' : ''}
                        ${specialty.badge === 'GLOBAL IMPACT' ? 'bg-green-600/20 text-green-400' : ''}
                        ${specialty.badge === 'HIGH VALUE' ? 'bg-blue-600/20 text-blue-400' : ''}
                      `}>
                        {specialty.badge}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{specialty.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs">Expert Panel:</span>
                        <span className="text-blue-400 text-xs">{specialty.expertise}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs">Token Reward:</span>
                        <span className="text-green-400 text-xs font-bold">{specialty.reward}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Urgency Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Choose Urgency Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgencyLevels.map((level) => {
              const isSelected = urgencyLevel === level.id;
              
              return (
                <Card 
                  key={level.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-600/20 border-orange-500'
                      : 'bg-slate-800/50 border-slate-600 hover:border-orange-500/50'
                  }`}
                  onClick={() => setUrgencyLevel(level.id)}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="text-white font-bold text-xl mb-2">{level.name}</h3>
                    <div className="text-2xl font-bold text-orange-400 mb-2">{level.timeline}</div>
                    <div className="text-lg font-bold text-purple-400 mb-4">{level.multiplier} Reward</div>
                    <ul className="space-y-2">
                      {level.features.map((feature, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Verification Process */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <FileSearch className="h-6 w-6 text-green-400" />
              <span>Truth Verification Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {verificationSteps.map((step, index) => (
                <div key={step.step} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.status === 'completed' ? 'bg-green-600 text-white' :
                    step.status === 'in-progress' ? 'bg-blue-600 text-white' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{step.title}</h4>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                      <Progress 
                        value={
                          step.status === 'completed' ? 100 :
                          step.status === 'in-progress' ? 60 : 0
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    step.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                    step.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>
                    {step.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              <span>High-Impact Truth Submission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Truth Title</label>
              <Input
                placeholder="Brief title describing the critical truth being disclosed"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Comprehensive Details</label>
              <Textarea
                placeholder="Provide comprehensive details about this critical truth, including timeline, key players, evidence, potential impact, and why immediate action is needed..."
                rows={10}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Supporting Evidence</label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <FileSearch className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Upload documents, data, recordings, or other evidence</p>
                <p className="text-slate-400 text-sm">Expert panel will verify authenticity and significance</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Upload Evidence Files
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-semibold mb-1">Expert Validation Promise</h4>
                  <p className="text-slate-300 text-sm">
                    Your submission will be reviewed by world-class experts in your selected field. Upon verification, you'll receive TRUTH tokens and global platform for your disclosure.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={!selectedSpecialty}
              >
                <FileSearch className="h-5 w-5 mr-2" />
                Submit for Expert Verification
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-green-500 text-green-400 hover:bg-green-600/20"
              >
                <Users className="h-5 w-5 mr-2" />
                Request Expert Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}