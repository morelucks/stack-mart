import { useState, useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ID, NETWORK } from '../config/contract';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

interface TransactionState {
  txId: string | null;
  loading: boolean;
  error: string | null;
}

export const useTransactionState = () => {
  const [state, setState] = useState<TransactionState>({
    txId: null,
    loading: false,
    error: null,
  });

  const executeTransaction = useCallback(async (
    functionName: string,
    functionArgs: any[],
    postConditions: any[] = []
  ) => {
    setState({ txId: null, loading: true, error: null });
    const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

    try {
      await openContractCall({
        network,
        anchorMode: AnchorMode.Any,
        contractAddress: CONTRACT_ID.split('.')[0],
        contractName: CONTRACT_ID.split('.')[1],
        functionName,
        functionArgs,
        postConditions,
        postConditionMode: postConditions.length > 0 ? PostConditionMode.Deny : PostConditionMode.Allow,
        onFinish: (data) => {
          setState({ txId: data.txId, loading: false, error: null });
        },
        onCancel: () => {
          setState({ txId: null, loading: false, error: 'Transaction cancelled' });
        },
      });
    } catch (error: any) {
      setState({ txId: null, loading: false, error: error.message });
    }
  }, []);

  return { ...state, executeTransaction };
};
