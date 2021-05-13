import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import { BaseTransaction } from "../../../src/tx/transaction/BaseTransaction";
import RegisterTransaction, {
  RegisterTransactionLike,
} from "../../../src/tx/transaction/RegisterTransaction";
import { Fixed8 } from "../../../src/u";
import samples from "./registerTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new RegisterTransaction();

    expect(result).toBeInstanceOf(RegisterTransaction);
    expect(result).toBeInstanceOf(BaseTransaction);
    expect(result.type).toBe(TransactionType.RegisterTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    } as Partial<TransactionLike>;

    const result = new RegisterTransaction(testObject);
    expect(result instanceof RegisterTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.RegisterTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new RegisterTransaction({
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new RegisterTransaction(testObject);
    expect(result instanceof RegisterTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new RegisterTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new RegisterTransaction();
    expect(tx.exclusiveData).toEqual({
      assetType: 0,
      name: "",
      amount: new Fixed8(0),
      precision: 0,
      owner: "",
      admin: "",
    });
  });

  test("serializeExclusive", () => {
    const tx = new RegisterTransaction();
    expect(tx.serializeExclusive()).toEqual("000000000000000000000002");
  });
});

describe("export", () => {
  const expected = {
    type: 0x40,
    version: 0,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    assetType: 0,
    name: "",
    amount: 0,
    precision: 0,
    owner: "",
    admin: "",
  } as Partial<TransactionLike>;

  const registerTx = new RegisterTransaction(expected);
  const result = registerTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x40,
    version: 0,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    type: 0x40,
    version: 0,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
    assetType: 0,
    name: "abc",
    amount: new Fixed8(0),
    precision: 0,
    owner: "ab",
    admin: "ab",
  };
  const registerTx1 = new RegisterTransaction(obj1);
  const registerTx2 = new RegisterTransaction(obj2);

  test.each([
    ["Register1 === Register1", registerTx1, registerTx1, true],
    ["Register1 !== Register2", registerTx1, registerTx2, false],
    ["Register1 === Obj1", registerTx1, obj1, true],
    ["Register1 !== Obj2", registerTx1, obj2, false],
  ])("%s", (msg: string, a: RegisterTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<RegisterTransactionLike>
  ) => {
    let tx: RegisterTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof RegisterTransaction).toBeTruthy();
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
