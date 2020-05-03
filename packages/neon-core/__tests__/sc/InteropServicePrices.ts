import { getInteropServicePrice, InteropServiceCode } from "../../src/sc";

describe("getInteropServicePrice", () => {
  test("Fixed Price Service", () => {
    expect(
      getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_ECDSAVERIFY)
    ).toBe(1000000e-8);
  });

  test("Write Storage Service", () => {
    expect(
      getInteropServicePrice(InteropServiceCode.SYSTEM_STORAGE_PUT, { size: 5 })
    ).toBe(5 * 100000e-8);
  });
});
