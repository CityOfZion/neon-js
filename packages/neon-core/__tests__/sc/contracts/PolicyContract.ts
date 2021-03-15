import { PolicyContract, CallFlags } from "../../../src/sc";

const contract = PolicyContract.INSTANCE;
const scriptHash = "cc5e4edd9f5f8dba8bb65734541df7a1c081c67b";

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "cc5e4edd9f5f8dba8bb65734541df7a1c081c67b"
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
