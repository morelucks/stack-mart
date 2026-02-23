import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { PriceHistory } from '../types/contract';

export const usePriceHistory = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getPriceHistory = useCallback(async (listingId: number): Promise<PriceHistory[]> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-price-history',
        functionArgs: [uintCV(listingId)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || [];
    } catch (error) {
      console.error('Error fetching price history:', error);
      return [];
    }
  }, [network]);

  return { getPriceHistory };
};
