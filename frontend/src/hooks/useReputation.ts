import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, principalCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { Reputation } from '../types/contract';

export const useReputation = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getReputation = useCallback(async (address: string): Promise<Reputation | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-reputation',
        functionArgs: [principalCV(address)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || null;
    } catch (error) {
      console.error('Error fetching reputation:', error);
      return null;
    }
  }, [network]);

  return { getReputation };
};
