import { useState } from 'react';
import { signMessage, verifySignature, getMessageHash } from '../services/signatures';

/**
 * Signature verification component using @stacks/connect and @stacks/transactions
 */
export const SignatureVerifier = () => {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [messageHash, setMessageHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!message) return;

    setLoading(true);
    try {
      const result = await signMessage(message);
      setSignature(result.signature);
      setPublicKey(result.publicKey);
      setMessageHash(getMessageHash(message));
      setVerificationResult(null);
    } catch (error) {
      console.error('Signing failed:', error);
      alert('Signing failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!message || !signature || !publicKey) {
      alert('Please provide message, signature, and public key');
      return;
    }

    const isValid = verifySignature(message, signature, publicKey);
    setVerificationResult(isValid);
  };

  const handleClear = () => {
    setMessage('');
    setSignature('');
    setPublicKey('');
    setMessageHash('');
    setVerificationResult(null);
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Message Signature Verifier</h2>
      <p className="text-sm text-gray-600 mb-6">
        Sign and verify messages using @stacks/connect and @stacks/transactions
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to sign..."
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSign}
            disabled={!message || loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {loading ? 'Signing...' : 'Sign Message'}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear
          </button>
        </div>

        {messageHash && (
          <div>
            <label className="block text-sm font-medium mb-1">Message Hash</label>
            <input
              type="text"
              value={messageHash}
              readOnly
              className="w-full p-2 border rounded bg-gray-50 font-mono text-sm"
            />
          </div>
        )}

        {signature && (
          <div>
            <label className="block text-sm font-medium mb-1">Signature</label>
            <textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="w-full p-2 border rounded font-mono text-sm"
              rows={3}
            />
          </div>
        )}

        {publicKey && (
          <div>
            <label className="block text-sm font-medium mb-1">Public Key</label>
            <input
              type="text"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              className="w-full p-2 border rounded font-mono text-sm"
            />
          </div>
        )}

        {(signature || publicKey) && (
          <button
            onClick={handleVerify}
            className="w-full px-4 py-2 bg-green-500 text-white rounded"
          >
            Verify Signature
          </button>
        )}

        {verificationResult !== null && (
          <div
            className={`p-4 rounded ${
              verificationResult ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <p className="font-medium">
              {verificationResult ? '✓ Signature Valid' : '✗ Signature Invalid'}
            </p>
            <p className="text-sm mt-1">
              {verificationResult
                ? 'The signature is valid and was created by the owner of the public key.'
                : 'The signature is invalid or does not match the message and public key.'}
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>1. Enter a message and click "Sign Message"</li>
            <li>2. Wallet popup will appear (openSignatureRequestPopup)</li>
            <li>3. Approve the signature request in your wallet</li>
            <li>4. Signature and public key will be displayed</li>
            <li>5. Click "Verify Signature" to validate (verifyMessageSignatureRsv)</li>
            <li>6. Message hash is computed using hashMessage()</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-medium mb-2">Use Cases:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Delivery attestations with cryptographic proof</li>
            <li>• Signed offers for off-chain negotiation</li>
            <li>• Authentication and identity verification</li>
            <li>• Dispute evidence with tamper-proof signatures</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
