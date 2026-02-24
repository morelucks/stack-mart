import { useState } from 'react';
import { useListing } from '../hooks/useListing';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { PriceDisplay, RoyaltyDisplay } from './PriceDisplay';
import { AddressDisplay } from './AddressDisplay';
import { BuyButton } from './BuyButton';
import { WishlistButton } from './WishlistButton';
import { UpdatePriceForm } from './UpdatePriceForm';
import { useWallet } from '../hooks/useWallet';

interface EnhancedListingCardProps {
  listingId: number;
}

export const EnhancedListingCard = ({ listingId }: EnhancedListingCardProps) => {
  const { listing, loading, error } = useListing(listingId);
  const { address } = useWallet();
  const [showUpdatePrice, setShowUpdatePrice] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!listing?.value) return null;

  const data = listing.value;
  const isOwner = address === data.seller;

  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">Listing #{listingId}</h3>
        <WishlistButton listingId={listingId} />
      </div>

      <div className="space-y-3">
        <PriceDisplay microSTX={data.price} />
        <RoyaltyDisplay bips={data['royalty-bips']} />
        
        <div className="text-sm">
          <span className="text-gray-600">Seller: </span>
          <AddressDisplay address={data.seller} />
        </div>

        <div className="text-sm">
          <span className="text-gray-600">Royalty Recipient: </span>
          <AddressDisplay address={data['royalty-recipient']} />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {isOwner ? (
          <button
            onClick={() => setShowUpdatePrice(!showUpdatePrice)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showUpdatePrice ? 'Cancel' : 'Update Price'}
          </button>
        ) : (
          <BuyButton listingId={listingId} />
        )}
      </div>

      {showUpdatePrice && isOwner && (
        <div className="mt-4">
          <UpdatePriceForm
            listingId={listingId}
            currentPrice={data.price}
            onSuccess={() => setShowUpdatePrice(false)}
          />
        </div>
      )}
    </div>
  );
};
