import { base642hex, hex2base64 } from "../../../src/u/basic/base64";

const testCases = [
  ["4e454f", "TkVP"], // NEO
  ["6e656f", "bmVv"], // neo
  ["11", "EQ=="],
  ["41123e7fe8", "QRI+f+g="],
];
describe("base64", () => {
  test.each(testCases)("hex2base64 %s", (input: string, expected: string) => {
    const result = hex2base64(input);
    expect(result).toBe(expected);
  });

  test.each(testCases)("base642hex %s", (expected: string, input: string) => {
    const result = base642hex(input);
    expect(result).toBe(expected);
  });
});
