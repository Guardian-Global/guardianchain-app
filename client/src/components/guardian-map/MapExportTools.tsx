import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download,
  FileImage,
  FileText,
  Database,
  Globe,
  Settings,
  Camera,
  Share2
} from 'lucide-react';

interface GuardianNode {
  id: string;
  wallet: string;
  latitude: number;
  longitude: number;
  truth_score: number;
  capsule_count: number;
  region: string;
  country: string;
  city: string;
  reputation_tier: 'Bronze' | 'Silver' | 'Gold' | 'Veritas';
  activity_level: 'low' | 'medium' | 'high';
  last_active: string;
  specialties: string[];
  connections: string[];
  influence_radius: number;
}

interface ExportOptions {
  includeConnections: boolean;
  includeMetrics: boolean;
  includeSpecialties: boolean;
  resolution: 'standard' | 'high' | 'ultra';
  format: 'png' | 'svg' | 'pdf';
  includeWatermark: boolean;
  includeTimestamp: boolean;
}

interface MapExportToolsProps {
  guardians: GuardianNode[];
  onExportData: (format: 'csv' | 'json' | 'excel', options: ExportOptions) => void;
  onExportImage: (options: ExportOptions) => void;
  onExportReport: (format: 'pdf' | 'html', options: ExportOptions) => void;
  onShareMap: () => void;
}

export default function MapExportTools({ 
  guardians, 
  onExportData, 
  onExportImage, 
  onExportReport,
  onShareMap 
}: MapExportToolsProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeConnections: true,
    includeMetrics: true,
    includeSpecialties: true,
    resolution: 'high',
    format: 'png',
    includeWatermark: true,
    includeTimestamp: true
  });

  const handleOptionChange = (option: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const generateFileName = (type: string, format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const guardianCount = guardians.length;
    return `guardianmap_${type}_${guardianCount}guardians_${timestamp}.${format}`;
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-indigo-300 flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export & Share Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Export Options */}
        <div>
          <Label className="text-sm text-gray-300 mb-3 block">Export Options</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeConnections"
                checked={exportOptions.includeConnections}
                onCheckedChange={(checked) => handleOptionChange('includeConnections', checked)}
                className="border-indigo-500/30"
              />
              <Label htmlFor="includeConnections" className="text-sm text-gray-300 cursor-pointer">
                Include Connections
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetrics"
                checked={exportOptions.includeMetrics}
                onCheckedChange={(checked) => handleOptionChange('includeMetrics', checked)}
                className="border-indigo-500/30"
              />
              <Label htmlFor="includeMetrics" className="text-sm text-gray-300 cursor-pointer">
                Include Metrics
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSpecialties"
                checked={exportOptions.includeSpecialties}
                onCheckedChange={(checked) => handleOptionChange('includeSpecialties', checked)}
                className="border-indigo-500/30"
              />
              <Label htmlFor="includeSpecialties" className="text-sm text-gray-300 cursor-pointer">
                Include Specialties
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTimestamp"
                checked={exportOptions.includeTimestamp}
                onCheckedChange={(checked) => handleOptionChange('includeTimestamp', checked)}
                className="border-indigo-500/30"
              />
              <Label htmlFor="includeTimestamp" className="text-sm text-gray-300 cursor-pointer">
                Include Timestamp
              </Label>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div>
          <Label className="text-sm text-gray-300 mb-3 block">Data Export</Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportData('csv', exportOptions)}
              className="flex-1 border-indigo-500/30"
            >
              <Database className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportData('json', exportOptions)}
              className="flex-1 border-indigo-500/30"
            >
              <Database className="w-4 h-4 mr-1" />
              JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportData('excel', exportOptions)}
              className="flex-1 border-indigo-500/30"
            >
              <Database className="w-4 h-4 mr-1" />
              Excel
            </Button>
          </div>
        </div>

        {/* Image Export Settings */}
        <div>
          <Label className="text-sm text-gray-300 mb-3 block">Image Export Settings</Label>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Resolution</Label>
              <Select 
                value={exportOptions.resolution} 
                onValueChange={(value) => handleOptionChange('resolution', value)}
              >
                <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-indigo-500/30">
                  <SelectItem value="standard">Standard (1920x1080)</SelectItem>
                  <SelectItem value="high">High (2560x1440)</SelectItem>
                  <SelectItem value="ultra">Ultra (3840x2160)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-400 mb-1 block">Format</Label>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value) => handleOptionChange('format', value)}
              >
                <SelectTrigger className="bg-slate-800 border-indigo-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-indigo-500/30">
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeWatermark"
                checked={exportOptions.includeWatermark}
                onCheckedChange={(checked) => handleOptionChange('includeWatermark', checked)}
                className="border-indigo-500/30"
              />
              <Label htmlFor="includeWatermark" className="text-sm text-gray-300 cursor-pointer">
                GuardianChain Watermark
              </Label>
            </div>
          </div>

          <Button
            onClick={() => onExportImage(exportOptions)}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600"
          >
            <Camera className="w-4 h-4 mr-2" />
            Export Map Image
          </Button>
        </div>

        {/* Report Export */}
        <div>
          <Label className="text-sm text-gray-300 mb-3 block">Report Export</Label>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportReport('pdf', exportOptions)}
              className="flex-1 border-indigo-500/30"
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExportReport('html', exportOptions)}
              className="flex-1 border-indigo-500/30"
            >
              <Globe className="w-4 h-4 mr-1" />
              Web Report
            </Button>
          </div>
        </div>

        {/* Sharing */}
        <div>
          <Label className="text-sm text-gray-300 mb-3 block">Share Map</Label>
          <Button
            variant="outline"
            onClick={onShareMap}
            className="w-full border-indigo-500/30"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Generate Shareable Link
          </Button>
        </div>

        {/* Export Info */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Current Dataset: {guardians.length} guardians</div>
            <div>• Export includes filtered results only</div>
            <div>• All timestamps in UTC format</div>
            <div>• High-resolution exports may take longer</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}