import { useState, useEffect } from 'react';
import { getTokenBalance } from '../services/token';
import { useWallet } from './useWallet';

export const useTokenBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const result = await getTokenBalance(address);
        setBalance(result.value || 0);
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return { balance, loading };
};
