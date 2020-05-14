import { Transaction, TransactionLike, TransactionType } from "../../../src/tx";
import EnrollmentTransaction, {
  EnrollmentTransactionLike,
} from "../../../src/tx/transaction/EnrollmentTransaction";

import { BaseTransaction } from "../../../src/tx/transaction/BaseTransaction";
import samples from "./enrollmentTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new EnrollmentTransaction();

    expect(result).toBeInstanceOf(EnrollmentTransaction);
    expect(result).toBeInstanceOf(BaseTransaction);
    expect(result.type).toBe(TransactionType.EnrollmentTransaction);
  });

  test("TransactionLike", () => {
    const testObject = {
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    } as Partial<TransactionLike>;

    const result = new EnrollmentTransaction(testObject);
    expect(result instanceof EnrollmentTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.EnrollmentTransaction);
    expect(result.version).toBe(testObject.version);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
  });

  test("Transaction", () => {
    const testObject = new EnrollmentTransaction({
      version: 0,
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
    });

    const result = new EnrollmentTransaction(testObject);
    expect(result instanceof EnrollmentTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new EnrollmentTransaction();
    expect(tx.fees).toBe(1000);
  });

  test("exclusiveData", () => {
    const tx = new EnrollmentTransaction();
    expect(tx.exclusiveData).toEqual({ publicKey: "" });
  });

  test("serializeExclusive", () => {
    const tx = new EnrollmentTransaction();
    expect(tx.serializeExclusive()).toEqual("00");
  });
});

describe("export", () => {
  const expected = {
    type: 0x20,
    version: 0,
    publicKey: "key",
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  } as Partial<TransactionLike>;

  const enrollmentTx = new EnrollmentTransaction(expected);
  const result = enrollmentTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x20,
    version: 0,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
  };

  const obj2 = {
    version: 0,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
  };
  const enrollment1 = new EnrollmentTransaction(obj1);
  const enrollment2 = new EnrollmentTransaction(obj2);

  test.each([
    ["Enrollemnt1 === Enrollemnt1", enrollment1, enrollment1, true],
    ["Enrollemnt1 !== Enrollemnt2", enrollment1, enrollment2, false],
    ["Enrollemnt1 === Obj1", enrollment1, obj1, true],
    ["Enrollemnt1 !== Obj2", enrollment1, obj2, false],
  ])("%s", (msg: string, a: EnrollmentTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<EnrollmentTransactionLike>
  ) => {
    let tx: EnrollmentTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof EnrollmentTransaction).toBeTruthy();
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
