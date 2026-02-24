import { useState, useEffect } from 'react';
import { getTokenName, getTokenSymbol, getTotalSupply } from '../services/token';
import { useWallet } from '../hooks/useWallet';

export const TokenInfo = () => {
  const [info, setInfo] = useState({ name: '', symbol: '', totalSupply: 0 });
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();

  useEffect(() => {
    const fetchInfo = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        const [name, symbol, supply] = await Promise.all([
          getTokenName(address),
          getTokenSymbol(address),
          getTotalSupply(address)
        ]);
        
        setInfo({
          name: name.value || '',
          symbol: symbol.value || '',
          totalSupply: supply.value || 0
        });
      } catch (error) {
        console.error('Failed to fetch token info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [address]);

  if (loading) {
    return <div className="text-center py-4">Loading token info...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🪙 {info.name}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm opacity-80">Symbol</div>
          <div className="text-xl font-bold">{info.symbol}</div>
        </div>
        <div>
          <div className="text-sm opacity-80">Total Supply</div>
          <div className="text-xl font-bold">
            {(info.totalSupply / 1000000).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
