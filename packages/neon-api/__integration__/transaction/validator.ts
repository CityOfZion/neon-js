import {
  TransactionBuilder,
  TransactionValidator,
  ValidationAttributes
} from "../../src/transaction";
import { sc, tx, u, rpc, CONST, wallet } from "@cityofzion/neon-core";

const TESTNET_URL = "http://seed5t.neo.org:20332";
const rpcClient = new rpc.RPCClient(TESTNET_URL);

const normalAcc = new wallet.Account();
const multiSigAcc = wallet.Account.createMultiSig(
  2,
  [new wallet.Account(), new wallet.Account(), new wallet.Account()].map(
    account => account.publicKey
  )
);

describe("validateValidUntilBlock", () => {
  test("valid", async () => {
    const transaction = new TransactionBuilder({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN +
        (await rpcClient.getBlockCount()) -
        1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new TransactionBuilder({
      validUntilBlock: 1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock();
    expect(validation.valid).toBeFalsy();
  });

  test("autoFix", async () => {
    const transaction = new TransactionBuilder({
      validUntilBlock: 1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateValidUntilBlock(true);
    const {
      valid,
      result: {
        validUntilBlock: { fixed, prev, suggestion }
      }
    } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeTruthy();
    expect(prev).toBe(1);
    expect(suggestion).toBeGreaterThan(1);
    expect(transaction.validUntilBlock).toBe(suggestion);
  });
});

describe("validateScript", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      script
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateScript();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "not_exist_method",
      args: []
    });
    const transaction = new TransactionBuilder({
      script
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateScript();
    expect(validation.valid).toBeFalsy();
    expect(validation.result.script.message).toBeDefined();
  });
});

describe("validateSystemFee", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      script,
      systemFee: 10
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateSystemFee();
    expect(validation.valid).toBeTruthy();
  });

  describe("invalid", () => {
    test("not enough", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        script,
        systemFee: 0
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee();
      expect(validation).toStrictEqual({
        valid: false,
        result: {
          systemFee: {
            fixed: false,
            prev: new u.Fixed8(0),
            suggestion: new u.Fixed8(1)
          }
        }
      });
    });

    test("precision", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        script,
        systemFee: 10.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee();
      expect(validation).toStrictEqual({
        valid: false,
        result: {
          systemFee: {
            fixed: false,
            prev: new u.Fixed8(10.1),
            suggestion: new u.Fixed8(1)
          }
        }
      });
    });

    test("script execution error in neoVM", async () => {
      const addressInHash160 = sc.ContractParam.hash160(
        "AZzpS2oDPRtPwFp6C9ric98KCXGZiic6RV"
      );
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "transfer",
        args: [addressInHash160, addressInHash160, 1]
      });
      const transaction = new TransactionBuilder({
        script,
        systemFee: 10
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee();
      expect(validation).toStrictEqual({
        valid: false,
        result: {
          systemFee: {
            fixed: false,
            message:
              "Cannot get precise systemFee as script execution on node reports FAULT."
          }
        }
      });
    });
  });

  describe("autoFix", () => {
    test("fix not enough", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        script,
        systemFee: 0
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee(true);
      const {
        valid,
        result: {
          systemFee: { fixed, prev, suggestion }
        }
      } = validation;
      expect(valid).toBeTruthy();
      expect(fixed).toBeTruthy();
      expect(prev.equals(0)).toBeTruthy();
      expect(suggestion.equals(1)).toBeTruthy();
      expect(transaction.systemFee.equals(suggestion)).toBeTruthy();
    });

    test("precision", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        script,
        systemFee: 10.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validateSystemFee(true);
      const {
        valid,
        result: {
          systemFee: { fixed, prev, suggestion }
        }
      } = validation;
      expect(valid).toBeTruthy();
      expect(fixed).toBeTruthy();
      expect(prev.equals(10.1)).toBeTruthy();
      expect(suggestion.equals(1)).toBeTruthy();
      expect(transaction.systemFee.equals(suggestion)).toBeTruthy();
    });
  });
});

describe("validateSigners", () => {
  test("valid", async () => {
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ]
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateSigners([
      normalAcc,
      multiSigAcc
    ]);
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ]
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateSigners([normalAcc]);
    expect(validation.valid).toBeFalsy();
  });
});

describe("validateNetworkFee", () => {
  test("valid", async () => {
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ],
      networkFee: 0.044199
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee([
      normalAcc,
      multiSigAcc
    ]);
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ],
      networkFee: 0.01
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee([
      normalAcc,
      multiSigAcc
    ]);
    expect(validation.valid).toBeFalsy();
  });

  test("autoFix", async () => {
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ],
      networkFee: 0.01
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee(
      [normalAcc, multiSigAcc],
      true
    );
    const {
      valid,
      result: {
        networkFee: { fixed, prev, suggestion }
      }
    } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeTruthy();
    expect(prev.equals(0.01)).toBeTruthy();
    expect(suggestion.equals(0.044199)).toBeTruthy();
    expect(transaction.networkFee.equals(suggestion)).toBeTruthy();
  });
});

describe("validateAll", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ],
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN +
        (await rpcClient.getBlockCount()) -
        1,
      networkFee: 0.1,
      script,
      systemFee: 1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validate(ValidationAttributes.All, [
      normalAcc,
      multiSigAcc
    ]);
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      sender: u.reverseHex(normalAcc.scriptHash),
      cosigners: [
        {
          account: u.reverseHex(multiSigAcc.scriptHash),
          scopes: tx.WitnessScope.CalledByEntry
        }
      ],
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN +
        (await rpcClient.getBlockCount()) -
        1,
      networkFee: 0.01,
      script,
      systemFee: 1.1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validate(ValidationAttributes.All);
    expect(validation.valid).toBeFalsy();
  });

  describe("autoFix", () => {
    test("fix all", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        sender: u.reverseHex(normalAcc.scriptHash),
        cosigners: [
          {
            account: u.reverseHex(multiSigAcc.scriptHash),
            scopes: tx.WitnessScope.CalledByEntry
          }
        ],
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN +
          (await rpcClient.getBlockCount()) -
          1,
        networkFee: 0.01,
        script,
        systemFee: 1.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
        [normalAcc, multiSigAcc],
        ValidationAttributes.All
      );
      expect(validation).toStrictEqual({
        valid: true,
        result: {
          systemFee: {
            fixed: true,
            prev: new u.Fixed8(1.1),
            suggestion: new u.Fixed8(1)
          },
          networkFee: {
            fixed: true,
            prev: new u.Fixed8(0.01),
            suggestion: new u.Fixed8(0.044529)
          }
        }
      });
    });

    test("fix one", async () => {
      const script = sc.createScript({
        scriptHash: CONST.ASSET_ID.NEO,
        operation: "name",
        args: []
      });
      const transaction = new TransactionBuilder({
        sender: u.reverseHex(normalAcc.scriptHash),
        cosigners: [
          {
            account: u.reverseHex(multiSigAcc.scriptHash),
            scopes: tx.WitnessScope.CalledByEntry
          }
        ],
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN +
          (await rpcClient.getBlockCount()) -
          1,
        networkFee: 0.01,
        script,
        systemFee: 1.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
        [normalAcc, multiSigAcc],
        ValidationAttributes.SystemFee
      );
      expect(validation).toStrictEqual({
        valid: false,
        result: {
          systemFee: {
            fixed: true,
            prev: new u.Fixed8(1.1),
            suggestion: new u.Fixed8(1)
          },
          networkFee: {
            fixed: false,
            prev: new u.Fixed8(0.01),
            suggestion: new u.Fixed8(0.044529)
          }
        }
      });
    });
  });
});
