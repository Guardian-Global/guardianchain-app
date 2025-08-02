import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { AUCTION_CONTRACT_ADDRESS, AUCTION_ABI } from '@/lib/constants';

export function useFundAuction(auctionId: string | undefined, amount: number) {
  const {
    data: hash,
    writeContract: fundAuction,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isTxPending,
    isSuccess: isTxSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const executeAuction = () => {
    if (auctionId && amount > 0) {
      fundAuction({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_ABI,
        functionName: 'fundAuction',
        args: [BigInt(auctionId), parseEther(amount.toString())],
      });
    }
  };

  return {
    fundAuction: executeAuction,
    txData: hash,
    isLoading: isWriting || isTxPending,
    isSuccess: isTxSuccess,
    error: writeError || txError,
    transactionHash: hash,
  };
}