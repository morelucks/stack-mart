import { useState, useEffect } from 'react';
import { API_URL } from '../config/contract';

interface TransactionStatus {
  status: 'pending' | 'success' | 'failed' | 'unknown';
  blockHeight?: number;
  error?: string;
}

export const useTransactionMonitor = (txId: string | null) => {
  const [status, setStatus] = useState<TransactionStatus>({ status: 'unknown' });

  useEffect(() => {
    if (!txId) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/extended/v1/tx/${txId}`);
        const data = await response.json();
        
        if (data.tx_status === 'success') {
          setStatus({ status: 'success', blockHeight: data.block_height });
        } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          setStatus({ status: 'failed', error: data.tx_result?.repr });
        } else {
          setStatus({ status: 'pending' });
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [txId]);

  return status;
};
