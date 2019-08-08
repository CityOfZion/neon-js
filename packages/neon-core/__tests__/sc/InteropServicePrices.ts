import { getInteropSericePrice, InteropService } from "../../src/sc";

describe("getInteropSericePrice", () => {
  test("Fixed Price Service", () => {
    expect(
      getInteropSericePrice(
        InteropService.SYSTEM_EXECUTIONENGINE_GETSCRIPTCONTAINER
      )
    ).toBe(250e-8);
  });

  test("Native Contract Method", () => {
    expect(
      getInteropSericePrice(
        InteropService.NEO_NATIVE_TOKENS_NEO,
        undefined,
        "balanceOf"
      )
    ).toBe(1000000e-8);
  });

  test("Storage Realted Service", () => {
    expect(getInteropSericePrice(InteropService.SYSTEM_STORAGE_PUT, 5)).toBe(
      5 * 100000e-8
    );
  });
});
