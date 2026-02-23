import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, AnchorMode, PostConditionMode, makeStandardSTXPostCondition, FungibleConditionCode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useBuyListing = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const buyListing = useCallback(async (listingId: number, price: number, userAddress: string) => {
    const postConditions = [
      makeStandardSTXPostCondition(
        userAddress,
        FungibleConditionCode.Equal,
        price
      )
    ];

    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'buy-listing',
      functionArgs: [uintCV(listingId)],
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Purchase complete:', data);
      },
      onCancel: () => {
        console.log('Purchase cancelled');
      },
    });
  }, [network]);

  return { buyListing };
};
