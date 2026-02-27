import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import {
  uintCV,
  principalCV,
  stringAsciiCV,
  boolCV,
  bufferCV,
  listCV,
  tupleCV,
  someCV,
  noneCV,
  ClarityValue,
  PostConditionMode,
} from '@stacks/transactions';
import { getNetwork } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../config/contract';

interface Argument {
  name: string;
  type: 'uint' | 'principal' | 'string' | 'bool' | 'buffer' | 'optional';
  value: string;
}

/**
 * Interactive transaction builder using @stacks/connect and @stacks/transactions
 * Allows building and executing arbitrary contract calls
 */
export const TransactionBuilder = () => {
  const [functionName, setFunctionName] = useState('');
  const [args, setArgs] = useState<Argument[]>([]);
  const [result, setResult] = useState<string>('');

  const addArgument = () => {
    setArgs([...args, { name: '', type: 'uint', value: '' }]);
  };

  const updateArgument = (index: number, field: keyof Argument, value: string) => {
    const newArgs = [...args];
    newArgs[index] = { ...newArgs[index], [field]: value };
    setArgs(newArgs);
  };

  const removeArgument = (index: number) => {
    setArgs(args.filter((_, i) => i !== index));
  };

  const buildClarityValue = (arg: Argument): ClarityValue => {
    switch (arg.type) {
      case 'uint':
        return uintCV(parseInt(arg.value));
      case 'principal':
        return principalCV(arg.value);
      case 'string':
        return stringAsciiCV(arg.value);
      case 'bool':
        return boolCV(arg.value === 'true');
      case 'buffer':
        return bufferCV(Buffer.from(arg.value, 'hex'));
      case 'optional':
        return arg.value ? someCV(stringAsciiCV(arg.value)) : noneCV();
      default:
        throw new Error(`Unsupported type: ${arg.type}`);
    }
  };

  const executeTransaction = async () => {
    try {
      const functionArgs = args.map(buildClarityValue);

      await openContractCall({
        network: getNetwork(),
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          setResult(`Transaction successful! TX ID: ${data.txId}`);
          console.log('Transaction:', data);
        },
        onCancel: () => {
          setResult('Transaction cancelled by user');
        },
      });
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Transaction Builder</h2>
      <p className="text-sm text-gray-600 mb-6">
        Build and execute contract calls using @stacks/connect and @stacks/transactions
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Function Name</label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            placeholder="create-listing"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Arguments</label>
            <button
              onClick={addArgument}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
            >
              Add Argument
            </button>
          </div>

          {args.map((arg, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={arg.name}
                onChange={(e) => updateArgument(index, 'name', e.target.value)}
                placeholder="Argument name"
                className="flex-1 p-2 border rounded"
              />
              <select
                value={arg.type}
                onChange={(e) => updateArgument(index, 'type', e.target.value as any)}
                className="p-2 border rounded"
              >
                <option value="uint">uint</option>
                <option value="principal">principal</option>
                <option value="string">string</option>
                <option value="bool">bool</option>
                <option value="buffer">buffer</option>
                <option value="optional">optional</option>
              </select>
              <input
                type="text"
                value={arg.value}
                onChange={(e) => updateArgument(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => removeArgument(index)}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={executeTransaction}
          disabled={!functionName}
          className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
        >
          Execute Transaction
        </button>

        {result && (
          <div className={`p-4 rounded ${result.includes('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
            <p className="text-sm">{result}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Clarity Value Types:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li><code>uint</code> - Unsigned integer (uintCV)</li>
            <li><code>principal</code> - Stacks address (principalCV)</li>
            <li><code>string</code> - ASCII string (stringAsciiCV)</li>
            <li><code>bool</code> - Boolean true/false (boolCV)</li>
            <li><code>buffer</code> - Hex buffer (bufferCV)</li>
            <li><code>optional</code> - Optional value (someCV/noneCV)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
