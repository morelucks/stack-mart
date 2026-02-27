import { useState } from 'react';
import { makeOffer, acceptOffer, cancelOffer } from '../services/offers';

interface OfferMakerProps {
  listingId?: number;
  offerId?: number;
  mode: 'make' | 'manage';
}

export const OfferMaker = ({ listingId, offerId, mode }: OfferMakerProps) => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');

  const handleMakeOffer = async () => {
    if (listingId && amount && duration) {
      await makeOffer(listingId, parseInt(amount), parseInt(duration));
      setAmount('');
      setDuration('');
    }
  };

  const handleAcceptOffer = async () => {
    if (offerId) {
      await acceptOffer(offerId);
    }
  };

  const handleCancelOffer = async () => {
    if (offerId) {
      await cancelOffer(offerId);
    }
  };

  if (mode === 'make') {
    return (
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Make Offer</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Offer Amount (microSTX)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000000"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (blocks)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="144"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleMakeOffer}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit Offer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Manage Offer</h3>
      <div className="flex gap-2">
        <button
          onClick={handleAcceptOffer}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
        >
          Accept Offer
        </button>
        <button
          onClick={handleCancelOffer}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel Offer
        </button>
      </div>
    </div>
  );
};
