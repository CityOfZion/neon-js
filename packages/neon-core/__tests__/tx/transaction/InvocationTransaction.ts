import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import InvocationTransaction, {
  InvocationTransactionLike,
} from "../../../src/tx/transaction/InvocationTransaction";

import { Fixed8 } from "../../../src/u";
import samples from "./invocationTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new InvocationTransaction();

    expect(result instanceof InvocationTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.InvocationTransaction);
    expect(result.gas.toNumber()).toBe(0);
    expect(result.script).toEqual("");
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      gas: 1,
      script: "00",
    } as Partial<TransactionLike>;

    const result = new InvocationTransaction(testObject);
    expect(result instanceof InvocationTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.InvocationTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new InvocationTransaction({
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      gas: 1,
      script: "00",
    });

    const result = new InvocationTransaction(testObject);
    expect(result instanceof InvocationTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new InvocationTransaction({
      gas: 2,
    });
    expect(tx.fees).toBe(2);
  });

  test("exclusiveData", () => {
    const tx = new InvocationTransaction();
    expect(tx.exclusiveData).toEqual({ script: "", gas: new Fixed8(0) });
  });

  test("serializeExclusive", () => {
    const tx = new InvocationTransaction({ script: "1234", gas: 5 });
    expect(tx.serializeExclusive()).toEqual("0212340065cd1d00000000");
  });
});

describe("export", () => {
  const expected = {
    type: 0xd1,
    version: 1,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    gas: 1,
    script: "00",
  } as Partial<TransactionLike>;

  const invocationTx = new InvocationTransaction(expected);
  const result = invocationTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0xd1,
    version: 1,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    gas: 1,
  };

  const obj2 = {
    type: 0xd1,
    version: 1,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
    script: "12",
  };
  const invocationTx1 = new InvocationTransaction(obj1);
  const invocationTx2 = new InvocationTransaction(obj2);

  test.each([
    ["Invocation1 === Invocation1", invocationTx1, invocationTx1, true],
    ["Invocation1 !== Invocation2", invocationTx1, invocationTx2, false],
    ["Invocation1 === Obj1", invocationTx1, obj1, true],
    ["Invocation1 !== Obj2", invocationTx1, obj2, false],
  ])("%s", (msg: string, a: InvocationTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<InvocationTransactionLike>
  ) => {
    let tx: InvocationTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof InvocationTransaction).toBeTruthy();
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
