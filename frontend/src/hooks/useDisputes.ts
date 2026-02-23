import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { Dispute } from '../types/contract';

export const useDisputes = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getDispute = useCallback(async (disputeId: number): Promise<Dispute | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-dispute',
        functionArgs: [uintCV(disputeId)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || null;
    } catch (error) {
      console.error('Error fetching dispute:', error);
      return null;
    }
  }, [network]);

  return { getDispute };
};
