// client/src/components/auth/EnhancedWalletConnect.tsx
"use client";


import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { useEffect } from "react";

export default function EnhancedWalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { connect, connectors: availableConnectors, error: connectError, isPending: isConnecting } = useConnect();

  useEffect(() => {
    // You may want to check for supported networks here
    // Example: if (!isSupportedNetwork(chainId)) { ... }
  }, [chainId]);

  return (
    <div className="p-4 rounded border bg-gray-50 shadow-md text-sm">
      {isConnected ? (
        <div className="flex flex-col gap-2">
          <p className="text-green-700 font-medium">✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {availableConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
              disabled={isConnecting}
            >
              {isConnecting ? `Connecting...` : `Connect ${connector.name}`}
            </button>
          ))}
          {connectError && (
            <p className="text-red-600 text-xs mt-2">{connectError.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
