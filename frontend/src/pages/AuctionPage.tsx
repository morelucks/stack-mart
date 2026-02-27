import { useState } from 'react';
import { AuctionCard } from '../components/AuctionCard';
import { createAuction } from '../services/auction';
import { Header } from '../components/Header';

export const AuctionPage = () => {
  const [nftContract, setNftContract] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [auctionIds, setAuctionIds] = useState<number[]>([1, 2, 3]);

  const handleCreateAuction = async () => {
    if (nftContract && tokenId && startPrice && reservePrice && duration) {
      await createAuction(
        nftContract,
        parseInt(tokenId),
        parseInt(startPrice),
        parseInt(reservePrice),
        parseInt(duration)
      );
      // Reset form
      setNftContract('');
      setTokenId('');
      setStartPrice('');
      setReservePrice('');
      setDuration('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Auctions</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-sm bg-white sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Create Auction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">NFT Contract</label>
                  <input
                    type="text"
                    value={nftContract}
                    onChange={(e) => setNftContract(e.target.value)}
                    placeholder="SP000.nft-contract"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Token ID</label>
                  <input
                    type="number"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="1"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Price (microSTX)</label>
                  <input
                    type="number"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    placeholder="1000000"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reserve Price (microSTX)</label>
                  <input
                    type="number"
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                    placeholder="5000000"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (blocks)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="144"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  onClick={handleCreateAuction}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Auction
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Active Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auctionIds.map(id => (
                <AuctionCard key={id} auctionId={id} nftContract={nftContract || 'SP000.nft'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
