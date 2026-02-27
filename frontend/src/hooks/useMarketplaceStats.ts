import { useState, useEffect } from 'react';
import { getMarketplaceStats } from '../services/read';
import { useWallet } from './useWallet';

export const useMarketplaceStats = () => {
  const { address } = useWallet();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMarketplaceStats(address);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [address]);

  return { stats, loading, error, refetch: () => {} };
};
