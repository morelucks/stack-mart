import { useMarketplaceStats } from '../hooks/useMarketplaceStats';
import { formatSTX } from '../utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export const MarketplaceStats = () => {
  const { stats, loading, error } = useMarketplaceStats();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Listings</h3>
        <p className="text-2xl font-bold mt-2">{stats.totalListings || 0}</p>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
        <p className="text-2xl font-bold mt-2">{formatSTX(stats.totalVolume || 0)}</p>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Fees Collected</h3>
        <p className="text-2xl font-bold mt-2">{formatSTX(stats.totalFeesCollected || 0)}</p>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Active Auctions</h3>
        <p className="text-2xl font-bold mt-2">{stats.activeAuctions || 0}</p>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Active Escrows</h3>
        <p className="text-2xl font-bold mt-2">{stats.activeEscrows || 0}</p>
      </div>
      
      <div className="border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Marketplace Fee</h3>
        <p className="text-2xl font-bold mt-2">{(stats.marketplaceFee || 0) / 100}%</p>
      </div>
    </div>
  );
};
