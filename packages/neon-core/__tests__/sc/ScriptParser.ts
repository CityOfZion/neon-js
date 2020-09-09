import { ScriptParser, ScriptIntent } from "../../src/sc";

const testCases = [
  [
    "simple emitAppCall",
    "00c1046e616d65145f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc68627d5b52",
    {
      scriptHash: "dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f",
      operation: "name",
      args: [],
    },
  ],
  [
    "emitAppCall with args",
    "205fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b51c10962616c616e63654f661411c4d1f4fba619f2628870d36e3a9773e874705b68627d5b52",
    {
      scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
      operation: "balanceOf",
      args: [
        "5fe459481de7b82f0636542ffe5445072f9357a1261515d6d3173c07c762743b",
      ],
    },
  ],
  [
    "emitAppCall with nested arrays as args",
    "0474657374045468697302341252c1026973045468697353c1045468697353c10962616c616e63654f661411c4d1f4fba619f2628870d36e3a9773e874705b68627d5b52",
    {
      scriptHash: "5b7074e873973a6ed3708862f219a6fbf4d1c411",
      operation: "balanceOf",
      args: [
        "54686973",
        ["54686973", "6973", ["3412", "54686973"]],
        "74657374",
      ],
    },
  ],
];

describe("toScriptParams", () => {
  test.each(testCases as [string, string, ScriptIntent][])(
    "%s",
    (msg: string, data: string, expected: ScriptIntent) => {
      const sr = new ScriptParser(data);
      const intents = sr.toScriptParams();
      expect(intents[0]).toStrictEqual(expected);
    }
  );
});