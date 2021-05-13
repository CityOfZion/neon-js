import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import IssueTransaction from "../../../src/tx/transaction/IssueTransaction";

import samples from "./issueTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new IssueTransaction();

    expect(result instanceof IssueTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.IssueTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    } as Partial<TransactionLike>;

    const result = new IssueTransaction(testObject);
    expect(result instanceof IssueTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.IssueTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new IssueTransaction({
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new IssueTransaction(testObject);
    expect(result instanceof IssueTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new IssueTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new IssueTransaction();
    expect(tx.exclusiveData).toEqual({});
  });

  test("serializeExclusive", () => {
    const tx = new IssueTransaction();
    expect(tx.serializeExclusive()).toEqual("");
  });
});

describe("export", () => {
  const expected = {
    type: 0x01,
    version: 1,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  } as Partial<TransactionLike>;

  test("export1", () => {
    const issueTx = new IssueTransaction(expected);
    const result = issueTx.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    type: 0x01,
    version: 1,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    type: 0x01,
    version: 1,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
  };
  const issue1 = new IssueTransaction(obj1);
  const issue2 = new IssueTransaction(obj2);

  test.each([
    ["Issue1 === Issue1", issue1, issue1, true],
    ["Issue1 !== Issue2", issue1, issue2, false],
    ["Issue1 === Obj1", issue1, obj1, true],
    ["Issue1 !== Obj2", issue1, obj2, false],
  ])("%s", (msg: string, a: IssueTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<TransactionLike>
  ) => {
    let tx: IssueTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof IssueTransaction).toBeTruthy();
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
