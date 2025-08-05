import { useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function MetaMaskConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask not detected. Please install the extension.');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const wallet = accounts[0];
      setAccount(wallet);

      // Log wallet connection to backend
      try {
        await apiRequest('POST', '/api/wallet-connections', {
          wallet,
          lastSeen: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to log wallet connection:', error);
      }

      // Redirect to profile view
      setLocation(`/profile/${wallet}`);
    } catch (err) {
      console.error('Failed to connect MetaMask:', err);
    }
  };

  return (
    <div className="p-4 text-white">
      {account ? (
        <p className="text-cyan-400">🔗 Connected: {account}</p>
      ) : (
        <button 
          onClick={connectMetaMask} 
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          data-testid="button-connect-metamask"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}