import { remove0xPrefix, reverseHex } from "../../../src/u/basic/hex";

describe("reverseHex", () => {
  test("throws if not hexstring", () => {
    expect(() => reverseHex("fg")).toThrow();
  });

  test("Reverses hex", () => {
    const input = "000102030405060708090a0b0c0d0e0f";
    const result = reverseHex(input);
    expect(result).toBe("0f0e0d0c0b0a09080706050403020100");
  });

  test("Remove 0x prefix", () => {
    const input = "0x000102030405060708090a0b0c0d0e0f";
    const result = remove0xPrefix(input);
    expect(result).toBe("000102030405060708090a0b0c0d0e0f");
  });
});
