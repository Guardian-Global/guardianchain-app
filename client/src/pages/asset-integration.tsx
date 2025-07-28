import React from "react";
import AssetIntegrationHub from "@/components/AssetIntegrationHub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Upload, Search, Zap } from "lucide-react";

const AssetIntegrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Asset Integration Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Discover, review, and seamlessly integrate all your Supabase assets
            into GUARDIANCHAIN. Transform your stored files into verified truth
            capsules with automated processing.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Integration Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-6 h-6 mr-2 text-blue-400" />
                Asset Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Automatically scan all your Supabase storage buckets to discover
                images, videos, documents, and other assets ready for
                integration.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="w-6 h-6 mr-2 text-green-400" />
                Smart Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Filter assets by type, size, bucket, or search by name. Organize
                and select exactly what you want to integrate.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-6 h-6 mr-2 text-purple-400" />
                Bulk Capsule Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm">
                Select multiple assets and create truth capsules instantly. Each
                asset becomes a verified, immutable capsule on GUARDIANCHAIN.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Integration Hub */}
        <AssetIntegrationHub />

        {/* Integration Guide */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Integration Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
              <div>
                <h4 className="text-white font-medium mb-2">
                  Supported Asset Types
                </h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>
                    <strong>Images:</strong> JPG, PNG, GIF, SVG, WebP
                  </li>
                  <li>
                    <strong>Videos:</strong> MP4, AVI, MOV, WebM
                  </li>
                  <li>
                    <strong>Audio:</strong> MP3, WAV, FLAC, AAC
                  </li>
                  <li>
                    <strong>Documents:</strong> PDF, DOC, TXT, RTF
                  </li>
                  <li>
                    <strong>Data:</strong> JSON, CSV, XML, YAML
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">
                  Integration Process
                </h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>
                    Assets are automatically discovered from Supabase storage
                  </li>
                  <li>Use filters and search to find specific assets</li>
                  <li>Select assets you want to convert to capsules</li>
                  <li>Assets are processed and minted as truth capsules</li>
                  <li>Each capsule retains original metadata and links</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Supabase Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Database URL:</span>
                <span
                  className={
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {import.meta.env.NEXT_PUBLIC_SUPABASE_URL
                    ? "Configured"
                    : "Missing"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Service Key:</span>
                <span
                  className={
                    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
                    ? "Configured"
                    : "Missing"}
                </span>
              </div>
              {(!import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
                !import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY) && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded">
                  <p className="text-red-300 text-sm">
                    <strong>Configuration Required:</strong> Please add your
                    Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and
                    VITE_SUPABASE_SERVICE_ROLE_KEY) to access your assets.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetIntegrationPage;
