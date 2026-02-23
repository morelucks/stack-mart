import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { Auction } from '../types/contract';

export const useAuctions = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getAuction = useCallback(async (id: number): Promise<Auction | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-auction',
        functionArgs: [uintCV(id)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || null;
    } catch (error) {
      console.error('Error fetching auction:', error);
      return null;
    }
  }, [network]);

  return { getAuction };
};
