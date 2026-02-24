import { useTokenBalance } from '../hooks/useTokenBalance';

export const TokenBalance = () => {
  const { balance, loading } = useTokenBalance();

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg">
      <span className="text-2xl">💰</span>
      <div>
        <div className="text-xs text-gray-600">SMT Balance</div>
        <div className="text-lg font-bold text-blue-600">
          {(balance / 1000000).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
