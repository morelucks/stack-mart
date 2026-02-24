import { useState, useEffect } from 'react';
import { getSellerReputation } from '../services/read';
import { useConnect } from '@stacks/connect-react';

interface ReputationBadgeProps {
  sellerAddress: string;
}

export const ReputationBadge = ({ sellerAddress }: ReputationBadgeProps) => {
  const [reputation, setReputation] = useState<any>(null);
  const { userSession } = useConnect();

  useEffect(() => {
    const fetchReputation = async () => {
      if (userSession?.isUserSignedIn()) {
        const address = userSession.loadUserData().profile.stxAddress.mainnet;
        const data = await getSellerReputation(sellerAddress, address);
        setReputation(data.value);
      }
    };
    fetchReputation();
  }, [sellerAddress, userSession]);

  if (!reputation) return null;

  const successRate = reputation['successful-txs'] / 
    (reputation['successful-txs'] + reputation['failed-txs']) * 100;

  return (
    <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
      <span className="text-sm font-medium">
        ⭐ {successRate.toFixed(0)}% Success
      </span>
      <span className="text-xs text-gray-600">
        ({reputation['successful-txs']} sales)
      </span>
    </div>
  );
};
