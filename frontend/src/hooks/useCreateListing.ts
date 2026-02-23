import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useCreateListing = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const createListing = useCallback(async (
    nftContract: string,
    nftId: number,
    price: number,
    title: string
  ) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'create-listing',
      functionArgs: [
        stringAsciiCV(nftContract),
        uintCV(nftId),
        uintCV(price),
        stringAsciiCV(title)
      ],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Listing created:', data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
      },
    });
  }, [network]);

  return { createListing };
};
