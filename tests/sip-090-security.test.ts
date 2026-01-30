import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const contractName = "sip-090-nft";

describe("SIP-090 NFT Security Tests", () => {
  beforeEach(() => {
    simnet.setEpoch("3.0");
  });

  describe("Authorization Security", () => {
    it("should prevent unauthorized minting", () => {
      const mintResult = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.principal(wallet1), Cl.none()],
        wallet1 // Non-owner trying to mint
      );

      expect(mintResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
    });

    it("should prevent unauthorized administrative actions", () => {
      const pauseResult = simnet.callPublicFn(
        contractName,
        "pause-contract",
        [],
        wallet1 // Non-owner trying to pause
      );

      expect(pauseResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED

      const setUriResult = simnet.callPublicFn(
        contractName,
        "set-base-uri",
        [Cl.stringAscii("https://malicious.com/")],
        wallet1 // Non-owner trying to change URI
      );

      expect(setUriResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
    });

    it("should prevent unauthorized token URI changes", () => {
      // First mint a token
      simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.principal(wallet1), Cl.none()],
        deployer
      );

      const setTokenUriResult = simnet.callPublicFn(
        contractName,
        "set-token-uri",
        [Cl.uint(1), Cl.stringAscii("https://malicious.com/token/1")],
        wallet1 // Non-owner trying to change token URI
      );

      expect(setTokenUriResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
    });
  });

  describe("Transfer Security", () => {
    beforeEach(() => {
      simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.principal(wallet1), Cl.none()],
        deployer
      );
    });

    it("should prevent unauthorized transfers", () => {
      const transferResult = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet2 // Non-owner trying to transfer
      );

      expect(transferResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
    });

    it("should prevent transfers with wrong sender", () => {
      const transferResult = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(1), Cl.principal(wallet2), Cl.principal(wallet3)], // Wrong sender
        wallet1 // Actual owner
      );

      expect(transferResult.result).toBeErr(Cl.uint(403)); // ERR-INVALID-OWNER
    });

    it("should prevent self-transfers", () => {
      const transferResult = simnet.callPublicFn(
        contractName,
        "transfer",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet1)], // Same sender/recipient
        wallet1
      );

      expect(transferResult.result).toBeErr(Cl.uint(400)); // ERR-INVALID-PARAMETERS
    });
  });

  describe("Reentrancy Protection", () => {
    it("should handle secure transfer function", () => {
      // Mint token first
      simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.principal(wallet1), Cl.none()],
        deployer
      );

      // Test secure transfer (with reentrancy protection)
      const secureTransferResult = simnet.callPublicFn(
        contractName,
        "transfer-secure",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet1
      );

      expect(secureTransferResult.result).toBeOk(Cl.bool(true));

      // Verify ownership changed
      const newOwner = simnet.callReadOnlyFn(
        contractName,
        "get-owner",
        [Cl.uint(1)],
        deployer
      );
      expect(newOwner.result).toBeOk(Cl.some(Cl.principal(wallet2)));
    });

    it("should handle secure mint function", () => {
      const secureMintResult = simnet.callPublicFn(
        contractName,
        "mint-secure",
        [Cl.principal(wallet1), Cl.none()],
        deployer
      );

      expect(secureMintResult.result).toBeOk(Cl.uint(1));

      // Verify token was minted
      const owner = simnet.callReadOnlyFn(
        contractName,
        "get-owner",
        [Cl.uint(1)],
        deployer
      );
      expect(owner.result).toBeOk(Cl.some(Cl.principal(wallet1)));
    });
  });

  describe("Emergency Security", () => {
    it("should properly handle emergency mode", () => {
      // Enable emergency mode
      const emergencyResult = simnet.callPublicFn(
        contractName,
        "enable-emergency-mode",
        [],
        deployer
      );

      expect(emergencyResult.result).toBeOk(Cl.bool(true));

      // Verify contract is paused
      const isPaused = simnet.callReadOnlyFn(
        contractName,
        "is-paused",
        [],
        deployer
      );
      expect(isPaused.result).toBeOk(Cl.bool(true));

      // Try to mint (should fail)
      const mintResult = simnet.callPublicFn(
        contractName,
        "mint",
        [Cl.principal(wallet1), Cl.none()],
        deployer
      );
      expect(mintResult.result).toBeErr(Cl.uint(503)); // ERR-CONTRACT-PAUSED
    });

    it("should prevent unauthorized emergency actions", () => {
      const emergencyResult = simnet.callPublicFn(
        contractName,
        "enable-emergency-mode",
        [],
        wallet1 // Non-owner
      );

      expect(emergencyResult.result).toBeErr(Cl.uint(401)); // ERR-NOT-AUTHORIZED
    });
  });

  describe("Input Validation Security", () => {
    it("should handle invalid token IDs gracefully", () => {
      const owner = simnet.callReadOnlyFn(
        contractName,
        "get-owner",
        [Cl.uint(0)], // Invalid token ID
        deployer
      );

      expect(owner.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND

      const tokenUri = simnet.callReadOnlyFn(
        contractName,
        "get-token-uri",
        [Cl.uint(999999)], // Non-existent token ID
        deployer
      );

      expect(tokenUri.result).toBeErr(Cl.uint(404)); // ERR-NOT-FOUND
    });

    it("should validate batch operation inputs", () => {
      // Mismatched array lengths
      const recipients = [wallet1, wallet2];
      const metadataUris = [Cl.none()]; // Different length

      const batchMintResult = simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients.map(w => Cl.principal(w))),
          Cl.list(metadataUris)
        ],
        deployer
      );

      expect(batchMintResult.result).toBeErr(Cl.uint(400)); // ERR-INVALID-PARAMETERS
    });
  });
});