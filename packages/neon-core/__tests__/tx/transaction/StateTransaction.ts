import { Transaction, TransactionType } from "../../../src/tx";
import StateTransaction, {
  StateTransactionLike,
} from "../../../src/tx/transaction/StateTransaction";
import samples from "./stateTx.json";

describe("constructor", () => {
  test("empty", () => {
    const result = new StateTransaction();

    expect(result instanceof StateTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.StateTransaction);
    expect(result.descriptors).toEqual([]);
  });

  test("TransactionLike", () => {
    const testObject = {
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      descriptors: [
        {
          type: 0x40,
          field: "Votes",
          key: "",
          value: "",
        },
      ],
    };

    const result = new StateTransaction(testObject);
    expect(result instanceof StateTransaction).toBeTruthy();
    expect(result.type).toBe(TransactionType.StateTransaction);
    expect(result.inputs.map((i) => i.export())).toEqual(testObject.inputs);
    expect(result.outputs.map((i) => i.export())).toEqual(testObject.outputs);
    expect(result.scripts.map((i) => i.export())).toEqual(testObject.scripts);
    expect(result.descriptors.map((i) => i.export())).toEqual(
      testObject.descriptors
    );
  });

  test("Transaction", () => {
    const testObject = new StateTransaction({
      inputs: [{ prevHash: "ab", prevIndex: 0 }],
      outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
      scripts: [{ invocationScript: "ab", verificationScript: "" }],
      descriptors: [
        {
          type: 0x40,
          field: "Votes",
          key: "",
          value: "",
        },
      ],
    });

    const result = new StateTransaction(testObject);
    expect(result instanceof StateTransaction).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.inputs[0]).not.toBe(testObject.inputs[0]);
    expect(result.outputs[0]).not.toBe(testObject.outputs[0]);
    expect(result.scripts[0]).not.toBe(testObject.scripts[0]);
    expect(result.descriptors[0]).not.toBe(testObject.descriptors[0]);
  });
});

describe("getters", () => {
  test("fees", () => {
    const tx = new StateTransaction();
    expect(tx.fees).toBe(0);
  });

  test("exclusiveData", () => {
    const tx = new StateTransaction();
    expect(tx.exclusiveData).toEqual({ descriptors: [] });
  });
});
describe("export", () => {
  const expected = {
    type: 0x90,
    version: 1,
    attributes: [],
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "id", value: 1, scriptHash: "hash" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    descriptors: [{ type: 0x40, value: "ab", field: "Votes", key: "ab" }],
  } as Partial<StateTransactionLike>;

  const stateTx = new StateTransaction(expected);
  const result = stateTx.export();
  expect(result).toEqual(expected);
});

describe("equals", () => {
  const obj1 = {
    type: 0x90,
    version: 0,
    inputs: [{ prevHash: "ab", prevIndex: 0 }],
    outputs: [{ assetId: "12", value: 1, scriptHash: "1234" }],
    scripts: [{ invocationScript: "ab", verificationScript: "" }],
    descriptors: [{ type: 0x40, value: "ab", field: "Votes", key: "ab" }],
  };

  const obj2 = {
    type: 0x90,
    version: 0,
    inputs: [{ prevHash: "12", prevIndex: 1 }],
    descriptors: [{ type: 0x48, value: "cd", field: "Votes", key: "cd" }],
  };
  const state1 = new StateTransaction(obj1);
  const state2 = new StateTransaction(obj2);

  test.each([
    ["State1 === State1", state1, state1, true],
    ["State1 !== State2", state1, state2, false],
    ["State1 === Obj1", state1, obj1, true],
    ["State1 !== Obj2", state1, obj2, false],
  ])("%s", (msg: string, a: StateTransaction, b: any, cond: boolean) => {
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
    deserialized: Partial<StateTransactionLike>
  ) => {
    let tx: StateTransaction;
    test("Deserialize properly", () => {
      tx = Transaction.deserialize(serialized);
      expect(tx instanceof StateTransaction).toBeTruthy();
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
