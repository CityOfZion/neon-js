import { rpc, tx, u } from "@cityofzion/neon-core";
import {
  TransactionValidator,
  ValidationAttributes,
} from "../../src/transaction";

describe("validate", () => {
  test("validate some, no autofix, all valid", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 5000,
      script: "abcd",
      systemFee: 100,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validate(
      ValidationAttributes.ValidUntilBlock | ValidationAttributes.SystemFee
    );

    expect(result).toMatchObject({
      valid: true,
      result: {
        validUntilBlock: { valid: true, fixed: false },
        systemFee: { valid: true, fixed: false },
      },
    });
  });

  test("validate some, some autofix, autofixes specified fields", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 1,
      script: "abcd",
      systemFee: 100,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validate(
      ValidationAttributes.ValidUntilBlock |
        ValidationAttributes.SystemFee |
        ValidationAttributes.Script,
      ValidationAttributes.ValidUntilBlock
    );

    expect(result).toMatchObject({
      valid: true,
      result: {
        validUntilBlock: {
          valid: true,
          fixed: true,
          prev: 1,
          suggestion: 10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1,
        },
        systemFee: { valid: true, fixed: false },
        script: { valid: true, fixed: false },
      },
    });
  });
});

describe("validateValidUntilBlock", () => {
  test("valid", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 5000,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateValidUntilBlock(false);

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
    });
    expect(txn.validUntilBlock).toBe(5000);
  });

  test("invalid (validUntilBlock too small)", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 1,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateValidUntilBlock(false);

    expect(result).toMatchObject({
      valid: false,
      fixed: false,
      prev: 1,
      suggestion: 10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1,
    });
    expect(txn.validUntilBlock).toBe(1);
  });
  test("invalid (validUntilBlock too large)", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 100000000,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateValidUntilBlock(false);

    expect(result).toMatchObject({
      valid: false,
      fixed: false,
      prev: 100000000,
      suggestion: 10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1,
    });
    expect(txn.validUntilBlock).toBe(100000000);
  });

  test("valid but suggest when lifespan too short (20)", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 30,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateValidUntilBlock(false);

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
      prev: 30,
      suggestion: 10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1,
    });
    expect(txn.validUntilBlock).toBe(30);
  });

  test("autofix", async () => {
    const rpcClient: rpc.RPCClient = ({
      getBlockCount: jest.fn().mockImplementation(async () => 10),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      validUntilBlock: 1,
    });
    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateValidUntilBlock(true);

    expect(result).toMatchObject({
      valid: true,
      fixed: true,
      prev: 1,
      suggestion: 10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1,
    });
    expect(txn.validUntilBlock).toBe(
      10 + TransactionValidator.TX_LIFESPAN_SUGGESTION - 1
    );
  });
});

describe("validateScript", () => {
  test("valid", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest
        .fn()
        .mockImplementation(async () => ({ state: "HALT" })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateScript();

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
    });
  });

  test("invalid", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest
        .fn()
        .mockImplementation(async () => ({ state: "FAULT" })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateScript();

    expect(result).toMatchObject({
      valid: false,
      fixed: false,
    });
  });
});

describe("validateSystemFee", () => {
  test("valid", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
      systemFee: 100,
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateSystemFee(false);

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
    });
    expect(txn.systemFee.toString()).toBe("100");
  });

  test("invalid (too low)", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
      systemFee: 1,
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateSystemFee(false);

    expect(result).toMatchObject({
      valid: false,
      fixed: false,
      prev: u.BigInteger.fromNumber(1),
      suggestion: u.BigInteger.fromNumber(100),
    });
    expect(txn.systemFee.toString()).toBe("1");
  });

  test("suggest (too high)", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
      systemFee: 1000,
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateSystemFee(false);

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
      prev: u.BigInteger.fromNumber(1000),
      suggestion: u.BigInteger.fromNumber(100),
    });
    expect(txn.systemFee.toString()).toBe("1000");
  });

  test("autofix applies fix when too low", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
      systemFee: 1,
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateSystemFee(true);

    expect(result).toMatchObject({
      valid: true,
      fixed: true,
      prev: u.BigInteger.fromNumber(1),
      suggestion: u.BigInteger.fromNumber(100),
    });
    expect(txn.systemFee.toString()).toBe("100");
  });

  test("autofix does not activate when too high", async () => {
    const rpcClient: rpc.RPCClient = ({
      invokeScript: jest.fn().mockImplementation(async () => ({
        state: "HALT",
        gasconsumed: "0.000001",
      })),
    } as unknown) as rpc.RPCClient;
    const txn = new tx.Transaction({
      script: "abcd",
      systemFee: 1000,
    });

    const validator = new TransactionValidator(rpcClient, txn);
    const result = await validator.validateSystemFee(true);

    expect(result).toMatchObject({
      valid: true,
      fixed: false,
      prev: u.BigInteger.fromNumber(1000),
      suggestion: u.BigInteger.fromNumber(100),
    });
    expect(txn.systemFee.toString()).toBe("1000");
  });
});
