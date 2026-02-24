import { useState } from 'react';
import { toggleWishlist } from '../services/wishlist';

interface WishlistButtonProps {
  listingId: number;
  isWishlisted?: boolean;
}

export const WishlistButton = ({ listingId, isWishlisted = false }: WishlistButtonProps) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleWishlist(listingId);
      setWishlisted(!wishlisted);
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 rounded ${
        wishlisted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
      } hover:opacity-80 disabled:opacity-50`}
    >
      {wishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
    </button>
  );
};
