import React from 'react';
import { useListings } from '../hooks/useListings';
import { useBuyListing } from '../hooks/useBuyListing';
import { useStacks } from '../hooks/useStacks';
import { getStacksAddress } from '../utils/validation';

export const ListingsGrid: React.FC = () => {
  const { listings, loading, fetchAllListings } = useListings();
  const { buyListing } = useBuyListing();
  const { userSession } = useStacks();

  React.useEffect(() => {
    fetchAllListings(20);
  }, [fetchAllListings]);

  const handleBuy = async (listingId: number, price: number) => {
    const userData = userSession.loadUserData();
    const address = getStacksAddress(userData);
    if (address) {
      await buyListing(listingId, price, address);
    }
  };

  if (loading) return <div>Loading listings...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
      {listings.map((listing) => (
        <div key={listing.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>{listing.title}</h3>
          <p>Price: {listing.price} STX</p>
          <p>Seller: {listing.seller}</p>
          <button onClick={() => handleBuy(listing.id, listing.price)}>Buy Now</button>
        </div>
      ))}
    </div>
  );
};
