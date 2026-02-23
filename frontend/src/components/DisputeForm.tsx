import React, { useState } from 'react';
import { useRaiseDispute } from '../hooks/useRaiseDispute';

interface DisputeFormProps {
  escrowId: number;
}

export const DisputeForm: React.FC<DisputeFormProps> = ({ escrowId }) => {
  const [reason, setReason] = useState('');
  const { raiseDispute } = useRaiseDispute();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await raiseDispute(escrowId, reason);
    setReason('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h3>Raise Dispute</h3>
      <textarea
        placeholder="Describe the issue..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={4}
        maxLength={100}
        required
      />
      <button type="submit">Submit Dispute</button>
    </form>
  );
};
