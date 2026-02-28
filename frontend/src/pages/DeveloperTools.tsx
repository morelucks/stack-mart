import { Header } from '../components/Header';
import { TransactionBuilder } from '../components/TransactionBuilder';
import { ContractExplorer } from '../components/ContractExplorer';
import { SignatureVerifier } from '../components/SignatureVerifier';
import { EventMonitor, FilteredEventMonitor } from '../components/EventMonitor';

/**
 * Developer tools page showcasing @stacks/connect and @stacks/transactions
 */
export const DeveloperTools = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Developer Tools</h1>
          <p className="text-gray-600">
            Interactive tools for testing @stacks/connect and @stacks/transactions integration
          </p>
        </div>

        <div className="space-y-8">
          {/* Transaction Builder */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Transaction Builder</h2>
            <p className="text-gray-600 mb-4">
              Build and execute arbitrary contract calls using openContractCall with all Clarity types
            </p>
            <TransactionBuilder />
          </section>

          {/* Contract Explorer */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Contract Explorer</h2>
            <p className="text-gray-600 mb-4">
              Query contract state using callReadOnlyFunction and cvToJSON
            </p>
            <ContractExplorer />
          </section>

          {/* Signature Verifier */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Signature Verifier</h2>
            <p className="text-gray-600 mb-4">
              Sign and verify messages using openSignatureRequestPopup and verifyMessageSignatureRsv
            </p>
            <SignatureVerifier />
          </section>

          {/* Event Monitor */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Event Monitor</h2>
            <p className="text-gray-600 mb-4">
              Monitor contract events using @stacks/network API integration
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EventMonitor />
              <FilteredEventMonitor />
            </div>
          </section>

          {/* Integration Reference */}
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-bold mb-4">Integration Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">@stacks/connect</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• openContractCall - Execute transactions</li>
                  <li>• openSignatureRequestPopup - Sign messages</li>
                  <li>• Connect - Wallet provider</li>
                  <li>• PostConditionMode - Transaction safety</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">@stacks/transactions</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• uintCV, principalCV, stringAsciiCV - Value types</li>
                  <li>• listCV, tupleCV, bufferCV - Complex types</li>
                  <li>• callReadOnlyFunction - Read contract state</li>
                  <li>• cvToJSON, cvToString - Value conversion</li>
                  <li>• verifyMessageSignatureRsv - Verify signatures</li>
                  <li>• makeStandardSTXPostCondition - Post conditions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">@stacks/network</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• StacksMainnet - Mainnet configuration</li>
                  <li>• StacksTestnet - Testnet configuration</li>
                  <li>• coreApiUrl - API endpoint access</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Clarity Types</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• ClarityType - Type enumeration</li>
                  <li>• ClarityValue - Base value type</li>
                  <li>• UIntCV, IntCV, BooleanCV - Primitives</li>
                  <li>• PrincipalCV, BufferCV - Complex types</li>
                  <li>• OptionalCV, ResponseCV - Wrappers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="border rounded-lg p-6 shadow-sm bg-white">
            <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Execute Transaction</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
{`import { openContractCall } from '@stacks/connect';
import { uintCV, principalCV } from '@stacks/transactions';

await openContractCall({
  network: getNetwork(),
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'create-listing',
  functionArgs: [
    uintCV(1000000),
    uintCV(500),
    principalCV('SP...')
  ],
  postConditionMode: PostConditionMode.Allow,
  onFinish: (data) => console.log(data.txId)
});`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Read Contract State</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
{`import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';

const result = await callReadOnlyFunction({
  network: getNetwork(),
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName: 'get-listing',
  functionArgs: [uintCV(1)],
  senderAddress: address
});

const listing = cvToJSON(result);`}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sign Message</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
{`import { openSignatureRequestPopup } from '@stacks/connect';
import { verifyMessageSignatureRsv } from '@stacks/transactions';

const result = await openSignatureRequestPopup({
  network: getNetwork(),
  message: 'Hello, Stacks!',
  onFinish: (data) => ({
    signature: data.signature,
    publicKey: data.publicKey
  })
});

const isValid = verifyMessageSignatureRsv({
  message: 'Hello, Stacks!',
  signature: result.signature,
  publicKey: result.publicKey
});`}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
