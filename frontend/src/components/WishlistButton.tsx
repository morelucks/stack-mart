import React from 'react';
import { useWishlistToggle } from '../hooks/useWishlistToggle';

interface WishlistButtonProps {
  listingId: number;
  isInWishlist: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ listingId, isInWishlist }) => {
  const { toggleWishlist } = useWishlistToggle();

  const handleToggle = async () => {
    await toggleWishlist(listingId);
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: isInWishlist ? '#ff4444' : '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isInWishlist ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
    </button>
  );
};
