import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useFinalizeAuction = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const finalizeAuction = useCallback(async (auctionId: number) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'finalize-auction',
      functionArgs: [uintCV(auctionId)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Auction finalized:', data);
      },
      onCancel: () => {
        console.log('Finalization cancelled');
      },
    });
  }, [network]);

  return { finalizeAuction };
};
