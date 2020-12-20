import { PolicyContract } from "../../../src/sc";

const contract = PolicyContract.INSTANCE;
const scriptHash = "dde31084c0fdbebc7f5ed5f53a38905305ccee14";

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "dde31084c0fdbebc7f5ed5f53a38905305ccee14"
  );
});

describe("default methods", () => {
  test("getFeePerByte", () => {
    const result = contract.getFeePerByte();

    expect(result).toEqual({
      scriptHash,
      operation: "getFeePerByte",
      args: [],
    });
  });

  test("getExecFeeFactor", () => {
    const result = contract.getExecFeeFactor();

    expect(result).toEqual({
      scriptHash,
      operation: "getExecFeeFactor",
      args: [],
    });
  });
});
