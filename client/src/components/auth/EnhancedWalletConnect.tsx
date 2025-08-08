// client/src/components/auth/EnhancedWalletConnect.tsx
"use client";

import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { useEffect } from "react";

export default function EnhancedWalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

  const { connect: wcConnect } = useConnect({
    connector: new WalletConnectConnector({
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
        showQrModal: true
      }
    })
  });

  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain?.unsupported) {
      alert("Please switch to a supported network like Polygon or Base.");
    }
  }, [chain]);

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
          <button
            onClick={() => connect()}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Connect MetaMask
          </button>
          <button
            onClick={() => wcConnect()}
            className="bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
          >
            Connect WalletConnect
          </button>
        </div>
      )}
    </div>
  );
}
