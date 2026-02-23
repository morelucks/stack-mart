import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, principalCV, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { Listing } from '../types/contract';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const fetchListing = useCallback(async (id: number): Promise<Listing | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-listing',
        functionArgs: [uintCV(id)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value ? data.value : null;
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  }, [network]);

  const fetchAllListings = useCallback(async (count: number = 50) => {
    setLoading(true);
    const results: Listing[] = [];
    for (let i = 1; i <= count; i++) {
      const listing = await fetchListing(i);
      if (listing) results.push(listing);
    }
    setListings(results);
    setLoading(false);
  }, [fetchListing]);

  return { listings, loading, fetchListing, fetchAllListings };
};
