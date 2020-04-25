import {
  TransactionBuilder,
  TransactionValidator,
  ValidationAttributes
} from "../../src/transaction";
import { sc, tx, u, rpc, CONST } from "@cityofzion/neon-core";

const TESTNET_URL = "http://seed5t.neo.org:20332";
const rpcClient = new rpc.RPCClient(TESTNET_URL);

const sig = {
  invocationScript:
    "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b06",
  verificationScript:
    "21031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c968747476aa"
};
const multiSig = {
  invocationScript:
    "40f52d1206315dfac64c14ec2dfef1edd62f4460487c23be6bbbbf9080973784ca7dbfe4dfcf4b6b82f2921b968e0d693020b76be0b20171ac56e7da50ab1c4b0640efe3ccf3a49dd670d8785a12218324f60a6b56ed5a628f15522b883a81b51ea9256c0be62008377b156eb1a76e6dc25aad776524c18eb01b0810ed833b15a1ca",
  verificationScript:
    "5221031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c92103767002bb9f74317035ce8d557a3aed30ce831eb16b5f636a139dad0b07916bed210329898e6e5e0a2f175e205b4019c500d6bb69203b56470ec2fc8ab0a4c065e16d5368c7c34cba"
};

describe.skip("validateValidUntilBlock", () => {
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

describe.skip("validateScript", () => {
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

describe.skip("validateSystemFee", () => {
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

describe.skip("validateNetworkFee", () => {
  test("valid", async () => {
    const transaction = new TransactionBuilder({
      scripts: [sig, multiSig],
      networkFee: 0.0237654
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee();
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const transaction = new TransactionBuilder({
      scripts: [sig, multiSig],
      networkFee: 0.01
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee();
    expect(validation.valid).toBeFalsy();
  });

  test("autoFix", async () => {
    const transaction = new TransactionBuilder({
      scripts: [sig, multiSig],
      networkFee: 0.01
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validateNetworkFee(true);
    const {
      valid,
      result: {
        networkFee: { fixed, prev, suggestion }
      }
    } = validation;
    expect(valid).toBeTruthy();
    expect(fixed).toBeTruthy();
    expect(prev.equals(0.01)).toBeTruthy();
    expect(suggestion.equals(0.0237654)).toBeTruthy();
    expect(transaction.networkFee.equals(suggestion)).toBeTruthy();
  });
});

describe.skip("validateAll", () => {
  test("valid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN +
        (await rpcClient.getBlockCount()) -
        1,
      scripts: [sig, multiSig],
      networkFee: 0.1,
      script,
      systemFee: 1
    }).build();
    const validator = new TransactionValidator(rpcClient, transaction);
    const validation = await validator.validate(ValidationAttributes.All);
    expect(validation.valid).toBeTruthy();
  });

  test("invalid", async () => {
    const script = sc.createScript({
      scriptHash: CONST.ASSET_ID.NEO,
      operation: "name",
      args: []
    });
    const transaction = new TransactionBuilder({
      validUntilBlock:
        tx.Transaction.MAX_TRANSACTION_LIFESPAN +
        (await rpcClient.getBlockCount()) -
        1,
      scripts: [sig, multiSig],
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
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN +
          (await rpcClient.getBlockCount()) -
          1,
        scripts: [sig, multiSig],
        networkFee: 0.01,
        script,
        systemFee: 1.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
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
            suggestion: new u.Fixed8(0.0240954)
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
        validUntilBlock:
          tx.Transaction.MAX_TRANSACTION_LIFESPAN +
          (await rpcClient.getBlockCount()) -
          1,
        scripts: [sig, multiSig],
        networkFee: 0.01,
        script,
        systemFee: 1.1
      }).build();
      const validator = new TransactionValidator(rpcClient, transaction);
      const validation = await validator.validate(
        ValidationAttributes.All,
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
            suggestion: new u.Fixed8(0.0240954)
          }
        }
      });
    });
  });
});
