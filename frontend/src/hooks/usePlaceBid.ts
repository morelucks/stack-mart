import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode, makeStandardSTXPostCondition, FungibleConditionCode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const usePlaceBid = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const placeBid = useCallback(async (auctionId: number, bidAmount: number, userAddress: string) => {
    const postConditions = [
      makeStandardSTXPostCondition(
        userAddress,
        FungibleConditionCode.Equal,
        bidAmount
      )
    ];

    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'place-bid',
      functionArgs: [uintCV(auctionId), uintCV(bidAmount)],
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Bid placed:', data);
      },
      onCancel: () => {
        console.log('Bid cancelled');
      },
    });
  }, [network]);

  return { placeBid };
};
