import {
  base642hex,
  base642utf8,
  hex2base64,
  utf82base64,
} from "../../../src/u/basic/base64";

const hexBase64testCases = [
  ["4e454f", "TkVP"], // NEO
  ["6e656f", "bmVv"], // neo
  ["11", "EQ=="],
  ["41123e7fe8", "QRI+f+g="],
];
describe("hex and base64", () => {
  test.each(hexBase64testCases)(
    "hex2base64 %s",
    (input: string, expected: string) => {
      const result = hex2base64(input);
      expect(result).toBe(expected);
    },
  );

  test.each(hexBase64testCases)(
    "base642hex %s",
    (expected: string, input: string) => {
      const result = base642hex(input);
      expect(result).toBe(expected);
    },
  );
});

const utf8Base64testCases = [
  ["NEO", "TkVP"],
  ["neo", "bmVv"],
  ["neon-core", "bmVvbi1jb3Jl"],
  [
    "αβγδεζηθικλμνξοπρστυφχψω",
    "zrHOss6zzrTOtc62zrfOuM65zrrOu868zr3Ovs6/z4DPgc+Dz4TPhc+Gz4fPiM+J",
  ],
];
describe("utf8 and base64", () => {
  test.each(utf8Base64testCases)(
    "utf82base64 %s",
    (input: string, expected: string) => {
      const result = utf82base64(input);
      expect(result).toBe(expected);
    },
  );

  test.each(utf8Base64testCases)(
    "base642utf8 %s",
    (expected: string, input: string) => {
      const result = base642utf8(input);
      expect(result).toBe(expected);
    },
  );
});
