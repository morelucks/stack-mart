import React, { useState, useEffect } from 'react';
import { usePriceHistoryQuery } from '../hooks/usePriceHistoryQuery';

interface PriceChartProps {
  listingId: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ listingId }) => {
  const { getPriceHistory } = usePriceHistoryQuery();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getPriceHistory(listingId);
      setHistory(data);
    };
    fetchHistory();
  }, [listingId, getPriceHistory]);

  if (history.length === 0) return <div>No price history available</div>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Price History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {history.map((entry, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Block {entry.blockHeight}</span>
            <span>{entry.price} STX</span>
          </div>
        ))}
      </div>
    </div>
  );
};
