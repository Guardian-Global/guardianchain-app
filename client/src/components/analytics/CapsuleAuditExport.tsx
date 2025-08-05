import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database } from 'lucide-react';

interface CapsuleAuditExportProps {
  capsuleId: string;
}

export default function CapsuleAuditExport({ capsuleId }: CapsuleAuditExportProps) {
  const exportAudit = (format: 'csv' | 'json') => {
    const url = `/api/capsule/analytics/audit/${capsuleId}?format=${format}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={() => exportAudit('csv')}
        className="bg-[#00ffe1] text-black hover:bg-[#00ffe1]/90 flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export CSV
      </Button>
      
      <Button
        onClick={() => exportAudit('json')}
        className="bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90 flex items-center gap-2"
      >
        <Database className="h-4 w-4" />
        Export JSON
      </Button>

      <div className="text-xs text-[#8b949e] flex items-center gap-2 p-2">
        <Download className="h-3 w-3" />
        Export complete audit trail with timestamps and metadata
      </div>
    </div>
  );
}