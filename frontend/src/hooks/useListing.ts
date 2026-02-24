import { useState, useEffect } from 'react';
import { getListing } from '../services/read';
import { useWallet } from './useWallet';

export const useListing = (listingId: number) => {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();

  useEffect(() => {
    const fetchListing = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const data = await getListing(listingId, address);
        setListing(data);
        setError(null);
      } catch (err) {
        setError('Failed to load listing');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, address]);

  return { listing, loading, error };
};
