import { BigInteger } from "../../src/u";

describe("twos complement", () => {
  test.each([
    [0, "00"],
    [-1, "ff"],
    [1, "01"],
    [127, "7f"],
    [-128, "80"],
    [-2, "fffe"],
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
    [0, "00"],
    [-1, "ff"],
    [1, "01"],
    [127, "7f"],
    [-128, "80"],
    [-2, "fe"],
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
    const result = BigInteger.fromNumber(n);
    expect(result.toTwos()).toBe(s);
  });
});
