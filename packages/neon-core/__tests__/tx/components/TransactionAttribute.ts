import TransactionAttribute, {
  TransactionAttributeLike
} from "../../../src/tx/components/TransactionAttribute";
import { hexstring2str } from "../../../src/u";

describe("constructor", () => {
  test("empty", () => {
    const f = () => new TransactionAttribute({} as TransactionAttributeLike);
    expect(f).toThrow("TransactionAttribute requires usage and data fields");
  });

  test("TransactionAttributeLike (wrong usage)", () => {
    const testObject = {
      usage: 240,
      data: "test"
    } as TransactionAttributeLike;
    const f = () => new TransactionAttribute(testObject);
    expect(f).toThrow();
  });

  test("TransactionAttributeLike (int usage)", () => {
    const testObject = {
      usage: 129,
      data: "test"
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(testObject.usage);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (str usage)", () => {
    const testObject = {
      usage: "Url",
      data: "test"
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(129);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttribute", () => {
    const testObject = new TransactionAttribute({
      usage: 129,
      data: "test"
    });

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result).toEqual(testObject);
  });
});

describe("export", () => {
  test("export to TransactionAttributeLike", () => {
    const expected = {
      usage: 129,
      data: "test"
    };

    const txAttr = new TransactionAttribute(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    usage: 129,
    data: "obj1"
  };
  const obj2 = {
    usage: 129,
    data: "obj2"
  };
  const attr1 = new TransactionAttribute(obj1);
  const attr2 = new TransactionAttribute(obj2);

  test.each([
    ["Attr1 === Attr1", attr1, attr1, true],
    ["Attr1 !== Attr2", attr1, attr2, false],
    ["Attr1 === Obj1", attr1, obj1, true],
    ["Attr1 !== Obj2", attr1, obj2, false]
  ])("%s", (msg: string, a: TransactionAttribute, b: any, cond: boolean) => {
    expect(a.equals(b)).toBe(cond);
  });
});

const dataSet = [
  [
    "Cosigner",
    {
      usage: 129,
      data: "http://url"
    },
    "810a687474703a2f2f75726c"
  ]
];

describe("serialize", () => {
  test("errors if data too big", () => {
    const result = new TransactionAttribute({
      usage: 129,
      data: "0".repeat(999999)
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
      const exported = result.export();
      expect(exported.usage).toEqual(expected.usage);
      expect(hexstring2str(exported.data)).toBe(expected.data);
    }
  );
});
