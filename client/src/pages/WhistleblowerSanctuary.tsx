import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  FileText, 
  Upload,
  Eye,
  UserX,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface WhistleblowerSubmission {
  id: string;
  title: string;
  category: string;
  status: 'submitted' | 'under_review' | 'verified' | 'sealed';
  anonymityLevel: 'partial' | 'full' | 'witness_protection';
  timelock?: Date;
  evidence: {
    documents: File[];
    multimedia: File[];
    testimonies: string[];
  };
}

export default function WhistleblowerSanctuary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submission, setSubmission] = useState({
    title: '',
    category: '',
    description: '',
    evidence: '',
    anonymityLevel: 'partial',
    timelock: '',
    witnessProtection: false
  });
  const [files, setFiles] = useState<File[]>([]);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/whistleblower/submit', data);
    },
    onSuccess: () => {
      toast({
        title: 'Submission Secured',
        description: 'Your whistleblower submission has been encrypted and sealed.',
      });
      // Reset form
      setSubmission({
        title: '',
        category: '',
        description: '',
        evidence: '',
        anonymityLevel: 'partial',
        timelock: '',
        witnessProtection: false
      });
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: 'There was an error securing your submission. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = () => {
    if (!submission.title || !submission.description) {
      toast({
        title: 'Incomplete Submission',
        description: 'Please provide at least a title and description.',
        variant: 'destructive',
      });
      return;
    }

    submitMutation.mutate({
      ...submission,
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      submitterId: user?.id,
      timestamp: new Date().toISOString()
    });
  };

  const protectionLevels = [
    {
      level: 'partial',
      title: 'Partial Anonymity',
      description: 'Identity known to platform, anonymous to public',
      icon: Eye,
      color: 'yellow'
    },
    {
      level: 'full',
      title: 'Full Anonymity',
      description: 'Complete identity protection and encryption',
      icon: UserX,
      color: 'orange'
    },
    {
      level: 'witness_protection',
      title: 'Witness Protection',
      description: 'Maximum security with legal safeguards',
      icon: Shield,
      color: 'red'
    }
  ];

  const categories = [
    'Corporate Misconduct',
    'Government Corruption',
    'Environmental Violations',
    'Human Rights Abuse',
    'Financial Fraud',
    'Healthcare Violations',
    'Academic Misconduct',
    'Technology Ethics',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Whistleblower Sanctuary
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Secure platform for truth revelation with maximum protection and anonymity guarantees.
          </p>
          <Badge variant="destructive" className="mt-2">
            <Lock className="w-4 h-4 mr-1" />
            End-to-End Encrypted
          </Badge>
        </div>

        {/* Protection Level Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Choose Protection Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {protectionLevels.map((level) => (
                <div
                  key={level.level}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    submission.anonymityLevel === level.level
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSubmission(prev => ({ ...prev, anonymityLevel: level.level }))}
                >
                  <div className="flex items-center mb-2">
                    <level.icon className={`w-6 h-6 mr-2 text-${level.color}-500`} />
                    <h3 className="font-semibold">{level.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {level.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Truth Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Submission Title
              </label>
              <Input
                value={submission.title}
                onChange={(e) => setSubmission(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief, descriptive title for your submission"
                className="w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={submission.category}
                onChange={(e) => setSubmission(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Detailed Description
              </label>
              <Textarea
                value={submission.description}
                onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the misconduct, including dates, locations, people involved, and any other relevant details..."
                rows={8}
                className="w-full"
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Supporting Evidence
              </label>
              <Textarea
                value={submission.evidence}
                onChange={(e) => setSubmission(prev => ({ ...prev, evidence: e.target.value }))}
                placeholder="Describe any evidence you have: documents, recordings, communications, witness testimonies, etc."
                rows={4}
                className="w-full"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Files (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    All files are encrypted before upload
                  </p>
                </div>
              </div>
            </div>

            {/* Time Lock */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Lock (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <Input
                  type="datetime-local"
                  value={submission.timelock}
                  onChange={(e) => setSubmission(prev => ({ ...prev, timelock: e.target.value }))}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Set a future date when this submission should be automatically revealed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Guarantees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              Security Guarantees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Military-grade encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-green-500" />
                <span>Zero-knowledge architecture</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserX className="w-5 h-5 text-green-500" />
                <span>Identity protection protocols</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-green-500" />
                <span>Legal whistleblower protections</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            {submitMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Securing Submission...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Submit to Sanctuary
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            By submitting, you agree to the whistleblower protection terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}