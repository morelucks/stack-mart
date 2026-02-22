import { useStacks } from '../hooks/useStacks';
import { useContract } from '../hooks/useContract';
import { useState } from 'react';

/**
 * Comprehensive example showing proper @stacks/connect and @stacks/transactions integration
 */
export const StacksIntegrationExample = () => {
  const { isConnected, connectWallet, disconnectWallet, userData } = useStacks();
  const {
    createListing,
    buyListing,
    cancelListing,
    updateListingPrice,
    createAuction,
    placeBid,
    finalizeAuction,
    createBundle,
    raiseDispute,
    voteOnDispute,
    resolveDispute,
    toggleWishlist,
  } = useContract();

  const [status, setStatus] = useState('');

  // Example: Create a listing
  const handleCreateListing = async () => {
    try {
      setStatus('Creating listing...');
      await createListing(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-contract',
        1,
        1000000, // 1 STX
        'My NFT',
        'A cool NFT'
      );
      setStatus('Listing created!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  // Example: Buy a listing
  const handleBuyListing = async () => {
    try {
      setStatus('Buying listing...');
      await buyListing(1, 1000000);
      setStatus('Purchase initiated!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  // Example: Create an auction
  const handleCreateAuction = async () => {
    try {
      setStatus('Creating auction...');
      await createAuction(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-contract',
        2,
        500000, // 0.5 STX start price
        1000000, // 1 STX reserve
        144 // ~1 day duration
      );
      setStatus('Auction created!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  // Example: Place a bid
  const handlePlaceBid = async () => {
    try {
      setStatus('Placing bid...');
      await placeBid(1, 1500000); // 1.5 STX
      setStatus('Bid placed!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  // Example: Create a bundle
  const handleCreateBundle = async () => {
    try {
      setStatus('Creating bundle...');
      await createBundle([1, 2, 3], 10); // 10% discount
      setStatus('Bundle created!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  // Example: Raise a dispute
  const handleRaiseDispute = async () => {
    try {
      setStatus('Raising dispute...');
      await raiseDispute(1, 'Item not delivered');
      setStatus('Dispute raised!');
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Stacks Integration Examples</h2>
      
      {/* Wallet Connection */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Wallet Connection</h3>
        {!isConnected ? (
          <button onClick={connectWallet} style={{ padding: '10px 20px' }}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>Connected: {userData?.profile?.stxAddress?.mainnet || 'Unknown'}</p>
            <button onClick={disconnectWallet} style={{ padding: '10px 20px' }}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Status Display */}
      {status && (
        <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '20px' }}>
          {status}
        </div>
      )}

      {/* Listing Operations */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Listing Operations</h3>
        <button onClick={handleCreateListing} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Create Listing
        </button>
        <button onClick={handleBuyListing} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Buy Listing
        </button>
        <button onClick={() => cancelListing(1)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Cancel Listing
        </button>
        <button onClick={() => updateListingPrice(1, 2000000)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Update Price
        </button>
      </div>

      {/* Auction Operations */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Auction Operations</h3>
        <button onClick={handleCreateAuction} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Create Auction
        </button>
        <button onClick={handlePlaceBid} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Place Bid
        </button>
        <button onClick={() => finalizeAuction(1)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Finalize Auction
        </button>
      </div>

      {/* Bundle Operations */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Bundle Operations</h3>
        <button onClick={handleCreateBundle} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Create Bundle
        </button>
      </div>

      {/* Dispute Operations */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Dispute Operations</h3>
        <button onClick={handleRaiseDispute} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Raise Dispute
        </button>
        <button onClick={() => voteOnDispute(1, true, 100000)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Vote on Dispute
        </button>
        <button onClick={() => resolveDispute(1)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Resolve Dispute
        </button>
      </div>

      {/* Wishlist */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Wishlist</h3>
        <button onClick={() => toggleWishlist(1)} disabled={!isConnected} style={{ margin: '5px', padding: '8px 16px' }}>
          Toggle Wishlist
        </button>
      </div>
    </div>
  );
};
