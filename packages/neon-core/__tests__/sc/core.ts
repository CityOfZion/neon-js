import { mocked } from "ts-jest/utils";
import { createScript, generateDeployScript } from "../../src/sc/core";
import _ScriptBuilder from "../../src/sc/ScriptBuilder";
import * as _u from "../../src/u";
import testIntents from "./scriptIntents.json";
import { Fixed8 } from "../../src/u";
import { InteropServiceCode } from "../../src/sc";

jest.mock("../../src/sc/ScriptBuilder");
jest.mock("../../src/u");

const ScriptBuilder = mocked(_ScriptBuilder, true);
const u = mocked(_u, false);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createScript", () => {
  test("single ScriptIntent", () => {
    const intent = testIntents[1].scriptIntent;
    const result = createScript(intent);
    expect(ScriptBuilder).toHaveBeenCalledTimes(1);
    const sb = ScriptBuilder.mock.instances[0];
    expect(sb.emitAppCall).toBeCalledWith(
      intent.scriptHash,
      intent.operation,
      intent.args
    );
  });

  test("hexstring", () => {
    const script = "00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc";
    ScriptBuilder.mockImplementationOnce(() => {
      return {
        str: "",
        fee: new Fixed8(0),
        exportAsScriptResult: () => {
          return {
            hex: script,
            fee: new Fixed8(0)
          };
        }
      };
    });
    const result = createScript(script);
    expect(result).toBe(script);
  });

  test("multiple ScriptIntents", () => {
    const expected = jest.fn();
    const mockEmitCall = jest.fn();
    ScriptBuilder.mockImplementationOnce(() => {
      return {
        str: expected,
        emitAppCall: mockEmitCall,
        emitGasCall: mockEmitCall,
        emitNeoCall: mockEmitCall,
        emitPolicyCall: mockEmitCall
      };
    });
    const intents = [
      testIntents[1].scriptIntent,
      testIntents[2].scriptIntent,
      testIntents[3].scriptIntent,
      testIntents[4].scriptIntent,
      testIntents[5].scriptIntent
    ];
    const result = createScript(...intents);
    expect(result).toBe(expected);
    expect(mockEmitCall.mock.calls).toEqual(
      intents.map(i => [i.scriptHash, i.operation, i.args])
    );
  });
});

describe("generateDeployScript", () => {
  let order: any = [];

  beforeEach(() => {
    order = [];
    const mock = {
      emitPush: jest.fn().mockImplementation(i => {
        order.push(i);
        return mock;
      }),
      emitSysCall: jest.fn().mockImplementation(i => {
        order.push(i);
        return mock;
      })
    };
    ScriptBuilder.mockImplementationOnce(() => {
      return mock;
    });
    u.str2hexstring.mockImplementation(i => i);
  });

  test("full params", () => {
    const params = {
      manifest: jest.fn(),
      script: jest.fn(),
      name: jest.fn(),
      version: jest.fn(),
      author: jest.fn(),
      email: jest.fn(),
      description: jest.fn(),
      needsStorage: jest.fn(),
      returnType: jest.fn(),
      parameterList: jest.fn()
    } as any;

    const result = generateDeployScript(params);
    expect(u.str2hexstring.mock.calls).toEqual([
      [params.description],
      [params.email],
      [params.author],
      [params.version],
      [params.name]
    ]);
    expect(order).toEqual([
      params.description,
      params.email,
      params.author,
      params.version,
      params.name,
      params.needsStorage,
      params.returnType,
      params.parameterList,
      params.manifest,
      params.script,
      InteropServiceCode.NEO_CONTRACT_CREATE
    ]);
  });

  test("defaults", () => {
    const params = {
      manifest: jest.fn(),
      script: jest.fn(),
      name: jest.fn(),
      version: jest.fn(),
      author: jest.fn(),
      email: jest.fn(),
      description: jest.fn(),
      parameterList: jest.fn()
    } as any;

    const result = generateDeployScript(params);
    expect(u.str2hexstring.mock.calls).toEqual([
      [params.description],
      [params.email],
      [params.author],
      [params.version],
      [params.name]
    ]);
    expect(order).toEqual([
      params.description,
      params.email,
      params.author,
      params.version,
      params.name,
      false,
      "ff00",
      params.parameterList,
      params.manifest,
      params.script,
      InteropServiceCode.NEO_CONTRACT_CREATE
    ]);
  });
});
