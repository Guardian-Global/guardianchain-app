import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  Database,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  Trash2,
  FileSpreadsheet,
  BarChart3,
  Brain,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Star,
  Globe,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Hash,
  Type,
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Link,
  Wand2,
  Target,
  Award,
  Save,
  RefreshCw,
  Lock,
  Unlock,
  GitBranch,
  Layers,
  Cpu,
  HardDrive,
  Network,
  Zap as Lightning
} from 'lucide-react';

interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'email' | 'url' | 'phone' | 'address' | 'boolean' | 'json';
  sampleValues: string[];
  nullCount: number;
  uniqueCount: number;
  mapped?: boolean;
  capsuleField?: string;
  quality: number;
  statistics?: {
    min?: number;
    max?: number;
    avg?: number;
    median?: number;
    mode?: string;
  };
}

interface DataPreview {
  columns: DataColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  fileName: string;
  fileSize: number;
  encoding: string;
  schema: {
    hash: string;
    version: string;
    created: string;
  };
  quality: {
    overall: number;
    completeness: number;
    uniqueness: number;
    consistency: number;
  };
}

interface ProcessingStatus {
  stage: 'uploading' | 'parsing' | 'validating' | 'ai-analysis' | 'processing' | 'complete' | 'error';
  progress: number;
  processedRows: number;
  totalRows: number;
  currentBatch: number;
  totalBatches: number;
  message: string;
  errors: string[];
  warnings: string[];
  aiInsights?: {
    contentThemes: string[];
    suggestedCategories: string[];
    qualityScore: number;
    recommendations: string[];
  };
}

interface EnhancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  variables: string[];
  aiOptimized: boolean;
  usage: number;
  rating: number;
}

interface BulkProcessingConfig {
  batchSize: number;
  concurrency: number;
  retryAttempts: number;
  qualityThreshold: number;
  aiEnhancement: boolean;
  autoCorrection: boolean;
  deduplication: boolean;
  validation: {
    required: string[];
    formats: Record<string, string>;
    ranges: Record<string, [number, number]>;
  };
  transformation: {
    normalize: boolean;
    trim: boolean;
    titleCase: boolean;
    dateFormat: string;
  };
}

const ENHANCED_TEMPLATES: EnhancedTemplate[] = [
  {
    id: 'personal-story',
    name: 'Personal Story Archive',
    description: 'Template for personal narratives and life stories',
    category: 'Personal',
    content: `{{name}}'s Story: {{title}}

Date: {{date}}
Location: {{location}}

Story:
{{content}}

Key People: {{people}}
Emotions: {{emotions}}
Life Lesson: {{lesson}}

Tags: #PersonalMemory #{{category}} #{{year}}`,
    variables: ['name', 'title', 'date', 'location', 'content', 'people', 'emotions', 'lesson', 'category', 'year'],
    aiOptimized: true,
    usage: 1250,
    rating: 4.8
  },
  {
    id: 'business-record',
    name: 'Business Record Archive',
    description: 'Professional documentation template',
    category: 'Business',
    content: `Business Record: {{record_type}}

Company: {{company}}
Date: {{date}}
Reference: {{reference_id}}

Summary:
{{summary}}

Details:
{{details}}

Financial Impact: {{financial_impact}}
Stakeholders: {{stakeholders}}
Status: {{status}}

Archive Classification: {{classification}}
Retention Period: {{retention_period}}

Tags: #Business #{{department}} #{{fiscal_year}}`,
    variables: ['record_type', 'company', 'date', 'reference_id', 'summary', 'details', 'financial_impact', 'stakeholders', 'status', 'classification', 'retention_period', 'department', 'fiscal_year'],
    aiOptimized: true,
    usage: 980,
    rating: 4.6
  },
  {
    id: 'research-data',
    name: 'Research Data Entry',
    description: 'Scientific and research data archival',
    category: 'Research',
    content: `Research Entry: {{title}}

Study: {{study_name}}
Researcher: {{researcher}}
Date: {{collection_date}}
Sample ID: {{sample_id}}

Methodology: {{methodology}}
Variables: {{variables}}
Results: {{results}}
Statistical Significance: {{p_value}}

Observations:
{{observations}}

Conclusions: {{conclusions}}
Future Research: {{future_work}}

Tags: #Research #{{field}} #{{study_type}}`,
    variables: ['title', 'study_name', 'researcher', 'collection_date', 'sample_id', 'methodology', 'variables', 'results', 'p_value', 'observations', 'conclusions', 'future_work', 'field', 'study_type'],
    aiOptimized: true,
    usage: 675,
    rating: 4.7
  },
  {
    id: 'legal-testimony',
    name: 'Legal Testimony Archive',
    description: 'Legal document and testimony preservation',
    category: 'Legal',
    content: `Legal Archive: {{document_type}}

Case: {{case_number}}
Date: {{date}}
Jurisdiction: {{jurisdiction}}
Attorney: {{attorney}}

Testimony/Document Summary:
{{summary}}

Key Facts:
{{key_facts}}

Evidence References: {{evidence_refs}}
Witness Information: {{witnesses}}

Legal Significance: {{significance}}
Outcome Impact: {{impact}}

Confidentiality: {{confidentiality_level}}
Retention: {{retention_period}}

Tags: #Legal #{{case_type}} #{{year}}`,
    variables: ['document_type', 'case_number', 'date', 'jurisdiction', 'attorney', 'summary', 'key_facts', 'evidence_refs', 'witnesses', 'significance', 'impact', 'confidentiality_level', 'retention_period', 'case_type', 'year'],
    aiOptimized: true,
    usage: 445,
    rating: 4.9
  }
];

const QUALITY_INDICATORS = {
  excellent: { min: 90, color: 'text-green-400', bg: 'bg-green-500/20' },
  good: { min: 75, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  fair: { min: 60, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  poor: { min: 0, color: 'text-red-400', bg: 'bg-red-500/20' }
};

export default function EnhancedBulkDataDumpCapsule() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EnhancedTemplate>(ENHANCED_TEMPLATES[0]);
  const [customTemplate, setCustomTemplate] = useState('');
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filterText, setFilterText] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [currentTab, setCurrentTab] = useState('upload');
  
  // Enhanced processing configuration
  const [processingConfig, setProcessingConfig] = useState<BulkProcessingConfig>({
    batchSize: 100,
    concurrency: 3,
    retryAttempts: 3,
    qualityThreshold: 70,
    aiEnhancement: true,
    autoCorrection: true,
    deduplication: true,
    validation: {
      required: [],
      formats: {},
      ranges: {}
    },
    transformation: {
      normalize: true,
      trim: true,
      titleCase: false,
      dateFormat: 'YYYY-MM-DD'
    }
  });

  // AI-powered data analysis
  const analyzeDataMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/bulk/analyze', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.insights) {
        setProcessingStatus(prev => prev ? {
          ...prev,
          aiInsights: data.insights,
          message: 'AI analysis complete'
        } : null);
        
        toast({
          title: "AI Analysis Complete",
          description: `Found ${data.insights.contentThemes.length} themes and ${data.insights.suggestedCategories.length} categories`,
        });
      }
    }
  });

  // Enhanced file processing mutation
  const processFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('config', JSON.stringify(processingConfig));
      const response = await apiRequest('POST', '/api/bulk/upload', formData);
      return response.json();
    },
    onSuccess: (data: any) => {
      setDataPreview(data);
      setCurrentTab('preview');
      
      // Trigger AI analysis if enabled
      if (processingConfig.aiEnhancement) {
        analyzeDataMutation.mutate({
          preview: data,
          analysisType: 'comprehensive'
        });
      }
      
      toast({
        title: "File processed successfully",
        description: `Loaded ${data.totalRows} rows with ${data.columns.length} columns`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Enhanced bulk creation mutation
  const createBulkCapsulesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/bulk/create-capsules', {
        ...data,
        config: processingConfig
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setProcessingStatus({
        stage: 'complete',
        progress: 100,
        processedRows: data.successCount,
        totalRows: data.totalProcessed,
        currentBatch: data.totalBatches,
        totalBatches: data.totalBatches,
        message: `Successfully created ${data.successCount} capsules`,
        errors: data.errors || [],
        warnings: data.warnings || []
      });
      
      toast({
        title: "Bulk creation complete",
        description: `Created ${data.successCount} capsules from ${data.totalProcessed} rows`,
      });
    },
    onError: (error: any) => {
      setProcessingStatus(prev => prev ? {
        ...prev,
        stage: 'error',
        message: error.message,
        errors: [error.message]
      } : null);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setProcessingStatus({
        stage: 'uploading',
        progress: 0,
        processedRows: 0,
        totalRows: 0,
        currentBatch: 0,
        totalBatches: 0,
        message: 'Uploading and analyzing file...',
        errors: [],
        warnings: []
      });
      
      processFileMutation.mutate(file);
    }
  }, [processFileMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/tab-separated-values': ['.tsv']
    },
    multiple: false
  });

  // Enhanced column mapping with AI suggestions
  const getColumnIcon = useCallback((type: string) => {
    const iconMap = {
      string: Type,
      number: Hash,
      date: Calendar,
      email: Mail,
      url: Link,
      phone: Phone,
      address: MapPin,
      boolean: CheckCircle,
      json: Database
    };
    return iconMap[type as keyof typeof iconMap] || Type;
  }, []);

  // Quality assessment
  const getQualityIndicator = (score: number) => {
    for (const [level, config] of Object.entries(QUALITY_INDICATORS)) {
      if (score >= config.min) {
        return { level, ...config };
      }
    }
    return QUALITY_INDICATORS.poor;
  };

  // Enhanced filtering and sorting
  const filteredAndSortedRows = useMemo(() => {
    if (!dataPreview) return [];
    
    let filtered = dataPreview.rows;
    
    // Apply text filter
    if (filterText) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }
    
    return filtered;
  }, [dataPreview, filterText, sortColumn, sortDirection]);

  const handleStartProcessing = () => {
    if (!dataPreview) return;
    
    const template = isCustomTemplate ? customTemplate : selectedTemplate.content;
    const rowsToProcess = selectedRows.size > 0 
      ? Array.from(selectedRows).map(index => dataPreview.rows[index])
      : dataPreview.rows;
    
    setProcessingStatus({
      stage: 'processing',
      progress: 0,
      processedRows: 0,
      totalRows: rowsToProcess.length,
      currentBatch: 1,
      totalBatches: Math.ceil(rowsToProcess.length / processingConfig.batchSize),
      message: 'Starting bulk capsule creation...',
      errors: [],
      warnings: []
    });
    
    createBulkCapsulesMutation.mutate({
      rows: rowsToProcess,
      template,
      selectedRows: Array.from(selectedRows)
    });
  };

  const handleTemplateChange = (templateId: string) => {
    const template = ENHANCED_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setIsCustomTemplate(false);
    }
  };

  const handleSelectAllRows = () => {
    if (selectedRows.size === filteredAndSortedRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedRows.map((_, index) => index)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="relative">
              <Database className="w-12 h-12 text-cyan-400 mr-4" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Enhanced Bulk Data Processor
              </h1>
              <p className="text-gray-300 mt-2">
                AI-powered mass capsule creation with advanced processing capabilities
              </p>
            </div>
          </motion.div>
          
          {/* Status indicators */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <Cpu className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              <Shield className="w-3 h-3 mr-1" />
              Quality Assured
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              <Lightning className="w-3 h-3 mr-1" />
              High Performance
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm">
            <TabsTrigger value="upload" className="data-testid-tab-upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload & Analyze
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!dataPreview} className="data-testid-tab-preview">
              <Eye className="w-4 h-4 mr-2" />
              Data Preview
            </TabsTrigger>
            <TabsTrigger value="template" disabled={!dataPreview} className="data-testid-tab-template">
              <Wand2 className="w-4 h-4 mr-2" />
              Template Design
            </TabsTrigger>
            <TabsTrigger value="process" disabled={!dataPreview} className="data-testid-tab-process">
              <Zap className="w-4 h-4 mr-2" />
              Bulk Process
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Database className="w-5 h-5 mr-2 text-cyan-400" />
                  Enhanced File Upload & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
                    isDragActive
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/5'
                  }`}
                  data-testid="file-dropzone"
                >
                  <input {...getInputProps()} />
                  <motion.div
                    animate={{ scale: isDragActive ? 1.05 : 1 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-center">
                      <FileSpreadsheet className="w-16 h-16 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {isDragActive ? 'Drop your file here' : 'Upload your data file'}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Supports CSV, Excel (.xlsx, .xls), JSON, and TSV formats
                      </p>
                      <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Processing Configuration */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: showAdvancedSettings ? 1 : 0, 
                    height: showAdvancedSettings ? 'auto' : 0 
                  }}
                  className="mt-6 overflow-hidden"
                >
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Batch Size: {processingConfig.batchSize}
                      </label>
                      <Slider
                        value={[processingConfig.batchSize]}
                        onValueChange={([value]) => 
                          setProcessingConfig(prev => ({ ...prev, batchSize: value }))
                        }
                        min={10}
                        max={1000}
                        step={10}
                        className="data-testid-batch-size-slider"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Quality Threshold: {processingConfig.qualityThreshold}%
                      </label>
                      <Slider
                        value={[processingConfig.qualityThreshold]}
                        onValueChange={([value]) => 
                          setProcessingConfig(prev => ({ ...prev, qualityThreshold: value }))
                        }
                        min={0}
                        max={100}
                        step={5}
                        className="data-testid-quality-threshold-slider"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={processingConfig.aiEnhancement}
                          onCheckedChange={(checked) =>
                            setProcessingConfig(prev => ({ ...prev, aiEnhancement: checked }))
                          }
                          data-testid="ai-enhancement-switch"
                        />
                        <label className="text-sm text-white">AI Enhancement</label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={processingConfig.deduplication}
                          onCheckedChange={(checked) =>
                            setProcessingConfig(prev => ({ ...prev, deduplication: checked }))
                          }
                          data-testid="deduplication-switch"
                        />
                        <label className="text-sm text-white">Deduplication</label>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    className="text-cyan-400"
                    data-testid="toggle-advanced-settings"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                    {showAdvancedSettings ? (
                      <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                  </Button>

                  {dataPreview && (
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      File Ready
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <AnimatePresence>
              {processingStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-sm border-blue-500/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">Processing Status</h4>
                          <Badge
                            variant="outline"
                            className={`${
                              processingStatus.stage === 'complete'
                                ? 'border-green-500/50 text-green-400'
                                : processingStatus.stage === 'error'
                                ? 'border-red-500/50 text-red-400'
                                : 'border-blue-500/50 text-blue-400'
                            }`}
                          >
                            {processingStatus.stage}
                          </Badge>
                        </div>
                        
                        <Progress value={processingStatus.progress} className="w-full" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Processed:</span>
                            <div className="text-white font-medium">
                              {processingStatus.processedRows} / {processingStatus.totalRows}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Batch:</span>
                            <div className="text-white font-medium">
                              {processingStatus.currentBatch} / {processingStatus.totalBatches}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Errors:</span>
                            <div className="text-red-400 font-medium">
                              {processingStatus.errors.length}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Warnings:</span>
                            <div className="text-yellow-400 font-medium">
                              {processingStatus.warnings.length}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-300">{processingStatus.message}</p>

                        {/* AI Insights */}
                        {processingStatus.aiInsights && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                          >
                            <h5 className="font-semibold text-purple-400 mb-2 flex items-center">
                              <Brain className="w-4 h-4 mr-2" />
                              AI Analysis Results
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Content Themes:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {processingStatus.aiInsights.contentThemes.map((theme, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {theme}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Suggested Categories:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {processingStatus.aiInsights.suggestedCategories.map((category, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-400">Quality Score:</span>
                              <div className="text-purple-400 font-medium">
                                {processingStatus.aiInsights.qualityScore}/100
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Data Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            {dataPreview && (
              <>
                {/* Data Quality Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(dataPreview.quality).map(([metric, score]) => {
                    const indicator = getQualityIndicator(score);
                    return (
                      <Card key={metric} className={`bg-black/40 backdrop-blur-sm border-gray-600/30 ${indicator.bg}`}>
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${indicator.color}`}>
                              {Math.round(score)}%
                            </div>
                            <div className="text-sm text-gray-400 capitalize">
                              {metric}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Data Controls */}
                <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30">
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            placeholder="Filter data..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            className="pl-10 w-64"
                            data-testid="data-filter-input"
                          />
                        </div>
                        
                        <Select value={sortColumn} onValueChange={setSortColumn}>
                          <SelectTrigger className="w-48" data-testid="sort-column-select">
                            <SelectValue placeholder="Sort by column" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataPreview.columns.map(column => (
                              <SelectItem key={column.name} value={column.name}>
                                {column.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                          data-testid="sort-direction-toggle"
                        >
                          {sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllRows}
                          data-testid="select-all-button"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {selectedRows.size === filteredAndSortedRows.length ? 'Deselect All' : 'Select All'}
                        </Button>
                        
                        <Badge variant="outline" className="text-cyan-400">
                          {selectedRows.size} / {filteredAndSortedRows.length} selected
                        </Badge>
                      </div>
                    </div>

                    {/* Column Statistics */}
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Column Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {dataPreview.columns.map(column => {
                          const IconComponent = getColumnIcon(column.type);
                          const qualityIndicator = getQualityIndicator(column.quality);
                          
                          return (
                            <div
                              key={column.name}
                              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-white truncate">
                                    {column.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {column.type} • {column.uniqueCount} unique
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${qualityIndicator.color} border-current`}
                              >
                                {Math.round(column.quality)}%
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Data Table */}
                    <ScrollArea className="h-96 border border-gray-600/30 rounded-lg">
                      <div className="min-w-full">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-800/50 sticky top-0">
                            <tr>
                              <th className="p-2 text-left">
                                <Checkbox
                                  checked={selectedRows.size === filteredAndSortedRows.length}
                                  onCheckedChange={handleSelectAllRows}
                                  data-testid="select-all-checkbox"
                                />
                              </th>
                              {dataPreview.columns.map(column => (
                                <th key={column.name} className="p-2 text-left text-white font-medium">
                                  <button
                                    onClick={() => {
                                      if (sortColumn === column.name) {
                                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                                      } else {
                                        setSortColumn(column.name);
                                        setSortDirection('asc');
                                      }
                                    }}
                                    className="flex items-center space-x-1 hover:text-cyan-400 transition-colors"
                                  >
                                    <span>{column.name}</span>
                                    {sortColumn === column.name && (
                                      sortDirection === 'asc' ? 
                                        <ChevronUp className="w-3 h-3" /> : 
                                        <ChevronDown className="w-3 h-3" />
                                    )}
                                  </button>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedRows.map((row, index) => (
                              <tr
                                key={index}
                                className={`border-b border-gray-700/30 hover:bg-gray-800/30 ${
                                  selectedRows.has(index) ? 'bg-cyan-500/10' : ''
                                }`}
                              >
                                <td className="p-2">
                                  <Checkbox
                                    checked={selectedRows.has(index)}
                                    onCheckedChange={(checked) => {
                                      const newSelected = new Set(selectedRows);
                                      if (checked) {
                                        newSelected.add(index);
                                      } else {
                                        newSelected.delete(index);
                                      }
                                      setSelectedRows(newSelected);
                                    }}
                                    data-testid={`row-checkbox-${index}`}
                                  />
                                </td>
                                {dataPreview.columns.map(column => (
                                  <td key={column.name} className="p-2 text-gray-300">
                                    <div className="max-w-32 truncate">
                                      {String(row[column.name] || '-')}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>

                    <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                      <span>
                        Showing {filteredAndSortedRows.length} of {dataPreview.totalRows} rows
                      </span>
                      <span>
                        File: {dataPreview.fileName} ({(dataPreview.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Template Design Tab */}
          <TabsContent value="template" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template Selection */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wand2 className="w-5 h-5 mr-2 text-purple-400" />
                    Template Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        checked={isCustomTemplate}
                        onCheckedChange={setIsCustomTemplate}
                        data-testid="custom-template-switch"
                      />
                      <label className="text-sm text-white">Use Custom Template</label>
                    </div>

                    {!isCustomTemplate ? (
                      <div className="space-y-3">
                        {ENHANCED_TEMPLATES.map(template => (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedTemplate.id === template.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-600 hover:border-purple-500/50'
                            }`}
                            onClick={() => handleTemplateChange(template.id)}
                            data-testid={`template-${template.id}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{template.name}</h4>
                              <div className="flex items-center space-x-2">
                                {template.aiOptimized && (
                                  <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                                    <Brain className="w-3 h-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                                <div className="flex items-center text-xs text-gray-400">
                                  <Star className="w-3 h-3 mr-1" />
                                  {template.rating}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <Badge variant="outline" className="text-xs">{template.category}</Badge>
                              <span>{template.usage.toLocaleString()} uses</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">
                          Custom Template Content
                        </label>
                        <Textarea
                          value={customTemplate}
                          onChange={(e) => setCustomTemplate(e.target.value)}
                          placeholder="Enter your custom template with {{variable}} placeholders..."
                          className="min-h-48 font-mono text-sm"
                          data-testid="custom-template-textarea"
                        />
                        <div className="text-xs text-gray-400 mt-2">
                          Use {'{'}{'{'}{'}'}column_name{'{'}{'}'}{'{'}{'}'} syntax to insert data from your columns
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Template Preview */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-cyan-400" />
                    Template Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-2">Template Content:</h4>
                      <ScrollArea className="h-64">
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                          {isCustomTemplate ? customTemplate : selectedTemplate.content}
                        </pre>
                      </ScrollArea>
                    </div>

                    {!isCustomTemplate && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Required Variables:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.variables.map(variable => (
                            <Badge key={variable} variant="outline" className="text-xs">
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {dataPreview && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Available Columns:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {dataPreview.columns.map(column => {
                            const IconComponent = getColumnIcon(column.type);
                            return (
                              <Button
                                key={column.name}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (isCustomTemplate) {
                                    setCustomTemplate(prev => prev + `{{${column.name}}} `);
                                  }
                                }}
                                className="justify-start text-xs"
                                data-testid={`column-button-${column.name}`}
                              >
                                <IconComponent className="w-3 h-3 mr-2" />
                                {column.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bulk Process Tab */}
          <TabsContent value="process" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Processing Summary */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Processing Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">
                            {selectedRows.size || dataPreview?.totalRows || 0}
                          </div>
                          <div className="text-sm text-gray-400">Rows to Process</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {Math.ceil((selectedRows.size || dataPreview?.totalRows || 0) / processingConfig.batchSize)}
                          </div>
                          <div className="text-sm text-gray-400">Batches</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {processingConfig.batchSize}
                          </div>
                          <div className="text-sm text-gray-400">Batch Size</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            ~{Math.ceil((selectedRows.size || dataPreview?.totalRows || 0) / processingConfig.batchSize / processingConfig.concurrency)}
                          </div>
                          <div className="text-sm text-gray-400">Est. Minutes</div>
                        </div>
                      </div>

                      {/* Configuration Review */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Processing Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">AI Enhancement:</span>
                              <Badge variant={processingConfig.aiEnhancement ? "default" : "outline"}>
                                {processingConfig.aiEnhancement ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Auto Correction:</span>
                              <Badge variant={processingConfig.autoCorrection ? "default" : "outline"}>
                                {processingConfig.autoCorrection ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Deduplication:</span>
                              <Badge variant={processingConfig.deduplication ? "default" : "outline"}>
                                {processingConfig.deduplication ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Quality Threshold:</span>
                              <span className="text-white">{processingConfig.qualityThreshold}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Retry Attempts:</span>
                              <span className="text-white">{processingConfig.retryAttempts}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400">Concurrency:</span>
                              <span className="text-white">{processingConfig.concurrency}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div>
                        <h4 className="text-white font-medium mb-3">Selected Template</h4>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">
                              {isCustomTemplate ? 'Custom Template' : selectedTemplate.name}
                            </span>
                            {!isCustomTemplate && selectedTemplate.aiOptimized && (
                              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                                <Brain className="w-3 h-3 mr-1" />
                                AI Optimized
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {isCustomTemplate ? 'User-defined template' : selectedTemplate.description}
                          </p>
                        </div>
                      </div>

                      {/* Start Processing Button */}
                      <div className="pt-4">
                        <Button
                          onClick={handleStartProcessing}
                          disabled={!dataPreview || processingStatus?.stage === 'processing'}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3"
                          data-testid="start-processing-button"
                        >
                          {processingStatus?.stage === 'processing' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing Capsules...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Start Bulk Creation
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('preview')}
                      data-testid="review-data-button"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Data
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setCurrentTab('template')}
                      data-testid="modify-template-button"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Modify Template
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowAdvancedSettings(true)}
                      data-testid="adjust-settings-button"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Adjust Settings
                    </Button>
                    
                    <Separator />
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-400 border-red-500/50 hover:bg-red-500/10"
                      onClick={() => {
                        setDataPreview(null);
                        setProcessingStatus(null);
                        setSelectedRows(new Set());
                        setCurrentTab('upload');
                      }}
                      data-testid="reset-all-button"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                {processingStatus && (
                  <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30 mt-4">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-orange-400" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Throughput:</span>
                        <span className="text-white">
                          {Math.round(processingStatus.processedRows / Math.max(1, processingStatus.currentBatch * 60))} rows/min
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400">
                          {Math.round((processingStatus.processedRows / Math.max(1, processingStatus.processedRows + processingStatus.errors.length)) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">ETA:</span>
                        <span className="text-white">
                          {Math.ceil((processingStatus.totalRows - processingStatus.processedRows) / Math.max(1, processingStatus.processedRows / processingStatus.currentBatch))} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}