import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnhancedBulkDataDumpCapsule from '@/components/capsule/EnhancedBulkDataDumpCapsule';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import {
  Database,
  Upload,
  FileSpreadsheet,
  Zap,
  Shield,
  Star,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Brain,
  Target,
  Globe
} from 'lucide-react';

export default function BulkUpload() {
  const { user } = useAuth();

  const handleBulkComplete = (results: { created: number; failed: number; capsules: any[] }) => {
    console.log('Bulk upload complete:', results);
    // Handle completion - maybe show success message or redirect
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/create-capsule">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Create
                </Button>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Bulk Data Upload</h1>
                  <p className="text-gray-400">Transform datasets into truth capsules at scale</p>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Welcome back</div>
                <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                <Badge className="bg-cyan-600 mt-1">{user.tier}</Badge>
              </div>
            )}
          </motion.div>

          {/* Benefits Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border-purple-500/30">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Scale Your Truth Preservation</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Upload entire datasets and automatically create verified truth capsules for every record. 
                    Perfect for historical data, research findings, testimonials, and organizational knowledge.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: Zap,
                      title: 'Lightning Fast',
                      description: 'Process thousands of records in minutes',
                      color: 'text-yellow-400'
                    },
                    {
                      icon: Shield,
                      title: 'Blockchain Verified',
                      description: 'Every capsule gets immutable proof',
                      color: 'text-cyan-400'
                    },
                    {
                      icon: Brain,
                      title: 'AI Enhanced',
                      description: 'Smart content optimization and validation',
                      color: 'text-purple-400'
                    },
                    {
                      icon: BarChart3,
                      title: 'Full Analytics',
                      description: 'Track performance across all capsules',
                      color: 'text-green-400'
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="text-center">
                      <benefit.icon className={`w-8 h-8 mx-auto ${benefit.color} mb-3`} />
                      <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Upload Component */}
          <motion.div variants={itemVariants}>
            <EnhancedBulkDataDumpCapsule />
          </motion.div>

          {/* Use Cases */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center">Perfect For</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Historical Archives',
                  description: 'Preserve historical records, documents, and testimonies',
                  icon: Clock,
                  examples: ['Oral histories', 'Document archives', 'Timeline data', 'Legacy records']
                },
                {
                  title: 'Research Data',
                  description: 'Transform research findings into verifiable capsules',
                  icon: Target,
                  examples: ['Survey responses', 'Study results', 'Field observations', 'Lab data']
                },
                {
                  title: 'Corporate Knowledge',
                  description: 'Digitize and verify organizational information',
                  icon: Users,
                  examples: ['Employee records', 'Meeting minutes', 'Policy documents', 'Training data']
                },
                {
                  title: 'Media Collections',
                  description: 'Catalog and verify media content at scale',
                  icon: Globe,
                  examples: ['Photo metadata', 'Video descriptions', 'Audio transcripts', 'Article archives']
                },
                {
                  title: 'Financial Records',
                  description: 'Create immutable financial and transaction records',
                  icon: TrendingUp,
                  examples: ['Transaction logs', 'Audit trails', 'Compliance data', 'Investment records']
                },
                {
                  title: 'Personal Collections',
                  description: 'Preserve personal stories and memories',
                  icon: Star,
                  examples: ['Family stories', 'Life events', 'Achievement records', 'Memory collections']
                }
              ].map((useCase, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-600 hover:border-gray-400 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <useCase.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-white">{useCase.title}</h3>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{useCase.description}</p>
                    
                    <div className="space-y-1">
                      {useCase.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Technical Specs */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Supported Formats</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>• CSV (Comma Separated Values)</div>
                      <div>• Excel (.xls, .xlsx)</div>
                      <div>• JSON (JavaScript Object Notation)</div>
                      <div>• TSV (Tab Separated Values)</div>
                      <div>• TXT (Delimited Text Files)</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">File Limits</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>• Maximum file size: 50MB</div>
                      <div>• Maximum rows: 100,000</div>
                      <div>• Maximum columns: 1,000</div>
                      <div>• Batch processing: 50-1000 per batch</div>
                      <div>• Processing timeout: 30 minutes</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">Features</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div>• Real-time progress tracking</div>
                      <div>• Error handling & recovery</div>
                      <div>• Data validation & cleaning</div>
                      <div>• Custom content templates</div>
                      <div>• Selective row processing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}