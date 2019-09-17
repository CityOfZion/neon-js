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
      data: "2f75726c"
    } as TransactionAttributeLike;
    const f = () => new TransactionAttribute(testObject);
    expect(f).toThrow();
  });

  test("TransactionAttributeLike (int usage)", () => {
    const testObject = {
      usage: 129,
      data: "2f75726c"
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(testObject.usage);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (str usage)", () => {
    const testObject = {
      usage: "Url",
      data: "2f75726c"
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(129);
    expect(result.data).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (data not in hex)", () => {
    const testObject = {
      usage: 129,
      data: "test"
    };

    const result = function() {
      new TransactionAttribute(testObject);
    };
    expect(result).toThrow();
  });

  test("TransactionAttribute", () => {
    const testObject = new TransactionAttribute({
      usage: 129,
      data: "2f75726c"
    });

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result).toEqual(testObject);
  });

  test("Static Url", () => {
    const result = TransactionAttribute.Url("http://url");
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(129);
    expect(result.data).toEqual("687474703a2f2f75726c");
  });
});

describe("export", () => {
  test("export to TransactionAttributeLike", () => {
    const expected = {
      usage: 129,
      data: "2f75726c"
    };

    const txAttr = new TransactionAttribute(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    usage: 129,
    data: "2f75726c"
  };
  const obj2 = {
    usage: 129,
    data: "703a2f"
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
      data: "2f75726c"
    },
    "81042f75726c"
  ]
];

describe("serialize", () => {
  test("errors if data too big", () => {
    const result = new TransactionAttribute({
      usage: 129,
      data: "0".repeat(1000000)
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
