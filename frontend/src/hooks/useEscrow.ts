import { useState, useEffect } from 'react';
import { getEscrow } from '../services/read';
import { useWallet } from './useWallet';

export const useEscrow = (listingId: number) => {
  const { address } = useWallet();
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEscrow = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getEscrow(listingId, address);
        setEscrow(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch escrow');
        setEscrow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEscrow();
  }, [listingId, address]);

  return { escrow, loading, error, refetch: () => {} };
};
