import { EnhancedListingCard } from '../components/EnhancedListingCard';
import { CreateListingForm } from '../components/CreateListingForm';
import { WishlistView } from '../components/WishlistView';
import { AdminPanel } from '../components/AdminPanel';
import { useWallet } from '../hooks/useWallet';
import { CONTRACT_ADDRESS } from '../config/contract';
import { useState } from 'react';

export const HomePage = () => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'wishlist' | 'create' | 'admin'>('marketplace');
  const isAdmin = address === CONTRACT_ADDRESS;

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to StackMart</h1>
          <p className="text-gray-600 mb-6">Connect your wallet to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">StackMart Marketplace</h1>

      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 ${activeTab === 'marketplace' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 ${activeTab === 'wishlist' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 ${activeTab === 'create' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
        >
          Create Listing
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 ${activeTab === 'admin' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
          >
            Admin
          </button>
        )}
      </div>

      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <EnhancedListingCard key={id} listingId={id} />
          ))}
        </div>
      )}

      {activeTab === 'wishlist' && <WishlistView />}

      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Create New Listing</h2>
          <CreateListingForm />
        </div>
      )}

      {activeTab === 'admin' && isAdmin && <AdminPanel />}
    </div>
  );
};
