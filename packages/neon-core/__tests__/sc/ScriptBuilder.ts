import ContractParam from "../../src/sc/ContractParam";
import OpCode from "../../src/sc/OpCode";
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

describe("emitAppCall", () => {
  test.each([
    [
      "simple emitAppCall",
      {
        scriptHash: "dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f",
        operation: "name",
        args: [],
        useTailCall: false,
      },
      "00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc",
    ],
    [
      "simple emitAppCall with null args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "symbol",
        args: null,
        useTailCall: false,
      },
      "000673796d626f6c6711c4d1f4fba619f2628870d36e3a9773e874705b",
    ],
    [
      "simple emitAppCall with false args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "decimals",
        args: false,
        useTailCall: false,
      },
      "0008646563696d616c736711c4d1f4fba619f2628870d36e3a9773e874705b",
    ],
    [
      "emitAppCall with args",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "balanceOf",
        args: [
          "5fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b",
        ],
        useTailCall: false,
      },
      "205fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b",
    ],
    [
      "emitAppCall with number arg",
      {
        scriptHash: "db81b3d1e546a958e60c8ce33c766165100c04b7",
        operation: null,
        args: 7,
        useTailCall: false,
      },
      "5767b7040c106561763ce38c0ce658a946e5d1b381db",
    ],
    [
      "emitAppCall with ContractParam args in array",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
        operation: "balanceOf",
        args: [
          {
            type: "Hash160",
            value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
          },
        ],
        useTailCall: false,
      },
      "143775292229eccdf904f16fff8e83e7cffdc0f0ce51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b",
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
              value: "cef0c0fdcfe7838eff6ff104f9cdec2922297537",
            },
          ],
        },
        useTailCall: false,
      },
      "143775292229eccdf904f16fff8e83e7cffdc0f0ce51c10962616c616e63654f666711c4d1f4fba619f2628870d36e3a9773e874705b",
    ],
    [
      "emitAppCall with only scriptHash",
      {
        scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
      },
      "6711c4d1f4fba619f2628870d36e3a9773e874705b",
    ],
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

const veryBigNumber =
  "179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137215";
const veryBigNumberBytes =
  "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00";

const verySmallNumber =
  "-179769313486231590772930519078902473361797697894230657273430081157732675805500963132708477322407536021120113879871393357658789768814416622492847430639474124377767893424865485276302219601246094119453082952085005768838150682342462881473913110540827237163350510684586298239947245938479716304835356329624224137216";
const verySmallNumberBytes =
  "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff";
describe("emitPush", () => {
  test.each([
    ["short string", "a".repeat(75 * 2), "4b" + "a".repeat(75 * 2)],
    ["string", "a".repeat(0xff * 2), "4c" + "ff" + "a".repeat(0xff * 2)],
    [
      "med string",
      "a".repeat(0xffff * 2),
      "4d" + "ffff" + "a".repeat(0xffff * 2),
    ],
    [
      "med string",
      "a".repeat(0x1234 * 2),
      "4d" + "3412" + "a".repeat(0x1234 * 2),
    ],
    [
      "long string",
      "a".repeat(0x00010000 * 2),
      "4e" + "00000100" + "a".repeat(0x00010000 * 2),
    ],
    ["-1", -1, "4f"],
    ["0", 0, "00"],
    ["13", 13, (0x50 + 13).toString(16)],
    ["500", 500, "02f401"],
    ["65536", 65536, "03000001"],
    ["true", true, "51"],
    ["false", false, "00"],
    [
      "ContractParam(integer) 1",
      ContractParam.integer(1),
      (0x50 + 1).toString(16),
    ],
    ["ContractParam(integer) 256", ContractParam.integer(256), "020001"],
    [
      "ContractParam(integer) 14256661",
      ContractParam.integer(14256661),
      "04158ad900",
    ],
    [
      "ContractParam(integer) veryBigNumber",
      ContractParam.integer(veryBigNumber),
      OpCode.PUSHDATA1.toString(16) +
        (veryBigNumberBytes.length / 2).toString(16) +
        veryBigNumberBytes,
    ],
    ["ContractParam(integer) -1", ContractParam.integer(-1), "4f"],
    ["ContractParam(integer) -12345", ContractParam.integer(-12345), "02c7cf"],
    [
      "ContractParam(integer) verySmallNumber",
      ContractParam.integer(verySmallNumber),
      OpCode.PUSHDATA1.toString(16) +
        (verySmallNumberBytes.length / 2).toString(16) +
        verySmallNumberBytes,
    ],
  ])("%s", (msg: string, data: any, expected: string) => {
    const sb = new ScriptBuilder();
    sb.emitPush(data);
    expect(sb.str).toBe(expected);
  });
});

describe("toScriptParams", () => {
  test("NEP5 token transfer scripts", () => {
    const rawScript =
      "0400e1f50514d0d6076f6953a895b0c23a21c9cd342a974554d714961d3ef7448228f7e1bbe14b99e031cc7f8d7e8453c1087472616e73666572679ffc47dd7f4678024f01aea820a262e76653b13ff10400c2eb0b1476dada428b7bbc938ac82a8ea94802f74f121a46145ed9efbac2a1e0f24a90d49a775e7b1165812d4e53c1087472616e73666572679ffc47dd7f4678024f01aea820a262e76653b13ff10400a3e111148b5b7e57f83c84bbba0375ac5c2297cdb095eeb2145ed9efbac2a1e0f24a90d49a775e7b1165812d4e53c1087472616e73666572679ffc47dd7f4678024f01aea820a262e76653b13ff1040084d71714961d3ef7448228f7e1bbe14b99e031cc7f8d7e84145ed9efbac2a1e0f24a90d49a775e7b1165812d4e53c1087472616e73666572679ffc47dd7f4678024f01aea820a262e76653b13ff166205b697264ebe483";
    const scriptIntents = new ScriptBuilder(rawScript).toScriptParams();
    expect(scriptIntents.length).toEqual(4);
  });
});
