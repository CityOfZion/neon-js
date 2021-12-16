import {
  TransactionValidator,
  ValidationAttributes,
} from "../../src/transaction";
import { sc, tx, u, rpc, wallet, CONST } from "@cityofzion/neon-core";
import * as TestHelpers from "../../../../testHelpers";

let rpcClient: rpc.NeoServerRpcClient;
beforeAll(async () => {
  const url = await TestHelpers.getIntegrationEnvUrl();
  rpcClient = new rpc.NeoServerRpcClient(url);
}, 20000);

const sig = {
  invocationScript:
    "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b06",
  verificationScript:
    "0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef4156e7b327",
};
const multiSig = {
  invocationScript:
    "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b0640efe3ccf3a49dd670d8785a12218324f60a6b56ed5a628f15522b883a81b51ea9256c0be62008377b156eb1a76e6dc25aad776524c18eb01b0810ed833b15a1ca",
  verificationScript:
    "110c2103118a2b7962fa0226fa35acf5d224855b691c7ea978d1afe2c538631d5f7be85e11419ed0dc3a",
};

const signers: tx.SignerLike[] = [
  {
    account: wallet.getScriptHashFromVerificationScript(sig.verificationScript),
    scopes: 1,
  },
  {
    account: wallet.getScriptHashFromVerificationScript(
      multiSig.invocationScript
    ),
    scopes: 1,
  },
];

describe("validateValidUntilBlock", () => {
  test("valid", async () => {
    const currentBlock = await rpcClient.getBlockCount();
    const transaction = new tx.Transaction({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN + currentBlock - 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new tx.Transaction({
      validUntilBlock: 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock();
    expect(validation.valid).toBeFalsy();
  });

  test("autoFix", async () => {
    const transaction = new tx.Transaction({
      validUntilBlock: 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock(true);
    const { valid, fixed, prev, suggestion } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeTruthy();
    expect(prev).toBe(1);
    expect(suggestion).toBeGreaterThan(1);
    expect(transaction.validUntilBlock).toBe(suggestion);
  });
});

describe.skip("validateScript", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "symbol",
      args: [],
    });
    const transaction = new tx.Transaction({
      script,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateScript();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "not_exist_method",
      args: [],
    });
    const transaction = new tx.Transaction({
      script,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateScript();
    expect(validation.valid).toBeFalsy();
    expect(validation.message).toBeDefined();
  });
});

describe("validateSystemFee", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "symbol",
      args: [],
    });
    const transaction = new tx.Transaction({
      script,
      systemFee: "1000000000",
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateSystemFee();
    expect(validation.valid).toBeTruthy();
  });

  describe("invalid", () => {
    test("not enough", async () => {
      const script = sc.createScript({
        scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
        operation: "symbol",
        args: [],
      });
      const transaction = new tx.Transaction({
        script,
        systemFee: 0,
      });
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee();
      expect(validation).toStrictEqual({
        valid: false,
        fixed: false,
        prev: u.BigInteger.fromNumber(0),
        suggestion: u.BigInteger.fromNumber(1),
        message: "Insufficient fees attached to run the script.",
      });
    });

    test("script execution error in neoVM", async () => {
      const addressInHash160 = sc.ContractParam.hash160(
        "NPTmAHDxo6Pkyic8Nvu3kwyXoYJCvcCB6i"
      );
      const script = sc.createScript({
        scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
        operation: "transfer",
        args: [addressInHash160, addressInHash160, sc.ContractParam.integer(1)],
      });
      const transaction = new tx.Transaction({
        script,
        systemFee: "1000000000",
      });
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee();
      expect(validation).toStrictEqual({
        valid: false,
        fixed: false,
        message:
          "Cannot get precise systemFee as script execution on node reports FAULT.",
      });
    });
  });

  describe("autoFix", () => {
    test("fix not enough", async () => {
      const script = sc.createScript({
        scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
        operation: "symbol",
        args: [],
      });
      const transaction = new tx.Transaction({
        script,
        systemFee: 0,
      });
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee(true);
      const { valid, fixed, prev, suggestion } = validation;
      expect(valid).toBeTruthy();
      expect(fixed).toBeTruthy();
      expect(prev && prev.equals(0)).toBeTruthy();
      expect(suggestion && suggestion.compare(0)).toEqual(1);
      expect(transaction.systemFee.equals(suggestion ?? -1)).toBeTruthy();
    });
  });

  test("suggest when overpaying", async () => {
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "symbol",
      args: [],
    });
    const transaction = new tx.Transaction({
      script,
      systemFee: 1010000000,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateSystemFee(true);
    const { valid, fixed, prev, suggestion, message } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeFalsy();
    expect(prev && prev.equals(1010000000)).toBeTruthy();
    expect(suggestion && suggestion.compare(1010000000)).toEqual(-1);
    expect(message).toContain("Overpaying");
  });
});

describe("validateNetworkFee", () => {
  test("valid", async () => {
    const transaction = new tx.Transaction({
      script: "1234",
      signers,
      witnesses: [sig, multiSig],
      networkFee: 2376540,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new tx.Transaction({
      script: "1234",
      signers,
      witnesses: [sig, multiSig],
      networkFee: 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee();
    expect(validation.valid).toBeFalsy();
  });

  test("autoFix", async () => {
    const transaction = new tx.Transaction({
      script: "1234",
      signers,
      witnesses: [sig, multiSig],
      networkFee: 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee(true);
    const { valid, fixed, prev, suggestion } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeTruthy();
    expect(prev && prev.equals(1)).toBeTruthy();
    expect(suggestion && suggestion.compare(1)).toEqual(1);
    expect(transaction.networkFee.equals(suggestion ?? -1)).toBeTruthy();
  });
});

describe("validateAll", () => {
  test("valid", async () => {
    const currentBlock = await rpcClient.getBlockCount();
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "symbol",
      args: [],
    });
    const transaction = new tx.Transaction({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN + currentBlock - 1,
      signers,
      witnesses: [sig, multiSig],
      script,
      networkFee: 100000000,
      systemFee: 100000000,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validate(ValidationAttributes.All);
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const currentBlock = await rpcClient.getBlockCount();
    const script = sc.createScript({
      scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
      operation: "symbol",
      args: [],
    });
    const transaction = new tx.Transaction({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN + currentBlock - 1,
      signers,
      witnesses: [sig, multiSig],
      script,
      networkFee: 1,
      systemFee: 1,
    });
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validate(ValidationAttributes.All);
    expect(validation.valid).toBeFalsy();
  });

  describe("autoFix", () => {
    test("fix all", async () => {
      const currentBlock = await rpcClient.getBlockCount();
      const script = sc.createScript({
        scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
        operation: "symbol",
        args: [],
      });
      const transaction = new tx.Transaction({
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN + currentBlock - 1,
        signers,
        witnesses: [sig, multiSig],
        script,
        networkFee: 1,
        systemFee: 1,
      });
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
        ValidationAttributes.All
      );
      expect(validation).toMatchObject({
        valid: true,
        result: {
          systemFee: {
            valid: true,
            fixed: true,
            prev: u.BigInteger.fromNumber(1),
            suggestion: expect.any(u.BigInteger),
          },
          networkFee: {
            valid: true,
            fixed: true,
            prev: u.BigInteger.fromNumber(1),
            suggestion: expect.any(u.BigInteger),
          },
          validUntilBlock: {
            valid: true,
            fixed: false,
          },
          script: {
            valid: true,
            fixed: false,
          },
        },
      });
    });

    test("fix one", async () => {
      const currentBlock = await rpcClient.getBlockCount();
      const script = sc.createScript({
        scriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
        operation: "symbol",
        args: [],
      });
      const transaction = new tx.Transaction({
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN + currentBlock - 1,
        signers,
        witnesses: [sig, multiSig],
        script,
        networkFee: 1,
        systemFee: 1,
      });
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
        ValidationAttributes.SystemFee
      );
      expect(validation).toMatchObject({
        valid: false,
        result: {
          systemFee: {
            valid: true,
            fixed: true,
            prev: u.BigInteger.fromNumber(1),
            suggestion: expect.any(u.BigInteger),
          },
          networkFee: {
            valid: false,
            fixed: false,
            prev: u.BigInteger.fromNumber(1),
            suggestion: expect.any(u.BigInteger),
            message: "Insufficient network fees.",
          },
          validUntilBlock: {
            valid: true,
            fixed: false,
          },
          script: {
            valid: true,
            fixed: false,
          },
        },
      });
    });
  });
});
