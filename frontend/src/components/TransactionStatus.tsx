import React from 'react';
import { useTransactionMonitor } from '../hooks/useTransactionMonitor';

interface TransactionStatusProps {
  txId: string | null;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ txId }) => {
  const status = useTransactionMonitor(txId);

  if (!txId) return null;

  const getStatusColor = () => {
    switch (status.status) {
      case 'success': return '#4CAF50';
      case 'failed': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{
      padding: '1rem',
      background: getStatusColor(),
      color: 'white',
      borderRadius: '8px',
      marginTop: '1rem'
    }}>
      <h4>Transaction Status</h4>
      <p>Status: {status.status.toUpperCase()}</p>
      {status.blockHeight && <p>Block: {status.blockHeight}</p>}
      {status.error && <p>Error: {status.error}</p>}
      <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>TX: {txId}</p>
    </div>
  );
};
