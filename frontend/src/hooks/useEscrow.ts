import { useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import type { EscrowStatus } from '../types/contract';

export const useEscrow = () => {
  const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

  const getEscrowStatus = useCallback(async (escrowId: number): Promise<EscrowStatus | null> => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName: 'get-escrow',
        functionArgs: [uintCV(escrowId)],
        network,
        senderAddress: CONTRACT_ID.split('.')[0],
      });
      const data = cvToJSON(result);
      return data.value || null;
    } catch (error) {
      console.error('Error fetching escrow:', error);
      return null;
    }
  }, [network]);

  return { getEscrowStatus };
};
