import { useState } from 'react';
import { CreateListingForm } from '../components/CreateListingForm';
import { ListingCard } from '../components/ListingCard';

export const MarketplacePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [listingIds] = useState([1, 2, 3]); // Example IDs

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">StackMart Marketplace</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create Listing'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Listing</h2>
          <CreateListingForm />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listingIds.map((id) => (
          <ListingCard key={id} listingId={id} />
        ))}
      </div>
    </div>
  );
};
