import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useToast } from '@/hooks/use-toast';

// Mock auction contract ABI - replace with actual contract details
const AUCTION_ABI = [
  {
    name: 'fundAuction',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'auctionId', type: 'uint256' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

// Mock contract address - replace with actual deployed contract
const AUCTION_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8d563F12Ff6f32123' as const;

export function useFundAuction() {
  const [isLogging, setIsLogging] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();

  const { 
    writeContract, 
    data: hash,
    isPending: isWriting,
    error: writeError 
  } = useWriteContract();

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError 
  } = useWaitForTransactionReceipt({ hash });

  const fundAuction = async (auctionId: string, amount: string) => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to fund this auction",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('💰 Initiating auction funding:', { auctionId, amount });
      
      // Initiate blockchain transaction
      writeContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_ABI,
        functionName: 'fundAuction',
        args: [BigInt(auctionId), parseEther(amount)],
        value: parseEther(amount)
      });

    } catch (error) {
      console.error('❌ Funding transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to initiate funding",
        variant: "destructive"
      });
    }
  };

  // Log funding to database after successful transaction
  const logFunding = async (auctionId: string, amount: string) => {
    if (!hash || !address) return;

    setIsLogging(true);
    try {
      const response = await fetch(`/api/auction/${auctionId}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          wallet: address,
          transactionHash: hash,
          blockNumber: null // Will be filled by indexer
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log funding');
      }

      const result = await response.json();
      console.log('✅ Funding logged to database:', result);
      
      toast({
        title: "Funding Successful",
        description: `Successfully funded auction with ${amount} ETH`,
        variant: "default"
      });

    } catch (error) {
      console.error('❌ Failed to log funding:', error);
      toast({
        title: "Logging Error",
        description: "Transaction succeeded but failed to log to database",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };

  return {
    fundAuction,
    logFunding,
    hash,
    isWriting,
    isConfirming,
    isConfirmed,
    isLogging,
    error: writeError || receiptError
  };
}