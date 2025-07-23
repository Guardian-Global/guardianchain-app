// Real Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Silent configuration check - no console warnings
const isConfigured = supabaseUrl && supabaseServiceKey;

// Create Supabase client with enhanced configuration
export const supabase = isConfigured 
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        persistSession: false
      },
      global: {
        headers: {
          'x-client': 'guardianchain-frontend'
        }
      }
    })
  : null;

// Asset management functions
export async function getAllAssets() {
  if (!supabase) {
    throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY');
  }

  try {
    // List all files in storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) throw bucketsError;

    const allAssets = [];
    
    for (const bucket of buckets) {
      try {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
        
        if (!filesError && files) {
          for (const file of files) {
            if (file.name && !file.name.endsWith('/')) { // Skip folders
              const { data: urlData } = supabase.storage
                .from(bucket.name)
                .getPublicUrl(file.name);
              
              // Fix double extension issues and create clean URLs
              let cleanFileName = file.name;
              if (file.name.includes('.png.png')) {
                cleanFileName = file.name.replace('.png.png', '.png');
              }
              if (file.name.includes('.jpg.jpg')) {
                cleanFileName = file.name.replace('.jpg.jpg', '.jpg');
              }
              
              allAssets.push({
                id: `${bucket.name}/${cleanFileName}`,
                name: cleanFileName,
                originalName: file.name,
                bucket: bucket.name,
                size: file.metadata?.size || 0,
                type: getFileType(cleanFileName),
                url: urlData.publicUrl.replace(encodeURIComponent(file.name), encodeURIComponent(cleanFileName)),
                lastModified: file.updated_at || file.created_at,
                metadata: file.metadata
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Error listing files in bucket ${bucket.name}:`, error);
      }
    }

    return allAssets;
  } catch (error) {
    throw new Error('Failed to fetch assets: ' + (error as Error).message);
  }
}

export async function getAssetsByType(type: string) {
  const assets = await getAllAssets();
  return assets.filter(asset => asset.type === type);
}

export async function searchAssets(query: string) {
  const assets = await getAllAssets();
  return assets.filter(asset => 
    asset.name.toLowerCase().includes(query.toLowerCase()) ||
    asset.bucket.toLowerCase().includes(query.toLowerCase())
  );
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext) return 'unknown';
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const dataExts = ['json', 'csv', 'xml', 'yaml'];
  
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  if (dataExts.includes(ext)) return 'data';
  
  return 'file';
}

export async function createCapsuleFromAsset(asset: any, additionalData: any = {}) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const capsuleData = {
    title: additionalData.title || `Asset: ${asset.name}`,
    content: additionalData.content || `Imported asset from ${asset.bucket}`,
    asset_url: asset.url,
    asset_type: asset.type,
    asset_name: asset.name,
    asset_size: asset.size,
    metadata: {
      ...asset.metadata,
      imported_from: 'supabase_storage',
      original_bucket: asset.bucket,
      ...additionalData.metadata
    },
    status: 'draft',
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('capsules')
    .insert([capsuleData])
    .select()
    .single();

  if (error) throw error;
  
  return data;
}

// Database table operations
export async function getTableData(tableName: string, limit = 100) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllTables() {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // This requires RLS to be configured properly
  const { data, error } = await supabase.rpc('get_table_names');
  
  if (error) {
    // Fallback to common table names if RPC not available
    const commonTables = [
      'capsules', 'users', 'verifications', 'transactions', 
      'achievements', 'treasury_snapshots', 'gtt_price_tracking',
      'stripe_subscriptions', 'compliance_logs'
    ];
    
    const existingTables = [];
    for (const table of commonTables) {
      try {
        await supabase.from(table).select('*').limit(1);
        existingTables.push(table);
      } catch {
        // Table doesn't exist or no access
      }
    }
    return existingTables;
  }
  
  return data?.map((row: any) => row.table_name) || [];
}