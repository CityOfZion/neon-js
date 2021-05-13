import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import MinerTransaction, {
  MinerTransactionLike,
} from "../../../src/tx/transaction/MinerTransaction";

import { BaseTransaction } from "../../../src/tx/transaction/BaseTransaction";
import samples from "./minerTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new MinerTransaction();

    expect(result).toBeInstanceOf(MinerTransaction);
    expect(result).toBeInstanceOf(BaseTransaction);
    expect(result.type).toBe(TransactionType.MinerTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      nonce: 1234,
    } as Partial<TransactionLike>;

    const result = new MinerTransaction(testObject);
    expect(result instanceof MinerTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.MinerTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new MinerTransaction({
      version: 1,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new MinerTransaction(testObject);
    expect(result instanceof MinerTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new MinerTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new MinerTransaction();
    expect(tx.exclusiveData).toEqual({ nonce: 0 });
  });

  test("serializeExclusive", () => {
    const tx = new MinerTransaction();
    expect(tx.serializeExclusive()).toEqual("00000000");
  });
});

describe("export", () => {
  const expected = {
    type: 0x00,
    version: 1,
    nonce: 571397116,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  } as Partial<TransactionLike>;

  const minerTx = new MinerTransaction(expected);
  const result = minerTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x00,
    version: 1,
    nonce: 123456,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    type: 0x00,
    version: 1,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
  };
  const minerTx1 = new MinerTransaction(obj1);
  const minerTx2 = new MinerTransaction(obj2);

  test.each([
    ["Miner1 === Miner1", minerTx1, minerTx1, true],
    ["Miner1 !== Miner2", minerTx1, minerTx2, false],
    ["Miner1 === Obj1", minerTx1, obj1, true],
    ["Miner1 !== Obj2", minerTx1, obj2, false],
  ])("%s", (msg: string, a: MinerTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<MinerTransactionLike>
  ) => {
    let tx: MinerTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof MinerTransaction).toBeTruthy();
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
