import * as convert from "../../src/u/convert";

describe.each([
  ["", ""],
  [
    "abcdefghijklmnopqrstuwwxyz",
    "6162636465666768696a6b6c6d6e6f707172737475777778797a",
  ],
  ["1234567890", "31323334353637383930"],
  [
    "!@#$%^&*()-_=+,./;'[]<>?:\"{}",
    "21402324255e262a28292d5f3d2b2c2e2f3b275b5d3c3e3f3a227b7d",
  ],
])("(%s)ASCII <-> HEX(%s)", (ascii: string, hex: string) => {
  test("ASCII -> HEX", () => {
    const result = convert.str2hexstring(ascii);
    expect(result).toBe(hex);
  });

  test("HEX -> ASCII", () => {
    const result = convert.hexstring2str(hex);
    expect(result).toBe(ascii);
  });
});

describe.each([
  ["0000000000000000", 0],
  ["00e1f50500000000", 1],
  ["0100000000000000", 0.00000001],
  ["0080c6a47e8d0300", 10000000],
  ["5004fb711f010000", 12345.6789],
])("(%s)Fixed8 <-> Number(%d)", (fixed8: string, num: number) => {
  test("Fixed8 -> NUM", () => {
    const result = convert.fixed82num(fixed8);
    expect(result).toBe(num);
  });

  test("NUM -> Fixed8", () => {
    const result = convert.num2fixed8(num);
    expect(result).toBe(fixed8);
  });
});

describe.each([
  [[], ""],
  [[84, 101, 115, 116], "Test"],
  [Uint8Array.from([84, 101, 115, 116]), "Test"],
])("ArrayBuffer <-> ASCII", (ab: ArrayLike<number>, ascii: string) => {
  test("AB -> ASCII", () => {
    const result = convert.ab2str(ab);
    expect(result).toBe(ascii);
  });

  test("ASCII -> AB", () => {
    const result = convert.str2ab(ascii);
    expect(new Uint8Array(result)).toEqual(Uint8Array.from(ab));
  });
});

test("str2ab: throw if input is non-string", () => {
  expect(() => convert.str2ab(1 as any)).toThrow();
});

describe.each([
  [[], ""],
  [[84, 101, 115, 116], "54657374"],
  [Uint8Array.from([84, 101, 115, 116]), "54657374"],
])("ArrayBuffer <-> HEX", (ab: ArrayLike<number>, hex: string) => {
  test("AB -> HEX", () => {
    const result = convert.ab2hexstring(ab);
    expect(result).toBe(hex);
  });

  test("HEX -> AB", () => {
    const result = convert.hexstring2ab(hex);
    expect(new Uint8Array(result)).toEqual(Uint8Array.from(ab));
  });
});

describe("num2hexstring", () => {
  test("throw if negative", () => {
    expect(() => convert.num2hexstring(-1)).toThrow();
  });

  test("throw if non-integer", () => {
    expect(() => convert.num2hexstring(0.1)).toThrow();
  });

  test("throw if non-integer size", () => {
    expect(() => convert.num2hexstring(1, 0.1)).toThrow();
  });

  test("throw if unsafe", () => {
    expect(() => convert.num2hexstring(Number.MAX_SAFE_INTEGER + 1)).toThrow();
  });

  describe.each([
    [1, "01", 1, "uint8"],
    [0xff, "ff", 1, "uint8(max)"],
    [0xff, "00ff", 2, "uint16"],
    [0xffff, "ffff", 2, "uint16(max)"],
    [0x010000, "00010000", 4, "uint32"],
    [0xffffffff, "ffffffff", 4, "uint32(max)"],
    [0x0100000000, "0000000100000000", 8, "uint64"],
    [Number.MAX_SAFE_INTEGER, "001fffffffffffff", 8, "uint64(max)"],
  ])(
    "(%d)INT -> HEX(%s)",
    (num: number, hex: string, size: number, msg: string) => {
      test(`${msg}(BE) `, () => {
        const result = convert.num2hexstring(num, size);
        expect(result).toBe(hex);
      });

      test(`${msg}(LE) `, () => {
        const result = convert.num2hexstring(num, size, true);
        const reversedHex = hex
          .match(/.{1,2}/g)
          .reverse()
          .join("");
        expect(result).toBe(reversedHex);
      });
    }
  );
});

describe.each([
  [1, "01", "uint8"],
  [0xff, "fdff00", "uint8(max)"],
  [0x0100, "fd0001", "uint16"],
  [0xffff, "fdffff", "uint16(max)"],
  [0x010000, "fe00000100", "uint32"],
  [0xffffffff, "feffffffff", "uint32(max)"],
  [0x0100000000, "ff0000000001000000", "uint64"],
  [Number.MAX_SAFE_INTEGER, "ffffffffffffff1f00", "uint64(max)"],
])("(%d)INT -> VARINT(%s)", (num: number, varint: string, msg: string) => {
  test(msg, () => {
    const result = convert.num2VarInt(num);
    expect(result).toBe(varint);
  });
});
