import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Loader2,
  Hash,
  Type,
  Calendar,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Link
} from 'lucide-react';

interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'email' | 'url' | 'phone' | 'address';
  sampleValues: string[];
  nullCount: number;
  uniqueCount: number;
  mapped?: boolean;
  capsuleField?: string;
}

interface DataPreview {
  columns: DataColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  fileName: string;
  fileSize: number;
  encoding: string;
}

interface ProcessingStatus {
  stage: 'uploading' | 'parsing' | 'validating' | 'processing' | 'complete' | 'error';
  progress: number;
  currentRow: number;
  totalRows: number;
  message: string;
  errors: string[];
  warnings: string[];
  processed: number;
  failed: number;
  skipped: number;
}

interface BulkCapsule {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  error?: string;
  gttEstimate: number;
  truthScore: number;
  rowData: Record<string, any>;
}

interface BulkDataDumpCapsuleProps {
  onComplete?: (results: { created: number; failed: number; capsules: BulkCapsule[] }) => void;
}

export default function BulkDataDumpCapsule({ onComplete }: BulkDataDumpCapsuleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [bulkCapsules, setBulkCapsules] = useState<BulkCapsule[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'mapping' | 'processing' | 'results'>('upload');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [templateContent, setTemplateContent] = useState('');
  const [batchSize, setBatchSize] = useState(50);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('POST', '/api/capsules/bulk-upload', formData);
    },
    onSuccess: async (response) => {
      const preview = await response.json();
      setDataPreview(preview);
      setActiveTab('preview');
      toast({
        title: "File Uploaded Successfully",
        description: `Parsed ${preview.totalRows} rows with ${preview.columns.length} columns`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Please check your file format",
        variant: "destructive",
      });
    },
  });

  const processMutation = useMutation({
    mutationFn: async (data: {
      preview: DataPreview;
      mapping: Record<string, string>;
      template: string;
      batchSize: number;
      selectedRows?: number[];
    }) => {
      return apiRequest('POST', '/api/capsules/bulk-process', data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      onComplete?.(result);
      toast({
        title: "Bulk Processing Complete",
        description: `Created ${result.created} capsules, ${result.failed} failed`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setFile(file);
      uploadMutation.mutate(file);
    }
  }, [uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  const startProcessing = () => {
    if (!dataPreview || !templateContent.trim()) {
      toast({
        title: "Missing Requirements",
        description: "Please upload data and provide a content template",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setActiveTab('processing');
    
    const selectedRowsArray = selectedRows.size > 0 ? Array.from(selectedRows) : undefined;
    
    processMutation.mutate({
      preview: dataPreview,
      mapping: columnMapping,
      template: templateContent,
      batchSize,
      selectedRows: selectedRowsArray
    });
  };

  const pauseProcessing = () => {
    setIsPaused(!isPaused);
    // Implementation would send pause/resume signal to backend
  };

  const resetUpload = () => {
    setFile(null);
    setDataPreview(null);
    setProcessingStatus(null);
    setBulkCapsules([]);
    setColumnMapping({});
    setSelectedRows(new Set());
    setActiveTab('upload');
  };

  const getColumnIcon = (type: string) => {
    switch (type) {
      case 'string': return Type;
      case 'number': return Hash;
      case 'date': return Calendar;
      case 'email': return Mail;
      case 'url': return Link;
      case 'phone': return Phone;
      case 'address': return MapPin;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'processing': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      case 'processing': return Loader2;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
  };

  const selectAllRows = () => {
    if (!dataPreview) return;
    setSelectedRows(new Set(Array.from({ length: dataPreview.totalRows }, (_, i) => i)));
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Bulk Data Dump Capsule</h1>
                <p className="text-gray-400">Upload datasets and create multiple capsules at once</p>
              </div>
            </div>
            
            {file && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Current File</div>
                <div className="font-medium text-white">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'upload', label: 'Upload', icon: Upload, disabled: false },
              { id: 'preview', label: 'Preview', icon: Eye, disabled: !dataPreview },
              { id: 'mapping', label: 'Mapping', icon: Settings, disabled: !dataPreview },
              { id: 'processing', label: 'Processing', icon: Play, disabled: !dataPreview },
              { id: 'results', label: 'Results', icon: BarChart3, disabled: bulkCapsules.length === 0 },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                  disabled={tab.disabled}
                  className={`${activeTab === tab.id ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
                  data-testid={`tab-${tab.id}`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Data File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  data-testid="file-upload-area"
                >
                  <input {...getInputProps()} />
                  
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                    {uploadMutation.isPending ? (
                      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragActive ? 'Drop your file here' : 'Upload Data File'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Support CSV, Excel, JSON, and TXT files up to 50MB
                  </p>
                  
                  <Button variant="outline" disabled={uploadMutation.isPending}>
                    Choose File
                  </Button>
                </div>

                {/* Supported Formats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { format: 'CSV', icon: FileSpreadsheet, desc: 'Comma separated' },
                    { format: 'Excel', icon: FileSpreadsheet, desc: '.xls, .xlsx files' },
                    { format: 'JSON', icon: FileText, desc: 'JSON objects' },
                    { format: 'TXT', icon: FileText, desc: 'Tab delimited' },
                    { format: 'TSV', icon: FileText, desc: 'Tab separated' },
                  ].map(item => (
                    <Card key={item.format} className="bg-gray-700/30 border-gray-600 p-4 text-center">
                      <item.icon className="w-8 h-8 mx-auto text-cyan-400 mb-2" />
                      <div className="font-medium text-white text-sm">{item.format}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </Card>
                  ))}
                </div>

                {/* Reset Button */}
                {file && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={resetUpload}
                      data-testid="reset-upload"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Upload Different File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && dataPreview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Data Summary */}
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Data Preview
                  </div>
                  <Badge className="bg-cyan-600">
                    {dataPreview.totalRows.toLocaleString()} rows
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-700/30 rounded">
                    <div className="text-2xl font-bold text-cyan-300">{dataPreview.totalRows.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Rows</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded">
                    <div className="text-2xl font-bold text-purple-300">{dataPreview.columns.length}</div>
                    <div className="text-sm text-gray-400">Columns</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded">
                    <div className="text-2xl font-bold text-pink-300">{(dataPreview.fileSize / 1024 / 1024).toFixed(1)}MB</div>
                    <div className="text-sm text-gray-400">File Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/30 rounded">
                    <div className="text-2xl font-bold text-green-300">{dataPreview.encoding}</div>
                    <div className="text-sm text-gray-400">Encoding</div>
                  </div>
                </div>

                {/* Column Analysis */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Column Analysis</h3>
                  <div className="space-y-2">
                    {dataPreview.columns.map((column, index) => {
                      const IconComponent = getColumnIcon(column.type);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-4 h-4 text-cyan-400" />
                            <div>
                              <div className="font-medium text-white">{column.name}</div>
                              <div className="text-sm text-gray-400 capitalize">{column.type}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-green-300">{column.uniqueCount}</div>
                              <div className="text-xs text-gray-400">Unique</div>
                            </div>
                            <div className="text-center">
                              <div className="text-red-300">{column.nullCount}</div>
                              <div className="text-xs text-gray-400">Null</div>
                            </div>
                            <div className="w-32">
                              <div className="text-xs text-gray-400 mb-1">Sample Values</div>
                              <div className="text-xs text-gray-300 truncate">
                                {column.sampleValues.slice(0, 2).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Data Sample */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Sample (First 10 Rows)</h3>
                  <ScrollArea className="h-64 w-full border border-gray-600 rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-700/30">
                        <tr>
                          {dataPreview.columns.map(column => (
                            <th key={column.name} className="p-2 text-left text-white font-medium border-r border-gray-600">
                              {column.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataPreview.rows.slice(0, 10).map((row, index) => (
                          <tr key={index} className="border-b border-gray-700">
                            {dataPreview.columns.map(column => (
                              <td key={column.name} className="p-2 text-gray-300 border-r border-gray-600">
                                {String(row[column.name] || '').substring(0, 50)}
                                {String(row[column.name] || '').length > 50 && '...'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                {/* Row Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllRows}
                      data-testid="select-all-rows"
                    >
                      Select All Rows
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                      data-testid="clear-selection"
                    >
                      Clear Selection
                    </Button>
                    <span className="text-sm text-gray-400">
                      {selectedRows.size > 0 ? `${selectedRows.size} rows selected` : 'All rows will be processed'}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => setActiveTab('mapping')}
                    data-testid="proceed-to-mapping"
                  >
                    Proceed to Mapping
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mapping Tab */}
        {activeTab === 'mapping' && dataPreview && (
          <motion.div
            key="mapping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Content Template & Column Mapping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content Template */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Content Template
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <Textarea
                    placeholder="Use {{column_name}} to insert data from columns. Example: My name is {{name}} and I work at {{company}}..."
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    className="h-32"
                    data-testid="content-template"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Use double curly braces {{column_name}} to insert data from your uploaded file
                  </div>
                </div>

                {/* Processing Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Batch Size</label>
                    <Input
                      type="number"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      min={1}
                      max={1000}
                      data-testid="batch-size"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Number of capsules to process simultaneously
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Filter Criteria</label>
                    <Input
                      placeholder="Optional filter expression"
                      value={filterCriteria}
                      onChange={(e) => setFilterCriteria(e.target.value)}
                      data-testid="filter-criteria"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Advanced filtering (e.g., age {'>'} 18)
                    </div>
                  </div>
                </div>

                {/* Available Columns */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Available Columns</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dataPreview.columns.map(column => {
                      const IconComponent = getColumnIcon(column.type);
                      return (
                        <Button
                          key={column.name}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newTemplate = templateContent + `{{${column.name}}} `;
                            setTemplateContent(newTemplate);
                          }}
                          className="justify-start"
                          data-testid={`column-${column.name}`}
                        >
                          <IconComponent className="w-3 h-3 mr-2" />
                          {column.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Template Preview */}
                {templateContent && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Template Preview</h3>
                    <div className="p-4 bg-gray-700/30 rounded border">
                      <div className="font-medium text-white mb-2">Sample Output:</div>
                      <div className="text-gray-300 text-sm">
                        {/* Simple template replacement for preview */}
                        {templateContent.replace(/\{\{(\w+)\}\}/g, (match, columnName) => {
                          const column = dataPreview.columns.find(c => c.name === columnName);
                          return column?.sampleValues[0] || `[${columnName}]`;
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('preview')}
                    data-testid="back-to-preview"
                  >
                    Back to Preview
                  </Button>
                  
                  <Button
                    onClick={startProcessing}
                    disabled={!templateContent.trim()}
                    data-testid="start-processing"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Processing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Processing Tab */}
        {activeTab === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Bulk Processing
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={pauseProcessing}
                      data-testid="pause-processing"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('results')}
                      disabled={bulkCapsules.length === 0}
                      data-testid="view-results"
                    >
                      View Results
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {processMutation.isPending ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto relative">
                      <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                      <Database className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white">Processing Your Data</h3>
                    <p className="text-gray-400">Creating capsules from your dataset...</p>
                    
                    <div className="max-w-md mx-auto space-y-2">
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>324 of 500 processed</span>
                        <span>65%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Processing Complete!</h3>
                    <p className="text-gray-400">Your bulk capsule creation has finished</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && bulkCapsules.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Processing Results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" data-testid="download-results">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetUpload} data-testid="start-new">
                      Start New Upload
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded">
                    <div className="text-3xl font-bold text-green-300">
                      {bulkCapsules.filter(c => c.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-400">Created Successfully</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded">
                    <div className="text-3xl font-bold text-red-300">
                      {bulkCapsules.filter(c => c.status === 'failed').length}
                    </div>
                    <div className="text-sm text-gray-400">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <div className="text-3xl font-bold text-yellow-300">
                      {bulkCapsules.filter(c => c.status === 'processing').length}
                    </div>
                    <div className="text-sm text-gray-400">Processing</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
                    <div className="text-3xl font-bold text-cyan-300">
                      {bulkCapsules.reduce((sum, c) => sum + c.gttEstimate, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total GTT Potential</div>
                  </div>
                </div>

                {/* Results List */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Individual Results</h3>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {bulkCapsules.map((capsule, index) => {
                        const StatusIcon = getStatusIcon(capsule.status);
                        return (
                          <Card key={capsule.id} className="bg-gray-700/30 border-gray-600">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <StatusIcon 
                                    className={`w-5 h-5 mt-0.5 ${getStatusColor(capsule.status)} ${
                                      capsule.status === 'processing' ? 'animate-spin' : ''
                                    }`} 
                                  />
                                  
                                  <div className="flex-1">
                                    <h4 className="font-medium text-white">{capsule.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                      {capsule.content.substring(0, 150)}...
                                    </p>
                                    
                                    {capsule.error && (
                                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-300">
                                        {capsule.error}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 ml-4">
                                  <Badge className="bg-yellow-600">
                                    {capsule.gttEstimate} GTT
                                  </Badge>
                                  <Badge variant="outline">
                                    {capsule.truthScore}/100
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}