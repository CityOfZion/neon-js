import Fixed8 from "../../src/u/Fixed8";
import { reverseHex } from "../../src/u/misc";

describe.each([
  ["0000000000000000", 0],
  ["00e1f50500000000", 1],
  ["0100000000000000", 0.00000001],
  ["0080c6a47e8d0300", 10000000],
  ["5004fb711f010000", 12345.6789]
])("from hexstring (%s)", (hex, num) => {
  test("fromHex", () => {
    const result = Fixed8.fromReverseHex(hex);
    expect(result.toNumber()).toBe(num);
  });

  test("fromReverseHex", () => {
    const result = Fixed8.fromHex(reverseHex(hex));
    expect(result.toNumber()).toBe(num);
  });

  test("toHex", () => {
    const result = new Fixed8(num);
    expect(result.toHex()).toBe(reverseHex(hex));
  });

  test("toReverseHex", () => {
    const result = new Fixed8(num);
    expect(result.toReverseHex()).toBe(hex);
  });
});

describe.each([
  ["string", "1", 1],
  ["number", 1.234, 1.234],
  ["Fixd8", new Fixed8(2), 2]
])("constructor", (type, data, expected) => {
  test(`${type}`, () => {
    const result = new Fixed8(data);
    expect(result.toNumber()).toBe(expected);
  });
});

describe("functions", () => {
  test("ceil", () => {
    const input = new Fixed8(1.23);
    const result = input.ceil();
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(2);
  });

  test("floor", () => {
    const input = new Fixed8(1.53);
    const result = input.floor();
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(1);
  });

  test("equals", () => {
    const input = new Fixed8(1.234);
    const result = input.equals("1.234");
    expect(result).toBeTruthy();
  });

  test("round", () => {
    const input = new Fixed8(1.23456);
    const result = input.round(3);
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(1.235);
  });

  test("dividedBy", () => {
    const input = new Fixed8(10);
    const result = input.dividedBy(4);
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(2.5);
  });

  test("times", () => {
    const input = new Fixed8(2);
    const result = input.times(2.5);
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(5);
  });

  test("plus", () => {
    const input = new Fixed8(1);
    const result = input.plus(2);
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(3);
  });

  test("minus", () => {
    const input = new Fixed8(5);
    const result = input.minus(3);
    expect(result instanceof Fixed8).toBeTruthy();
    expect(result.toNumber()).toBe(2);
  });
});
