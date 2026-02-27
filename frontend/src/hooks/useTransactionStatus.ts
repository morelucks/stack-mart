import { useState, useEffect, useCallback } from 'react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from '../config/contract';

interface TransactionStatus {
  status: 'pending' | 'success' | 'failed' | 'unknown';
  blockHeight?: number;
  blockHash?: string;
  txResult?: string;
  error?: string;
}

/**
 * Hook to track transaction status on Stacks blockchain
 */
export const useTransactionStatus = (txId: string | null) => {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'unknown' });
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    if (!txId) return;

    setLoading(true);
    try {
      const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
      const apiUrl = network.coreApiUrl;
      
      const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
      
      if (!response.ok) {
        setStatus({ status: 'unknown', error: 'Transaction not found' });
        return;
      }

      const data = await response.json();
      
      if (data.tx_status === 'success') {
        setStatus({
          status: 'success',
          blockHeight: data.block_height,
          blockHash: data.block_hash,
          txResult: data.tx_result?.repr,
        });
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        setStatus({
          status: 'failed',
          error: data.tx_result?.repr || 'Transaction failed',
        });
      } else {
        setStatus({ status: 'pending' });
      }
    } catch (error) {
      setStatus({
        status: 'unknown',
        error: error instanceof Error ? error.message : 'Failed to check status',
      });
    } finally {
      setLoading(false);
    }
  }, [txId]);

  useEffect(() => {
    if (txId) {
      checkStatus();
      
      // Poll every 10 seconds if pending
      const interval = setInterval(() => {
        if (status.status === 'pending' || status.status === 'unknown') {
          checkStatus();
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [txId, status.status, checkStatus]);

  return {
    ...status,
    loading,
    refresh: checkStatus,
  };
};
