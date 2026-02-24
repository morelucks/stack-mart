import { useState } from 'react';
import { transferToken } from '../services/token';

export const TokenTransferForm = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await transferToken(
        Number(amount) * 1000000, // Convert to micro-tokens
        recipient,
        memo || undefined
      );
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold">Send SMT Tokens</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="SP..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount (SMT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="0.00"
          step="0.000001"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Memo (optional)</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Payment for..."
          maxLength={34}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Tokens'}
      </button>
    </form>
  );
};
