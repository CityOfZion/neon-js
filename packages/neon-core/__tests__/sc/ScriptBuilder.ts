import ContractParam from "../../src/sc/ContractParam";
import OpCode from "../../src/sc/OpCode";
import ScriptBuilder, { ScriptIntent } from "../../src/sc/ScriptBuilder";
import { InteropServiceCode } from "../../src/sc";
import { HexString } from "../../src/u";

describe("constructor", () => {
  test("empty", () => {
    const result = new ScriptBuilder();

    expect(result instanceof ScriptBuilder).toBeTruthy();
  });

  test("init", () => {
    const result = new ScriptBuilder("Init");
    expect(result.str).toBe("Init");
  });
});

describe("build", () => {
  test("returns script", () => {
    const sb = new ScriptBuilder();
    sb.emit(OpCode.PUSHDATA1, "1234");
    expect(sb.build()).toBe("0c1234");
  });

  test("is copy", () => {
    const sb = new ScriptBuilder();
    const result = sb.emit(OpCode.PUSHDATA1, "1234").build();
    sb.emit(OpCode.PUSHDATA2);
    expect(result).toBe("0c1234");
  });
});

describe("emit", () => {
  test("single OpCode", () => {
    const sb = new ScriptBuilder();
    sb.emit(OpCode.PUSH1);
    expect(sb.build()).toBe("11");
  });

  test("OpCode with args", () => {
    const sb = new ScriptBuilder();
    sb.emit(0x10 as OpCode, "0102");
    expect(sb.build()).toBe("100102");
  });
});

describe("emitSysCall", () => {
  test("emitSysCall with args", () => {
    const sb = new ScriptBuilder();
    const result = sb.emitSysCall(
      InteropServiceCode.SYSTEM_CONTRACT_CREATE,
      HexString.fromHex("a45f"),
      HexString.fromHex("2bc5")
    ).str;
    expect(result).toBe("0c02c52b0c025fa441ce352c85");
  });
});

describe("emitAppCall", () => {
  test.each([
    [
      "simple emitAppCall",
      {
        scriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
        operation: "name",
        args: []
      },
      "c20c046e616d650c14897720d8cd76f4f00abfa37c0edd889c208fde9b41627d5b52"
    ],
    [
      "emitAppCall with args",
      {
        scriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: "a7213b15cc18d19c810f644e37411d882ee561ca"
          }
        ]
      },
      "0c14ca61e52e881d41374e640f819cd118cc153b21a711c00c0962616c616e63654f660c14897720d8cd76f4f00abfa37c0edd889c208fde9b41627d5b52"
    ]
  ] as [string, ScriptIntent, string][])(
    "%s",
    (_msg: string, data: ScriptIntent, expected: string) => {
      const sb = new ScriptBuilder();
      sb.emitAppCall(data.scriptHash, data.operation, data.args);
      expect(sb.str).toBe(expected);
    }
  );
});

describe("emitPush", () => {
  test.each([
    ["short string", "a".repeat(5), "0c05" + "61".repeat(5)],
    ["true", true, "11"],
    ["false", false, "10"],
    [
      "ContractParam(integer) 1",
      ContractParam.integer(1),
      (0x10 + 1).toString(16)
    ],
    ["ContractParam(integer) 256", ContractParam.integer(256), "010001"],
    [
      "ContractParam(integer) 14256661",
      ContractParam.integer(14256661),
      "02158ad900"
    ],
    ["ContractParam(integer) -1", ContractParam.integer(-1), "0f"],
    ["ContractParam(integer) -12345", ContractParam.integer(-12345), "01c7cf"]
  ] as [string, ContractParam | string | boolean | number, string][])(
    "%s",
    (
      _msg: string,
      data: ContractParam | string | number | boolean,
      expected: string
    ) => {
      const sb = new ScriptBuilder();
      sb.emitPush(data);
      expect(sb.str).toBe(expected);
    }
  );
});

describe("emitBoolean", () => {
  test.each([
    ["true", true, "11"],
    ["false", false, "10"]
  ])("%s", (_msg: string, data: boolean, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitBoolean(data);
    expect(sb.build()).toBe(expected);
  });
});

describe("emitString", () => {
  test.each([
    ["null", "", "0c00"],
    [
      "simple string",
      "simple string",
      "0c" + "0d" + "73696d706c6520737472696e67"
    ],
    ["256 byte string", "a".repeat(0x100), "0d" + "0001" + "61".repeat(0x100)],
    [
      "65536 byte string",
      "a".repeat(0x10000),
      "0e" + "00000100" + "61".repeat(0x10000)
    ]
  ])("%s", (_msg: string, data: string, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitString(data);
    // Check initial slice to fail early and print less
    expect(sb.build().substr(0, 10)).toBe(expected.substr(0, 10));
    expect(sb.build()).toBe(expected);
  });

  // Difficult to test throw when string too large due to string buffer smaller than limit
});

describe("emitNumber", () => {
  test.each([
    ["-1", -1, "0f"],
    ["0", 0, "10"],
    ["13", 13, (0x10 + 13).toString(16)],
    ["500", 500, "01f401"],
    ["sbyte min", -128, "0080"],
    ["sbyte max", 127, "007f"],
    ["byte", 255, "01ff00"],
    ["short min", -32768, "010080"],
    ["short max", 32767, "01ff7f"],
    ["ushort max", 65535, "02ffff0000"],
    ["int min", -2147483648, "0200000080"],
    ["int max", 2147483647, "02ffffff7f"],
    ["uint max", 4294967295, "03ffffffff00000000"],
    ["long min", "-9223372036854775808", "030000000000000080"],
    ["long max", "9223372036854775807", "03ffffffffffffff7f"],
    ["ulong max", "18446744073709551615", "04ffffffffffffffff0000000000000000"]
  ])("%s", (_msg: string, data: number | string, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitNumber(data);
    expect(sb.build()).toBe(expected);
  });
});

describe("emitContractParam", () => {
  test.each([
    [
      "ContractParam(integer) 1",
      ContractParam.integer(1),
      (0x10 + 1).toString(16)
    ],
    ["ContractParam(integer) 256", ContractParam.integer(256), "010001"]
  ])("%s", (_msg: string, data: ContractParam, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitContractParam(data);
    expect(sb.build()).toBe(expected);
  });
});
