import ContractParam, {
  ContractParamType,
  likeContractParam,
} from "../../src/sc/ContractParam";

describe("constructor", () => {
  test("ContractParamLike", () => {
    const result = new ContractParam({ type: "String", value: "1" });

    expect(result instanceof ContractParam).toBeTruthy();
    expect(result.type).toBe(ContractParamType.String);
    expect(result.value).toBe("1");
  });

  test("ContractParam", () => {
    const testObject = new ContractParam("Boolean", false);

    const result = new ContractParam(testObject);
    expect(result instanceof ContractParam).toBeTruthy();
    expect(result).not.toBe(testObject);
    expect(result.type).toBe(ContractParamType.Boolean);
    expect(result.value).toBe(false);
  });

  test("string type and normal value", () => {
    const result = new ContractParam("String", "test");

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
    ])("%s", (msg: string, data: any, expected: boolean) => {
      const result = ContractParam.boolean(data);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Boolean);
      expect(result.value).toBe(expected);
    });
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
    ])("%s", (msg: string, data: any, expected: boolean) => {
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
        "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW",
        "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
      ],
      [
        "scriphash",
        "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
        "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
      ],
    ])("%s", (msg: string, data: any, expected: boolean) => {
      const result = ContractParam.hash160(data);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.Hash160);
      expect(result.value).toBe(expected);
    });

    test("Errors on non-string", () => {
      const thrower = (): ContractParam => ContractParam.hash160(1 as any);
      expect(thrower).toThrow();
    });

    test("Errors on non-address or scripthash", () => {
      const thrower = (): ContractParam => ContractParam.hash160("1");
      expect(thrower).toThrow();
    });
  });

  describe("byteArray", () => {
    test.each([
      ["bytearray", ["010203"], "010203"],
      [
        "address",
        ["ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s", "address"],
        "35b20010db73bf86371075ddfba4e6596f1ff35d",
      ],
      ["fixed8", [100.012345678, "fixed8"], "88ba1e5402000000"],
      ["fixed8 (0 decimals)", [1, "fixed8", 0], "0100000000000000"],
      ["fixed8(4 decimals)", [222.1234, "fixed8", 4], "b2e4210000000000"],
    ])("%s", (msg: string, data: [number, string, any], expected: boolean) => {
      const result = ContractParam.byteArray(...data);

      expect(result instanceof ContractParam).toBeTruthy();
      expect(result.type).toBe(ContractParamType.ByteArray);
      expect(result.value).toBe(expected);
    });

    test("errors when exceeds allowed precision for fixed8", () => {
      const thrower = (): ContractParam => {
        ContractParam.byteArray(222.12345, "fixed8", 4);
      };
      expect(thrower).toThrow("wrong precision");
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
    ["ContractParam", new ContractParam("Integer", 1), true],
    ["empty", {}, false],
    ["wrong type", { type: "", value: 1 }, false],
    ["missing value", { type: "ByteArray" }, false],
  ])("%s", (msg: string, data: any, expected: boolean) => {
    const result = likeContractParam(data);
    expect(result).toBe(expected);
  });
});

describe("export", () => {
  test("exports properly", () => {
    const testObject = new ContractParam(ContractParamType.Integer, 1);
    const result = testObject.export();

    expect(result).toEqual({
      type: "Integer",
      value: 1,
    });
  });
});

describe("toString", () => {
  test("emits correct string", () => {
    const result = new ContractParam("Boolean", false).toString();
    expect(result).toBe("[object ContractParam:Boolean]");
  });
});
