import { Policy } from "../../../src/sc";

describe("Policy Contract ABI", () => {
  const policy = new Policy();

  test("blockAccount", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = policy.blockAccount(addr);
    expect(result).toBe(
      "14e849739c4d7711fed5a4e27fa3d5ae950038d04951c10c626c6f636b4163636f756e7414778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("getBlockedAccounts", () => {
    const result = policy.getBlockedAccounts();
    expect(result).toBe(
      "00c112676574426c6f636b65644163636f756e747314778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("getFeePerByte", () => {
    const result = policy.getFeePerByte();
    expect(result).toBe(
      "00c10d6765744665655065724279746514778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("getMaxTransactionsPerBlock", () => {
    const result = policy.getMaxTransactionsPerBlock();
    expect(result).toBe(
      "00c11a6765744d61785472616e73616374696f6e73506572426c6f636b14778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("setFeePerByte", () => {
    const result = policy.setFeePerByte(1000);
    expect(result).toBe(
      "02e80351c10d7365744665655065724279746514778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("setMaxTransactionsPerBlock", () => {
    const result = policy.setMaxTransactionsPerBlock(10023);
    expect(result).toBe(
      "02272751c11a7365744d61785472616e73616374696f6e73506572426c6f636b14778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("unblockAccount", () => {
    const addr = "Acx6QWXVxsGPUvNqjS9zWY3SZCryq5R8bp";
    const result = policy.unblockAccount(addr);
    expect(result).toBe(
      "14e849739c4d7711fed5a4e27fa3d5ae950038d04951c10e756e626c6f636b4163636f756e7414778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });

  test("supportedStandards", () => {
    const result = policy.supportedStandards();
    expect(result).toBe(
      "00c112737570706f727465645374616e646172647314778bba6b68d2df455ddd60218e46bd60b299569c68627d5b52"
    );
  });
});
