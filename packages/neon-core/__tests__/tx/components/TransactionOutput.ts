import TransactionOutput, {
  TransactionOutputLike,
} from "../../../src/tx/components/TransactionOutput";

describe("constructor", () => {
  test("empty", () => {
    const f = (): TransactionOutput =>
      new TransactionOutput({} as TransactionOutputLike);
    expect(f).toThrow(
      "TransactionOutput requires assetId, value and scriptHash fields"
    );
  });

  test("TransactionOutputLike", () => {
    const testObject = {
      assetId: "1234",
      value: 1,
      scriptHash: "abcd",
    } as TransactionOutputLike;

    const result = new TransactionOutput(testObject);
    expect(result instanceof TransactionOutput).toBeTruthy();
    expect(result.assetId).toEqual(testObject.assetId);
    expect(result.value.toNumber()).toEqual(testObject.value);
    expect(result.scriptHash).toEqual(testObject.scriptHash);
  });

  test("TransactionOutput", () => {
    const testObject = new TransactionOutput({
      assetId: "1234",
      value: 1,
      scriptHash: "abcd",
    });

    const result = new TransactionOutput(testObject);
    expect(result instanceof TransactionOutput).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to TransactionOutputLike", () => {
    const expected = {
      assetId: "1234",
      value: 1,
      scriptHash: "abcd",
    };

    const txAttr = new TransactionOutput(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    assetId: "1234",
    value: 1,
    scriptHash: "abcd",
  };
  const obj2 = {
    assetId: "4321",
    value: 2,
    scriptHash: "dcba",
  };
  const output1 = new TransactionOutput(obj1);
  const output2 = new TransactionOutput(obj2);

  test.each([
    ["Output1 === Output1", output1, output1, true],
    ["Output1 !== Output2", output1, output2, false],
    ["Output1 === Obj1", output1, obj1, true],
    ["Output1 !== Obj2", output1, obj2, false],
  ])("%s", (msg: string, a: TransactionOutput, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Basic Output",
    {
      assetId:
        "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
      value: 1,
      scriptHash: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
    },
    "9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc500e1f505000000003775292229eccdf904f16fff8e83e7cffdc0f0ce",
  ],
  [
    "Large Output",
    {
      assetId:
        "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
      value: 4714,
      scriptHash: "5df31f6f59e6a4fbdd75103786bf73db1000b235",
    },
    "9b7cffdaa674beae0f930ebe6085af9093e5fe56b34a5c220ccdcf6efc336fc5002aa1c16d00000035b20010db73bf86371075ddfba4e6596f1ff35d",
  ],
];

describe("serialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, data: TransactionOutputLike, expected: string) => {
      const result = new TransactionOutput(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, expected: TransactionOutputLike, data: string) => {
      const result = TransactionOutput.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});
