import { PolicyContract } from "../../../src/sc";

const contract = PolicyContract.INSTANCE;
const scriptHash = "ce06595079cd69583126dbfd1d2e25cca74cffe9";

test("scriptHash", () => {
  expect(contract.scriptHash).toEqual(
    "ce06595079cd69583126dbfd1d2e25cca74cffe9"
  );
});

describe("default methods", () => {
  test("name", () => {
    const result = contract.name();

    expect(result).toEqual({
      scriptHash,
      operation: "name",
      args: [],
    });
  });

  test("getFeePerByte", () => {
    const result = contract.getFeePerByte();

    expect(result).toEqual({
      scriptHash,
      operation: "getFeePerByte",
      args: [],
    });
  });
});
