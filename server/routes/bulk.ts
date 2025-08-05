import type { Express } from "express";
import { isDebugAuthenticated } from "../debugAuth";
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import * as XLSX from 'xlsx';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload CSV, Excel, JSON, or TXT files.'));
    }
  }
});

interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'email' | 'url' | 'phone' | 'address';
  sampleValues: string[];
  nullCount: number;
  uniqueCount: number;
}

interface DataPreview {
  columns: DataColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  fileName: string;
  fileSize: number;
  encoding: string;
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

function detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'email' | 'url' | 'phone' | 'address' {
  const sampleValues = values.filter(v => v != null && v !== '').slice(0, 10);
  
  if (sampleValues.length === 0) return 'string';
  
  // Check for email pattern
  if (sampleValues.every(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))) {
    return 'email';
  }
  
  // Check for URL pattern
  if (sampleValues.every(v => /^https?:\/\//.test(String(v)))) {
    return 'url';
  }
  
  // Check for phone pattern
  if (sampleValues.every(v => /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(String(v)))) {
    return 'phone';
  }
  
  // Check for date pattern
  if (sampleValues.every(v => !isNaN(Date.parse(String(v))))) {
    return 'date';
  }
  
  // Check for number pattern
  if (sampleValues.every(v => !isNaN(Number(v)))) {
    return 'number';
  }
  
  return 'string';
}

function analyzeColumn(columnName: string, values: any[]): DataColumn {
  const nonNullValues = values.filter(v => v != null && v !== '');
  const uniqueValues = [...new Set(nonNullValues.map(v => String(v)))];
  
  return {
    name: columnName,
    type: detectColumnType(values),
    sampleValues: uniqueValues.slice(0, 3),
    nullCount: values.length - nonNullValues.length,
    uniqueCount: uniqueValues.length
  };
}

async function parseCSV(buffer: Buffer): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, any>[] = [];
    const stream = Readable.from(buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function parseExcel(buffer: Buffer): Record<string, any>[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

function parseJSON(buffer: Buffer): Record<string, any>[] {
  const content = buffer.toString();
  const parsed = JSON.parse(content);
  
  if (Array.isArray(parsed)) {
    return parsed;
  } else {
    return [parsed];
  }
}

function parseTSV(buffer: Buffer): Record<string, any>[] {
  const content = buffer.toString();
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = lines[0].split('\t');
  const results: Record<string, any>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const row: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    
    results.push(row);
  }
  
  return results;
}

function replaceTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, columnName) => {
    return String(data[columnName] || '');
  });
}

function generateCapsuleId(): string {
  return `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function estimateGTT(content: string): number {
  const baseScore = Math.min(content.length / 10, 100);
  const wordCount = content.split(/\s+/).length;
  const complexityBonus = Math.min(wordCount / 5, 50);
  return Math.round(baseScore + complexityBonus);
}

function calculateTruthScore(content: string): number {
  // Simple truth score calculation based on content characteristics
  let score = 50; // Base score
  
  // Length bonus
  if (content.length > 100) score += 10;
  if (content.length > 500) score += 10;
  
  // Complexity bonus
  const sentences = content.split(/[.!?]+/).length;
  if (sentences > 3) score += 10;
  
  // Specific keywords that might indicate authenticity
  const truthIndicators = ['evidence', 'witness', 'fact', 'documented', 'verified', 'confirmed'];
  const foundIndicators = truthIndicators.filter(indicator => 
    content.toLowerCase().includes(indicator)
  ).length;
  score += foundIndicators * 5;
  
  return Math.min(Math.max(score, 1), 100);
}

export function registerBulkRoutes(app: Express) {
  // Upload and parse data file
  app.post('/api/capsules/bulk-upload', isDebugAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { originalname, buffer, mimetype, size } = req.file;
      let rows: Record<string, any>[] = [];

      // Parse file based on type
      try {
        if (mimetype === 'text/csv') {
          rows = await parseCSV(buffer);
        } else if (mimetype === 'application/vnd.ms-excel' || 
                   mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          rows = parseExcel(buffer);
        } else if (mimetype === 'application/json') {
          rows = parseJSON(buffer);
        } else if (mimetype === 'text/plain') {
          rows = parseTSV(buffer);
        } else {
          return res.status(400).json({ error: 'Unsupported file format' });
        }
      } catch (parseError) {
        console.error('File parsing error:', parseError);
        return res.status(400).json({ error: 'Failed to parse file. Please check the format.' });
      }

      if (rows.length === 0) {
        return res.status(400).json({ error: 'No data found in file' });
      }

      // Analyze columns
      const columnNames = Object.keys(rows[0]);
      const columns: DataColumn[] = columnNames.map(columnName => {
        const columnValues = rows.map(row => row[columnName]);
        return analyzeColumn(columnName, columnValues);
      });

      const preview: DataPreview = {
        columns,
        rows: rows.slice(0, 100), // Preview first 100 rows
        totalRows: rows.length,
        fileName: originalname,
        fileSize: size,
        encoding: 'UTF-8'
      };

      res.json(preview);

    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ error: 'Internal server error during file upload' });
    }
  });

  // Process bulk capsule creation
  app.post('/api/capsules/bulk-process', isDebugAuthenticated, async (req, res) => {
    try {
      const { preview, mapping, template, batchSize = 50, selectedRows } = req.body;

      if (!preview || !template) {
        return res.status(400).json({ error: 'Missing required data' });
      }

      const rowsToProcess = selectedRows && selectedRows.length > 0 
        ? selectedRows.map((index: number) => preview.rows[index]).filter(Boolean)
        : preview.rows;

      if (rowsToProcess.length === 0) {
        return res.status(400).json({ error: 'No rows to process' });
      }

      const bulkCapsules: BulkCapsule[] = [];
      let processed = 0;
      let failed = 0;

      // Process in batches
      for (let i = 0; i < rowsToProcess.length; i += batchSize) {
        const batch = rowsToProcess.slice(i, i + batchSize);
        
        for (const row of batch) {
          try {
            const content = replaceTemplate(template, row);
            
            if (!content.trim()) {
              failed++;
              continue;
            }

            const capsule: BulkCapsule = {
              id: generateCapsuleId(),
              title: `Capsule from ${preview.fileName} - Row ${i + batch.indexOf(row) + 1}`,
              content,
              status: 'success',
              gttEstimate: estimateGTT(content),
              truthScore: calculateTruthScore(content),
              rowData: row
            };

            bulkCapsules.push(capsule);
            processed++;

          } catch (error) {
            failed++;
            const errorCapsule: BulkCapsule = {
              id: generateCapsuleId(),
              title: `Failed - Row ${i + batch.indexOf(row) + 1}`,
              content: '',
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
              gttEstimate: 0,
              truthScore: 0,
              rowData: row
            };
            bulkCapsules.push(errorCapsule);
          }
        }

        // Simulate processing delay for realistic progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const result = {
        created: processed,
        failed,
        capsules: bulkCapsules
      };

      res.json(result);

    } catch (error) {
      console.error('Bulk processing error:', error);
      res.status(500).json({ error: 'Internal server error during processing' });
    }
  });

  // Get bulk processing status (for real-time updates)
  app.get('/api/capsules/bulk-status/:jobId', isDebugAuthenticated, async (req, res) => {
    try {
      const { jobId } = req.params;
      
      // In a real implementation, this would check job status from a job queue
      // For now, return mock status
      const status = {
        jobId,
        stage: 'complete',
        progress: 100,
        currentRow: 500,
        totalRows: 500,
        message: 'Processing complete',
        errors: [],
        warnings: [],
        processed: 450,
        failed: 50,
        skipped: 0
      };

      res.json(status);

    } catch (error) {
      console.error('Bulk status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}