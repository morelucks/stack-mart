import { useState } from 'react';
import { createBundle } from '../services/bundle';

export const BundleCreator = () => {
  const [listingIds, setListingIds] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');

  const handleCreateBundle = async () => {
    const ids = listingIds.split(',').map(id => parseInt(id.trim()));
    const discountBips = parseInt(discount);

    if (ids.length > 0 && discountBips) {
      await createBundle(ids, discountBips);
      setListingIds('');
      setDiscount('');
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Create Bundle</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Listing IDs (comma-separated)
          </label>
          <input
            type="text"
            value={listingIds}
            onChange={(e) => setListingIds(e.target.value)}
            placeholder="1, 2, 3"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount (basis points, e.g., 1000 = 10%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="1000"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleCreateBundle}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Bundle
        </button>
      </div>
    </div>
  );
};
