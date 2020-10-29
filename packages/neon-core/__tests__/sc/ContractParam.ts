import {
  ContractParam,
  ContractParamLike,
  ContractParamType,
  likeContractParam,
} from "../../src/sc/ContractParam";
import { HexString } from "../../src/u";

describe("constructor", () => {
  test("ContractParamLike", () => {
    const result = new ContractParam({ type: "String", value: "1" });

    expect(result instanceof ContractParam).toBeTruthy();
    expect(result.type).toBe(ContractParamType.String);
    expect(result.value).toBe("1");
  });

  test("ContractParam", () => {
    const testObject = new ContractParam({ type: "Boolean", value: false });

    const result = new ContractParam(testObject);
    expect(result instanceof ContractParam).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.type).toBe(ContractParamType.Boolean);
    expect(result.value).toBe(false);
  });

  test("string type and normal value", () => {
    const result = new ContractParam({ type: "String", value: "test" });

    expect(result instanceof ContractParam).toBeTruthy();
    expect(result.type).toBe(ContractParamType.String);
    expect(result.value).toBe("test");
  });
});

describe("Static constructors", () => {
  test("string", () => {
    const result = ContractParam.string("test");

    expect(result instanceof ContractParam).toBeTruthy();
    expect(result.type).toBe(ContractParamType.String);
    expect(result.value).toBe("test");
  });

  describe("boolean", () => {
    test.each([
      ["true", true, true],
      ["false", false, false],
      ["0", 0, false],
      ["0(string)", "0", true],
    ])(
      "%s",
      (msg: string, data: string | boolean | number, expected: boolean) => {
        const result = ContractParam.boolean(data);

        expect(result instanceof ContractParam).toBeTruthy();
        expect(result.type).toBe(ContractParamType.Boolean);
        expect(result.value).toBe(expected);
      }
    );
  });

  describe("integer", () => {
    test.each([
      ["10", 10, "10"],
      ["10(string)", "10", "10"],
      ["1.01", 1.01, "1"],
      [
        "very big number",
        "179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137215",
        "179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137215",
      ],
    ])("%s", (_msg: string, data: string | number, expected: string) => {
      const result = ContractParam.integer(data);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Integer);
      expect(result.value).toBe(expected);
    });
  });

  describe("hash160", () => {
    test.each([
      [
        "address",
        "NQ9NEvVrutLL6JDtUMKMrkEG6QpWNxgNBM",
        "8ed27229893fc531b1d27a115c8c820bd927692e",
      ],
      [
        "scriphash",
        "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
        "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
      ],
    ])("%s", (_msg: string, data: string, expected: unknown) => {
      const result = ContractParam.hash160(data);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Hash160);
      expect(result.value).toBeInstanceOf(HexString);
      const hexStringValue = result.value as HexString;
      expect(hexStringValue.toBigEndian()).toBe(expected);
    });

    test("errors when not 20 bytes", () => {
      expect(() => ContractParam.hash160(HexString.fromHex("12"))).toThrow(
        "expected 20 bytes"
      );
    });
  });

  describe("hash256", () => {
    test("hexstring", () => {
      const expected = "abcd".repeat(16);
      const result = ContractParam.hash256(expected);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Hash256);
      expect(result.value).toBeInstanceOf(HexString);
      const hexStringValue = result.value as HexString;
      expect(hexStringValue.toBigEndian()).toBe(expected);
    });

    test("HexString class", () => {
      const expected = HexString.fromHex("1234".repeat(16));
      const result = ContractParam.hash256(expected);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Hash256);
      expect(result.value).toBeInstanceOf(HexString);
      const hexStringValue = result.value as HexString;
      expect(hexStringValue.equals(expected)).toBeTruthy();
    });

    test("errors when not 32 bytes", () => {
      expect(() => ContractParam.hash256(HexString.fromHex("12"))).toThrow(
        "expected 32 bytes"
      );
    });
  });

  describe("byteArray", () => {
    test("%s", () => {
      const result = ContractParam.byteArray("1234");

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.ByteArray);
      expect(result.value).toBeInstanceOf(HexString);
      const hexStringValue = result.value as HexString;
      expect(hexStringValue.toBigEndian()).toEqual("1234");
    });
  });

  describe("array", () => {
    test("contain other ContractParams", () => {
      const c1 = ContractParam.string("first");
      const c2 = ContractParam.integer(2);

      const result = ContractParam.array(c1, c2);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Array);
      expect(result.value).toEqual([c1, c2]);
    });
  });

  describe("publicKey", () => {
    test("valid key", () => {
      const result = ContractParam.publicKey(
        "026d3ca98c83dd2490a134ba4f874b59292afaac8abc2f9b34b690fcd2b44648ee"
      );

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.PublicKey);
      expect(result.value).toBeInstanceOf(HexString);
      const hexStringValue = result.value as HexString;
      expect(hexStringValue.toBigEndian()).toBe(
        "026d3ca98c83dd2490a134ba4f874b59292afaac8abc2f9b34b690fcd2b44648ee"
      );
    });

    test("invalid key", () => {
      expect(() => ContractParam.publicKey("")).toThrow(
        "expected valid public key"
      );
    });
  });
});

describe("likeContractParam", () => {
  test.each([
    [
      "basic JS object",
      {
        type: "String",
        value: "1",
      },
      true,
    ],
    [
      "another JS object",
      {
        type: "Hash160",
        value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
      },
      true,
    ],
    [
      "embedded Array",
      {
        type: "Array",
        value: [
          {
            type: "Hash160",
            value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
          },
        ],
      },
      true,
    ],
    ["ContractParam", ContractParam.integer(1), true],
    ["empty", {}, false],
    ["wrong type", { type: "", value: 1 }, false],
    ["missing value", { type: "ByteArray" }, false],
  ])(
    "%s",
    (msg: string, data: Partial<ContractParamLike>, expected: boolean) => {
      const result = likeContractParam(data);
      expect(result).toBe(expected);
    }
  );
});

describe("toJson", () => {
  test("integer", () => {
    const testObject = ContractParam.integer(1);
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "Integer",
      value: "1",
    });
  });

  test("boolean", () => {
    const testObject = ContractParam.boolean(true);
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "Boolean",
      value: true,
    });
  });

  test("string", () => {
    const testObject = ContractParam.string("utf8 string");
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "String",
      value: "utf8 string",
    });
  });

  test("hash160", () => {
    const testObject = ContractParam.hash160("abcd".repeat(10));
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "Hash160",
      value: "abcd".repeat(10),
    });
  });

  test("hash256", () => {
    const testObject = ContractParam.hash256("abcd".repeat(16));
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "Hash256",
      value: "abcd".repeat(16),
    });
  });

  test("publicKey", () => {
    const testObject = ContractParam.publicKey(
      "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef"
    );
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "PublicKey",
      value:
        "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
    });
  });

  test("byteArray", () => {
    const testObject = ContractParam.byteArray("1234abcd");
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "ByteArray",
      value: "1234abcd",
    });
  });

  test("array", () => {
    const testObject = ContractParam.array(
      ContractParam.integer(999),
      ContractParam.boolean(false),
      ContractParam.string("hello world")
    );
    const result = testObject.toJson();

    expect(result).toEqual({
      type: "Array",
      value: [
        {
          type: "Integer",
          value: "999",
        },
        { type: "Boolean", value: false },
        { type: "String", value: "hello world" },
      ],
    });
  });
});

describe("toString", () => {
  test("emits correct string", () => {
    const result = new ContractParam({
      type: "Boolean",
      value: false,
    }).toString();
    expect(result).toBe("[object ContractParam:Boolean]");
  });
});

describe("equals", () => {
  const obj1 = {
    type: "String",
    value: "1234",
  };

  const obj2 = {
    type: "Array",
    value: [
      {
        type: "Array",
        value: [
          {
            type: "Hash160",
            value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
          },
        ],
      },
    ],
  };

  const obj3 = {
    type: "Void",
  };

  const param1 = ContractParam.fromJson(obj1);
  const param2 = ContractParam.fromJson(obj2);
  const param3 = ContractParam.fromJson(obj3);

  test.each([
    ["Param1 === Param1", param1, param1, true],
    ["Param1 !== Param2", param1, param2, false],
    ["Param1 === Obj1", param1, obj1, true],
    ["Param1 !== Obj2", param1, obj2, false],
    ["Param2 === Obj2", param2, obj2, true],
    ["Param3 === Obj3", param3, obj3, true],
  ] as [string, ContractParam, ContractParamLike, boolean][])(
    "%s",
    (
      _msg: string,
      a: ContractParam,
      b: ContractParamLike,
      expected: boolean
    ) => {
      expect(a.equals(b)).toEqual(expected);
    }
  );
});
