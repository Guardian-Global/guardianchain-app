import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MetaMaskTest: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const { toast } = useToast();

  const testMetaMaskConnection = async () => {
    setIsConnecting(true);
    setConnectionResult(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setConnectionResult({
          success: false,
          error: 'MetaMask not detected. Please install MetaMask.'
        });
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        setConnectionResult({
          success: false,
          error: 'No accounts found. Please unlock MetaMask.'
        });
        return;
      }

      // Get additional wallet info
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      setConnectionResult({
        success: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: parseInt(balance, 16) / Math.pow(10, 18)
      });

      toast({
        title: "MetaMask Connected",
        description: `Successfully connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
      });

    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending in MetaMask';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setConnectionResult({
        success: false,
        error: errorMessage
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wallet className="w-6 h-6 mr-2 text-blue-400" />
          MetaMask Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={testMetaMaskConnection}
            disabled={isConnecting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isConnecting ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Testing Connection...
              </div>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Test MetaMask Connection
              </>
            )}
          </Button>

          {connectionResult && (
            <div className={`rounded-lg p-4 ${
              connectionResult.success 
                ? 'bg-green-900/20 border border-green-700' 
                : 'bg-red-900/20 border border-red-700'
            }`}>
              <div className="flex items-center mb-3">
                {connectionResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                )}
                <h3 className={`font-bold ${
                  connectionResult.success ? 'text-green-400' : 'text-red-400'
                }`}>
                  {connectionResult.success ? 'Connection Successful' : 'Connection Failed'}
                </h3>
              </div>

              {connectionResult.success ? (
                <div className="space-y-2">
                  <div className="text-slate-300 text-sm">
                    <strong>Address:</strong> {connectionResult.address}
                  </div>
                  <div className="text-slate-300 text-sm">
                    <strong>Chain ID:</strong> {connectionResult.chainId}
                  </div>
                  <div className="text-slate-300 text-sm">
                    <strong>Balance:</strong> {connectionResult.balance.toFixed(4)} ETH
                  </div>
                </div>
              ) : (
                <div className="text-red-300 text-sm">
                  {connectionResult.error}
                </div>
              )}
            </div>
          )}

          <div className="bg-slate-700/50 rounded-lg p-3">
            <h4 className="text-white font-semibold mb-2">Debug Info</h4>
            <div className="text-slate-300 text-sm space-y-1">
              <div>MetaMask Detected: {typeof window.ethereum !== 'undefined' ? 'Yes' : 'No'}</div>
              <div>Is MetaMask: {window.ethereum?.isMetaMask ? 'Yes' : 'No'}</div>
              <div>Browser: {navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaMaskTest;