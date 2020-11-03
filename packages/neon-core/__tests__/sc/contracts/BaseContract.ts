import {
  ContractMethodDefinition,
  ContractParam,
  ContractParamType,
} from "../../../src/sc";
import { BaseContract } from "../../../src/sc/contracts/BaseContract";

const scriptHash = "";

describe("call", () => {
  test("no args", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "customMethod",
      }),
    ]);

    const result = contract.call("customMethod");

    expect(result).toEqual({
      scriptHash,
      operation: "customMethod",
      args: [],
    });
  });

  test("method with single bool arg", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "boolMethod",
        parameters: [{ name: "arg1", type: ContractParamType.Boolean }],
      }),
    ]);

    const result = contract.call("boolMethod", false);

    expect(result).toEqual({
      scriptHash,
      operation: "boolMethod",
      args: [ContractParam.boolean(false)],
    });
  });

  test("method throws when insufficient arguments", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "boolMethod",
        parameters: [{ name: "arg1", type: ContractParamType.Boolean }],
      }),
    ]);

    expect(() => contract.call("boolMethod")).toThrow(
      "Invalid number of parameters"
    );
  });

  test("method throws when method is not found", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "boolMethod",
        parameters: [{ name: "arg1", type: ContractParamType.Boolean }],
      }),
    ]);

    expect(() => contract.call("notexists")).toThrow();
  });

  test("method throws when incompatible type", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "intMethod",
        parameters: [{ name: "arg1", type: ContractParamType.Integer }],
      }),
    ]);

    expect(() => contract.call("intMethod", false)).toThrow("not convertable");
  });

  test("accepts hash160 in place of bytearray", () => {
    const contract = new BaseContract(scriptHash, [
      new ContractMethodDefinition({
        name: "byteArrayMethod",
        parameters: [{ name: "arg1", type: ContractParamType.ByteArray }],
      }),
    ]);

    const result = contract.call("byteArrayMethod", {
      type: "Hash160",
      value: "abcd".repeat(10),
    });

    expect(result).toEqual({
      scriptHash,
      operation: "byteArrayMethod",
      args: [ContractParam.hash160("abcd".repeat(10))],
    });
  });
});
