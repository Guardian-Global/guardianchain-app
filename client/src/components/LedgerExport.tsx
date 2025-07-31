import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange: 'all' | 'last_30_days' | 'last_90_days' | 'last_year';
  includeVerifications: boolean;
  includeTransactions: boolean;
  includeMetadata: boolean;
}

export default function LedgerExport() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'last_30_days',
    includeVerifications: true,
    includeTransactions: true,
    includeMetadata: false
  });
  
  const [exported, setExported] = useState(false);
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async (options: ExportOptions) => {
      const response = await apiRequest('POST', '/api/export/ledger', options);
      return response.blob();
    },
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `guardianchain-ledger-${timestamp}.${exportOptions.format}`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setExported(true);
      toast({
        title: "Export Complete",
        description: `Public ledger exported as ${filename}`,
      });
      
      // Reset after 3 seconds
      setTimeout(() => setExported(false), 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export ledger data",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    exportMutation.mutate(exportOptions);
  };

  const getEstimatedSize = () => {
    const baseSize = exportOptions.dateRange === 'all' ? 15 : 
                     exportOptions.dateRange === 'last_year' ? 8 :
                     exportOptions.dateRange === 'last_90_days' ? 3 : 1;
    
    let multiplier = 1;
    if (exportOptions.includeVerifications) multiplier += 0.5;
    if (exportOptions.includeTransactions) multiplier += 0.3;
    if (exportOptions.includeMetadata) multiplier += 0.2;
    
    return `~${Math.round(baseSize * multiplier)}MB`;
  };

  const getRecordEstimate = () => {
    const baseRecords = exportOptions.dateRange === 'all' ? 50000 : 
                       exportOptions.dateRange === 'last_year' ? 25000 :
                       exportOptions.dateRange === 'last_90_days' ? 8000 : 2500;
    return baseRecords.toLocaleString();
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-400" />
            Public Ledger Export
          </div>
          <Badge className="bg-blue-600 text-white">
            <FileText className="w-3 h-3 mr-1" />
            Veritas Data
          </Badge>
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Export comprehensive blockchain ledger data for analysis, compliance, and transparency reporting
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Export Format</label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: 'csv' | 'json' | 'xlsx') => 
              setExportOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
              <SelectItem value="json">JSON (Structured Data)</SelectItem>
              <SelectItem value="xlsx">Excel (Spreadsheet)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Date Range</label>
          <Select 
            value={exportOptions.dateRange} 
            onValueChange={(value: any) => 
              setExportOptions(prev => ({ ...prev, dateRange: value }))
            }
          >
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
              <SelectItem value="all">All Records</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Inclusion Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Include Data Types</label>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.includeVerifications}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeVerifications: e.target.checked 
                }))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
              <span className="text-slate-300 text-sm">Verification Records</span>
              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                Truth validation data
              </Badge>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.includeTransactions}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeTransactions: e.target.checked 
                }))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
              <span className="text-slate-300 text-sm">GTT Transactions</span>
              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                Token transfers & rewards
              </Badge>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeMetadata: e.target.checked 
                }))}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
              <span className="text-slate-300 text-sm">Extended Metadata</span>
              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                Detailed attributes
              </Badge>
            </label>
          </div>
        </div>

        {/* Export Preview */}
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Estimated Records:</span>
            <span className="text-white font-medium">{getRecordEstimate()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Estimated Size:</span>
            <span className="text-white font-medium">{getEstimatedSize()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Processing Time:</span>
            <span className="text-slate-300">2-5 minutes</span>
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={exportMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {exportMutation.isPending ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Export...
            </>
          ) : exported ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Export Complete
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export Public Ledger
            </>
          )}
        </Button>

        {/* Success/Error Messages */}
        {exported && (
          <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Export Successful</span>
            </div>
            <p className="text-green-300 text-sm mt-1">
              Your ledger export has been downloaded successfully
            </p>
          </div>
        )}

        {/* Compliance Notice */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300">Transparency Notice</p>
              <p>
                This export contains public blockchain data only. 
                Personal information and private capsule content are never included in exports.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}