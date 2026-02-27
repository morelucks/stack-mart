import { useState } from 'react';
import { EscrowManager } from '../components/EscrowManager';
import { DisputePanel } from '../components/DisputePanel';
import { Header } from '../components/Header';
import { buyListingEscrow, attestDelivery } from '../services/escrow';

export const EscrowPage = () => {
  const [listingId, setListingId] = useState('');
  const [deliveryHash, setDeliveryHash] = useState('');
  const [activeEscrows] = useState<number[]>([1, 2, 3]);

  const handleBuyWithEscrow = async () => {
    if (listingId) {
      await buyListingEscrow(parseInt(listingId));
      setListingId('');
    }
  };

  const handleAttestDelivery = async () => {
    if (listingId && deliveryHash) {
      await attestDelivery(parseInt(listingId), deliveryHash);
      setListingId('');
      setDeliveryHash('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Escrow Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-lg p-6 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-4">Buy with Escrow</h2>
              <div className="space-y-3">
                <input
                  type="number"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  placeholder="Listing ID"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleBuyWithEscrow}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Buy with Escrow
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-6 shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-4">Attest Delivery</h2>
              <div className="space-y-3">
                <input
                  type="number"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  placeholder="Listing ID"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={deliveryHash}
                  onChange={(e) => setDeliveryHash(e.target.value)}
                  placeholder="Delivery Hash (hex)"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleAttestDelivery}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded"
                >
                  Attest Delivery
                </button>
              </div>
            </div>

            <DisputePanel escrowId={1} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Active Escrows</h2>
            <div className="space-y-4">
              {activeEscrows.map(id => (
                <EscrowManager key={id} listingId={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
