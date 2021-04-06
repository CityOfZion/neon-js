import { HexString } from "../../src/u";
import { Witness } from "../../src/tx";
import { getSerializedSize } from "../../src/u/serialize";

describe("getSerializedSize", () => {
  test("size of HexString", () => {
    const input = HexString.fromHex("112233");
    const result = getSerializedSize(input);
    expect(result).toBe(4);
  });

  test("size of number < 0xfd", () => {
    const result = getSerializedSize(0xfc);
    expect(result).toBe(1);
  });

  test("size of number <= 0xffff", () => {
    // lower boundary
    let result = getSerializedSize(0xfd);
    expect(result).toBe(3);
    // upper boundary
    result = getSerializedSize(0xffff);
    expect(result).toBe(3);
  });

  test("size of number > 0xffff", () => {
    const result = getSerializedSize(0xffff + 1);
    expect(result).toBe(5);
  });

  test("array of serializable objects", () => {
    const input = [
      new Witness({
        invocationScript: "01".repeat(256),
        verificationScript: "03",
      }),
      new Witness({
        invocationScript: "01".repeat(256),
        verificationScript: "03",
      }),
    ];

    const result = getSerializedSize(input);
    expect(result).toBe(523);
  });
});
