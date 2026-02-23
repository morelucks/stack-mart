import React, { useState } from 'react';
import { useCreateBundle } from '../hooks/useCreateBundle';

export const BundleCreator: React.FC = () => {
  const [listingIds, setListingIds] = useState('');
  const [discount, setDiscount] = useState('');
  const { createBundle } = useCreateBundle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = listingIds.split(',').map(id => parseInt(id.trim()));
    await createBundle(ids, parseInt(discount));
    setListingIds('');
    setDiscount('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Create Bundle</h2>
      <input
        placeholder="Listing IDs (comma-separated)"
        value={listingIds}
        onChange={(e) => setListingIds(e.target.value)}
        required
      />
      <input
        placeholder="Discount %"
        type="number"
        min="0"
        max="100"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        required
      />
      <button type="submit">Create Bundle</button>
    </form>
  );
};
