import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import ContractTransaction from "../../../src/tx/transaction/ContractTransaction";

import samples from "./contractTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new ContractTransaction();

    expect(result instanceof ContractTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.ContractTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }]
    } as Partial<TransactionLike>;

    const result = new ContractTransaction(testObject);
    expect(result instanceof ContractTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.ContractTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map(i => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map(i => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new ContractTransaction({
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }]
    });

    const result = new ContractTransaction(testObject);
    expect(result instanceof ContractTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new ContractTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new ContractTransaction();
    expect(tx.exclusiveData).toEqual({});
  });

  test("serializeExclusive", () => {
    const tx = new ContractTransaction();
    expect(tx.serializeExclusive()).toEqual("");
  });
});

describe("export", () => {
  const expected = {
    type: 0x80,
    version: 1,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }]
  } as Partial<TransactionLike>;

  const contractTx = new ContractTransaction(expected);
  const result = contractTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x80,
    version: 1,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }]
  };

  const obj2 = {
    type: 0x80,
    version: 1,
    inputs: [{ prevHash: "12", prevIndex: 1 }]
  };
  const contract1 = new ContractTransaction(obj1);
  const contract2 = new ContractTransaction(obj2);

  test.each([
    ["Contract1 === Contract1", contract1, contract1, true],
    ["Contract1 !== Contract2", contract1, contract2, false],
    ["Contract1 === Obj1", contract1, obj1, true],
    ["Contract1 !== Obj2", contract1, obj2, false]
  ])("%s", (msg: string, a: ContractTransaction, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = Object.keys(samples).map(k => {
  const s = samples[k];
  return [s.txid, s.serialized, s.deserialized];
});

describe.each(dataSet)(
  "%s",
  (
    txid: string,
    serialized: string,
    deserialized: Partial<InvocationTransactionLike>
  ) => {
    let tx: ContractTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof ContractTransaction).toBeTruthy();
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
