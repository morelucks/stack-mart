import { useState } from 'react';
import { updateListingPrice } from '../services/listing';

interface UpdatePriceFormProps {
  listingId: number;
  currentPrice: number;
  onSuccess?: () => void;
}

export const UpdatePriceForm = ({ listingId, currentPrice, onSuccess }: UpdatePriceFormProps) => {
  const [newPrice, setNewPrice] = useState(currentPrice / 1000000);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateListingPrice(listingId, newPrice * 1000000);
      onSuccess?.();
    } catch (error) {
      console.error('Price update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(Number(e.target.value))}
        className="border rounded px-2 py-1"
        step="0.01"
        min="0"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Price'}
      </button>
    </form>
  );
};
