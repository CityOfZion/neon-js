import { ContractParam } from "../../src/sc/ContractParam";
import { OpCode } from "../../src/sc/OpCode";
import { ScriptBuilder } from "../../src/sc/ScriptBuilder";
import { InteropServiceCode } from "../../src/sc";
import { HexString } from "../../src/u";
import { ContractCallJson } from "../../src/sc/types";

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
    const result = new ScriptBuilder().emit(OpCode.PUSHDATA1, "1234").build();
    expect(result).toBe("0c1234");
  });
});

describe("emit", () => {
  test("single OpCode", () => {
    const result = new ScriptBuilder().emit(OpCode.PUSH1).build();
    expect(result).toBe("11");
  });

  test("OpCode with args", () => {
    const result = new ScriptBuilder().emit(0x10 as OpCode, "0102").build();
    expect(result).toBe("100102");
  });
});

describe("emitSysCall", () => {
  test("emitSysCall with args", () => {
    const sb = new ScriptBuilder();
    const result = sb
      .emitSysCall(
        InteropServiceCode.SYSTEM_CRYPTO_CHECKMULTISIG,
        HexString.fromHex("a45f"),
        HexString.fromHex("2bc5")
      )
      .build();
    expect(result).toBe("0c02c52b0c025fa4419ed0dc3a");
  });
});

describe("emitContractCall", () => {
  test.each([
    [
      "simple emitAppCall",
      {
        scriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
        operation: "name",
        args: [],
      },
      "c21f0c046e616d650c14897720d8cd76f4f00abfa37c0edd889c208fde9b41627d5b52",
    ],
    [
      "emitAppCall with args",
      {
        scriptHash: "de5f57d430d3dece511cf975a8d37848cb9e0525",
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: "4120c7c8443dd30af91a8280d151fd38d1b9be91",
          },
        ],
      },
      "0c1491beb9d138fd51d180821af90ad33d44c8c7204111c01f0c0962616c616e63654f660c1425059ecb4878d3a875f91c51ceded330d4575fde41627d5b52",
    ],
  ] as [string, ContractCallJson, string][])(
    "%s",
    (_msg: string, data: ContractCallJson, expected: string) => {
      const result = new ScriptBuilder().emitContractCall(data).build();
      expect(result).toBe(expected);
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
      (0x10 + 1).toString(16),
    ],
    ["ContractParam(integer) 256", ContractParam.integer(256), "010001"],
    [
      "ContractParam(integer) 14256661",
      ContractParam.integer(14256661),
      "02158ad900",
    ],
    ["ContractParam(integer) -1", ContractParam.integer(-1), "0f"],
    ["ContractParam(integer) -12345", ContractParam.integer(-12345), "01c7cf"],
  ] as [string, ContractParam | string | boolean | number, string][])(
    "%s",
    (
      _msg: string,
      data: ContractParam | string | number | boolean,
      expected: string
    ) => {
      const result = new ScriptBuilder().emitPush(data).build();
      expect(result).toBe(expected);
    }
  );
});

describe("emitBoolean", () => {
  test.each([
    ["true", true, "11"],
    ["false", false, "10"],
  ])("%s", (_msg: string, data: boolean, expected: string) => {
    const result = new ScriptBuilder().emitBoolean(data).build();
    expect(result).toBe(expected);
  });
});

describe("emitString", () => {
  test.each([
    ["null", "", "0c00"],
    [
      "simple string",
      "simple string",
      "0c" + "0d" + "73696d706c6520737472696e67",
    ],
    ["12345", "12345", "0c053132333435"],
    ["256 byte string", "a".repeat(0x100), "0d" + "0001" + "61".repeat(0x100)],
    [
      "65536 byte string",
      "a".repeat(0x10000),
      "0e" + "00000100" + "61".repeat(0x10000),
    ],
  ])("%s", (_msg: string, data: string, expected: string) => {
    const result = new ScriptBuilder().emitString(data).build();
    // Check initial slice to fail early and print less
    expect(result.substr(0, 10)).toBe(expected.substr(0, 10));
    expect(result).toBe(expected);
  });

  // Difficult to test throw when string too large due to string buffer smaller than limit
});

describe("emitHexString", () => {
  test.each([
    ["null", "", "0c00"],
    ["string input", "0102030405", "0c050102030405"],
    ["string input", HexString.fromHex("0102030405", true), "0c050102030405"],
    ["string input", HexString.fromHex("0102030405", false), "0c050504030201"],
  ])("%s", (_msg: string, data: string | HexString, expected: string) => {
    const result = new ScriptBuilder().emitHexString(data).build();
    // Check initial slice to fail early and print less
    expect(result.substr(0, 10)).toBe(expected.substr(0, 10));
    expect(result).toBe(expected);
  });
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
    ["ulong max", "18446744073709551615", "04ffffffffffffffff0000000000000000"],
  ])("%s", (_msg: string, data: number | string, expected: string) => {
    const result = new ScriptBuilder().emitNumber(data).build();
    expect(result).toBe(expected);
  });
});

describe("emitContractParam", () => {
  test.each([
    [
      "ContractParam(integer) 1",
      ContractParam.integer(1),
      (0x10 + 1).toString(16),
    ],
    ["ContractParam(integer) 256", ContractParam.integer(256), "010001"],
    [
      "ContractParam(byteArray)",
      ContractParam.byteArray(
        HexString.fromHex("5461c33e9bbc7de7076754540ba9e62b255ea9fc")
      ),
      "0c14fca95e252be6a90b54546707e77dbc9b3ec36154",
    ],
    [
      "ContractParam(hash160)",
      ContractParam.hash160("5461c33e9bbc7de7076754540ba9e62b255ea9fc"),
      "0c14fca95e252be6a90b54546707e77dbc9b3ec36154",
    ],
    [
      "ContractParam(string)",
      ContractParam.string("hello world"),
      "0c0b68656c6c6f20776f726c64",
    ],
  ])("%s", (_msg: string, data: ContractParam, expected: string) => {
    const result = new ScriptBuilder().emitContractParam(data).build();
    expect(result).toBe(expected);
  });
});

describe("null_any_param", () => {
  const builder = new ScriptBuilder();
  builder.emitContractCall({
    scriptHash: "d2a4cff31913016155e38e474a2c06d08be276cf",
    operation: "transfer",
    args: [
      {
        type: "Hash160",
        value: "f898fec9055cc080f46ed38f2a7430b9b245a5a8",
      },
      {
        type: "Hash160",
        value: "f898fec9055cc080f46ed38f2a7430b9b245a5a8",
      },
      {
        type: "Integer",
        value: "1000",
      },
      {
        type: "Any",
        value: null,
      },
    ],
  });
  expect(builder.build()).toBeTruthy();
});
