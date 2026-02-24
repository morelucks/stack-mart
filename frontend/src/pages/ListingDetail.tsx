import { useState } from 'react';
import { ListingCard } from '../components/ListingCard';
import { BuyButton } from '../components/BuyButton';
import { WishlistButton } from '../components/WishlistButton';
import { ReputationBadge } from '../components/ReputationBadge';

interface ListingDetailProps {
  listingId: number;
}

export const ListingDetail = ({ listingId }: ListingDetailProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ListingCard listingId={listingId} key={refreshKey} />
      
      <div className="mt-6 flex gap-4">
        <BuyButton 
          listingId={listingId} 
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
        <WishlistButton listingId={listingId} />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Seller Reputation</h3>
        <ReputationBadge sellerAddress="SP34MN3DMM07BNAWYJSHTS4B08T8JRVK8AT810X1B" />
      </div>
    </div>
  );
};
