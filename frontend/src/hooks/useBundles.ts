import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { Bundle } from '../types/contract';

export const useBundles = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getBundle = useCallback(async (bundleId: number): Promise<Bundle | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-bundle',
        functionArgs: [uintCV(bundleId)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || null;
    } catch (error) {
      console.error('Error fetching bundle:', error);
      return null;
    }
  }, [network]);

  return { getBundle };
};
