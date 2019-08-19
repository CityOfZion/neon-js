import { getInteropServicePrice, InteropServiceCode } from "../../src/sc";

describe("getInteropSericePrice", () => {
  test("Fixed Price Service", () => {
    expect(
      getInteropServicePrice(
        InteropServiceCode.SYSTEM_EXECUTIONENGINE_GETSCRIPTCONTAINER
      )
    ).toBe(250e-8);
  });

  test("Native Contract Method", () => {
    expect(
      getInteropServicePrice(
        InteropServiceCode.NEO_NATIVE_TOKENS_NEO,
        undefined,
        "balanceOf"
      )
    ).toBe(1000000e-8);
  });

  test("Storage Realted Service", () => {
    expect(
      getInteropServicePrice(InteropServiceCode.SYSTEM_STORAGE_PUT, 5)
    ).toBe(5 * 100000e-8);
  });
});
