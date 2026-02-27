import { useState } from 'react';
import { createDispute, stakeOnDispute, voteOnDispute, resolveDispute } from '../services/dispute';

interface DisputePanelProps {
  escrowId: number;
  disputeId?: number;
}

export const DisputePanel = ({ escrowId, disputeId }: DisputePanelProps) => {
  const [reason, setReason] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeSide, setStakeSide] = useState<boolean>(true);

  const handleCreateDispute = async () => {
    if (reason) {
      await createDispute(escrowId, reason);
      setReason('');
    }
  };

  const handleStake = async () => {
    if (disputeId && stakeAmount) {
      await stakeOnDispute(disputeId, parseInt(stakeAmount), stakeSide);
      setStakeAmount('');
    }
  };

  const handleVote = async (vote: boolean) => {
    if (disputeId) {
      await voteOnDispute(disputeId, vote);
    }
  };

  const handleResolve = async () => {
    if (disputeId) {
      await resolveDispute(disputeId);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Dispute Resolution</h3>
      
      {!disputeId ? (
        <div className="space-y-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter dispute reason..."
            className="w-full p-2 border rounded"
            rows={3}
          />
          <button
            onClick={handleCreateDispute}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Create Dispute
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Stake on Dispute</h4>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Stake amount"
              className="w-full p-2 border rounded"
            />
            <select
              value={stakeSide ? 'buyer' : 'seller'}
              onChange={(e) => setStakeSide(e.target.value === 'buyer')}
              className="w-full p-2 border rounded"
            >
              <option value="buyer">Support Buyer</option>
              <option value="seller">Support Seller</option>
            </select>
            <button
              onClick={handleStake}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Place Stake
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Vote on Dispute</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleVote(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Vote Buyer
              </button>
              <button
                onClick={() => handleVote(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Vote Seller
              </button>
            </div>
          </div>

          <button
            onClick={handleResolve}
            className="px-4 py-2 bg-purple-500 text-white rounded w-full"
          >
            Resolve Dispute
          </button>
        </div>
      )}
    </div>
  );
};
