import { TokenInfo } from '../components/TokenInfo';
import { TokenTransferForm } from '../components/TokenTransferForm';
import { useWallet } from '../hooks/useWallet';

export const TokenPage = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">StackMart Tips Token</h1>
          <p className="text-gray-600">Connect your wallet to manage SMT tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">StackMart Tips (SMT)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TokenInfo />
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">About SMT</h3>
            <p className="text-gray-600 mb-4">
              StackMart Tips (SMT) is the native utility token of the StackMart marketplace.
              Use SMT to tip creators, pay for premium features, and participate in governance.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Standard:</span>
                <span className="font-medium">SIP-010</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Decimals:</span>
                <span className="font-medium">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium">Stacks Mainnet</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <TokenTransferForm />
        </div>
      </div>
    </div>
  );
};
