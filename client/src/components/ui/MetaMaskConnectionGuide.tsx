import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, AlertTriangle, Wallet } from 'lucide-react';

interface MetaMaskConnectionGuideProps {
  error?: string;
  onRetry?: () => void;
}

export function MetaMaskConnectionGuide({ error, onRetry }: MetaMaskConnectionGuideProps) {
  const isInIframe = () => {
    try {
      return window.parent !== window;
    } catch (e) {
      return true; // Assume iframe if we can't check
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  if (isInIframe() || error?.includes('preview mode') || error?.includes('new tab')) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            MetaMask Access Required
          </CardTitle>
          <CardDescription>
            MetaMask cannot be accessed from the preview window
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Preview Mode Limitation</AlertTitle>
            <AlertDescription>
              Browser extensions like MetaMask don't work in embedded preview windows. 
              You need to open the app in a full browser tab.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <Button onClick={openInNewTab} className="w-full" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>After opening in a new tab:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ensure MetaMask extension is installed</li>
                <li>Unlock your MetaMask wallet</li>
                <li>Connect to the GuardianChain app</li>
                <li>Switch to Base Network if prompted</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-blue-500" />
          Connect MetaMask Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to access GuardianChain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full" size="lg">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Requirements:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>MetaMask browser extension installed</li>
              <li>Wallet unlocked and accessible</li>
              <li>App opened in full browser tab (not preview)</li>
              <li>Base Network supported</li>
            </ul>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Don't have MetaMask? 
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                Download here
              </a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}