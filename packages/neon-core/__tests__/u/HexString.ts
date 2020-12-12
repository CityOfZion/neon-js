import { HexString } from "../../src/u/HexString";

describe("Initiator", () => {
  describe("fromHex", () => {
    test("default endian param", () => {
      const hex = HexString.fromHex("0xa4c2");
      expect(hex.toBigEndian()).toBe("a4c2");
    });

    test("param littleEndian is true", () => {
      const hex = HexString.fromHex("0xa4c2", true);
      expect(hex.toBigEndian()).toBe("c2a4");
    });

    test("non-hex string", () => {
      const initHexWithNonHex = (): HexString => HexString.fromHex("h69j");
      expect(initHexWithNonHex).toThrowError();
    });
  });

  test("fromAscii", () => {
    const hex = HexString.fromAscii("test");
    expect(hex.toBigEndian()).toBe("74657374");
  });

  describe("fromNumber", () => {
    test("default endian param", () => {
      const hex = HexString.fromNumber(9999);
      expect(hex.toBigEndian()).toBe("270f");
    });

    test("0 as param", () => {
      const hex = HexString.fromNumber(0);
      expect(hex.toBigEndian()).toBe("00");
    });

    test("negative as param", () => {
      const initWithNegativeNum = (): HexString => HexString.fromNumber(-9999);
      expect(initWithNegativeNum).toThrowError();
    });
  });

  describe("fromArrayBuffer", () => {
    test("default endian param", () => {
      const hex = HexString.fromArrayBuffer([12, 45, 34, 89]);
      expect(hex.toBigEndian()).toBe("0c2d2259");
    });

    test("param littleEndian is true", () => {
      const hex = HexString.fromArrayBuffer([12, 45, 34, 89], true);
      expect(hex.toBigEndian()).toBe("59222d0c");
    });
  });

  describe("fromBase64", () => {
    test("default", () => {
      const hex = HexString.fromBase64("bmVv");
      expect(hex.toBigEndian()).toBe("6e656f");
      expect(hex.toAscii()).toBe("neo");
    });

    test("little endian", () => {
      const hex = HexString.fromBase64("bmVv", true);
      expect(hex.toBigEndian()).toBe("6f656e");
      expect(hex.toAscii()).toBe("oen");
    });
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

  describe("toNumber", () => {
    test("export as default big endian", () => {
      const hex = HexString.fromHex("0110");
      expect(hex.toNumber()).toBe(0x0110);
    });

    test("export as little endian", () => {
      const hex = HexString.fromHex("0110");
      expect(hex.toNumber(true)).toBe(0x1001);
    });
  });

  test("toAscii", () => {
    const hex = HexString.fromHex("a4c2");
    expect(hex.toAscii()).toBe("¤Â");
  });

  describe("toArrayBuffer", () => {
    test("export as default big endian", () => {
      const hex = HexString.fromHex("a4c2");
      const arr = hex.toArrayBuffer();
      expect(arr[0]).toBe(164);
      expect(arr[1]).toBe(194);
    });

    test("export as little endian", () => {
      const hex = HexString.fromHex("a4c2");
      const arr = hex.toArrayBuffer(true);
      expect(arr[0]).toBe(194);
      expect(arr[1]).toBe(164);
    });
  });

  describe("toBase64", () => {
    test("default", () => {
      const hex = HexString.fromAscii("neo");
      const b64 = hex.toBase64();
      expect(b64).toBe("bmVv");
    });

    test("little endian", () => {
      const hex = HexString.fromAscii("oen");
      const b64 = hex.toBase64(true);
      expect(b64).toBe("bmVv");
    });
  });
});

describe("math operation", () => {
  test("xor", () => {
    const hex = HexString.fromHex("a4"); // 10100100
    const hex2 = HexString.fromHex("5f"); // 01011111
    expect(hex.xor(hex2).toBigEndian()).toBe("fb"); // 11111011
  });

  test("equals", () => {
    const hex = HexString.fromHex("a4c2");
    const hex2 = HexString.fromAscii("¤Â");
    expect(hex.equals(hex2)).toBeTruthy();
  });
});
