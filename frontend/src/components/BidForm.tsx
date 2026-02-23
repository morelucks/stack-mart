import React, { useState } from 'react';
import { usePlaceBid } from '../hooks/usePlaceBid';
import { useStacks } from '../hooks/useStacks';
import { getStacksAddress } from '../utils/validation';

interface BidFormProps {
  auctionId: number;
  currentBid: number;
}

export const BidForm: React.FC<BidFormProps> = ({ auctionId, currentBid }) => {
  const [bidAmount, setBidAmount] = useState('');
  const { placeBid } = usePlaceBid();
  const { userSession } = useStacks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = userSession.loadUserData();
    const address = getStacksAddress(userData);
    if (address) {
      await placeBid(auctionId, parseInt(bidAmount), address);
      setBidAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        type="number"
        placeholder={`Min: ${currentBid + 1} STX`}
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        min={currentBid + 1}
        required
      />
      <button type="submit">Place Bid</button>
    </form>
  );
};
