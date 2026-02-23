import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useCreateAuction = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const createAuction = useCallback(async (
    nftContract: string,
    nftId: number,
    reservePrice: number,
    duration: number,
    title: string
  ) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'create-auction',
      functionArgs: [
        stringAsciiCV(nftContract),
        uintCV(nftId),
        uintCV(reservePrice),
        uintCV(duration),
        stringAsciiCV(title)
      ],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Auction created:', data);
      },
      onCancel: () => {
        console.log('Auction creation cancelled');
      },
    });
  }, [network]);

  return { createAuction };
};
