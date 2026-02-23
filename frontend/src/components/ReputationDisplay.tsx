import React, { useState, useEffect } from 'react';
import { useReputation } from '../hooks/useReputation';

interface ReputationDisplayProps {
  address: string;
}

export const ReputationDisplay: React.FC<ReputationDisplayProps> = ({ address }) => {
  const { getReputation } = useReputation();
  const [reputation, setReputation] = useState<any>(null);

  useEffect(() => {
    const fetchRep = async () => {
      const data = await getReputation(address);
      setReputation(data);
    };
    fetchRep();
  }, [address, getReputation]);

  if (!reputation) return <div>Loading reputation...</div>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Reputation</h3>
      <p>Sales: {reputation.sales || 0}</p>
      <p>Purchases: {reputation.purchases || 0}</p>
      <p>Total Volume: {reputation.volume || 0} STX</p>
      <p>Rating: {reputation.rating || 0}/100</p>
    </div>
  );
};
