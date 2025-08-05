import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function MetaMaskConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check for existing connection on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          getChainId();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  const getChainId = async () => {
    try {
      const id = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(id);
    } catch (err) {
      console.error('Error getting chain ID:', err);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setChainId(null);
    } else {
      setAccount(accounts[0]);
      logWalletConnection(accounts[0]);
    }
  };

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId);
  };

  const logWalletConnection = async (wallet: string) => {
    try {
      await apiRequest('POST', '/api/wallet-connections', {
        wallet,
        lastSeen: new Date().toISOString()
      });
      
      toast({
        title: "Wallet Connected",
        description: `Successfully logged connection for ${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to log wallet connection:', error);
      toast({
        title: "Connection Warning",
        description: "Wallet connected but logging failed",
        variant: "destructive",
      });
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask not detected. Please install the MetaMask extension.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const wallet = accounts[0];
      setAccount(wallet);
      await getChainId();

      // Log wallet connection to backend
      await logWalletConnection(wallet);

      // Redirect to profile view
      setLocation(`/profile/${wallet}`);
    } catch (err: any) {
      console.error('Failed to connect MetaMask:', err);
      setError(err.message || 'Failed to connect to MetaMask');
      toast({
        title: "Connection Failed",
        description: err.message || 'Failed to connect to MetaMask',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai',
      '0x2105': 'Base Mainnet',
      '0x14a33': 'Base Goerli'
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  if (account) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <CheckCircle className="w-5 h-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Your MetaMask wallet is successfully connected to GuardianChain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-mono text-sm text-white">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
                <p className="text-xs text-gray-400">Wallet Address</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account)}
              className="text-cyan-400 hover:text-cyan-300"
              data-testid="button-copy-address"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {chainId && (
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-white">{getNetworkName(chainId)}</p>
                  <p className="text-xs text-gray-400">Network</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="border-purple-500/30 text-purple-400"
              >
                {chainId}
              </Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => setLocation(`/profile/${account}`)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              data-testid="button-view-profile"
            >
              <Wallet className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button
              onClick={() => setLocation('/explore')}
              variant="outline"
              className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              data-testid="button-explore-capsules"
            >
              Explore Capsules
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          Connect Web3 Wallet
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to access GuardianChain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50"
          data-testid="button-connect-metamask"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect MetaMask
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            Don't have MetaMask?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://metamask.io/', '_blank')}
            className="text-cyan-400 hover:text-cyan-300"
            data-testid="button-install-metamask"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Install MetaMask
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}