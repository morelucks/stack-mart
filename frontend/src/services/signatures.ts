import { openSignatureRequestPopup } from '@stacks/connect';
import { 
  verifyMessageSignatureRsv,
  hashMessage,
  publicKeyFromSignatureRsv,
} from '@stacks/transactions';
import { getNetwork } from '../utils/network';

/**
 * Message signing and verification using @stacks/connect and @stacks/transactions
 */

export interface SignatureResult {
  signature: string;
  publicKey: string;
  message: string;
}

/**
 * Request message signature from user using @stacks/connect
 */
export const signMessage = async (message: string): Promise<SignatureResult> => {
  return new Promise((resolve, reject) => {
    openSignatureRequestPopup({
      network: getNetwork(),
      message,
      onFinish: (data) => {
        resolve({
          signature: data.signature,
          publicKey: data.publicKey,
          message,
        });
      },
      onCancel: () => {
        reject(new Error('Signature request cancelled'));
      },
    });
  });
};

/**
 * Verify message signature using @stacks/transactions
 */
export const verifySignature = (
  message: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    return verifyMessageSignatureRsv({
      message,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

/**
 * Hash message using @stacks/transactions
 */
export const getMessageHash = (message: string): string => {
  const hash = hashMessage(message);
  return Buffer.from(hash).toString('hex');
};

/**
 * Recover public key from signature using @stacks/transactions
 */
export const recoverPublicKey = (
  message: string,
  signature: string
): string | null => {
  try {
    const publicKey = publicKeyFromSignatureRsv(message, {
      data: signature,
      type: 0, // MessageSignature type
    } as any);
    return publicKey;
  } catch (error) {
    console.error('Public key recovery failed:', error);
    return null;
  }
};

/**
 * Sign and verify workflow
 */
export const signAndVerify = async (message: string): Promise<{
  signed: SignatureResult;
  verified: boolean;
}> => {
  const signed = await signMessage(message);
  const verified = verifySignature(message, signed.signature, signed.publicKey);
  
  return { signed, verified };
};

/**
 * Create signed attestation for delivery
 */
export const createDeliveryAttestation = async (
  listingId: number,
  deliveryDetails: string
): Promise<SignatureResult> => {
  const message = `Delivery attestation for listing ${listingId}: ${deliveryDetails}`;
  return signMessage(message);
};

/**
 * Verify delivery attestation
 */
export const verifyDeliveryAttestation = (
  listingId: number,
  deliveryDetails: string,
  signature: string,
  publicKey: string
): boolean => {
  const message = `Delivery attestation for listing ${listingId}: ${deliveryDetails}`;
  return verifySignature(message, signature, publicKey);
};

/**
 * Create signed offer
 */
export const createSignedOffer = async (
  listingId: number,
  amount: number,
  expiresAt: number
): Promise<SignatureResult> => {
  const message = `Offer for listing ${listingId}: ${amount} microSTX, expires at block ${expiresAt}`;
  return signMessage(message);
};

/**
 * Verify signed offer
 */
export const verifySignedOffer = (
  listingId: number,
  amount: number,
  expiresAt: number,
  signature: string,
  publicKey: string
): boolean => {
  const message = `Offer for listing ${listingId}: ${amount} microSTX, expires at block ${expiresAt}`;
  return verifySignature(message, signature, publicKey);
};
