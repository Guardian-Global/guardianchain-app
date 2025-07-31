import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuickHelp } from '@/components/help/ContextualHelp';
import { Plus, Lock, Globe, Users, Eye } from 'lucide-react';

export default function CapsuleCreationWithHelp() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [accessLevel, setAccessLevel] = useState('free');

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with Help */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Create Truth Capsule
            </h1>
            <QuickHelp helpId="capsule-creation" position="bottom" />
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Package your truth into an immutable capsule for community verification
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              Capsule Details
              <QuickHelp helpId="capsule-creation" position="right" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Title Section */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white font-medium">Title</label>
                <QuickHelp helpId="capsule-creation" position="top" />
              </div>
              <Input
                placeholder="Enter a clear, descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
              <p className="text-slate-400 text-sm mt-1">
                Make it specific and verifiable
              </p>
            </div>

            {/* Content Section */}
            <div>
              <div className="flex items-center mb-2">
                <label className="text-white font-medium">Content & Evidence</label>
                <QuickHelp helpId="capsule-creation" position="top" />
              </div>
              <Textarea
                placeholder="Provide comprehensive details, sources, and evidence..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
              <p className="text-slate-400 text-sm mt-1">
                Include multiple sources for stronger verification
              </p>
            </div>

            {/* Privacy Controls Section */}
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-white font-medium">Privacy & Access Controls</h3>
                <QuickHelp helpId="privacy-controls" position="right" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Privacy Level */}
                <div>
                  <label className="text-white font-medium mb-2 block">Visibility Level</label>
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Public - Everyone can see
                        </div>
                      </SelectItem>
                      <SelectItem value="restricted">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Restricted - Verified users only
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Private - Invitation only
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Access Requirements */}
                <div>
                  <label className="text-white font-medium mb-2 block">Access Requirements</label>
                  <Select value={accessLevel} onValueChange={setAccessLevel}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Access</SelectItem>
                      <SelectItem value="stake">5 GTT Stake Required</SelectItem>
                      <SelectItem value="premium">10 GTT Stake Required</SelectItem>
                      <SelectItem value="exclusive">50 GTT Stake Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-white font-medium">Verification Settings</h3>
                <QuickHelp helpId="verification-process" position="right" />
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white">Community Verification</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Enabled
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  Your capsule will be reviewed by the community for accuracy and credibility.
                  Higher quality evidence leads to faster verification and better rewards.
                </p>
              </div>
            </div>

            {/* Rewards Preview */}
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-white font-medium">Potential Rewards</h3>
                <QuickHelp helpId="gtt-rewards" position="right" />
              </div>
              
              <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 rounded-lg p-4 border border-purple-500/30">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">5-25 GTT</div>
                    <div className="text-slate-400 text-sm">Base Reward</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">2.5x</div>
                    <div className="text-slate-400 text-sm">Quality Multiplier</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">62.5 GTT</div>
                    <div className="text-slate-400 text-sm">Total Potential</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white font-semibold py-3"
                disabled={!title || !content}
              >
                Create Truth Capsule
              </Button>
              <p className="text-slate-400 text-sm text-center mt-2">
                By creating this capsule, you agree to the community verification process
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Tips */}
        <Card className="mt-8 bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-white font-medium">Pro Tips for Better Verification</h3>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Include multiple credible sources to support your claims
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Use clear, factual language without emotional bias
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Consider future access needs when setting privacy controls
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Engage constructively with community feedback during verification
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}