import { buyListing } from '../services/listing';

interface BuyButtonProps {
  listingId: number;
  onSuccess?: () => void;
}

export const BuyButton = ({ listingId, onSuccess }: BuyButtonProps) => {
  const handleBuy = async () => {
    try {
      await buyListing(listingId);
      onSuccess?.();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Buy Now
    </button>
  );
};
