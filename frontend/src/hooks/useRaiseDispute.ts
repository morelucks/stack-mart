import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV, AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const useRaiseDispute = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const raiseDispute = useCallback(async (escrowId: number, reason: string) => {
    await openContractCall({
      network,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ID.split('.')[0],
      contractName: CONTRACT_ID.split('.')[1],
      functionName: 'raise-dispute',
      functionArgs: [uintCV(escrowId), stringAsciiCV(reason)],
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        console.log('Dispute raised:', data);
      },
      onCancel: () => {
        console.log('Dispute cancelled');
      },
    });
  }, [network]);

  return { raiseDispute };
};
