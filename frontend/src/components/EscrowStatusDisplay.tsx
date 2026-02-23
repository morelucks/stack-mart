import React, { useState, useEffect } from 'react';
import { useEscrow } from '../hooks/useEscrow';

interface EscrowStatusProps {
  escrowId: number;
}

export const EscrowStatusDisplay: React.FC<EscrowStatusProps> = ({ escrowId }) => {
  const { getEscrowStatus } = useEscrow();
  const [escrow, setEscrow] = useState<any>(null);

  useEffect(() => {
    const fetchEscrow = async () => {
      const data = await getEscrowStatus(escrowId);
      setEscrow(data);
    };
    fetchEscrow();
  }, [escrowId, getEscrowStatus]);

  if (!escrow) return <div>Loading escrow...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ff9800';
      case 'completed': return '#4CAF50';
      case 'disputed': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Escrow #{escrowId}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Status:</span>
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          background: getStatusColor(escrow.status),
          color: 'white',
          borderRadius: '4px'
        }}>
          {escrow.status}
        </span>
      </div>
      <p>Amount: {escrow.amount} STX</p>
      <p>Buyer: {escrow.buyer}</p>
      <p>Seller: {escrow.seller}</p>
    </div>
  );
};
