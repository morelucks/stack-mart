import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useWishlist = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const toggleWishlist = useCallback(async (listingId: number) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'toggle-wishlist',
      functionArgs: [uintCV(listingId)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Wishlist updated:', data);
      },
      onCancel: () => {
        console.log('Wishlist action cancelled');
      },
    });
  }, [network]);

  return { toggleWishlist };
};
