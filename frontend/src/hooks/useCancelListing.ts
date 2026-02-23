import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useCancelListing = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const cancelListing = useCallback(async (listingId: number) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'cancel-listing',
      functionArgs: [uintCV(listingId)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Listing cancelled:', data);
      },
      onCancel: () => {
        console.log('Cancellation aborted');
      },
    });
  }, [network]);

  return { cancelListing };
};
