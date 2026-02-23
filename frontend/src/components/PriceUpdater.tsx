import React, { useState } from 'react';
import { useUpdatePrice } from '../hooks/useUpdatePrice';

interface PriceUpdaterProps {
  listingId: number;
  currentPrice: number;
}

export const PriceUpdater: React.FC<PriceUpdaterProps> = ({ listingId, currentPrice }) => {
  const [newPrice, setNewPrice] = useState(currentPrice.toString());
  const { updateListingPrice } = useUpdatePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateListingPrice(listingId, parseInt(newPrice));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <label>Update Price:</label>
      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        min="1"
        required
        style={{ width: '120px' }}
      />
      <span>STX</span>
      <button type="submit">Update</button>
    </form>
  );
};
