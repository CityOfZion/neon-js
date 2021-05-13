import TransactionAttribute, {
  TransactionAttributeLike,
} from "../../../src/tx/components/TransactionAttribute";

describe("constructor", () => {
  test("empty", () => {
    const f = (): TransactionAttribute =>
      new TransactionAttribute({} as TransactionAttributeLike);
    expect(f).toThrow("TransactionAttribute requires usage and data fields");
  });

  test("TransactionAttributeLike (int usage)", () => {
    const testObject = {
      usage: 240,
      data: "test",
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(testObject.usage);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (str usage)", () => {
    const testObject = {
      usage: "Remark",
      data: "test",
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(240);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttribute", () => {
    const testObject = new TransactionAttribute({
      usage: 240,
      data: "test",
    });

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to TransactionAttributeLike", () => {
    const expected = {
      usage: 240,
      data: "test",
    };

    const txAttr = new TransactionAttribute(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    usage: 240,
    data: "obj1",
  };
  const obj2 = {
    usage: 241,
    data: "obj2",
  };
  const attr1 = new TransactionAttribute(obj1);
  const attr2 = new TransactionAttribute(obj2);

  test.each([
    ["Attr1 === Attr1", attr1, attr1, true],
    ["Attr1 !== Attr2", attr1, attr2, false],
    ["Attr1 === Obj1", attr1, obj1, true],
    ["Attr1 !== Obj2", attr1, obj2, false],
  ])("%s", (msg: string, a: TransactionAttribute, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Remark",
    {
      usage: parseInt("f0", 16),
      // This is a remark
      data: "5468697320697320612072656d61726b",
    },
    "f0105468697320697320612072656d61726b",
  ],
];

describe("serialize", () => {
  test("errors if data too big", () => {
    const result = new TransactionAttribute({
      usage: 0,
      data: "0".repeat(999999),
    });

    expect(result.serialize).toThrow();
  });

  test.each(dataSet)(
    "%s",
    (msg: string, data: TransactionAttributeLike, expected: string) => {
      const result = new TransactionAttribute(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (msg: string, expected: TransactionAttributeLike, data: string) => {
      const result = TransactionAttribute.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});
