import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

const contractName = "sip-090-nft";

describe("SIP-090 NFT Performance Tests", () => {
  beforeEach(() => {
    simnet.setEpoch("3.0");
  });

  describe("Batch Operations Performance", () => {
    it("should handle maximum batch size efficiently", () => {
      // Test with maximum batch size (50 tokens)
      const recipients = Array(50).fill(wallet1).map(() => wallet1);
      const metadataUris = Array(50).fill(null).map(() => Cl.none());

      const batchMintResult = simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients.map(w => Cl.principal(w))),
          Cl.list(metadataUris)
        ],
        deployer
      );

      expect(batchMintResult.result).toBeOk(
        Cl.list(Array.from({length: 50}, (_, i) => Cl.uint(i + 1)))
      );

      // Verify total supply
      const totalSupply = simnet.callReadOnlyFn(
        contractName,
        "get-total-supply",
        [],
        deployer
      );
      expect(totalSupply.result).toBeOk(Cl.uint(50));
    });

    it("should handle multiple batch operations", () => {
      // First batch
      const recipients1 = Array(10).fill(wallet1);
      const metadataUris1 = Array(10).fill(null).map(() => Cl.none());

      simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients1.map(w => Cl.principal(w))),
          Cl.list(metadataUris1)
        ],
        deployer
      );

      // Second batch
      const recipients2 = Array(15).fill(wallet2);
      const metadataUris2 = Array(15).fill(null).map(() => Cl.none());

      const batchMintResult2 = simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients2.map(w => Cl.principal(w))),
          Cl.list(metadataUris2)
        ],
        deployer
      );

      expect(batchMintResult2.result).toBeOk(
        Cl.list(Array.from({length: 15}, (_, i) => Cl.uint(i + 11)))
      );

      // Verify total supply
      const totalSupply = simnet.callReadOnlyFn(
        contractName,
        "get-total-supply",
        [],
        deployer
      );
      expect(totalSupply.result).toBeOk(Cl.uint(25));
    });
  });

  describe("Query Performance", () => {
    beforeEach(() => {
      // Mint 20 tokens to wallet1 for testing
      const recipients = Array(20).fill(wallet1);
      const metadataUris = Array(20).fill(null).map(() => Cl.none());

      simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients.map(w => Cl.principal(w))),
          Cl.list(metadataUris)
        ],
        deployer
      );
    });

    it("should efficiently query tokens by owner", () => {
      const tokensResult = simnet.callReadOnlyFn(
        contractName,
        "get-tokens-by-owner",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(tokensResult.result).toBeOk(
        Cl.list(Array.from({length: 20}, (_, i) => Cl.uint(i + 1)))
      );
    });

    it("should efficiently get token count", () => {
      const countResult = simnet.callReadOnlyFn(
        contractName,
        "get-token-count-by-owner",
        [Cl.principal(wallet1)],
        deployer
      );

      expect(countResult.result).toBeOk(Cl.uint(20));
    });

    it("should efficiently query multiple token info", () => {
      const tokenIds = Array.from({length: 20}, (_, i) => Cl.uint(i + 1));
      
      const tokensInfoResult = simnet.callReadOnlyFn(
        contractName,
        "get-tokens-info",
        [Cl.list(tokenIds)],
        deployer
      );

      expect(tokensInfoResult.result).toBeOk(
        Cl.list(Array.from({length: 20}, (_, i) => 
          Cl.tuple({
            "token-id": Cl.uint(i + 1),
            owner: Cl.some(Cl.principal(wallet1)),
            "metadata-uri": Cl.some(Cl.stringAscii(`https://api.stackmart.io/nft/${i + 1}`))
          })
        ))
      );
    });
  });

  describe("Transfer Performance", () => {
    beforeEach(() => {
      // Mint 10 tokens for transfer testing
      const recipients = Array(10).fill(wallet1);
      const metadataUris = Array(10).fill(null).map(() => Cl.none());

      simnet.callPublicFn(
        contractName,
        "batch-mint",
        [
          Cl.list(recipients.map(w => Cl.principal(w))),
          Cl.list(metadataUris)
        ],
        deployer
      );
    });

    it("should handle multiple sequential transfers efficiently", () => {
      // Transfer tokens 1-5 from wallet1 to wallet2
      for (let i = 1; i <= 5; i++) {
        const transferResult = simnet.callPublicFn(
          contractName,
          "transfer",
          [Cl.uint(i), Cl.principal(wallet1), Cl.principal(wallet2)],
          wallet1
        );
        expect(transferResult.result).toBeOk(Cl.bool(true));
      }

      // Verify final token distribution
      const wallet1Tokens = simnet.callReadOnlyFn(
        contractName,
        "get-tokens-by-owner",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(wallet1Tokens.result).toBeOk(
        Cl.list([Cl.uint(6), Cl.uint(7), Cl.uint(8), Cl.uint(9), Cl.uint(10)])
      );

      const wallet2Tokens = simnet.callReadOnlyFn(
        contractName,
        "get-tokens-by-owner",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(wallet2Tokens.result).toBeOk(
        Cl.list([Cl.uint(1), Cl.uint(2), Cl.uint(3), Cl.uint(4), Cl.uint(5)])
      );
    });
  });
});