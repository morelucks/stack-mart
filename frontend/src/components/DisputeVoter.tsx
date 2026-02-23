import React from 'react';
import { useVoteDispute } from '../hooks/useVoteDispute';

interface DisputeVoterProps {
  disputeId: number;
  description: string;
}

export const DisputeVoter: React.FC<DisputeVoterProps> = ({ disputeId, description }) => {
  const { voteOnDispute } = useVoteDispute();

  const handleVote = async (voteFor: boolean) => {
    await voteOnDispute(disputeId, voteFor);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h4>Dispute #{disputeId}</h4>
      <p>{description}</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={() => handleVote(true)} style={{ background: '#4CAF50', color: 'white' }}>
          Vote For Buyer
        </button>
        <button onClick={() => handleVote(false)} style={{ background: '#f44336', color: 'white' }}>
          Vote For Seller
        </button>
      </div>
    </div>
  );
};
