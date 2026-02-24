import { ConnectWalletButton } from './ConnectWalletButton';
import { useWallet } from '../hooks/useWallet';
import { AddressDisplay } from './AddressDisplay';

export const Header = () => {
  const { address, isConnected } = useWallet();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-blue-600">StackMart</h1>
            <span className="text-sm text-gray-500">Decentralized Marketplace</span>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && address && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Connected:</span>
                <AddressDisplay address={address} />
              </div>
            )}
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};
