import { useState, useEffect } from 'react';
import { getWishlist } from '../services/read';
import { useConnect } from '@stacks/connect-react';

export const WishlistView = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { userSession } = useConnect();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (userSession?.isUserSignedIn()) {
        const address = userSession.loadUserData().profile.stxAddress.mainnet;
        const data = await getWishlist(address);
        setWishlist(data.value?.['listing-ids'] || []);
      }
    };
    fetchWishlist();
  }, [userSession]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((id) => (
            <div key={id} className="border rounded p-4">
              Listing #{id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
