import { HexString } from "../../src/basic/HexString";

describe("Static Constructor", () => {
  test("FromHexString, handle 0x prefix", () => {
    const hex = HexString.fromHexString("a4b1");
    const hex2 = HexString.fromHexString("0xa4b1");
    expect(hex.value).toBe("a4b1");
    expect(hex2.value).toBe("a4b1");
    expect(hex.isLittleEndian).toBeFalsy();
  });

  test("FromHexString, not hex param will throw", () => {
    const func = function() {
      HexString.fromHexString("HI");
    };
    expect(func).toThrowError();
  });

  test("FromASCIIString", () => {
    const hex = HexString.fromASCIIString("this is a test", true);
    expect(hex.isLittleEndian).toBeTruthy();
    expect(hex.value).toBe("7473657420612073692073696874");
  });

  test("FromNumber", () => {
    const hex = HexString.fromNumber(100);
    expect(hex.value).toBe("64");
    expect(hex.isLittleEndian).toBeFalsy();
  });
});
