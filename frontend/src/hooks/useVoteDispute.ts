import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, boolCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useVoteDispute = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const voteOnDispute = useCallback(async (disputeId: number, voteFor: boolean) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'vote-on-dispute',
      functionArgs: [uintCV(disputeId), boolCV(voteFor)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Vote submitted:', data);
      },
      onCancel: () => {
        console.log('Vote cancelled');
      },
    });
  }, [network]);

  return { voteOnDispute };
};
