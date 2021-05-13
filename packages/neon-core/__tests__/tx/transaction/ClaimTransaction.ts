import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import ClaimTransaction, {
  ClaimTransactionLike,
} from "../../../src/tx/transaction/ClaimTransaction";

import { BaseTransaction } from "../../../src/tx/transaction/BaseTransaction";
import samples from "./claimTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new ClaimTransaction();

    expect(result).toBeInstanceOf(ClaimTransaction);
    expect(result).toBeInstanceOf(BaseTransaction);
    expect(result.type).toBe(TransactionType.ClaimTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    } as Partial<TransactionLike>;

    const result = new ClaimTransaction(testObject);
    expect(result instanceof ClaimTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.ClaimTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new ClaimTransaction({
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new ClaimTransaction(testObject);
    expect(result instanceof ClaimTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new ClaimTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new ClaimTransaction();
    expect(tx.exclusiveData).toEqual({ claims: [] });
  });

  test("serializeExclusive", () => {
    const tx = new ClaimTransaction();
    expect(tx.serializeExclusive()).toEqual("00");
  });
});

describe("export", () => {
  const expected = {
    type: 0x02,
    version: 1,
    claims: [{ prevHash: "cd", prevIndex: 0 }],
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  } as Partial<TransactionLike>;

  const claimTx = new ClaimTransaction(expected);
  const result = claimTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x02,
    version: 1,
    claims: [{ prevHash: "cd", prevIndex: 0 }],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    type: 0x02,
    version: 1,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
  };
  const claimTx1 = new ClaimTransaction(obj1);
  const claimTx2 = new ClaimTransaction(obj2);

  test.each([
    ["Claim1 === Claim1", claimTx1, claimTx1, true],
    ["Claim1 !== Claim2", claimTx1, claimTx2, false],
    ["Claim1 === Obj1", claimTx1, obj1, true],
    ["Claim1 !== Obj2", claimTx1, obj2, false],
  ])("%s", (msg: string, a: ClaimTransaction, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = Object.keys(samples).map((k) => {
  const s = samples[k];
  return [s.txid, s.serialized, s.deserialized];
});

describe.each(dataSet)(
  "%s",
  (
    txid: string,
    serialized: string,
    deserialized: Partial<ClaimTransactionLike>
  ) => {
    let tx: ClaimTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof ClaimTransaction).toBeTruthy();
    });

    test("exports properly", () => {
      const result = tx.export();
      expect(result).toEqual(deserialized);
    });

    test("produce correct hash", () => {
      expect(tx.hash).toEqual(txid);
    });
  }
);
