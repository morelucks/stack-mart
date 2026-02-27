import { useAuction } from '../hooks/useAuction';
import { placeBid, endAuction } from '../services/auction';
import { formatSTX } from '../utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface AuctionCardProps {
  auctionId: number;
  nftContract: string;
}

export const AuctionCard = ({ auctionId, nftContract }: AuctionCardProps) => {
  const { auction, loading, error } = useAuction(auctionId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!auction) return null;

  const handleBid = async () => {
    const amount = prompt('Enter bid amount (in microSTX):');
    if (amount) {
      await placeBid(auctionId, parseInt(amount));
    }
  };

  const handleEndAuction = async () => {
    await endAuction(auctionId, nftContract);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Auction #{auctionId}</h3>
      <div className="space-y-2">
        <p>Start Price: {formatSTX(auction.startPrice)}</p>
        <p>Reserve Price: {formatSTX(auction.reservePrice)}</p>
        <p>Current Bid: {formatSTX(auction.currentBid)}</p>
        <p>Status: {auction.active ? 'Active' : 'Ended'}</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleBid}
            disabled={!auction.active}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Place Bid
          </button>
          <button
            onClick={handleEndAuction}
            disabled={!auction.active}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            End Auction
          </button>
        </div>
      </div>
    </div>
  );
};
