import * as misc from "../../src/u/misc";

describe("hexXor", () => {
  test("throws if inputs of different length", () => {
    const input1 = "00";
    const input2 = "0001";
    expect(() => misc.hexXor(input1, input2)).toThrow();
  });

  test("Performs bitwise XOR", () => {
    const input1 = "0001101100011011";
    const input2 = "0000000011111111";
    const result = misc.hexXor(input1, input2);
    expect(result).toBe("0001101111100100");
  });
});

describe("reverseArray", () => {
  test("throws if not array", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(() => misc.reverseArray(1)).toThrow();
  });

  test("Reverses an array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = misc.reverseArray(input);
    expect(result).toEqual([5, 4, 3, 2, 1]);
  });
});
