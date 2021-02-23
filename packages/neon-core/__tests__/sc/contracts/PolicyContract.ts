import { PolicyContract } from "../../../src/sc";
import { CallFlags } from "../../../lib/sc";

const contract = PolicyContract.INSTANCE;
const scriptHash = "79bcd398505eb779df6e67e4be6c14cded08e2f2";

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "79bcd398505eb779df6e67e4be6c14cded08e2f2"
  );
});

describe("default methods", () => {
  test("getFeePerByte", () => {
    const result = contract.getFeePerByte();

    expect(result).toEqual({
      scriptHash,
      callFlags: CallFlags.All,
      operation: "getFeePerByte",
      args: [],
    });
  });

  test("getExecFeeFactor", () => {
    const result = contract.getExecFeeFactor();

    expect(result).toEqual({
      scriptHash,
      callFlags: CallFlags.All,
      operation: "getExecFeeFactor",
      args: [],
    });
  });
});
