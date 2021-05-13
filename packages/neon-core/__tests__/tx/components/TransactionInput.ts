import TransactionInput, {
  TransactionInputLike,
} from "../../../src/tx/components/TransactionInput";

describe("constructor", () => {
  test("empty", () => {
    const f = (): TransactionInput =>
      new TransactionInput({} as TransactionInputLike);
    expect(f).toThrow(
      "TransactionInput requires prevHash and prevIndex fields"
    );
  });

  test("TransactionInputLike", () => {
    const testObject = {
      prevHash: "1234",
      prevIndex: 1,
    } as TransactionInputLike;

    const result = new TransactionInput(testObject);
    expect(result instanceof TransactionInput).toBeTruthy();
    expect(result.prevHash).toEqual(testObject.prevHash);
    expect(result.prevIndex).toEqual(testObject.prevIndex);
  });

  test("TransactionInput", () => {
    const testObject = new TransactionInput({
      prevHash: "1234",
      prevIndex: 1,
    });

    const result = new TransactionInput(testObject);
    expect(result instanceof TransactionInput).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to TransactionInputLike", () => {
    const expected = {
      prevHash: "1234",
      prevIndex: 1,
    };

    const txAttr = new TransactionInput(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    prevHash: "1234",
    prevIndex: 1,
  };
  const obj2 = {
    prevHash: "5678",
    prevIndex: 2,
  };
  const input1 = new TransactionInput(obj1);
  const input2 = new TransactionInput(obj2);

  test.each([
    ["Input1 === Input1", input1, input1, true],
    ["Input1 !== Input2", input1, input2, false],
    ["Input1 === Obj1", input1, obj1, true],
    ["Input1 !== Obj2", input1, obj2, false],
  ])("%s", (msg: string, a: TransactionInput, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Basic Input",
    {
      prevHash:
        "22555bfe765497956f4194d40c0e8cf8068b97517799061e450ad2468db2a7c4",
      prevIndex: 1,
    },
    "c4a7b28d46d20a451e06997751978b06f88c0e0cd494416f95975476fe5b55220100",
  ],
];

describe("serialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, data: TransactionInputLike, expected: string) => {
      const result = new TransactionInput(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, expected: TransactionInputLike, data: string) => {
      const result = TransactionInput.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});
