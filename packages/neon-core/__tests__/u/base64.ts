import { base64Encode, base64Decode } from "../../src/u/base64";

const testCases = [
  ["NEO", "TkVP"],
  ["neo", "bmVv"],
];
describe("base64", () => {
  test.each(testCases)("base64Encode %s", (input: string, expected: string) => {
    const result = base64Encode(input);
    expect(result).toBe(expected);
  });

  test.each(testCases)("base64Decode %s", (expected: string, input: string) => {
    const result = base64Decode(input);
    expect(result).toBe(expected);
  });
});
