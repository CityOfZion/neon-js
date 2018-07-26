import OpCode from "../../src/sc/opCode";
import ScriptBuilder from "../../src/sc/ScriptBuilder";


describe("constructor", () => {
  test("empty", () => {
    const result = new ScriptBuilder();

    expect(result instanceof ScriptBuilder).toBeTruthy();
  });
});

describe("emit", () => {
  test("single OpCode", () => {
    const sb = new ScriptBuilder();
    sb.emit(OpCode.PUSH1);
    expect(sb.str).toBe("51");
  });

  test("OpCode with args", () => {
    const sb = new ScriptBuilder();
    sb.emit(16 as OpCode, "0102");
    expect(sb.str).toBe("100102");
  });

  test("returns this", () => {
    const sb = new ScriptBuilder();
    const result = sb.emit(1 as OpCode);
    expect(result).toBe(sb);
  });
});

describe.only("emitAppCall", () => {
  test.each([
    [
      "simple emitAppCall",
      {
        scriptHash: "dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f",
        operation: "name",
        args: [],
        useTailCall: false
      },
      "00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc"
    ],
    [
      "simple emitAppCall with null args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "symbol",
        args: null,
        useTailCall: false
      },
      "000673796d626f6c6711c4d1f4fba619f2628870d36e3a9773e874705b"
    ],
    [
      "simple emitAppCall with false args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "decimals",
        args: false,
        useTailCall: false
      },
      "0008646563696d616c736711c4d1f4fba619f2628870d36e3a9773e874705b"
    ],
    [
      "emitAppCall with args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "balanceOf",
        args: [
          "5fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b"
        ],
        useTailCall: false
      },
      "205fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b"
    ],
    [
      "emitAppCall with number arg",
      {
        scriptHash: "db81b3d1e546a958e60c8ce33c766165100c04b7",
        operation: null,
        args: 7,
        useTailCall: false
      },
      "5767b7040c106561763ce38c0ce658a946e5d1b381db"
    ],
    [
      "emitAppCall with ContractParam args in array",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537"
          }
        ],
        useTailCall: false
      },
      "143775292229eccdf904f16fff8e83e7cffdc0f0ce51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b"
    ],
    [
      "emitAppCall with pure ContractParam args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "balanceOf",
        args: {
          type: "Array",
          value: [
            {
              type: "Hash160",
              value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537"
            }
          ]
        },
        useTailCall: false
      },
      "143775292229eccdf904f16fff8e83e7cffdc0f0ce51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b"
    ]
  ])("%s", (msg: string, data: any, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitAppCall(
      data.scriptHash,
      data.operation,
      data.args,
      data.useTailCall
    );
    expect(sb.str).toBe(expected);
  });
});

describe("emitSysCall", () => {});

describe("emitPush", () => {
  test.each([
    ["short string", "a".repeat(75 * 2), "4b" + "a".repeat(75 * 2)],
    ["string", "a".repeat(0xff * 2), "4c" + "ff" + "a".repeat(0xff * 2)],
    [
      "med string",
      "a".repeat(0xffff * 2),
      "4d" + "ffff" + "a".repeat(0xffff * 2)
    ],
    [
      "med string",
      "a".repeat(0x1234 * 2),
      "4d" + "3412" + "a".repeat(0x1234 * 2)
    ],
    [
      "long string",
      "a".repeat(0x00010000 * 2),
      "4e" + "00000100" + "a".repeat(0x00010000 * 2)
    ],
    ["-1", -1, "4f"],
    ["0", 0, "00"],
    ["13", 13, (0x50 + 13).toString(16)],
    ["500", 500, "08f401000000000000"],
    ["65536", 65536, "080000010000000000"],
    ["true", true, "51"],
    ["false", false, "00"]
  ])("%s", (msg: string, data: any, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitPush(data);
    expect(sb.str).toBe(expected);
  });
});
