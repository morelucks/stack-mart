import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, listCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useCreateBundle = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const createBundle = useCallback(async (listingIds: number[], discountPercent: number) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'create-bundle',
      functionArgs: [
        listCV(listingIds.map(id => uintCV(id))),
        uintCV(discountPercent)
      ],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Bundle created:', data);
      },
      onCancel: () => {
        console.log('Bundle creation cancelled');
      },
    });
  }, [network]);

  return { createBundle };
};
