import { HexString } from "../../src/u/HexString";

describe("Initiator", () => {
  test("fromHex", () => {
    const hex = HexString.fromHex("0xa4c2", true);
    expect(hex.toLittleEndian()).toBe("a4c2");
    const initHexWithNonHex = function() {
      HexString.fromHex("h69j");
    };
    expect(initHexWithNonHex).toThrowError();
  });

  test("fromAscii", () => {
    const hex = HexString.fromAscii("test");
    expect(hex.toBigEndian()).toBe("74657374");
  });

  test("fromNumber", () => {
    const hex = HexString.fromNumber(1000);
    expect(hex.toBigEndian()).toBe("e8");
  });

  test("fromArrayBuffer", () => {
    const hex = HexString.fromArrayBuffer([12, 45, 34, 89]);
    expect(hex.toBigEndian()).toBe("0c2d2259");
  });
});

describe("Export methods", () => {
  test("toBigEndian", () => {
    const hex = HexString.fromHex("a4c2");
    expect(hex.toBigEndian()).toBe("a4c2");
  });

  test("toLittleEndian", () => {
    const hex = HexString.fromHex("a4c2");
    expect(hex.toLittleEndian()).toBe("c2a4");
  });

  test("toNumber", () => {
    const hex = HexString.fromHex("a4c2");
    expect(hex.toNumber()).toBe(42178);
  });

  test("toAscii", () => {
    const hex = HexString.fromHex("a4c2");
    expect(hex.toAscii()).toBe("¤Â");
  });

  test("toArrayBuffer", () => {
    const hex = HexString.fromHex("a4c2");
    const arr = hex.toArrayBuffer();
    expect(arr[0]).toBe(164);
    expect(arr[1]).toBe(194);
  });
});

describe("math operation", () => {
  test("xor", () => {
    const hex = HexString.fromHex("a4c2");
    const hex2 = HexString.fromHex("5f21");
    expect(hex.xor(hex2).toBigEndian()).toBe("fbe3");
  });

  test("equals", () => {
    const hex = HexString.fromHex("a4c2");
    const hex2 = HexString.fromAscii("¤Â");
    expect(hex.equals(hex2)).toBeTruthy();
  });
});
