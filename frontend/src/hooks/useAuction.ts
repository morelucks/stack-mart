import { useState, useEffect } from 'react';
import { getAuction } from '../services/read';
import { useWallet } from './useWallet';

export const useAuction = (auctionId: number) => {
  const { address } = useWallet();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAuction(auctionId, address);
        setAuction(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch auction');
        setAuction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId, address]);

  return { auction, loading, error, refetch: () => {} };
};
