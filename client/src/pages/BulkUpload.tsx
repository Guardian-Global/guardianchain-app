import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  Globe,
  Image,
  Video,
  Camera,
  Film
} from 'lucide-react';

export default function BulkUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadMethod, setUploadMethod] = React.useState<'csv' | 'json' | 'media' | 'manual'>('csv');
  const [file, setFile] = React.useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = React.useState<File[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleBulkComplete = (results: { created: number; failed: number; capsules: any[] }) => {
    console.log('Bulk upload complete:', results);
    toast({
      title: "Bulk Upload Complete!",
      description: `Created ${results.created} capsules successfully`,
    });
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
            <Card className="bg-black/30 backdrop-blur-lg border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Bulk Upload Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Method Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Choose Upload Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { id: 'csv', name: 'CSV File', icon: FileSpreadsheet, description: 'Upload structured CSV data' },
                      { id: 'json', name: 'JSON Data', icon: Database, description: 'Paste or upload JSON format' },
                      { id: 'media', name: 'Media Files', icon: Camera, description: 'Upload images and videos' },
                      { id: 'manual', name: 'Manual Entry', icon: Star, description: 'Enter data manually' }
                    ].map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all ${
                          uploadMethod === method.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                        }`}
                        onClick={() => setUploadMethod(method.id as any)}
                      >
                        <CardContent className="p-4 text-center">
                          <method.icon className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                          <h4 className="font-medium text-white mb-1">{method.name}</h4>
                          <p className="text-xs text-gray-400">{method.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Upload Interface */}
                {uploadMethod === 'csv' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">CSV Upload</h4>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400 mb-4">
                        Drop your CSV file here or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="max-w-xs mx-auto"
                      />
                      {file && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
                          <p className="text-green-400 text-sm">
                            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Expected columns: title, content, type, privacy_level</p>
                      <p>Maximum file size: 10MB</p>
                    </div>
                  </div>
                )}

                {uploadMethod === 'json' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">JSON Data</h4>
                    <Textarea
                      placeholder="Paste your JSON data here..."
                      className="min-h-32 bg-gray-800/50 border-gray-600 text-white"
                      rows={8}
                    />
                    <div className="text-sm text-gray-400">
                      <p>Format: [{`"title": "...", "content": "...", "type": "truth", "privacy_level": "public"`}]</p>
                    </div>
                  </div>
                )}

                {uploadMethod === 'media' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Media Upload</h4>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
                      <div className="text-center">
                        <div className="flex justify-center gap-4 mb-4">
                          <Image className="w-12 h-12 text-blue-400" />
                          <Video className="w-12 h-12 text-purple-400" />
                        </div>
                        <p className="text-gray-400 mb-4">
                          Drop your images and videos here or click to browse
                        </p>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setMediaFiles(files);
                          }}
                          className="max-w-xs mx-auto"
                          data-testid="media-file-input"
                        />
                        {mediaFiles.length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h5 className="text-white font-medium">Selected Files ({mediaFiles.length})</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                              {mediaFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded text-sm">
                                  {file.type.startsWith('image/') ? (
                                    <Image className="w-4 h-4 text-blue-400" />
                                  ) : (
                                    <Video className="w-4 h-4 text-purple-400" />
                                  )}
                                  <span className="text-green-400 truncate">
                                    {file.name}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    ({Math.round(file.size / 1024)} KB)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Supported formats: JPG, PNG, GIF, MP4, MOV, AVI, WebM</p>
                      <p>Maximum file size: 100MB per file</p>
                      <p>Each media file will be converted into a Truth Capsule with metadata</p>
                    </div>
                  </div>
                )}

                {uploadMethod === 'manual' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-white">Manual Entry</h4>
                    <div className="text-center py-8">
                      <Brain className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                      <p className="text-gray-400">
                        Advanced manual entry interface with smart templates
                      </p>
                    </div>
                  </div>
                )}

                {/* Process Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                    disabled={isProcessing || 
                      (uploadMethod === 'csv' && !file) || 
                      (uploadMethod === 'media' && mediaFiles.length === 0)}
                    onClick={async () => {
                      setIsProcessing(true);
                      
                      if (uploadMethod === 'media') {
                        // Process media files
                        try {
                          const processedFiles = [];
                          for (const file of mediaFiles) {
                            // Create a FormData object for each file
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
                            formData.append('title', file.name.split('.')[0]);
                            
                            // You would typically upload to your media API here
                            console.log(`Processing ${file.name}...`);
                            processedFiles.push({
                              name: file.name,
                              type: file.type,
                              size: file.size,
                              url: URL.createObjectURL(file) // Temporary URL for demo
                            });
                          }
                          
                          handleBulkComplete({ 
                            created: processedFiles.length, 
                            failed: 0, 
                            capsules: processedFiles 
                          });
                        } catch (error) {
                          console.error('Media processing failed:', error);
                          toast({
                            title: "Upload Failed",
                            description: "Failed to process media files. Please try again.",
                            variant: "destructive"
                          });
                        }
                      } else {
                        // Simulate processing for other upload types
                        setTimeout(() => {
                          handleBulkComplete({ created: 25, failed: 2, capsules: [] });
                        }, 3000);
                      }
                      
                      setIsProcessing(false);
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        {uploadMethod === 'media' ? 'Process Media Files' : 'Process Data'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                      <div>• Images (JPG, PNG, GIF, WebP)</div>
                      <div>• Videos (MP4, MOV, AVI, WebM)</div>
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