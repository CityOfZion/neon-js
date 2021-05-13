import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import { BaseTransaction } from "../../../src/tx/transaction/BaseTransaction";
import PublishTransaction, {
  PublishTransactionLike,
} from "../../../src/tx/transaction/PublishTransaction";
import samples from "./publishTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new PublishTransaction();

    expect(result).toBeInstanceOf(PublishTransaction);
    expect(result).toBeInstanceOf(BaseTransaction);
    expect(result.type).toBe(TransactionType.PublishTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    } as Partial<TransactionLike>;

    const result = new PublishTransaction(testObject);
    expect(result instanceof PublishTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.PublishTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new PublishTransaction({
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new PublishTransaction(testObject);
    expect(result instanceof PublishTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new PublishTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new PublishTransaction();
    expect(tx.exclusiveData).toEqual({
      script: "",
      parameterList: [0],
      returnType: 0,
      needStorage: false,
      name: "",
      codeVersion: "",
      author: "",
      email: "",
      description: "",
    });
  });

  test("serializeExclusive", () => {
    const tx = new PublishTransaction();
    expect(tx.serializeExclusive()).toEqual("000100000000000000");
  });
});

describe("export", () => {
  const expected = {
    type: 0xd0,
    version: 0,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    script: "abc",
    parameterList: [0],
    returnType: 0,
    needStorage: false,
    name: "name",
    codeVersion: "v1",
    author: "author",
    email: "email",
    description: "desc",
  } as Partial<TransactionLike>;

  const publishTx = new PublishTransaction(expected);
  const result = publishTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0xd0,
    version: 0,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    type: 0xd0,
    version: 0,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
    script: "abcd",
    parameterList: [0],
    returnType: 0,
    needStorage: false,
    name: "name",
    codeVersion: "v1",
    author: "author",
    email: "email",
    description: "desc",
  };
  const publishTx1 = new PublishTransaction(obj1);
  const publishTx2 = new PublishTransaction(obj2);

  test.each([
    ["Publish1 === Publish1", publishTx1, publishTx1, true],
    ["Publish1 !== Publish2", publishTx1, publishTx2, false],
    ["Publish1 === Obj1", publishTx1, obj1, true],
    ["Publish1 !== Obj2", publishTx1, obj2, false],
  ])("%s", (msg: string, a: PublishTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<PublishTransactionLike>
  ) => {
    let tx: PublishTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof PublishTransaction).toBeTruthy();
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
