import { useState } from 'react';
import { 
  fetchCallReadOnlyFunction as callReadOnlyFunction,
  cvToJSON,
  uintCV,
  principalCV,
  stringAsciiCV,
  ClarityValue,
} from '@stacks/transactions';
import { getNetwork } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';
import { useWallet } from '../hooks/useWallet';

/**
 * Contract explorer using @stacks/transactions callReadOnlyFunction
 * Interactive tool for querying contract state
 */
export const ContractExplorer = () => {
  const { address } = useWallet();
  const [functionName, setFunctionName] = useState('');
  const [argType, setArgType] = useState<'uint' | 'principal' | 'string'>('uint');
  const [argValue, setArgValue] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const buildArgument = (): ClarityValue => {
    switch (argType) {
      case 'uint':
        return uintCV(parseInt(argValue));
      case 'principal':
        return principalCV(argValue);
      case 'string':
        return stringAsciiCV(argValue);
      default:
        throw new Error('Unsupported type');
    }
  };

  const queryContract = async () => {
    if (!address) {
      setError('Please connect wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const functionArgs = argValue ? [buildArgument()] : [];

      const response = await callReadOnlyFunction({
        network: getNetwork(),
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        senderAddress: address,
      });

      const jsonResult = cvToJSON(response);
      setResult(jsonResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const commonQueries = [
    { name: 'get-listing', arg: 'uint', placeholder: '1' },
    { name: 'get-auction', arg: 'uint', placeholder: '1' },
    { name: 'get-escrow', arg: 'uint', placeholder: '1' },
    { name: 'get-wishlist', arg: 'principal', placeholder: 'SP...' },
    { name: 'get-seller-reputation', arg: 'principal', placeholder: 'SP...' },
    { name: 'get-marketplace-stats', arg: 'none', placeholder: '' },
  ];

  const loadQuery = (query: typeof commonQueries[0]) => {
    setFunctionName(query.name);
    setArgType(query.arg as any);
    setArgValue(query.placeholder);
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Contract Explorer</h2>
      <p className="text-sm text-gray-600 mb-6">
        Query contract state using @stacks/transactions callReadOnlyFunction
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Function Name</label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="get-listing"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Argument Type</label>
            <select
              value={argType}
              onChange={(e) => setArgType(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="uint">uint</option>
              <option value="principal">principal</option>
              <option value="string">string</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Argument Value</label>
            <input
              type="text"
              value={argValue}
              onChange={(e) => setArgValue(e.target.value)}
              placeholder="1"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={queryContract}
          disabled={!functionName || loading || !address}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Querying...' : 'Query Contract'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="text-sm overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-medium mb-3">Common Queries:</h3>
          <div className="grid grid-cols-2 gap-2">
            {commonQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => loadQuery(query)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-left"
              >
                {query.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Available Read-Only Functions:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• get-listing (uint) - Get listing details</li>
            <li>• get-auction (uint) - Get auction details</li>
            <li>• get-escrow (uint) - Get escrow state</li>
            <li>• get-dispute (uint) - Get dispute details</li>
            <li>• get-bundle (uint) - Get bundle info</li>
            <li>• get-wishlist (principal) - Get user wishlist</li>
            <li>• get-seller-reputation (principal) - Get reputation</li>
            <li>• get-marketplace-stats () - Get marketplace stats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
