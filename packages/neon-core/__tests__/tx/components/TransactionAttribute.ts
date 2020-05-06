import {
  TransactionAttribute,
  TransactionAttributeLike,
  TransactionAttributeJson,
} from "../../../src/tx/components/TransactionAttribute";
import { TxAttrUsage } from "../../../src/tx/components/txAttrUsage";
import { HexString } from "../../../src/u";

describe("constructor", () => {
  test("empty", () => {
    expect(
      () => new TransactionAttribute({} as TransactionAttributeLike)
    ).toThrow("TransactionAttribute requires usage and data fields");
  });

  test("TransactionAttributeLike (wrong usage)", () => {
    const testObject = {
      usage: 240,
      data: "2f75726c",
    } as TransactionAttributeLike;
    expect(() => new TransactionAttribute(testObject)).toThrow();
  });

  test("TransactionAttributeLike (int usage)", () => {
    const testObject = {
      usage: 129,
      data: "2f75726c",
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(testObject.usage);
    expect(result.data.toBigEndian()).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (str usage)", () => {
    const testObject = {
      usage: "Url",
      data: "2f75726c",
    } as TransactionAttributeLike;

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(129);
    expect(result.data.toBigEndian()).toEqual(testObject.data);
  });

  test("TransactionAttributeLike (data not in hex)", () => {
    const testObject = {
      usage: 129,
      data: "test",
    };

    expect(() => new TransactionAttribute(testObject)).toThrow();
  });

  test("TransactionAttribute", () => {
    const testObject = new TransactionAttribute({
      usage: 129,
      data: "2f75726c",
    });

    const result = new TransactionAttribute(testObject);
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result).toEqual(testObject);
  });

  test("Static Url", () => {
    const result = TransactionAttribute.Url("http://url");
    expect(result instanceof TransactionAttribute).toBeTruthy();
    expect(result.usage).toEqual(129);
    expect(result.data.toBigEndian()).toEqual("687474703a2f2f75726c");
  });
});

describe("export", () => {
  test("export to TransactionAttributeLike", () => {
    const expected = {
      usage: 129,
      data: "2f75726c",
    };

    const txAttr = new TransactionAttribute(expected);
    const result = txAttr.export();
    expect(result).toEqual(expected);
  });
});

describe("equals", () => {
  const obj1 = {
    usage: 129,
    data: "2f75726c",
  };
  const obj2 = {
    usage: 129,
    data: "703a2f",
  };
  const attr1 = new TransactionAttribute(obj1);
  const attr2 = new TransactionAttribute(obj2);

  test.each([
    ["Attr1 === Attr1", attr1, attr1, true],
    ["Attr1 !== Attr2", attr1, attr2, false],
    ["Attr1 === Obj1", attr1, obj1, true],
    ["Attr1 !== Obj2", attr1, obj2, false],
  ])(
    "%s",
    (
      _msg: string,
      a: TransactionAttribute,
      b: TransactionAttributeLike,
      cond: boolean
    ) => {
      expect(a.equals(b)).toBe(cond);
    }
  );
});

const dataSet = [
  [
    "Cosigner",
    {
      usage: 129,
      data: "2f75726c",
    },
    "81042f75726c",
  ],
];

describe("serialize", () => {
  test("errors if data too big", () => {
    const result = new TransactionAttribute({
      usage: 129,
      data: "0".repeat(1000000),
    });

    expect(result.serialize).toThrow();
  });

  test.each(dataSet)(
    "%s",
    (_msg: string, data: TransactionAttributeLike, expected: string) => {
      const result = new TransactionAttribute(data);
      expect(result.serialize()).toBe(expected);
    }
  );
});

describe("deserialize", () => {
  test.each(dataSet)(
    "%s",
    (_msg: string, expected: TransactionAttributeLike, data: string) => {
      const result = TransactionAttribute.deserialize(data);
      expect(result.export()).toEqual(expected);
    }
  );
});

const jsonTestCases = [
  [
    "simple",
    {
      usage: "Url",
      data: "d3d3LmV4YW1wbGUuY29t", // www.example.com
    },
    new TransactionAttribute({
      usage: TxAttrUsage.Url,
      data: HexString.fromHex("7777772e6578616d706c652e636f6d", true),
    }),
  ],
];
describe("JSON", () => {
  test.each(jsonTestCases)(
    "fromJson %s",
    (
      _: string,
      json: TransactionAttributeJson,
      neonObj: TransactionAttribute
    ) => {
      const result = TransactionAttribute.fromJson(json);

      expect(result.usage).toBe(neonObj.usage);
      expect(result.data.toBigEndian()).toBe(neonObj.data.toBigEndian());
    }
  );

  test.each(jsonTestCases)(
    "toJson %s",
    (
      _: string,
      json: TransactionAttributeJson,
      neonObj: TransactionAttribute
    ) => {
      const result = neonObj.toJson();
      expect(result).toEqual(json);
    }
  );
});
