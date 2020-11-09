import { BigInteger } from "../../src/u";

describe("twos complement", () => {
  test.each([
    [0, "00"],
    [-1, "ff"],
    [1, "01"],
    [127, "7f"],
    [128, "0080"],
    [-128, "80"],
    [-2, "fffe"],
    [255, "00ff"],
    [1024, "0400"],
    [32767, "7fff"],
    [-32768, "8000"],
    [-3, "fffffd"],
    [8388607, "7fffff"],
    [-8388608, "800000"],
    [-4, "fffffffc"],
    ["2147483647", "7fffffff"],
    ["-2147483648", "80000000"],
    [-5, "fffffffffffffffffffffffffffffffb"],
    [-6, "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa"],
    ["123456789123456789123456789123456789", "17c6e3c032f89045ad746684045f15"],
    [
      "-11111111111111111111111111111111111111111111111111111111111111111111111111111",
      "e76f557f41c7aefdf7c8fe5d6f8f99074260d5d748e898e38e38e38e38e38e39",
    ],
    [
      "9999999999999999999999999999999999999999999999999999999999999999999999999999",
      "161bcca7119915b50764b4abe86529797775a5f171950fffffffffffffffffff",
    ],
  ])("fromTwos: %s <- %s", (n: number | string, s: string) => {
    const result = BigInteger.fromTwos(s);
    expect(result.toString()).toBe(n.toString());
  });

  test.each([
    ["0000000000000000", "0"],
    ["00e1f50500000000", "100000000"],
    ["0100000000000000", "1"],
    ["0080c6a47e8d0300", "1000000000000000"],
    ["5004fb711f010000", "1234567890000"],
    ["ffffffffffffffff", "-1"],
    ["31e28e7915000000", "92233720369"],
  ])("Fixed8: %s -> %s", (n: string, s: string) => {
    const result = BigInteger.fromTwos(n, true);
    expect(result.toString()).toBe(s);
  });

  test.each([
    [0, "00"],
    [-1, "ff"],
    [1, "01"],
    [127, "7f"],
    [128, "0080"],
    [-128, "80"],
    [-2, "fe"],
    [255, "00ff"],
    [1024, "0400"],
    [32767, "7fff"],
    [-32768, "8000"],
    [-3, "fd"],
    [8388607, "7fffff"],
    [-8388608, "800000"],
    [-4, "fc"],
    ["2147483647", "7fffffff"],
    ["-2147483648", "80000000"],
    ["123456789123456789123456789123456789", "17c6e3c032f89045ad746684045f15"],
    [
      "-11111111111111111111111111111111111111111111111111111111111111111111111111111",
      "e76f557f41c7aefdf7c8fe5d6f8f99074260d5d748e898e38e38e38e38e38e39",
    ],
    [
      "9999999999999999999999999999999999999999999999999999999999999999999999999999",
      "161bcca7119915b50764b4abe86529797775a5f171950fffffffffffffffffff",
    ],
  ])("toTwos: %s -> %s", (n: number | string, s: string) => {
    const result = BigInteger.fromNumber(n).toTwos();
    expect(result).toBe(s);
  });
});

describe("hexstring", () => {
  test.each([
    ["00", "0"],
    ["01", "1"],
    ["ff", "255"],
    ["ffff", "65535"],
  ])("fromHex: %s -> %s", (hexstr: string, num: string) => {
    const result = BigInteger.fromHex(hexstr);
    expect(result.toString()).toBe(num);
  });

  test.each([
    ["00", "0"],
    ["01", "1"],
    ["ff", "255"],
    ["ffff", "65535"],
  ])("toHex: %s <- %s", (hexstr: string, num: string) => {
    const result = BigInteger.fromNumber(num);
    expect(result.toHex()).toBe(hexstr);
  });
});

describe("number", () => {
  describe("fromNumber", () => {
    test("throws when non-integer number", () => {
      expect(() => BigInteger.fromNumber(1.1)).toThrowError(
        "BigInteger only accepts integers"
      );
    });

    test("throws when non-integer numeric string", () => {
      expect(() => BigInteger.fromNumber("1.1")).toThrowError(
        "BigInteger only accepts integers"
      );
    });

    test("accepts larger than safe number", () => {
      const result = BigInteger.fromNumber(9007199254740992);

      expect(result.toString()).toBe("9007199254740992");
    });

    test("accepts smaller than safe number", () => {
      const result = BigInteger.fromNumber(-9007199254740992);

      expect(result.toString()).toBe("-9007199254740992");
    });
  });
});

describe("decimals", () => {
  describe("fromDecimal", () => {
    test.each([
      [1234.5678, 8, "123456780000"],
      [1234.5678, 4, "12345678"],
      [0, 0, "0"],
      [0, 50, "0"],
      [-1, 3, "-1000"],
      [-0.00001, 5, "-1"],
    ])(
      "BigInteger.fromDecimal(%s,%s) = %s",
      (
        decimalNumber: number | string,
        decimalPlaces: number,
        expected: string
      ) => {
        const result = BigInteger.fromDecimal(decimalNumber, decimalPlaces);

        expect(result.toString()).toBe(expected);
      }
    );

    test("throws if provided number has more decimals than provides places", () => {
      expect(() => BigInteger.fromDecimal(0.123456789, 8)).toThrow();
    });
  });

  describe("toDecimal", () => {
    test.each([
      [1, 0, "1"],
      [0, 4, "0.0000"],
      [100000, 5, "1.00000"],
      [12345678, 4, "1234.5678"],
      [1, 8, "0.00000001"],
      [-1, 8, "-0.00000001"],
      [-12345678, 3, "-12345.678"],
    ])(
      "%s",
      (input: string | number, decimalPlaces: number, expected: string) => {
        const result = BigInteger.fromNumber(input).toDecimal(decimalPlaces);

        expect(result).toBe(expected);
      }
    );
  });
});

describe("math", () => {
  test.each([
    [0, 0, "0"],
    [0, 1, "1"],
    [-256, 256, "0"],
    ["999999999999999", 1, "1000000000000000"],
  ])(
    "BI + int: %s + %s = %s",
    (base: string | number, other: number, expected: string) => {
      const result = BigInteger.fromNumber(base).add(other);

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 0, "0"],
    [0, 1, "1"],
    [-256, 256, "0"],
    ["123456789", "987654321", "1111111110"],
  ])(
    "BI + BI: %s + %s = %s",
    (base: string | number, other: number | string, expected: string) => {
      const result = BigInteger.fromNumber(base).add(
        BigInteger.fromNumber(other)
      );

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 0, "0"],
    [0, 1, "-1"],
    [-256, 256, "-512"],
    ["123456789", 987654321, "-864197532"],
  ])(
    "BI - int: %s - %s = %s",
    (base: string | number, other: number, expected: string) => {
      const result = BigInteger.fromNumber(base).sub(other);

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 0, "0"],
    [0, 1, "-1"],
    [-256, 256, "-512"],
    ["123456789", "987654321", "-864197532"],
  ])(
    "BI - BI: %s - %s = %s",
    (base: string | number, other: number | string, expected: string) => {
      const result = BigInteger.fromNumber(base).sub(
        BigInteger.fromNumber(other)
      );

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 0, "0"],
    [0, 1, "0"],
    [-256, 256, "-65536"],
    ["123456789", 987654321, "121932631112635269"],
  ])(
    "BI * int: %s * %s = %s",
    (base: string | number, other: number, expected: string) => {
      const result = BigInteger.fromNumber(base).mul(other);

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 0, "0"],
    [0, 1, "0"],
    [-256, 256, "-65536"],
    ["123456789", "987654321", "121932631112635269"],
  ])(
    "BI * BI: %s * %s = %s",
    (base: string | number, other: number | string, expected: string) => {
      const result = BigInteger.fromNumber(base).mul(
        BigInteger.fromNumber(other)
      );

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 1, "0"],
    [1, 1, "1"],
    [-256, 256, "-1"],
    [5, 3, "1"],
    ["123456789", 987654321, "0"],
  ])(
    "BI / int: %s / %s = %s",
    (base: string | number, other: number, expected: string) => {
      const result = BigInteger.fromNumber(base).div(other);

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 1, "0"],
    [1, 1, "1"],
    [-256, 256, "-1"],
    [5, 3, "1"],
    ["123456789", "987654321", "0"],
  ])(
    "BI / BI: %s / %s = %s",
    (base: string | number, other: number | string, expected: string) => {
      const result = BigInteger.fromNumber(base).div(
        BigInteger.fromNumber(other)
      );

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 1, "0"],
    [1, 1, "0"],
    [-256, 256, "0"],
    [5, 3, "2"],
    ["123456789", 987654321, "123456789"],
  ])(
    "BI % int: %s % %s = %s",
    (base: string | number, other: number, expected: string) => {
      const result = BigInteger.fromNumber(base).mod(other);

      expect(result.toString()).toEqual(expected);
    }
  );

  test.each([
    [0, 1, "0"],
    [1, 1, "0"],
    [-256, 256, "0"],
    [5, 3, "2"],
    ["123456789", "987654321", "123456789"],
  ])(
    "BI % BI: %s % %s = %s",
    (base: string | number, other: number | string, expected: string) => {
      const result = BigInteger.fromNumber(base).mod(
        BigInteger.fromNumber(other)
      );

      expect(result.toString()).toEqual(expected);
    }
  );
});

describe("compare", () => {
  test("less than (int)", () => {
    const result = BigInteger.fromNumber(5).compare(10);

    expect(result).toBe(-1);
  });

  test("equal (int)", () => {
    const result = BigInteger.fromNumber(5).compare(5);

    expect(result).toBe(0);
  });

  test("less than (int)", () => {
    const result = BigInteger.fromNumber(5).compare(1);

    expect(result).toBe(1);
  });

  test("less than (BI)", () => {
    const result = BigInteger.fromNumber(5).compare(BigInteger.fromNumber(10));

    expect(result).toBe(-1);
  });

  test("equal (BI)", () => {
    const result = BigInteger.fromNumber(5).compare(BigInteger.fromNumber(5));

    expect(result).toBe(0);
  });

  test("less than (BI)", () => {
    const result = BigInteger.fromNumber(5).compare(BigInteger.fromNumber(1));

    expect(result).toBe(1);
  });

  test("accepts unsafe numbers", () => {
    const result = BigInteger.fromNumber(5).compare(
      9999999999999999999999999999999999
    );

    expect(result).toBe(-1);
  });
});
