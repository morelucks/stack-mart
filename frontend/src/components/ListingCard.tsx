import { useState, useEffect } from 'react';
import { getListing } from '../services/read';
import { useConnect } from '@stacks/connect-react';

interface ListingCardProps {
  listingId: number;
}

export const ListingCard = ({ listingId }: ListingCardProps) => {
  const [listing, setListing] = useState<any>(null);
  const { userSession } = useConnect();

  useEffect(() => {
    const fetchListing = async () => {
      if (userSession?.isUserSignedIn()) {
        const address = userSession.loadUserData().profile.stxAddress.mainnet;
        const data = await getListing(listingId, address);
        setListing(data);
      }
    };
    fetchListing();
  }, [listingId, userSession]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Listing #{listingId}</h3>
      <p>Price: {listing.price / 1000000} STX</p>
      <p>Seller: {listing.seller}</p>
      <p>Royalty: {listing.royaltyBips / 100}%</p>
    </div>
  );
};
