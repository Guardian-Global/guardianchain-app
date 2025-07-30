import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, AlertCircle, CheckCircle } from "lucide-react";

export default function AssetDebug() {
  const [assetTests, setAssetTests] = React.useState<any[]>([]);

  const testAsset = async (path: string, type: 'image' | 'video') => {
    try {
      const response = await fetch(path);
      console.log(`Testing ${path}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        ok: response.ok
      });
      
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      return {
        path,
        type,
        status: response.status,
        ok: response.ok,
        contentType,
        contentLength,
        url: response.url
      };
    } catch (error) {
      console.error(`Error testing ${path}:`, error);
      return {
        path,
        type,
        status: 'error',
        ok: false,
        contentType: null,
        contentLength: null,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    const assets = [
      { path: '/assets/GUARDIANCHAIN_logo.png', type: 'image' as const },
      { path: '/assets/GTT_logo.png', type: 'image' as const },
      { path: '/assets/GAURDIANCHAIN_logo_video.mp4', type: 'video' as const },
      { path: '/assets/GTT_logo_video.mp4', type: 'video' as const }
    ];

    console.log('🔍 Starting comprehensive asset tests...');
    
    const results = await Promise.all(
      assets.map(asset => testAsset(asset.path, asset.type))
    );
    
    setAssetTests(results);
    console.log('📊 Asset test results:', results);
  };

  React.useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔧 ASSET DEBUG CENTER
          </h1>
          <p className="text-xl text-slate-300">
            Comprehensive asset loading diagnostics and repair system
          </p>
        </div>

        {/* Real-time Asset Tests */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Live Asset Loading Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Button onClick={runAllTests} className="bg-purple-600 hover:bg-purple-700">
                🔄 Re-run Tests
              </Button>
              <span className="text-slate-300">
                Tests run automatically on page load
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assetTests.map((test, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">
                      {test.path.split('/').pop()}
                    </h3>
                    {test.ok ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={test.ok ? 'text-green-400' : 'text-red-400'}>
                        {test.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Content-Type:</span>
                      <span className="text-slate-300">
                        {test.contentType || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size:</span>
                      <span className="text-slate-300">
                        {test.contentLength ? `${(parseInt(test.contentLength) / 1024).toFixed(1)}KB` : 'Unknown'}
                      </span>
                    </div>
                    {test.error && (
                      <div className="text-red-400 text-xs mt-2">
                        Error: {test.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Direct Image Tests */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-green-400" />
              Direct Image Loading Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">GUARDIANCHAIN Logo</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <img 
                    src="/assets/GUARDIANCHAIN_logo.png" 
                    alt="GUARDIANCHAIN Logo Direct Test"
                    className="w-full max-w-xs mx-auto"
                    style={{ display: 'block' }}
                    onLoad={(e) => {
                      console.log('✅ GUARDIANCHAIN logo loaded directly:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid green';
                    }}
                    onError={(e) => {
                      console.log('❌ GUARDIANCHAIN logo failed directly:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                      e.currentTarget.alt = 'FAILED TO LOAD';
                    }}
                  />
                  <p className="text-center text-sm text-slate-400 mt-2">
                    /assets/GUARDIANCHAIN_logo.png
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">GTT Logo</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <img 
                    src="/assets/GTT_logo.png" 
                    alt="GTT Logo Direct Test"
                    className="w-full max-w-xs mx-auto"
                    style={{ display: 'block' }}
                    onLoad={(e) => {
                      console.log('✅ GTT logo loaded directly:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid green';
                    }}
                    onError={(e) => {
                      console.log('❌ GTT logo failed directly:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                      e.currentTarget.alt = 'FAILED TO LOAD';
                    }}
                  />
                  <p className="text-center text-sm text-slate-400 mt-2">
                    /assets/GTT_logo.png
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Direct Video Tests */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-400" />
              Direct Video Loading Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">GUARDIANCHAIN Video</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <video 
                    src="/assets/GAURDIANCHAIN_logo_video.mp4" 
                    className="w-full max-w-xs mx-auto rounded-lg"
                    style={{ display: 'block' }}
                    autoPlay
                    loop
                    muted
                    controls
                    onLoadStart={(e) => {
                      console.log('🎬 GUARDIANCHAIN video loading:', e.currentTarget.src);
                    }}
                    onCanPlay={(e) => {
                      console.log('✅ GUARDIANCHAIN video ready:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid green';
                    }}
                    onError={(e) => {
                      console.log('❌ GUARDIANCHAIN video failed:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                  <p className="text-center text-sm text-slate-400 mt-2">
                    /assets/GAURDIANCHAIN_logo_video.mp4
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">GTT Video</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <video 
                    src="/assets/GTT_logo_video.mp4" 
                    className="w-full max-w-xs mx-auto rounded-lg"
                    style={{ display: 'block' }}
                    autoPlay
                    loop
                    muted
                    controls
                    onLoadStart={(e) => {
                      console.log('🎬 GTT video loading:', e.currentTarget.src);
                    }}
                    onCanPlay={(e) => {
                      console.log('✅ GTT video ready:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid green';
                    }}
                    onError={(e) => {
                      console.log('❌ GTT video failed:', e.currentTarget.src);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                  <p className="text-center text-sm text-slate-400 mt-2">
                    /assets/GTT_logo_video.mp4
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              🚀 ASSET SYSTEM STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-slate-300 mb-4">
              Use this page to diagnose and fix asset loading issues before token deployment
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Files Present
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                Testing Loading
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-blue-400" />
                Debugging Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}