import { parse, UriIntent } from "../src/parse";

test("errors if nothing given", () => {
  expect(() => parse("neo:")).toThrow();
});

describe("parse", () => {
  test.each([
    [
      "Address with asset name",
      "neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=neo",
      {
        intent: "pay",
        description: "Transfer some NEO to NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
        contractCall: {
          scriptHash: "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
          operation: "transfer",
          args: [
            { type: "Hash160", value: "" },
            { type: "Hash160", value: "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk" },
            { type: "Integer", value: "" },
          ],
        },
      },
    ],
    [
      "Address with asset scriptHash",
      "neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=d2a4cff31913016155e38e474a2c06d08be276cf",
      {
        intent: "pay",
        description:
          "Transfer some tokens(d2a4cff31913016155e38e474a2c06d08be276cf) to NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
        contractCall: {
          scriptHash: "d2a4cff31913016155e38e474a2c06d08be276cf",
          operation: "transfer",
          args: [
            { type: "Hash160", value: "" },
            { type: "Hash160", value: "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk" },
            { type: "Integer", value: "" },
          ],
        },
      },
    ],
    [
      "Address transferring some specific amount of gas",
      "neo:NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk?asset=gas&amount=1000",
      {
        intent: "pay",
        description: "Transfer 1000 GAS to NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk",
        contractCall: {
          scriptHash: "d2a4cff31913016155e38e474a2c06d08be276cf",
          operation: "transfer",
          args: [
            { type: "Hash160", value: "" },
            { type: "Hash160", value: "NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk" },
            { type: "Integer", value: "1000" },
          ],
        },
      },
    ],
    [
      "vote",
      "neo:vote-02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
      {
        intent: "vote",
        description:
          "Vote for 02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
        contractCall: {
          scriptHash: "ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
          operation: "vote",
          args: [
            { type: "Hash160", value: "" },
            {
              type: "PublicKey",
              value:
                "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
            },
          ],
        },
      },
    ],
  ])("%s", (_: string, uri: string, expected: UriIntent) => {
    const result = parse(uri);
    expect(result).toMatchObject(expected);
  });
});
