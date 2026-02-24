import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { getNetwork } from '../utils/network';

export const setMarketplaceFee = async (feeBips: number) => {
  await openContractCall({
    network: getNetwork(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'set-marketplace-fee',
    functionArgs: [uintCV(feeBips)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => {
      console.log('Fee updated:', data.txId);
    }
  });
};

export const AdminPanel = () => {
  const [fee, setFee] = useState('250');
  const [loading, setLoading] = useState(false);

  const handleUpdateFee = async () => {
    setLoading(true);
    try {
      await setMarketplaceFee(Number(fee));
    } catch (error) {
      console.error('Fee update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Marketplace Fee (bips)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={handleUpdateFee}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Fee'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Current: {Number(fee) / 100}%
          </p>
        </div>
      </div>
    </div>
  );
};
