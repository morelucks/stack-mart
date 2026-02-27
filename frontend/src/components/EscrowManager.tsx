import { useEscrow } from '../hooks/useEscrow';
import { confirmReceipt, rejectDelivery, releaseEscrow, cancelEscrow } from '../services/escrow';
import { formatSTX } from '../utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface EscrowManagerProps {
  listingId: number;
}

export const EscrowManager = ({ listingId }: EscrowManagerProps) => {
  const { escrow, loading, error } = useEscrow(listingId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!escrow) return <div>No escrow found</div>;

  const handleConfirmReceipt = async () => {
    await confirmReceipt(listingId);
  };

  const handleRejectDelivery = async () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      await rejectDelivery(listingId, reason);
    }
  };

  const handleReleaseEscrow = async () => {
    await releaseEscrow(listingId);
  };

  const handleCancelEscrow = async () => {
    await cancelEscrow(listingId);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Escrow Status</h3>
      <div className="space-y-2">
        <p>Amount: {formatSTX(escrow.amount)}</p>
        <p>State: {escrow.state}</p>
        <p>Buyer: {escrow.buyer}</p>
        <div className="flex gap-2 mt-4">
          {escrow.state === 'delivered' && (
            <>
              <button
                onClick={handleConfirmReceipt}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirm Receipt
              </button>
              <button
                onClick={handleRejectDelivery}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject Delivery
              </button>
            </>
          )}
          {escrow.state === 'pending' && (
            <button
              onClick={handleCancelEscrow}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel Escrow
            </button>
          )}
          <button
            onClick={handleReleaseEscrow}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Release Escrow
          </button>
        </div>
      </div>
    </div>
  );
};
