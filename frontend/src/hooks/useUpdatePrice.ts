import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useUpdatePrice = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const updateListingPrice = useCallback(async (listingId: number, newPrice: number) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'update-listing-price',
      functionArgs: [uintCV(listingId), uintCV(newPrice)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Price updated:', data);
      },
      onCancel: () => {
        console.log('Price update cancelled');
      },
    });
  }, [network]);

  return { updateListingPrice };
};
