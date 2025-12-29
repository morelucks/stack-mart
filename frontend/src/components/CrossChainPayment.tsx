import { useState } from 'react';
import { useAllWallets } from '../hooks/useAllWallets';
import { EVMPaymentButton } from './EVMPaymentButton';
import { BuyListing } from './BuyListing';

interface CrossChainPaymentProps {
  listingId: number;
  price: number; // in microSTX
  allowEVM?: boolean; // Allow EVM payments
  onSuccess?: (txid: string, chain: 'stacks' | 'evm') => void;
  onError?: (error: string) => void;
}

/**
 * Cross-Chain Payment Component
 * Allows payment via Stacks (native) or EVM chains (AppKit/WalletKit)
 */
export const CrossChainPayment = ({
  listingId,
  price,
  allowEVM = true,
  onSuccess,
  onError,
}: CrossChainPaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stacks' | 'evm'>('stacks');
  const { stacks, appKit, walletKit } = useAllWallets();

  const priceInSTX = price / 1000000;
  // Convert STX to ETH (approximate, in production use oracle)
  const priceInETH = (priceInSTX * 0.0001).toFixed(6); // Rough conversion

  const handleStacksSuccess = (txid: string) => {
    onSuccess?.(txid, 'stacks');
  };

  const handleEVMSuccess = (txHash: string) => {
    onSuccess?.(txHash, 'evm');
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <h3 style={{ marginTop: 0, color: 'white' }}>Purchase Listing #{listingId}</h3>
      
      {allowEVM && (appKit.isConnected || walletKit.isConnected) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: '0.75rem' 
          }}>
            Payment Method:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPaymentMethod('stacks')}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: paymentMethod === 'stacks'
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${
                  paymentMethod === 'stacks'
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'rgba(255, 255, 255, 0.2)'
                }`,
                borderRadius: 'var(--radius-sm)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              ⛓️ Stacks (Native)
            </button>
            <button
              onClick={() => setPaymentMethod('evm')}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: paymentMethod === 'evm'
                  ? 'rgba(99, 102, 241, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: `1px solid ${
                  paymentMethod === 'evm'
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'rgba(255, 255, 255, 0.2)'
                }`,
                borderRadius: 'var(--radius-sm)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              🔷 EVM Chains
            </button>
          </div>
        </div>
      )}

      {paymentMethod === 'stacks' ? (
        <BuyListing
          listingId={listingId}
          price={price}
          onSuccess={handleStacksSuccess}
          onError={onError}
        />
      ) : (
        <div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '0.5rem' }}>
              Pay with EVM Wallet
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
              {priceInETH} ETH
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '0.25rem' }}>
              ≈ {priceInSTX} STX
            </div>
          </div>
          
          <EVMPaymentButton
            recipient="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" // Example recipient
            amount={priceInETH}
            onSuccess={handleEVMSuccess}
            onError={onError}
            useGasless={walletKit.isConnected}
          />
        </div>
      )}
    </div>
  );
};

